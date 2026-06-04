import { Vehicle, VehicleStatus } from '../../domain/entities/Vehicle.js';
import { VehicleImage } from '../../domain/entities/VehicleImage.js';
import { DamageRecord } from '../../domain/entities/DamageRecord.js';
import { RestorationHistory } from '../../domain/entities/RestorationHistory.js';
import { VehicleRepository, VehicleFilter } from '../../domain/repositories/VehicleRepository.js';
import { prisma } from '../prisma-client/prisma.js';

export class PrismaVehicleRepository implements VehicleRepository {
  private mapToEntity(dbVehicle: any): Vehicle {
    return new Vehicle(
      dbVehicle.id,
      dbVehicle.brand,
      dbVehicle.model,
      dbVehicle.year,
      dbVehicle.mileage,
      Number(dbVehicle.price),
      dbVehicle.marketPrice ? Number(dbVehicle.marketPrice) : null,
      dbVehicle.description,
      dbVehicle.status as VehicleStatus,
      dbVehicle.createdAt,
      dbVehicle.updatedAt
    );
  }

  async findById(id: string): Promise<(Vehicle & { images: VehicleImage[]; damages: DamageRecord[]; restorations: RestorationHistory[] }) | null> {
    const dbVehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: true,
        damages: true,
        restorations: true
      }
    });

    if (!dbVehicle) return null;

    return {
      ...this.mapToEntity(dbVehicle),
      images: dbVehicle.images.map(img => new VehicleImage(img.id, img.imageUrl, img.vehicleId, img.createdAt)),
      damages: dbVehicle.damages.map(dmg => new DamageRecord(dmg.id, dmg.damageType, dmg.affectedParts, dmg.acquisitionDate, dmg.vehicleId, dmg.createdAt)),
      restorations: dbVehicle.restorations.map(res => new RestorationHistory(res.id, res.repairsPerformed, res.replacedParts, res.repairDate, res.observations, res.vehicleId, res.createdAt))
    };
  }

  async findMany(filters: VehicleFilter, page: number, limit: number): Promise<{ data: Vehicle[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.brand) {
      where.brand = { contains: filters.brand, mode: 'insensitive' };
    }
    if (filters.model) {
      where.model = { contains: filters.model, mode: 'insensitive' };
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.yearMin || filters.yearMax) {
      where.year = {};
      if (filters.yearMin) where.year.gte = filters.yearMin;
      if (filters.yearMax) where.year.lte = filters.yearMax;
    }
    if (filters.priceMin || filters.priceMax) {
      where.price = {};
      if (filters.priceMin) where.price.gte = filters.priceMin;
      if (filters.priceMax) where.price.lte = filters.priceMax;
    }
    if (filters.mileageMax !== undefined) {
      where.mileage = { lte: filters.mileageMax };
    }

    const [total, list] = await Promise.all([
      prisma.vehicle.count({ where }),
      prisma.vehicle.findMany({
        where,
        include: {
          images: {
            take: 1 // Fetch only the main/first image for catalogue efficiency
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })
    ]);

    // Map list to entities, appending the first image URL if available
    const data = list.map(item => {
      const entity = this.mapToEntity(item) as any;
      entity.images = item.images.map(img => new VehicleImage(img.id, img.imageUrl, img.vehicleId, img.createdAt));
      return entity;
    });

    return { data, total };
  }

  async create(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    const dbVehicle = await prisma.vehicle.create({
      data: {
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        mileage: vehicle.mileage,
        price: vehicle.price,
        marketPrice: vehicle.marketPrice,
        description: vehicle.description,
        status: vehicle.status
      }
    });
    return this.mapToEntity(dbVehicle);
  }

  async update(id: string, vehicle: Partial<Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Vehicle> {
    const dbVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        mileage: vehicle.mileage,
        price: vehicle.price,
        marketPrice: vehicle.marketPrice,
        description: vehicle.description,
        status: vehicle.status
      }
    });
    return this.mapToEntity(dbVehicle);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.vehicle.delete({
      where: { id }
    });
    return true;
  }

  async addImage(vehicleId: string, imageUrl: string): Promise<VehicleImage> {
    const dbImage = await prisma.vehicleImage.create({
      data: {
        imageUrl,
        vehicleId
      }
    });
    return new VehicleImage(dbImage.id, dbImage.imageUrl, dbImage.vehicleId, dbImage.createdAt);
  }

  async findImageById(imageId: string): Promise<VehicleImage | null> {
    const dbImage = await prisma.vehicleImage.findUnique({
      where: { id: imageId }
    });
    if (!dbImage) return null;
    return new VehicleImage(dbImage.id, dbImage.imageUrl, dbImage.vehicleId, dbImage.createdAt);
  }

  async removeImage(imageId: string): Promise<boolean> {
    await prisma.vehicleImage.delete({
      where: { id: imageId }
    });
    return true;
  }

  async addDamage(damage: Omit<DamageRecord, 'id' | 'createdAt'>): Promise<DamageRecord> {
    const dbDmg = await prisma.damageRecord.create({
      data: {
        damageType: damage.damageType,
        affectedParts: damage.affectedParts,
        acquisitionDate: damage.acquisitionDate,
        vehicleId: damage.vehicleId
      }
    });
    return new DamageRecord(dbDmg.id, dbDmg.damageType, dbDmg.affectedParts, dbDmg.acquisitionDate, dbDmg.vehicleId, dbDmg.createdAt);
  }

  async addRestoration(restoration: Omit<RestorationHistory, 'id' | 'createdAt'>): Promise<RestorationHistory> {
    const dbRes = await prisma.restorationHistory.create({
      data: {
        repairsPerformed: restoration.repairsPerformed,
        replacedParts: restoration.replacedParts,
        repairDate: restoration.repairDate,
        observations: restoration.observations,
        vehicleId: restoration.vehicleId
      }
    });
    return new RestorationHistory(dbRes.id, dbRes.repairsPerformed, dbRes.replacedParts, dbRes.repairDate, dbRes.observations, dbRes.vehicleId, dbRes.createdAt);
  }
}
