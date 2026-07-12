import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const searchStr = q.toLowerCase();

    const [vehicles, drivers, trips] = await Promise.all([
      // Search Vehicles
      prisma.vehicle.findMany({
        where: {
          OR: [
            { name_model: { contains: searchStr } },
            { registration_number: { contains: searchStr } },
          ],
        },
        take: 5,
      }),
      // Search Drivers
      prisma.driver.findMany({
        where: {
          OR: [
            { name: { contains: searchStr } },
            { license_number: { contains: searchStr } },
          ],
        },
        take: 5,
      }),
      // Search Trips
      prisma.trip.findMany({
        where: {
          OR: [
            { source: { contains: searchStr } },
            { destination: { contains: searchStr } },
            { id: { contains: searchStr } },
          ],
        },
        include: {
          vehicle: true,
          driver: true,
        },
        take: 5,
      }),
    ]);

    // Format results
    const results = [
      ...vehicles.map(v => ({
        id: v.id,
        type: 'vehicle',
        title: `${v.registration_number} - ${v.name_model}`,
        subtitle: `Status: ${v.status}`,
        url: `/vehicles`, // Could link to specific vehicle if we had a detail page
      })),
      ...drivers.map(d => ({
        id: d.id,
        type: 'driver',
        title: d.name,
        subtitle: `License: ${d.license_number} | Status: ${d.status}`,
        url: `/drivers`,
      })),
      ...trips.map(t => ({
        id: t.id,
        type: 'trip',
        title: `${t.source} to ${t.destination}`,
        subtitle: `Vehicle: ${t.vehicle.registration_number} | Driver: ${t.driver.name}`,
        url: `/trips`,
      })),
    ];

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};
