import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../application/usecases/auth/RegisterUserUseCase.js';
import { LoginUserUseCase } from '../../application/usecases/auth/LoginUserUseCase.js';
import { GetUserProfileUseCase } from '../../application/usecases/auth/GetUserProfileUseCase.js';
import { userRepository, passwordHasher, jwtService } from '../../infrastructure/config/services.js';

export class AuthController {
  private readonly registerUseCase = new RegisterUserUseCase(userRepository, passwordHasher, jwtService);
  private readonly loginUseCase = new LoginUserUseCase(userRepository, passwordHasher, jwtService);
  private readonly getProfileUseCase = new GetUserProfileUseCase(userRepository);

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.registerUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.loginUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  profile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('User context not found in request');
      }
      const result = await this.getProfileUseCase.execute(userId);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}

export default AuthController;
