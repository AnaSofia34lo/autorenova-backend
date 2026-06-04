import { VehicleRepository } from '../../../domain/repositories/VehicleRepository.js';
import { Vehicle, VehicleStatus } from '../../../domain/entities/Vehicle.js';

export interface CreateVehicleInput {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  marketPrice: number | null;
  description: string;
  status?: VehicleStatus;
}

export class CreateVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(input: CreateVehicleInput): Promise<Vehicle> {
    return this.vehicleRepository.create({
      brand: input.brand,
      model: input.model,
      year: input.year,
      mileage: input.mileage,
      price: input.price,
      marketPrice: input.marketPrice,
      description: input.description,
      status: input.status || 'AVAILABLE'
    });
  }
}
