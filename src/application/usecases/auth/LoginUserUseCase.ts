import { UserRepository } from '../../../domain/repositories/UserRepository.js';
import { PasswordHasher } from '../../../domain/services/PasswordHasher.js';
import { JwtService } from '../../../domain/services/JwtService.js';
import { UnauthorizedError } from '../../../domain/errors/DomainError.js';
import { AuthResponse } from './RegisterUserUseCase.js';

export interface LoginInput {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService
  ) {}

  async execute(input: LoginInput): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Credenciales incorrectas');
    }

    const isValid = await this.passwordHasher.compare(input.password, user.password || '');
    if (!isValid) {
      throw new UnauthorizedError('Credenciales incorrectas');
    }

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
