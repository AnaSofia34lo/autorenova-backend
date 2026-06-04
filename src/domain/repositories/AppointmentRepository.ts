import { Appointment, AppointmentStatus } from '../entities/Appointment.js';

export interface AppointmentFilter {
  userId?: string;
  status?: AppointmentStatus;
}

export interface AppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  hasActiveScheduleConflict(appointmentDate: Date, appointmentTime: string): Promise<boolean>;
  findMany(filters: AppointmentFilter, page: number, limit: number): Promise<{ data: (Appointment & { vehicle: { brand: string; model: string; year: number }; user?: { firstName: string; lastName: string; email: string } })[], total: number }>;
  create(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment>;
  update(id: string, appointment: Partial<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Appointment>;
  delete(id: string): Promise<boolean>;
}
