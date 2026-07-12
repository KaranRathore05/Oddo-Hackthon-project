import { Router } from 'express';
import { listDrivers, listAvailableDrivers, getDriver, createDriver, updateDriver, suspendDriver, reinstateDriver } from './controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createDriverSchema, updateDriverSchema } from './schema.js';

const router = Router();
router.use(authenticate);

router.get('/', listDrivers);
router.get('/available', listAvailableDrivers);
router.get('/:id', getDriver);
router.post('/', authorize('FLEET_MANAGER', 'SAFETY_OFFICER'), validate(createDriverSchema), createDriver);
router.put('/:id', authorize('FLEET_MANAGER', 'SAFETY_OFFICER'), validate(updateDriverSchema), updateDriver);
router.patch('/:id/suspend', authorize('SAFETY_OFFICER', 'FLEET_MANAGER'), suspendDriver);
router.patch('/:id/reinstate', authorize('SAFETY_OFFICER', 'FLEET_MANAGER'), reinstateDriver);

export default router;
