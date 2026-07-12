import { Router } from 'express';
import { globalSearch } from './controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/search', authenticate, globalSearch);

export default router;
