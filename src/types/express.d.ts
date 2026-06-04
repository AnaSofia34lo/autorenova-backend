import { JwtPayload } from '../domain/services/JwtService.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
