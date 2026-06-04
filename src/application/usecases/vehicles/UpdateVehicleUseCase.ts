import { VehicleRepository } from '../../../domain/repositories/VehicleRepository.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { Vehicle, VehicleStatus } from '../../../domain/entities/Vehicle.js';

export interface UpdateVehicleInput {
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  price?: number;
  marketPrice?: number | null;
  description?: string;
  status?: VehicleStatus;
}

export class UpdateVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(id: string, input: UpdateVehicleInput): Promise<Vehicle> {
    const existing = await this.vehicleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Vehículo no encontrado');
    }
    return this.vehicleRepository.update(id, input);
  }
}
