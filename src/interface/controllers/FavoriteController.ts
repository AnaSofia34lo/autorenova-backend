import { Request, Response, NextFunction } from 'express';
import { ToggleFavoriteUseCase } from '../../application/usecases/favorites/ToggleFavoriteUseCase.js';
import { ListFavoritesUseCase } from '../../application/usecases/favorites/ListFavoritesUseCase.js';
import { favoriteRepository, vehicleRepository } from '../../infrastructure/config/services.js';
import { ForbiddenError } from '../../domain/errors/DomainError.js';

export class FavoriteController {
  private readonly toggleUseCase = new ToggleFavoriteUseCase(favoriteRepository, vehicleRepository);
  private readonly listUseCase = new ListFavoritesUseCase(favoriteRepository);

  toggle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new ForbiddenError('No autenticado');
      }

      const { vehicleId } = req.body;
      const result = await this.toggleUseCase.execute(userId, vehicleId);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new ForbiddenError('No autenticado');
      }

      const result = await this.listUseCase.execute(userId);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}

export default FavoriteController;
