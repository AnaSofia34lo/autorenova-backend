import { ContactMessage } from '../entities/ContactMessage.js';

export interface ContactRepository {
  create(message: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage>;
  findMany(): Promise<ContactMessage[]>;
}
