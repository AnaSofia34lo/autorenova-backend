import { ContactMessage } from '../../domain/entities/ContactMessage.js';
import { ContactRepository } from '../../domain/repositories/ContactRepository.js';
import { prisma } from '../prisma-client/prisma.js';

export class PrismaContactRepository implements ContactRepository {
  async create(message: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> {
    const dbMsg = await prisma.contactMessage.create({
      data: {
        name: message.name,
        email: message.email,
        message: message.message
      }
    });
    return new ContactMessage(dbMsg.id, dbMsg.name, dbMsg.email, dbMsg.message, dbMsg.createdAt);
  }

  async findMany(): Promise<ContactMessage[]> {
    const list = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return list.map(item => new ContactMessage(item.id, item.name, item.email, item.message, item.createdAt));
  }
}
