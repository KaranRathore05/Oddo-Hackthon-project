import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

// Add document
export const addDocument = async (req: Request, res: Response) => {
  try {
    const { vehicle_id } = req.params;
    const { title } = req.body;
    const file = req.file;

    if (!file || !title) {
      return res.status(400).json({ error: { message: 'Title and file are required' } });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicle_id } });
    if (!vehicle) {
      return res.status(404).json({ error: { message: 'Vehicle not found' } });
    }

    // Generate URL for the uploaded file
    const file_url = `/uploads/${file.filename}`;

    const document = await prisma.vehicleDocument.create({
      data: {
        vehicle_id,
        title,
        file_url,
      },
    });

    res.status(201).json(document);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// Get documents for a vehicle
export const getDocuments = async (req: Request, res: Response) => {
  try {
    const { vehicle_id } = req.params;
    const documents = await prisma.vehicleDocument.findMany({
      where: { vehicle_id },
      orderBy: { created_at: 'desc' },
    });
    res.json(documents);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};
