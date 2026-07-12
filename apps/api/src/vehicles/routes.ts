import { Router } from 'express';
import { listVehicles, listAvailableVehicles, getVehicle, createVehicle, updateVehicle, retireVehicle } from './controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createVehicleSchema, updateVehicleSchema } from './schema.js';

const router = Router();

// All vehicle routes require authentication
router.use(authenticate);

router.get('/', listVehicles);
router.get('/available', listAvailableVehicles);
router.get('/:id', getVehicle);
router.post('/', authorize('FLEET_MANAGER'), validate(createVehicleSchema), createVehicle);
router.put('/:id', authorize('FLEET_MANAGER'), validate(updateVehicleSchema), updateVehicle);
router.patch('/:id/retire', authorize('FLEET_MANAGER'), retireVehicle);

export default router;
