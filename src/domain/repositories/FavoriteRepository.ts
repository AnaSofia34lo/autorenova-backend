import { Favorite } from '../entities/Favorite.js';
import { Vehicle } from '../entities/Vehicle.js';

export interface FavoriteRepository {
  findByUserAndVehicle(userId: string, vehicleId: string): Promise<Favorite | null>;
  findManyByUser(userId: string): Promise<(Favorite & { vehicle: Vehicle & { images: { imageUrl: string }[] } })[]>;
  create(userId: string, vehicleId: string): Promise<Favorite>;
  delete(userId: string, vehicleId: string): Promise<boolean>;
}
