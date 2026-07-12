import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

/** Helper to serialize dates to ISO strings */
function serializeVehicle(v: any) {
  return {
    ...v,
    created_at: v.created_at?.toISOString?.() ?? v.created_at,
    updated_at: v.updated_at?.toISOString?.() ?? v.updated_at,
  };
}

/**
 * GET /api/vehicles
 * Query: ?status=&type=&region=&search=
 */
export async function listVehicles(req: Request, res: Response): Promise<void> {
  const { status, type, region, search } = req.query;

  const where: any = {};
  if (status) where.status = status as string;
  if (type) where.type = type as string;
  if (region) where.region = region as string;
  if (search) {
    where.OR = [
      { registration_number: { contains: search as string } },
      { name_model: { contains: search as string } },
      { region: { contains: search as string } },
    ];
  }

  const vehicles = await prisma.vehicle.findMany({ where, orderBy: { created_at: 'desc' } });
  res.json(vehicles.map(serializeVehicle));
}

/**
 * GET /api/vehicles/available
 */
export async function listAvailableVehicles(_req: Request, res: Response): Promise<void> {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { name_model: 'asc' },
  });
  res.json(vehicles.map(serializeVehicle));
}

/**
 * GET /api/vehicles/:id
 */
export async function getVehicle(req: Request, res: Response): Promise<void> {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
  if (!vehicle) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Vehicle not found.' } });
    return;
  }
  res.json(serializeVehicle(vehicle));
}

/**
 * POST /api/vehicles
 */
export async function createVehicle(req: Request, res: Response): Promise<void> {
  // Check unique registration number
  const existing = await prisma.vehicle.findUnique({
    where: { registration_number: req.body.registration_number },
  });
  if (existing) {
    res.status(409).json({
      error: { code: 'DUPLICATE', message: `Vehicle with registration number "${req.body.registration_number}" already exists.` },
    });
    return;
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      registration_number: req.body.registration_number,
      name_model: req.body.name_model,
      type: req.body.type,
      max_load_capacity_kg: req.body.max_load_capacity_kg,
      odometer_km: req.body.odometer_km ?? 0,
      acquisition_cost: req.body.acquisition_cost,
      status: 'AVAILABLE',
      region: req.body.region,
    },
  });
  res.status(201).json(serializeVehicle(vehicle));
}

/**
 * PUT /api/vehicles/:id
 */
export async function updateVehicle(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Vehicle not found.' } });
    return;
  }

  // Check unique registration number if changing it
  if (req.body.registration_number && req.body.registration_number !== vehicle.registration_number) {
    const dup = await prisma.vehicle.findUnique({
      where: { registration_number: req.body.registration_number },
    });
    if (dup) {
      res.status(409).json({
        error: { code: 'DUPLICATE', message: `Registration number "${req.body.registration_number}" is already in use.` },
      });
      return;
    }
  }

  const updated = await prisma.vehicle.update({
    where: { id },
    data: req.body,
  });
  res.json(serializeVehicle(updated));
}

/**
 * PATCH /api/vehicles/:id/retire
 */
export async function retireVehicle(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Vehicle not found.' } });
    return;
  }
  if (vehicle.status === 'ON_TRIP') {
    res.status(400).json({
      error: { code: 'INVALID_STATUS', message: 'Cannot retire a vehicle that is currently on a trip.' },
    });
    return;
  }

  const updated = await prisma.vehicle.update({
    where: { id },
    data: { status: 'RETIRED' },
  });
  res.json(serializeVehicle(updated));
}
