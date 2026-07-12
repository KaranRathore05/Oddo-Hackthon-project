import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  vehicle_id: z.string().min(1, 'Valid vehicle ID is required.'),
  type: z.string().min(1, 'Maintenance type is required.'),
  description: z.string().optional(),
  cost: z.number().min(0, 'Cost must be non-negative.'),
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
