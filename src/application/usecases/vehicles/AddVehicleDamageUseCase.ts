import { VehicleRepository } from '../../../domain/repositories/VehicleRepository.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { DamageRecord } from '../../../domain/entities/DamageRecord.js';

export interface CreateDamageInput {
  damageType: string;
  affectedParts: string;
  acquisitionDate: Date;
}

export class AddVehicleDamageUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(vehicleId: string, input: CreateDamageInput): Promise<DamageRecord> {
    const existing = await this.vehicleRepository.findById(vehicleId);
    if (!existing) {
      throw new NotFoundError('Vehículo no encontrado');
    }
    return this.vehicleRepository.addDamage({
      damageType: input.damageType,
      affectedParts: input.affectedParts,
      acquisitionDate: input.acquisitionDate,
      vehicleId
    });
  }
}
