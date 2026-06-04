import { Request, Response, NextFunction } from 'express';
import { CreateReviewUseCase } from '../../application/usecases/reviews/CreateReviewUseCase.js';
import { ListReviewsUseCase } from '../../application/usecases/reviews/ListReviewsUseCase.js';
import { reviewRepository } from '../../infrastructure/config/services.js';
import { ForbiddenError } from '../../domain/errors/DomainError.js';

export class ReviewController {
  private readonly createUseCase = new CreateReviewUseCase(reviewRepository);
  private readonly listUseCase = new ListReviewsUseCase(reviewRepository);

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new ForbiddenError('No autenticado');
      }

      const result = await this.createUseCase.execute({
        ...req.body,
        userId
      });
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

export default ReviewController;
