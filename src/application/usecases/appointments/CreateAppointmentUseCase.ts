import { AppointmentRepository } from '../../../domain/repositories/AppointmentRepository.js';
import { VehicleRepository } from '../../../domain/repositories/VehicleRepository.js';
import { Appointment, AppointmentType } from '../../../domain/entities/Appointment.js';
import { NotFoundError, ValidationError } from '../../../domain/errors/DomainError.js';

export interface CreateAppointmentInput {
  appointmentDate: Date;
  appointmentTime: string; // e.g. "10:00"
  type: AppointmentType;
  userId: string;
  vehicleId: string;
}

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly vehicleRepository: VehicleRepository
  ) {}

  async execute(input: CreateAppointmentInput): Promise<Appointment> {
    const vehicle = await this.vehicleRepository.findById(input.vehicleId);
    if (!vehicle) {
      throw new NotFoundError('Vehículo no encontrado');
    }

    // Basic date validation (cannot be in the past)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(input.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      throw new ValidationError('La fecha de la cita no puede estar en el pasado');
    }

    const hasConflict = await this.appointmentRepository.hasActiveScheduleConflict(
      input.appointmentDate,
      input.appointmentTime
    );

    if (hasConflict) {
      throw new ValidationError('No hay disponibilidad en ese horario. Selecciona otro.');
    }

    return this.appointmentRepository.create({
      appointmentDate: input.appointmentDate,
      appointmentTime: input.appointmentTime,
      type: input.type,
      status: 'PENDING',
      userId: input.userId,
      vehicleId: input.vehicleId
    });
  }
}
