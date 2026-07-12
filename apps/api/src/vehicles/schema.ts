import { z } from 'zod';

const vehicleTypes = ['TRUCK', 'VAN', 'BUS', 'CAR', 'OTHER'] as const;

export const createVehicleSchema = z.object({
  registration_number: z.string().min(1, 'Registration number is required.'),
  name_model: z.string().min(1, 'Vehicle name/model is required.'),
  type: z.enum(vehicleTypes, { errorMap: () => ({ message: 'Invalid vehicle type.' }) }),
  max_load_capacity_kg: z.number().positive('Max load capacity must be positive.'),
  odometer_km: z.number().min(0).optional().default(0),
  acquisition_cost: z.number().positive('Acquisition cost must be positive.'),
  region: z.string().optional(),
});

export const updateVehicleSchema = z.object({
  registration_number: z.string().min(1).optional(),
  name_model: z.string().min(1).optional(),
  type: z.enum(vehicleTypes).optional(),
  max_load_capacity_kg: z.number().positive().optional(),
  odometer_km: z.number().min(0).optional(),
  acquisition_cost: z.number().positive().optional(),
  region: z.string().nullable().optional(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
