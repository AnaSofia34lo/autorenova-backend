import { User, UserRole } from '../../domain/entities/User.js';
import { UserRepository } from '../../domain/repositories/UserRepository.js';
import { prisma } from '../prisma-client/prisma.js';

export class PrismaUserRepository implements UserRepository {
  private mapToEntity(dbUser: any): User {
    return new User(
      dbUser.id,
      dbUser.firstName,
      dbUser.lastName,
      dbUser.email,
      dbUser.password,
      dbUser.role as UserRole,
      dbUser.isActive,
      dbUser.createdAt,
      dbUser.updatedAt
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const dbUser = await prisma.user.findUnique({
      where: { email }
    });
    if (!dbUser) return null;
    return this.mapToEntity(dbUser);
  }

  async findById(id: string): Promise<User | null> {
    const dbUser = await prisma.user.findUnique({
      where: { id }
    });
    if (!dbUser) return null;
    return this.mapToEntity(dbUser);
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<User> {
    const dbUser = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        role: user.role,
        isActive: user.isActive
      }
    });
    return this.mapToEntity(dbUser);
  }

  async update(id: string, user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    const dbUser = await prisma.user.update({
      where: { id },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
    return this.mapToEntity(dbUser);
  }
}
