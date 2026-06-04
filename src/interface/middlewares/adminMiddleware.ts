import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../domain/errors/DomainError.js';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new UnauthorizedError('No autenticado'));
  }

  if (req.user.role !== 'ADMIN') {
    return next(new ForbiddenError('Acceso denegado: Se requieren permisos de administrador'));
  }

  next();
};

export default adminMiddleware;
