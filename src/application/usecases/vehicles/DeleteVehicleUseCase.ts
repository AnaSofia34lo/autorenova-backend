import { VehicleRepository } from '../../../domain/repositories/VehicleRepository.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';

export class DeleteVehicleUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(id: string): Promise<boolean> {
    const existing = await this.vehicleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Vehículo no encontrado');
    }
    return this.vehicleRepository.delete(id);
  }
}
