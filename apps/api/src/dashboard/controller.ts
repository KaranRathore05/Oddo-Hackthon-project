import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

/**
 * GET /api/dashboard/kpis
 * Query: ?type=&region=
 * Returns all dashboard KPIs in a single response.
 */
export async function getDashboardKPIs(req: Request, res: Response): Promise<void> {
  const { type, region } = req.query;

  // Vehicle filters (for filtered KPIs)
  const vehicleWhere: any = {};
  if (type) vehicleWhere.type = type as string;
  if (region) vehicleWhere.region = region as string;

  const [
    allVehicles,
    availableVehicles,
    onTripVehicles,
    inShopVehicles,
    retiredVehicles,
    activeTrips,
    pendingTrips,
    completedTrips,
    driversOnDuty,
    totalDrivers,
    totalFuelCost,
    totalMaintenanceCost,
    totalExpenses,
    tripStats,
  ] = await Promise.all([
    // Vehicles
    prisma.vehicle.count({ where: vehicleWhere }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: 'AVAILABLE' } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: 'ON_TRIP' } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: 'IN_SHOP' } }),
    prisma.vehicle.count({ where: { ...vehicleWhere, status: 'RETIRED' } }),

    // Trips
    prisma.trip.count({ where: { status: 'DISPATCHED' } }),
    prisma.trip.count({ where: { status: 'DRAFT' } }),
    prisma.trip.count({ where: { status: 'COMPLETED' } }),

    // Drivers
    prisma.driver.count({ where: { status: 'ON_TRIP' } }),
    prisma.driver.count(),

    // Financial aggregates
    prisma.fuelLog.aggregate({ _sum: { cost: true } }),
    prisma.maintenanceLog.aggregate({ _sum: { cost: true } }),
    prisma.expense.aggregate({ _sum: { amount: true } }),

    // Trip distance/fuel for efficiency
    prisma.trip.aggregate({
      where: { status: 'COMPLETED' },
      _sum: {
        actual_distance_km: true,
        fuel_consumed_liters: true,
        revenue: true,
      },
    }),
  ]);

  const nonRetiredVehicles = allVehicles - retiredVehicles;
  const fleetUtilization = nonRetiredVehicles > 0
    ? Math.round((onTripVehicles / nonRetiredVehicles) * 100)
    : 0;

  const totalDistance = tripStats._sum.actual_distance_km ?? 0;
  const totalFuel = tripStats._sum.fuel_consumed_liters ?? 0;
  const fuelEfficiency = totalFuel > 0 ? Math.round((totalDistance / totalFuel) * 100) / 100 : 0;

  const fuelCost = totalFuelCost._sum.cost ?? 0;
  const maintCost = totalMaintenanceCost._sum.cost ?? 0;
  const expCost = totalExpenses._sum.amount ?? 0;
  const totalRevenue = tripStats._sum.revenue ?? 0;

  res.json({
    vehicles: {
      total: allVehicles,
      available: availableVehicles,
      on_trip: onTripVehicles,
      in_shop: inShopVehicles,
      retired: retiredVehicles,
    },
    trips: {
      active: activeTrips,
      pending: pendingTrips,
      completed: completedTrips,
    },
    drivers: {
      total: totalDrivers,
      on_duty: driversOnDuty,
    },
    fleet_utilization_percent: fleetUtilization,
    fuel_efficiency_km_per_liter: fuelEfficiency,
    financials: {
      total_fuel_cost: fuelCost,
      total_maintenance_cost: maintCost,
      total_expenses: expCost,
      total_operational_cost: fuelCost + maintCost + expCost,
      total_revenue: totalRevenue,
    },
  });
}
