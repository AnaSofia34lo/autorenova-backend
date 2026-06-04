import { VehicleRepository } from '../../../domain/repositories/VehicleRepository.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { Vehicle } from '../../../domain/entities/Vehicle.js';
import { VehicleImage } from '../../../domain/entities/VehicleImage.js';
import { DamageRecord } from '../../../domain/entities/DamageRecord.js';
import { RestorationHistory } from '../../../domain/entities/RestorationHistory.js';

export interface VehicleDetailsResponse extends Vehicle {
  images: VehicleImage[];
  damages: DamageRecord[];
  restorations: RestorationHistory[];
}

export class GetVehicleDetailsUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(id: string): Promise<VehicleDetailsResponse> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError('Vehículo no encontrado');
    }
    return vehicle;
  }
}
