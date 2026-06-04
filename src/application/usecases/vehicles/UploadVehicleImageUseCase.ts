import { VehicleRepository } from '../../../domain/repositories/VehicleRepository.js';
import { StorageService } from '../../../domain/services/StorageService.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';
import { UploadedFile } from '../../../domain/entities/UploadedFile.js';
import { VehicleImage } from '../../../domain/entities/VehicleImage.js';

export class UploadVehicleImageUseCase {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly storageService: StorageService
  ) {}

  async execute(vehicleId: string, file: UploadedFile): Promise<VehicleImage> {
    const existing = await this.vehicleRepository.findById(vehicleId);
    if (!existing) {
      throw new NotFoundError('Vehículo no encontrado');
    }

    // Upload to Supabase bucket under "vehicles" folder
    const imageUrl = await this.storageService.uploadFile(file, 'vehicles');

    // Add to DB
    return this.vehicleRepository.addImage(vehicleId, imageUrl);
  }
}
