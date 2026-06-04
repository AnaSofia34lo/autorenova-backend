import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../../infrastructure/config/services.js';
import { UnauthorizedError } from '../../domain/errors/DomainError.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Acceso denegado: Token no proporcionado'));
  }

  const token = authHeader.split(' ')[1];
  const payload = jwtService.verifyToken(token);

  if (!payload) {
    return next(new UnauthorizedError('Acceso denegado: Token inválido o expirado'));
  }

  req.user = payload;
  next();
};

export default authMiddleware;
