import { Router } from 'express';
import { listMaintenanceLogs, getMaintenanceLog, createMaintenanceLog, closeMaintenanceLog } from './controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createMaintenanceSchema } from './schema.js';

const router = Router();
router.use(authenticate);

router.get('/', listMaintenanceLogs);
router.get('/:id', getMaintenanceLog);
router.post('/', authorize('FLEET_MANAGER'), validate(createMaintenanceSchema), createMaintenanceLog);
router.patch('/:id/close', authorize('FLEET_MANAGER'), closeMaintenanceLog);

export default router;
