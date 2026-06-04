export type UserRole = 'USER' | 'ADMIN';

export class User {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password?: string, // optional when sending user details to client
    public readonly role: UserRole = 'USER',
    public readonly isActive: boolean = true,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
