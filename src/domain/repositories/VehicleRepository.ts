import { Vehicle } from '../entities/Vehicle.js';
import { VehicleImage } from '../entities/VehicleImage.js';
import { DamageRecord } from '../entities/DamageRecord.js';
import { RestorationHistory } from '../entities/RestorationHistory.js';

export interface VehicleFilter {
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  status?: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  mileageMax?: number;
}

export interface VehicleRepository {
  findById(id: string): Promise<(Vehicle & { images: VehicleImage[]; damages: DamageRecord[]; restorations: RestorationHistory[] }) | null>;
  findMany(filters: VehicleFilter, page: number, limit: number): Promise<{ data: Vehicle[], total: number }>;
  create(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle>;
  update(id: string, vehicle: Partial<Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Vehicle>;
  delete(id: string): Promise<boolean>;
  
  addImage(vehicleId: string, imageUrl: string): Promise<VehicleImage>;
  findImageById(imageId: string): Promise<VehicleImage | null>;
  removeImage(imageId: string): Promise<boolean>;
  
  addDamage(damage: Omit<DamageRecord, 'id' | 'createdAt'>): Promise<DamageRecord>;
  addRestoration(restoration: Omit<RestorationHistory, 'id' | 'createdAt'>): Promise<RestorationHistory>;
}
