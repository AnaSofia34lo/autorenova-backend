import { AppointmentRepository, AppointmentFilter } from '../../../domain/repositories/AppointmentRepository.js';
import { Appointment } from '../../../domain/entities/Appointment.js';
import { PaginatedResult } from '../vehicles/ListVehiclesUseCase.js';

export class ListAppointmentsUseCase {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(filters: AppointmentFilter, page: number = 1, limit: number = 10): Promise<PaginatedResult<any>> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));

    const { data, total } = await this.appointmentRepository.findMany(filters, safePage, safeLimit);
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
