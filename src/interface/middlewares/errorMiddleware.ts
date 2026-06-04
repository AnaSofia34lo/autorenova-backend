import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../domain/errors/DomainError.js';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Handle our custom Domain Errors
  if (error instanceof DomainError) {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }

  // 2. Handle Prisma specific errors
  // Prisma error codes are usually strings starting with P
  const prismaError = error as any;
  if (prismaError.code) {
    if (prismaError.code === 'P2002') {
      return res.status(409).json({
        error: 'Conflicto: Ya existe un registro con estos datos únicos'
      });
    }
    if (prismaError.code === 'P2025') {
      return res.status(404).json({
        error: 'No encontrado: El recurso solicitado no existe'
      });
    }
    if (prismaError.code.startsWith('P2')) {
      return res.status(400).json({
        error: `Error de base de datos (${prismaError.code}): Solicitud incorrecta`
      });
    }
  }

  // 3. Fallback for unknown errors (do not leak stack trace)
  console.error('Unhandled internal error:', error);
  res.status(500).json({
    error: 'Ocurrió un error interno en el servidor'
  });
};

export default errorMiddleware;
