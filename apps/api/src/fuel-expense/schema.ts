import { z } from 'zod';

export const createFuelLogSchema = z.object({
  vehicle_id: z.string().uuid('Valid vehicle ID is required.'),
  trip_id: z.string().uuid().optional(),
  liters: z.number().positive('Liters must be positive.'),
  cost: z.number().min(0, 'Cost must be non-negative.'),
  date: z.string().min(1, 'Date is required.'),
});

const expenseCategories = ['TOLL', 'MAINTENANCE', 'OTHER'] as const;

export const createExpenseSchema = z.object({
  vehicle_id: z.string().uuid().optional(),
  trip_id: z.string().uuid().optional(),
  category: z.enum(expenseCategories, { errorMap: () => ({ message: 'Invalid expense category.' }) }),
  amount: z.number().positive('Amount must be positive.'),
  date: z.string().min(1, 'Date is required.'),
  notes: z.string().optional(),
});

export type CreateFuelLogInput = z.infer<typeof createFuelLogSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
