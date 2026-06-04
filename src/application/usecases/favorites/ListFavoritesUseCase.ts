import { FavoriteRepository } from '../../../domain/repositories/FavoriteRepository.js';

export class ListFavoritesUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async execute(userId: string): Promise<any[]> {
    const list = await this.favoriteRepository.findManyByUser(userId);
    // Return the mapped vehicles
    return list.map(item => ({
      favoriteId: item.id,
      createdAt: item.createdAt,
      vehicle: item.vehicle
    }));
  }
}
