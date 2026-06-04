export interface JwtPayload {
  userId: string;
  role: 'USER' | 'ADMIN';
}

export interface JwtService {
  generateToken(payload: JwtPayload): string;
  verifyToken(token: string): JwtPayload | null;
}
