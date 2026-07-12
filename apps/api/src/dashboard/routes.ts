import { Router } from 'express';
import { getDashboardKPIs } from './controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/kpis', getDashboardKPIs);

export default router;
