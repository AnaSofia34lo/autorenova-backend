import { VehicleRepository } from '../../../domain/repositories/VehicleRepository.js';
import { StorageService } from '../../../domain/services/StorageService.js';
import { NotFoundError } from '../../../domain/errors/DomainError.js';

export class DeleteVehicleImageUseCase {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly storageService: StorageService
  ) {}

  async execute(vehicleId: string, imageId: string): Promise<boolean> {
    const existingVehicle = await this.vehicleRepository.findById(vehicleId);
    if (!existingVehicle) {
      throw new NotFoundError('Vehículo no encontrado');
    }

    const image = await this.vehicleRepository.findImageById(imageId);
    if (!image || image.vehicleId !== vehicleId) {
      throw new NotFoundError('Imagen no encontrada para este vehículo');
    }

    // Delete from Supabase Storage
    try {
      await this.storageService.deleteFile(image.imageUrl);
    } catch (e) {
      // Log error or continue to delete from DB if file is already missing
      console.error('Error deleting from storage:', e);
    }

    // Delete from DB
    return this.vehicleRepository.removeImage(imageId);
  }
}
