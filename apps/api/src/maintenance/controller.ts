import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

function serializeLog(l: any) {
  return {
    ...l,
    opened_at: l.opened_at?.toISOString?.() ?? l.opened_at,
    closed_at: l.closed_at?.toISOString?.() ?? l.closed_at,
    created_at: l.created_at?.toISOString?.() ?? l.created_at,
    updated_at: l.updated_at?.toISOString?.() ?? l.updated_at,
  };
}

/**
 * GET /api/maintenance
 * Query: ?status=&vehicleId=&search=
 */
export async function listMaintenanceLogs(req: Request, res: Response): Promise<void> {
  const { status, vehicleId, search } = req.query;
  const where: any = {};
  if (status) where.status = status as string;
  if (vehicleId) where.vehicle_id = vehicleId as string;
  if (search) {
    where.OR = [
      { type: { contains: search as string } },
      { description: { contains: search as string } },
    ];
  }

  const logs = await prisma.maintenanceLog.findMany({ where, orderBy: { created_at: 'desc' } });
  res.json(logs.map(serializeLog));
}

/**
 * GET /api/maintenance/:id
 */
export async function getMaintenanceLog(req: Request, res: Response): Promise<void> {
  const log = await prisma.maintenanceLog.findUnique({ where: { id: req.params.id } });
  if (!log) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Maintenance record not found.' } });
    return;
  }
  res.json(serializeLog(log));
}

/**
 * POST /api/maintenance
 * Rule #9: Creating an OPEN maintenance log atomically sets vehicle to IN_SHOP
 */
export async function createMaintenanceLog(req: Request, res: Response): Promise<void> {
  const { vehicle_id, type, description, cost } = req.body;

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicle_id } });
  if (!vehicle) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Vehicle not found.' } });
    return;
  }
  if (vehicle.status === 'RETIRED') {
    res.status(400).json({
      error: { code: 'INVALID_STATUS', message: 'Cannot create maintenance for a retired vehicle.' },
    });
    return;
  }

  // Atomic: create log + set vehicle IN_SHOP
  const [log] = await prisma.$transaction([
    prisma.maintenanceLog.create({
      data: { vehicle_id, type, description, cost, status: 'OPEN' },
    }),
    prisma.vehicle.update({
      where: { id: vehicle_id },
      data: { status: 'IN_SHOP' },
    }),
  ]);

  res.status(201).json(serializeLog(log));
}

/**
 * PATCH /api/maintenance/:id/close
 * Rule #10: Closing maintenance restores vehicle to AVAILABLE (unless RETIRED)
 */
export async function closeMaintenanceLog(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const log = await prisma.maintenanceLog.findUnique({ where: { id } });
  if (!log) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Maintenance record not found.' } });
    return;
  }
  if (log.status === 'CLOSED') {
    res.status(400).json({
      error: { code: 'ALREADY_CLOSED', message: 'This maintenance record is already closed.' },
    });
    return;
  }

  // Check if other open maintenance logs exist for this vehicle
  const otherOpenLogs = await prisma.maintenanceLog.count({
    where: { vehicle_id: log.vehicle_id, id: { not: id }, status: 'OPEN' },
  });

  const vehicle = await prisma.vehicle.findUnique({ where: { id: log.vehicle_id } });

  const transactions: any[] = [
    prisma.maintenanceLog.update({
      where: { id },
      data: { status: 'CLOSED', closed_at: new Date() },
    }),
  ];

  // Only restore to AVAILABLE if no other open logs and not RETIRED
  if (otherOpenLogs === 0 && vehicle && vehicle.status !== 'RETIRED') {
    transactions.push(
      prisma.vehicle.update({
        where: { id: log.vehicle_id },
        data: { status: 'AVAILABLE' },
      })
    );
  }

  const [updatedLog] = await prisma.$transaction(transactions);
  res.json(serializeLog(updatedLog));
}
