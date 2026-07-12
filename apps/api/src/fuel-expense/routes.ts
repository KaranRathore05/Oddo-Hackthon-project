import { Router } from 'express';
import { listFuelLogs, createFuelLog, listExpenses, createExpense, getOperationalCost } from './controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createFuelLogSchema, createExpenseSchema } from './schema.js';

const router = Router();
router.use(authenticate);

// Fuel logs
router.get('/fuel-logs', listFuelLogs);
router.post('/fuel-logs', authorize('FLEET_MANAGER', 'DRIVER', 'FINANCIAL_ANALYST'), validate(createFuelLogSchema), createFuelLog);

// Expenses
router.get('/expenses', listExpenses);
router.post('/expenses', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), validate(createExpenseSchema), createExpense);

// Operational cost aggregation
router.get('/operational-cost', getOperationalCost);

export default router;
