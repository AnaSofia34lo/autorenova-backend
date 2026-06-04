import { AppointmentRepository } from '../../../domain/repositories/AppointmentRepository.js';
import { AppointmentStatus } from '../../../domain/entities/Appointment.js';
import { NotFoundError, ForbiddenError } from '../../../domain/errors/DomainError.js';

export class UpdateAppointmentStatusUseCase {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(
    id: string,
    status: AppointmentStatus,
    userContext: { userId: string; role: 'USER' | 'ADMIN' }
  ): Promise<any> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundError('Cita no encontrada');
    }

    // Authorization checks:
    // If not Admin, a User can only CANCEL their own appointment.
    if (userContext.role !== 'ADMIN') {
      if (appointment.userId !== userContext.userId) {
        throw new ForbiddenError('No tienes permiso para modificar esta cita');
      }
      if (status !== 'CANCELLED') {
        throw new ForbiddenError('Solo los administradores pueden cambiar el estado a algo diferente de CANCELLED');
      }
    }

    return this.appointmentRepository.update(id, { status });
  }
}
