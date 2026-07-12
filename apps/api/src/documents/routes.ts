import { Router } from 'express';
import multer from 'multer';
import { addDocument, getDocuments } from './controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';

const router = Router();

// Setup Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Routes
router.post('/vehicles/:vehicle_id/documents', authenticate, authorize('FLEET_MANAGER'), upload.single('document'), addDocument);
router.get('/vehicles/:vehicle_id/documents', authenticate, getDocuments);

export default router;
