import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TransitOps database...\n');

  const passwordHash = await bcrypt.hash('demo123', 10);

  // ─── Seed 4 demo users (matching frontend authStore) ───────
  const users = [
    {
      id: 'user-fm-001',
      email: 'manager@transitops.io',
      name: 'Rajan K.',
      role: 'FLEET_MANAGER',
      password_hash: passwordHash,
    },
    {
      id: 'user-dr-001',
      email: 'driver@transitops.io',
      name: 'Alex M.',
      role: 'DRIVER',
      password_hash: passwordHash,
    },
    {
      id: 'user-so-001',
      email: 'safety@transitops.io',
      name: 'Priya S.',
      role: 'SAFETY_OFFICER',
      password_hash: passwordHash,
    },
    {
      id: 'user-fa-001',
      email: 'finance@transitops.io',
      name: 'Vikram T.',
      role: 'FINANCIAL_ANALYST',
      password_hash: passwordHash,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    console.log(`  ✓ User: ${user.email} (${user.role})`);
  }

  // ─── Seed sample vehicles ─────────────────────────────────
  const vehicles = [
    {
      id: 'vehicle-001',
      registration_number: 'VAN-05',
      name_model: 'Ford Transit 350',
      type: 'VAN',
      max_load_capacity_kg: 500,
      odometer_km: 15200,
      acquisition_cost: 3500000,
      status: 'AVAILABLE',
      region: 'North',
    },
    {
      id: 'vehicle-002',
      registration_number: 'TRK-12',
      name_model: 'Tata Prima 4028',
      type: 'TRUCK',
      max_load_capacity_kg: 2800,
      odometer_km: 48500,
      acquisition_cost: 5500000,
      status: 'ON_TRIP',
      region: 'West',
    },
    {
      id: 'vehicle-003',
      registration_number: 'BUS-01',
      name_model: 'Ashok Leyland Viking',
      type: 'BUS',
      max_load_capacity_kg: 1500,
      odometer_km: 72000,
      acquisition_cost: 4200000,
      status: 'AVAILABLE',
      region: 'South',
    },
  ];

  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { registration_number: v.registration_number },
      update: v,
      create: v,
    });
    console.log(`  ✓ Vehicle: ${v.registration_number} (${v.name_model})`);
  }

  // ─── Seed sample drivers ──────────────────────────────────
  const drivers = [
    {
      id: 'driver-001',
      name: 'Alex',
      license_number: 'DL-2026-001',
      license_category: 'Heavy Vehicle',
      license_expiry_date: new Date('2028-06-15'),
      contact_number: '+91-9876543210',
      safety_score: 95,
      status: 'AVAILABLE',
    },
    {
      id: 'driver-002',
      name: 'Meera',
      license_number: 'DL-2026-002',
      license_category: 'Light Motor Vehicle',
      license_expiry_date: new Date('2027-12-31'),
      contact_number: '+91-9876543211',
      safety_score: 100,
      status: 'ON_TRIP',
    },
    {
      id: 'driver-003',
      name: 'Rahul',
      license_number: 'DL-2026-003',
      license_category: 'Heavy Vehicle',
      license_expiry_date: new Date('2027-03-10'),
      contact_number: '+91-9876543212',
      safety_score: 88,
      status: 'AVAILABLE',
    },
  ];

  for (const d of drivers) {
    await prisma.driver.upsert({
      where: { license_number: d.license_number },
      update: d,
      create: d,
    });
    console.log(`  ✓ Driver: ${d.name} (${d.license_number})`);
  }

  // ─── Seed sample trips ────────────────────────────────────
  const trips = [
    {
      id: 'trip-001',
      source: 'Mumbai Hub',
      destination: 'Pune Depot',
      vehicle_id: 'vehicle-001',
      driver_id: 'driver-001',
      cargo_weight_kg: 400,
      planned_distance_km: 150,
      status: 'COMPLETED',
      actual_distance_km: 155,
      fuel_consumed_liters: 14.5,
      revenue: 5000,
      created_by: 'user-fm-001',
    },
    {
      id: 'trip-002',
      source: 'Delhi Hub',
      destination: 'Jaipur Depot',
      vehicle_id: 'vehicle-002',
      driver_id: 'driver-002',
      cargo_weight_kg: 2500,
      planned_distance_km: 280,
      status: 'DISPATCHED',
      revenue: 12000,
      created_by: 'user-fm-001',
    }
  ];

  for (const t of trips) {
    await prisma.trip.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
    console.log(`  ✓ Trip: ${t.source} to ${t.destination} (${t.status})`);
  }

  // ─── Seed sample maintenance ──────────────────────────────
  const maintenance = [
    {
      id: 'maint-001',
      vehicle_id: 'vehicle-003',
      type: 'ROUTINE',
      description: 'Routine Oil Change & Brake Inspection',
      cost: 15000,
      status: 'CLOSED',
    },
    {
      id: 'maint-002',
      vehicle_id: 'vehicle-001',
      type: 'REPAIR',
      description: 'AC Gas Refill',
      cost: 3500,
      status: 'OPEN',
    }
  ];

  for (const m of maintenance) {
    await prisma.maintenanceLog.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
    console.log(`  ✓ Maintenance: ${m.description} (${m.status})`);
  }

  // ─── Seed sample fuel expenses ────────────────────────────
  const fuel = [
    {
      id: 'fuel-001',
      vehicle_id: 'vehicle-001',
      trip_id: 'trip-001',
      liters: 14.5,
      cost: 1305,
      date: new Date(),
    },
    {
      id: 'fuel-002',
      vehicle_id: 'vehicle-002',
      liters: 45.0,
      cost: 4050,
      date: new Date(),
    }
  ];

  for (const f of fuel) {
    await prisma.fuelLog.upsert({
      where: { id: f.id },
      update: f,
      create: f,
    });
    console.log(`  ✓ Fuel Expense: ${f.liters}L for Vehicle ${f.vehicle_id}`);
  }

  console.log('\n✅ Seed complete!\n');
  console.log('Demo login credentials (all passwords: demo123):');
  console.log('  Fleet Manager:     manager@transitops.io');
  console.log('  Driver:            driver@transitops.io');
  console.log('  Safety Officer:    safety@transitops.io');
  console.log('  Financial Analyst: finance@transitops.io');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
