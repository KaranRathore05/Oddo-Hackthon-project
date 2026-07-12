import { z } from 'zod';

export const createDriverSchema = z.object({
  name: z.string().min(1, 'Driver name is required.'),
  license_number: z.string().min(1, 'License number is required.'),
  license_category: z.string().min(1, 'License category is required.'),
  license_expiry_date: z.string().min(1, 'License expiry date is required.'),
  contact_number: z.string().min(1, 'Contact number is required.'),
  safety_score: z.number().int().min(0).max(100).optional().default(100),
});

export const updateDriverSchema = z.object({
  name: z.string().min(1).optional(),
  license_number: z.string().min(1).optional(),
  license_category: z.string().min(1).optional(),
  license_expiry_date: z.string().optional(),
  contact_number: z.string().min(1).optional(),
  safety_score: z.number().int().min(0).max(100).optional(),
});

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
