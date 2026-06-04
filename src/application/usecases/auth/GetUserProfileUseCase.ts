import { UserRepository } from '../../../domain/repositories/UserRepository.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<{ id: string; firstName: string; lastName: string; email: string; role: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };
  }
}
