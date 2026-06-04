import { ContactRepository } from '../../../domain/repositories/ContactRepository.js';
import { ContactMessage } from '../../../domain/entities/ContactMessage.js';
import { ValidationError } from '../../../domain/errors/DomainError.js';

export interface CreateContactInput {
  name: string;
  email: string;
  message: string;
}

export class CreateContactMessageUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(input: CreateContactInput): Promise<ContactMessage> {
    if (!input.name.trim() || !input.email.trim() || !input.message.trim()) {
      throw new ValidationError('Todos los campos son obligatorios');
    }
    return this.contactRepository.create(input);
  }
}
