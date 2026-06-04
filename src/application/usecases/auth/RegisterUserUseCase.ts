import { UserRepository } from '../../../domain/repositories/UserRepository.js';
import { PasswordHasher } from '../../../domain/services/PasswordHasher.js';
import { JwtService } from '../../../domain/services/JwtService.js';
import { ConflictError } from '../../../domain/errors/DomainError.js';
import { User } from '../../../domain/entities/User.js';

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  token: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService
  ) {}

  async execute(input: RegisterInput): Promise<AuthResponse> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('El correo electrónico ya está registrado');
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);
    
    // Default role is USER for public registration
    const user = await this.userRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: hashedPassword,
      role: 'USER',
      isActive: true
    });

    const token = this.jwtService.generateToken({
      userId: user.id,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    };
  }
}
