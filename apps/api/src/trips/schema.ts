import { z } from 'zod';

export const createTripSchema = z.object({
  source: z.string().min(1, 'Source is required.'),
  destination: z.string().min(1, 'Destination is required.'),
  vehicle_id: z.string().uuid('Valid vehicle ID is required.'),
  driver_id: z.string().uuid('Valid driver ID is required.'),
  cargo_weight_kg: z.number().positive('Cargo weight must be positive.'),
  planned_distance_km: z.number().positive('Planned distance must be positive.'),
  revenue: z.number().min(0).optional(),
});

export const completeTripSchema = z.object({
  actual_distance_km: z.number().positive('Actual distance must be positive.'),
  fuel_consumed_liters: z.number().positive('Fuel consumed must be positive.'),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type CompleteTripInput = z.infer<typeof completeTripSchema>;
