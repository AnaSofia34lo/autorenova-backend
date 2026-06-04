import { Favorite } from '../../domain/entities/Favorite.js';
import { Vehicle, VehicleStatus } from '../../domain/entities/Vehicle.js';
import { FavoriteRepository } from '../../domain/repositories/FavoriteRepository.js';
import { prisma } from '../prisma-client/prisma.js';

export class PrismaFavoriteRepository implements FavoriteRepository {
  async findByUserAndVehicle(userId: string, vehicleId: string): Promise<Favorite | null> {
    const dbFav = await prisma.favorite.findUnique({
      where: {
        userId_vehicleId: { userId, vehicleId }
      }
    });
    if (!dbFav) return null;
    return new Favorite(dbFav.id, dbFav.userId, dbFav.vehicleId, dbFav.createdAt);
  }

  async findManyByUser(userId: string): Promise<any[]> {
    const list = await prisma.favorite.findMany({
      where: { userId },
      include: {
        vehicle: {
          include: {
            images: {
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return list.map(item => ({
      id: item.id,
      userId: item.userId,
      vehicleId: item.vehicleId,
      createdAt: item.createdAt,
      vehicle: {
        id: item.vehicle.id,
        brand: item.vehicle.brand,
        model: item.vehicle.model,
        year: item.vehicle.year,
        mileage: item.vehicle.mileage,
        price: Number(item.vehicle.price),
        marketPrice: item.vehicle.marketPrice ? Number(item.vehicle.marketPrice) : null,
        description: item.vehicle.description,
        status: item.vehicle.status as VehicleStatus,
        images: item.vehicle.images.map(img => ({ imageUrl: img.imageUrl }))
      }
    }));
  }

  async create(userId: string, vehicleId: string): Promise<Favorite> {
    const dbFav = await prisma.favorite.create({
      data: {
        userId,
        vehicleId
      }
    });
    return new Favorite(dbFav.id, dbFav.userId, dbFav.vehicleId, dbFav.createdAt);
  }

  async delete(userId: string, vehicleId: string): Promise<boolean> {
    await prisma.favorite.delete({
      where: {
        userId_vehicleId: { userId, vehicleId }
      }
    });
    return true;
  }
}
