// ─── Enums ───────────────────────────────────────────────────────────
export type UserRole = 'FLEET_MANAGER' | 'DRIVER' | 'SAFETY_OFFICER' | 'FINANCIAL_ANALYST';

export type VehicleType = 'TRUCK' | 'VAN' | 'BUS' | 'CAR' | 'OTHER';
export type VehicleStatus = 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED';

export type DriverStatus = 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED';

export type TripStatus = 'DRAFT' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';

export type MaintenanceStatus = 'OPEN' | 'CLOSED';

export type ExpenseCategory = 'TOLL' | 'MAINTENANCE' | 'OTHER';

// ─── Entities ────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  registration_number: string;
  name_model: string;
  type: VehicleType;
  max_load_capacity_kg: number;
  odometer_km: number;
  acquisition_cost: number;
  status: VehicleStatus;
  region?: string;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  name: string;
  license_number: string;
  license_category: string;
  license_expiry_date: string;
  contact_number: string;
  safety_score: number;
  status: DriverStatus;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicle_id: string;
  driver_id: string;
  cargo_weight_kg: number;
  planned_distance_km: number;
  actual_distance_km?: number;
  fuel_consumed_liters?: number;
  revenue?: number;
  status: TripStatus;
  created_by?: string;
  dispatched_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceLog {
  id: string;
  vehicle_id: string;
  type: string;
  description?: string;
  cost: number;
  status: MaintenanceStatus;
  opened_at: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FuelLog {
  id: string;
  vehicle_id: string;
  trip_id?: string;
  liters: number;
  cost: number;
  date: string;
  created_at: string;
}

export interface Expense {
  id: string;
  vehicle_id?: string;
  trip_id?: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes?: string;
  created_at: string;
}

export interface VehicleDocument {
  id: string;
  vehicle_id: string;
  title: string;
  file_url: string;
  created_at: string;
}

export interface SearchResult {
  id: string;
  type: 'vehicle' | 'driver' | 'trip';
  title: string;
  subtitle: string;
  url: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────

export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isLicenseExpired(expiryDate: string): boolean {
  return new Date(expiryDate) < new Date();
}

export function isLicenseExpiringSoon(expiryDate: string, withinDays = 30): boolean {
  const expiry = new Date(expiryDate);
  const soon = new Date();
  soon.setDate(soon.getDate() + withinDays);
  return expiry <= soon && expiry >= new Date();
}

// ─── RBAC permissions ────────────────────────────────────────────────

export type Module = 'fleet' | 'drivers' | 'trips' | 'maintenance' | 'fuel_exp' | 'analytics' | 'settings';
export type Permission = 'full' | 'view' | 'none';

export const RBAC_MATRIX: Record<UserRole, Record<Module, Permission>> = {
  FLEET_MANAGER: {
    fleet: 'full', drivers: 'full', trips: 'view', maintenance: 'full', fuel_exp: 'view', analytics: 'full', settings: 'full',
  },
  DRIVER: {
    fleet: 'view', drivers: 'none', trips: 'full', maintenance: 'none', fuel_exp: 'none', analytics: 'none', settings: 'none',
  },
  SAFETY_OFFICER: {
    fleet: 'none', drivers: 'full', trips: 'view', maintenance: 'none', fuel_exp: 'none', analytics: 'none', settings: 'none',
  },
  FINANCIAL_ANALYST: {
    fleet: 'view', drivers: 'none', trips: 'view', maintenance: 'none', fuel_exp: 'full', analytics: 'full', settings: 'none',
  },
};

export function hasPermission(role: UserRole, module: Module, requiredLevel: 'view' | 'full' = 'view'): boolean {
  const perm = RBAC_MATRIX[role]?.[module];
  if (requiredLevel === 'view') return perm === 'view' || perm === 'full';
  return perm === 'full';
}
