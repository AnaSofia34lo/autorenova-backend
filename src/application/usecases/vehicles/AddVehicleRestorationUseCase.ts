import { VehicleRepository } from '../../../domain/repositories/VehicleRepository.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { RestorationHistory } from '../../../domain/entities/RestorationHistory.js';

export interface CreateRestorationInput {
  repairsPerformed: string;
  replacedParts: string;
  repairDate: Date;
  observations: string | null;
}

export class AddVehicleRestorationUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(vehicleId: string, input: CreateRestorationInput): Promise<RestorationHistory> {
    const existing = await this.vehicleRepository.findById(vehicleId);
    if (!existing) {
      throw new NotFoundError('Vehículo no encontrado');
    }
    return this.vehicleRepository.addRestoration({
      repairsPerformed: input.repairsPerformed,
      replacedParts: input.replacedParts,
      repairDate: input.repairDate,
      observations: input.observations,
      vehicleId
    });
  }
}
