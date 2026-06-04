import jwt from 'jsonwebtoken';
import { JwtService, JwtPayload } from '../../domain/services/JwtService.js';
import { SignOptions } from 'jsonwebtoken';

type DecodedToken = {
  userId?: string;
  role?: 'USER' | 'ADMIN';
};

export class JwtTokenService implements JwtService {
  private getSecret(): string {
    return process.env['JWT_SECRET'] || 'fallback-super-secret-key-change-me';
  }

  private getExpiresIn(): SignOptions['expiresIn'] {
    return (process.env['JWT_EXPIRES_IN'] || '24h') as SignOptions['expiresIn'];
  }

  generateToken(payload: JwtPayload): string {
    return jwt.sign(
      { userId: payload.userId, role: payload.role },
      this.getSecret(),
      { expiresIn: this.getExpiresIn() }
    );
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.getSecret()) as DecodedToken;
      if (decoded && decoded.userId && decoded.role) {
        return {
          userId: decoded.userId,
          role: decoded.role
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
