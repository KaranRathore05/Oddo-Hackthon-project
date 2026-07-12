import { Router } from 'express';
import { listTrips, getTrip, createTrip, dispatchTrip, completeTrip, cancelTrip } from './controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTripSchema, completeTripSchema } from './schema.js';

const router = Router();
router.use(authenticate);

router.get('/', listTrips);
router.get('/:id', getTrip);
router.post('/', authorize('DRIVER', 'FLEET_MANAGER'), validate(createTripSchema), createTrip);
router.patch('/:id/dispatch', authorize('DRIVER', 'FLEET_MANAGER'), dispatchTrip);
router.patch('/:id/complete', authorize('DRIVER', 'FLEET_MANAGER'), validate(completeTripSchema), completeTrip);
router.patch('/:id/cancel', authorize('DRIVER', 'FLEET_MANAGER'), cancelTrip);

export default router;
