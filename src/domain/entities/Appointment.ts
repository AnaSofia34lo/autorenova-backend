export type AppointmentType = 'INSPECTION' | 'TEST_DRIVE' | 'FINANCIAL_ADVICE';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly appointmentDate: Date,
    public readonly appointmentTime: string,
    public readonly type: AppointmentType,
    public readonly status: AppointmentStatus = 'PENDING',
    public readonly userId: string,
    public readonly vehicleId: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
