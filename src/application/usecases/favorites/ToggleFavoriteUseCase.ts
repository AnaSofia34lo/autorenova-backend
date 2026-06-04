import { FavoriteRepository } from '../../../domain/repositories/FavoriteRepository.js';
import { VehicleRepository } from '../../../domain/repositories/VehicleRepository.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';

export class ToggleFavoriteUseCase {
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly vehicleRepository: VehicleRepository
  ) {}

  async execute(userId: string, vehicleId: string): Promise<{ favorited: boolean }> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundError('Vehículo no encontrado');
    }

    const existing = await this.favoriteRepository.findByUserAndVehicle(userId, vehicleId);
    if (existing) {
      await this.favoriteRepository.delete(userId, vehicleId);
      return { favorited: false };
    } else {
      await this.favoriteRepository.create(userId, vehicleId);
      return { favorited: true };
    }
  }
}
