import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

function serializeDriver(d: any) {
  return {
    ...d,
    license_expiry_date: d.license_expiry_date?.toISOString?.()?.slice(0, 10) ?? d.license_expiry_date,
    created_at: d.created_at?.toISOString?.() ?? d.created_at,
    updated_at: d.updated_at?.toISOString?.() ?? d.updated_at,
  };
}

/**
 * GET /api/drivers
 * Query: ?status=&search=&licenseCategory=
 */
export async function listDrivers(req: Request, res: Response): Promise<void> {
  const { status, search, licenseCategory } = req.query;
  const where: any = {};
  if (status) where.status = status as string;
  if (licenseCategory) where.license_category = licenseCategory as string;
  if (search) {
    where.OR = [
      { name: { contains: search as string } },
      { license_number: { contains: search as string } },
      { contact_number: { contains: search as string } },
    ];
  }

  const drivers = await prisma.driver.findMany({ where, orderBy: { created_at: 'desc' } });
  res.json(drivers.map(serializeDriver));
}

/**
 * GET /api/drivers/available
 * Returns drivers with status AVAILABLE and non-expired license.
 */
export async function listAvailableDrivers(_req: Request, res: Response): Promise<void> {
  const drivers = await prisma.driver.findMany({
    where: {
      status: 'AVAILABLE',
      license_expiry_date: { gte: new Date() },
    },
    orderBy: { name: 'asc' },
  });
  res.json(drivers.map(serializeDriver));
}

/**
 * GET /api/drivers/:id
 */
export async function getDriver(req: Request, res: Response): Promise<void> {
  const driver = await prisma.driver.findUnique({ where: { id: req.params.id } });
  if (!driver) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Driver not found.' } });
    return;
  }
  res.json(serializeDriver(driver));
}

/**
 * POST /api/drivers
 */
export async function createDriver(req: Request, res: Response): Promise<void> {
  const existing = await prisma.driver.findUnique({
    where: { license_number: req.body.license_number },
  });
  if (existing) {
    res.status(409).json({
      error: { code: 'DUPLICATE', message: `Driver with license number "${req.body.license_number}" already exists.` },
    });
    return;
  }

  const driver = await prisma.driver.create({
    data: {
      name: req.body.name,
      license_number: req.body.license_number,
      license_category: req.body.license_category,
      license_expiry_date: new Date(req.body.license_expiry_date),
      contact_number: req.body.contact_number,
      safety_score: req.body.safety_score ?? 100,
      status: 'AVAILABLE',
    },
  });
  res.status(201).json(serializeDriver(driver));
}

/**
 * PUT /api/drivers/:id
 */
export async function updateDriver(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Driver not found.' } });
    return;
  }

  if (req.body.license_number && req.body.license_number !== driver.license_number) {
    const dup = await prisma.driver.findUnique({ where: { license_number: req.body.license_number } });
    if (dup) {
      res.status(409).json({
        error: { code: 'DUPLICATE', message: `License number "${req.body.license_number}" is already in use.` },
      });
      return;
    }
  }

  const data: any = { ...req.body };
  if (data.license_expiry_date) {
    data.license_expiry_date = new Date(data.license_expiry_date);
  }

  const updated = await prisma.driver.update({ where: { id }, data });
  res.json(serializeDriver(updated));
}

/**
 * PATCH /api/drivers/:id/suspend
 */
export async function suspendDriver(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Driver not found.' } });
    return;
  }
  if (driver.status === 'ON_TRIP') {
    res.status(400).json({
      error: { code: 'INVALID_STATUS', message: 'Cannot suspend a driver who is currently on a trip.' },
    });
    return;
  }

  const updated = await prisma.driver.update({ where: { id }, data: { status: 'SUSPENDED' } });
  res.json(serializeDriver(updated));
}

/**
 * PATCH /api/drivers/:id/reinstate
 */
export async function reinstateDriver(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Driver not found.' } });
    return;
  }
  if (driver.status !== 'SUSPENDED' && driver.status !== 'OFF_DUTY') {
    res.status(400).json({
      error: { code: 'INVALID_STATUS', message: 'Driver is not suspended or off-duty.' },
    });
    return;
  }

  const updated = await prisma.driver.update({ where: { id }, data: { status: 'AVAILABLE' } });
  res.json(serializeDriver(updated));
}
