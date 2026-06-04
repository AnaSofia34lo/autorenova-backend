import { VehicleRepository, VehicleFilter } from '../../../domain/repositories/VehicleRepository.js';
import { Vehicle } from '../../../domain/entities/Vehicle.js';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ListVehiclesUseCase {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async execute(filters: VehicleFilter, page: number = 1, limit: number = 10): Promise<PaginatedResult<Vehicle>> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));

    const { data, total } = await this.vehicleRepository.findMany(filters, safePage, safeLimit);
    const totalPages = Math.ceil(total / safeLimit);

    return {
      data,
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages
      }
    };
  }
}
