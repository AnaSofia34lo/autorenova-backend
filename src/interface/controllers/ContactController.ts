import { Request, Response, NextFunction } from 'express';
import { CreateContactMessageUseCase } from '../../application/usecases/contact/CreateContactMessageUseCase.js';
import { ListContactMessagesUseCase } from '../../application/usecases/contact/ListContactMessagesUseCase.js';
import { contactRepository } from '../../infrastructure/config/services.js';

export class ContactController {
  private readonly createUseCase = new CreateContactMessageUseCase(contactRepository);
  private readonly listUseCase = new ListContactMessagesUseCase(contactRepository);

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.createUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.listUseCase.execute();
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}

export default ContactController;
