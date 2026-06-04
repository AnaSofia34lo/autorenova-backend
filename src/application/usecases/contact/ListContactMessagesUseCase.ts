import { ContactRepository } from '../../../domain/repositories/ContactRepository.js';
import { ContactMessage } from '../../../domain/entities/ContactMessage.js';

export class ListContactMessagesUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(): Promise<ContactMessage[]> {
    return this.contactRepository.findMany();
  }
}
