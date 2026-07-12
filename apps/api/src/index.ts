import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './auth/routes.js';
import vehicleRoutes from './vehicles/routes.js';
import driverRoutes from './drivers/routes.js';
import tripRoutes from './trips/routes.js';
import maintenanceRoutes from './maintenance/routes.js';
import financeRoutes from './fuel-expense/routes.js';
import dashboardRoutes from './dashboard/routes.js';
import documentRoutes from './documents/routes.js';
import searchRoutes from './search/routes.js';
import { startCronJobs } from './cron/reminders.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

// ─── Health check ───────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Static files ───────────────────────────────────────────
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', documentRoutes);
app.use('/api', searchRoutes);

// ─── Error handler (must be last) ───────────────────────────
app.use(errorHandler);

// ─── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 TransitOps API running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  
  // Start background jobs
  startCronJobs();
});

export default app;
