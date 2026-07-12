import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler — returns consistent { error: { code, message } } shape.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[ERROR]', err);

  if (err instanceof Error) {
    // Prisma unique constraint violation
    if ((err as any).code === 'P2002') {
      const target = (err as any).meta?.target;
      res.status(409).json({
        error: {
          code: 'DUPLICATE',
          message: `A record with this ${target ? target.join(', ') : 'value'} already exists.`,
        },
      });
      return;
    }

    // Prisma record not found
    if ((err as any).code === 'P2025') {
      res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'The requested record was not found.' },
      });
      return;
    }

    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: err.message },
    });
    return;
  }

  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' },
  });
}
