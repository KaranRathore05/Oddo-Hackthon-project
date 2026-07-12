import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

function serializeTrip(t: any) {
  return {
    ...t,
    dispatched_at: t.dispatched_at?.toISOString?.() ?? t.dispatched_at,
    completed_at: t.completed_at?.toISOString?.() ?? t.completed_at,
    cancelled_at: t.cancelled_at?.toISOString?.() ?? t.cancelled_at,
    created_at: t.created_at?.toISOString?.() ?? t.created_at,
    updated_at: t.updated_at?.toISOString?.() ?? t.updated_at,
  };
}

/**
 * GET /api/trips
 * Query: ?status=&search=
 */
export async function listTrips(req: Request, res: Response): Promise<void> {
  const { status, search } = req.query;
  const where: any = {};
  if (status) where.status = status as string;
  if (search) {
    where.OR = [
      { source: { contains: search as string } },
      { destination: { contains: search as string } },
    ];
  }

  const trips = await prisma.trip.findMany({ where, orderBy: { created_at: 'desc' } });
  res.json(trips.map(serializeTrip));
}

/**
 * GET /api/trips/:id
 */
export async function getTrip(req: Request, res: Response): Promise<void> {
  const trip = await prisma.trip.findUnique({ where: { id: req.params.id } });
  if (!trip) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Trip not found.' } });
    return;
  }
  res.json(serializeTrip(trip));
}

/**
 * POST /api/trips — Create a DRAFT trip
 * Enforces: Rules #1-5 (vehicle/driver availability, license expiry, cargo weight, no double-assignment)
 */
export async function createTrip(req: Request, res: Response): Promise<void> {
  const { source, destination, vehicle_id, driver_id, cargo_weight_kg, planned_distance_km, revenue } = req.body;

  // Fetch vehicle
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicle_id } });
  if (!vehicle) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Vehicle not found.' } });
    return;
  }

  // Rule #2: Vehicle must be AVAILABLE (not RETIRED, IN_SHOP, or ON_TRIP)
  if (vehicle.status !== 'AVAILABLE') {
    res.status(400).json({
      error: { code: 'VEHICLE_UNAVAILABLE', message: `Vehicle "${vehicle.registration_number}" is not available (current status: ${vehicle.status}).` },
    });
    return;
  }

  // Fetch driver
  const driver = await prisma.driver.findUnique({ where: { id: driver_id } });
  if (!driver) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Driver not found.' } });
    return;
  }

  // Rule #3: Driver must be AVAILABLE and license not expired
  if (driver.status !== 'AVAILABLE') {
    res.status(400).json({
      error: { code: 'DRIVER_UNAVAILABLE', message: `Driver "${driver.name}" is not available (current status: ${driver.status}).` },
    });
    return;
  }
  if (new Date(driver.license_expiry_date) < new Date()) {
    res.status(400).json({
      error: { code: 'LICENSE_EXPIRED', message: `Driver "${driver.name}" has an expired license.` },
    });
    return;
  }

  // Rule #5: Cargo weight must not exceed vehicle capacity
  if (cargo_weight_kg > vehicle.max_load_capacity_kg) {
    res.status(400).json({
      error: {
        code: 'OVERWEIGHT',
        message: `Cargo weight ${cargo_weight_kg} kg exceeds vehicle capacity of ${vehicle.max_load_capacity_kg} kg.`,
      },
    });
    return;
  }

  // Rule #4: Vehicle/Driver not already on an active trip
  const activeTrip = await prisma.trip.findFirst({
    where: {
      vehicle_id,
      status: { in: ['DRAFT', 'DISPATCHED'] },
    },
  });
  if (activeTrip) {
    res.status(400).json({
      error: { code: 'VEHICLE_IN_USE', message: `Vehicle "${vehicle.registration_number}" is already assigned to an active trip.` },
    });
    return;
  }
  const driverActiveTrip = await prisma.trip.findFirst({
    where: {
      driver_id,
      status: { in: ['DRAFT', 'DISPATCHED'] },
    },
  });
  if (driverActiveTrip) {
    res.status(400).json({
      error: { code: 'DRIVER_IN_USE', message: `Driver "${driver.name}" is already assigned to an active trip.` },
    });
    return;
  }

  const trip = await prisma.trip.create({
    data: {
      source,
      destination,
      vehicle_id,
      driver_id,
      cargo_weight_kg,
      planned_distance_km,
      revenue,
      status: 'DRAFT',
      created_by: req.user?.userId,
    },
  });
  res.status(201).json(serializeTrip(trip));
}

/**
 * PATCH /api/trips/:id/dispatch — DRAFT → DISPATCHED
 * Rule #6: Atomically set vehicle + driver to ON_TRIP
 * Rule #11: Strict state machine
 */
export async function dispatchTrip(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Trip not found.' } });
    return;
  }
  if (trip.status !== 'DRAFT') {
    res.status(400).json({
      error: { code: 'INVALID_TRANSITION', message: `Cannot dispatch a trip with status "${trip.status}". Only DRAFT trips can be dispatched.` },
    });
    return;
  }

  // Atomic transaction: update trip + vehicle + driver
  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id },
      data: { status: 'DISPATCHED', dispatched_at: new Date() },
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicle_id },
      data: { status: 'ON_TRIP' },
    }),
    prisma.driver.update({
      where: { id: trip.driver_id },
      data: { status: 'ON_TRIP' },
    }),
  ]);

  res.json(serializeTrip(updatedTrip));
}

/**
 * PATCH /api/trips/:id/complete — DISPATCHED → COMPLETED
 * Rule #7: Atomically restore vehicle + driver, update odometer
 * Rule #11: Strict state machine
 */
export async function completeTrip(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { actual_distance_km, fuel_consumed_liters } = req.body;

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Trip not found.' } });
    return;
  }
  if (trip.status !== 'DISPATCHED') {
    res.status(400).json({
      error: { code: 'INVALID_TRANSITION', message: `Cannot complete a trip with status "${trip.status}". Only DISPATCHED trips can be completed.` },
    });
    return;
  }

  // Atomic transaction
  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        actual_distance_km,
        fuel_consumed_liters,
        completed_at: new Date(),
      },
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicle_id },
      data: {
        status: 'AVAILABLE',
        odometer_km: { increment: actual_distance_km },
      },
    }),
    prisma.driver.update({
      where: { id: trip.driver_id },
      data: { status: 'AVAILABLE' },
    }),
  ]);

  res.json(serializeTrip(updatedTrip));
}

/**
 * PATCH /api/trips/:id/cancel — DISPATCHED → CANCELLED
 * Rule #8: Atomically restore vehicle + driver
 * Rule #11: Strict state machine
 */
export async function cancelTrip(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Trip not found.' } });
    return;
  }
  if (trip.status !== 'DISPATCHED') {
    res.status(400).json({
      error: { code: 'INVALID_TRANSITION', message: `Cannot cancel a trip with status "${trip.status}". Only DISPATCHED trips can be cancelled.` },
    });
    return;
  }

  // Atomic transaction
  const [updatedTrip] = await prisma.$transaction([
    prisma.trip.update({
      where: { id },
      data: { status: 'CANCELLED', cancelled_at: new Date() },
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicle_id },
      data: { status: 'AVAILABLE' },
    }),
    prisma.driver.update({
      where: { id: trip.driver_id },
      data: { status: 'AVAILABLE' },
    }),
  ]);

  res.json(serializeTrip(updatedTrip));
}
