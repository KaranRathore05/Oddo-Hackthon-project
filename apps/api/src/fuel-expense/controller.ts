import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

function serializeFuelLog(f: any) {
  return {
    ...f,
    date: f.date?.toISOString?.()?.slice(0, 10) ?? f.date,
    created_at: f.created_at?.toISOString?.() ?? f.created_at,
  };
}

function serializeExpense(e: any) {
  return {
    ...e,
    date: e.date?.toISOString?.()?.slice(0, 10) ?? e.date,
    created_at: e.created_at?.toISOString?.() ?? e.created_at,
  };
}

// ─── Fuel Logs ───────────────────────────────────────────────

/**
 * GET /api/fuel-logs
 * Query: ?vehicleId=
 */
export async function listFuelLogs(req: Request, res: Response): Promise<void> {
  const { vehicleId } = req.query;
  const where: any = {};
  if (vehicleId) where.vehicle_id = vehicleId as string;

  const logs = await prisma.fuelLog.findMany({ where, orderBy: { date: 'desc' } });
  res.json(logs.map(serializeFuelLog));
}

/**
 * POST /api/fuel-logs
 */
export async function createFuelLog(req: Request, res: Response): Promise<void> {
  const log = await prisma.fuelLog.create({
    data: {
      vehicle_id: req.body.vehicle_id,
      trip_id: req.body.trip_id,
      liters: req.body.liters,
      cost: req.body.cost,
      date: new Date(req.body.date),
    },
  });
  res.status(201).json(serializeFuelLog(log));
}

// ─── Expenses ────────────────────────────────────────────────

/**
 * GET /api/expenses
 * Query: ?vehicleId=
 */
export async function listExpenses(req: Request, res: Response): Promise<void> {
  const { vehicleId } = req.query;
  const where: any = {};
  if (vehicleId) where.vehicle_id = vehicleId as string;

  const expenses = await prisma.expense.findMany({ where, orderBy: { date: 'desc' } });
  res.json(expenses.map(serializeExpense));
}

/**
 * POST /api/expenses
 */
export async function createExpense(req: Request, res: Response): Promise<void> {
  const expense = await prisma.expense.create({
    data: {
      vehicle_id: req.body.vehicle_id,
      trip_id: req.body.trip_id,
      category: req.body.category,
      amount: req.body.amount,
      date: new Date(req.body.date),
      notes: req.body.notes,
    },
  });
  res.status(201).json(serializeExpense(expense));
}

// ─── Aggregated Operational Cost ─────────────────────────────

/**
 * GET /api/finance/operational-cost
 * Query: ?vehicleId= (optional — if omitted, returns fleet-wide)
 */
export async function getOperationalCost(req: Request, res: Response): Promise<void> {
  const { vehicleId } = req.query;
  const vehicleFilter = vehicleId ? { vehicle_id: vehicleId as string } : {};

  const [fuelAgg, maintenanceAgg, expenseAgg] = await Promise.all([
    prisma.fuelLog.aggregate({
      where: vehicleFilter,
      _sum: { cost: true },
    }),
    prisma.maintenanceLog.aggregate({
      where: vehicleFilter,
      _sum: { cost: true },
    }),
    prisma.expense.aggregate({
      where: vehicleFilter,
      _sum: { amount: true },
    }),
  ]);

  const fuelCost = fuelAgg._sum.cost ?? 0;
  const maintenanceCost = maintenanceAgg._sum.cost ?? 0;
  const expenseCost = expenseAgg._sum.amount ?? 0;

  res.json({
    fuel_cost: fuelCost,
    maintenance_cost: maintenanceCost,
    other_expenses: expenseCost,
    total_operational_cost: fuelCost + maintenanceCost + expenseCost,
    vehicle_id: vehicleId ?? null,
  });
}
