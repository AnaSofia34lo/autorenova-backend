import { Appointment, AppointmentType, AppointmentStatus } from '../../domain/entities/Appointment.js';
import { AppointmentRepository, AppointmentFilter } from '../../domain/repositories/AppointmentRepository.js';
import { prisma } from '../prisma-client/prisma.js';

export class PrismaAppointmentRepository implements AppointmentRepository {
  private mapToEntity(dbApp: any): Appointment {
    return new Appointment(
      dbApp.id,
      dbApp.appointmentDate,
      dbApp.appointmentTime,
      dbApp.type as AppointmentType,
      dbApp.status as AppointmentStatus,
      dbApp.userId,
      dbApp.vehicleId,
      dbApp.createdAt,
      dbApp.updatedAt
    );
  }

  async findById(id: string): Promise<Appointment | null> {
    const dbApp = await prisma.appointment.findUnique({
      where: { id }
    });
    if (!dbApp) return null;
    return this.mapToEntity(dbApp);
  }

  async hasActiveScheduleConflict(appointmentDate: Date, appointmentTime: string): Promise<boolean> {
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const count = await prisma.appointment.count({
      where: {
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        appointmentTime,
        status: {
          not: 'CANCELLED'
        }
      }
    });

    return count > 0;
  }

  async findMany(filters: AppointmentFilter, page: number, limit: number): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }
    if (filters.status) {
      where.status = filters.status;
    }

    const [total, list] = await Promise.all([
      prisma.appointment.count({ where }),
      prisma.appointment.findMany({
        where,
        include: {
          vehicle: {
            select: {
              brand: true,
              model: true,
              year: true
            }
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { appointmentDate: 'asc' },
        skip,
        take: limit
      })
    ]);

    const data = list.map(item => ({
      ...this.mapToEntity(item),
      vehicle: item.vehicle,
      user: item.user
    }));

    return { data, total };
  }

  async create(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    const dbApp = await prisma.appointment.create({
      data: {
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        type: appointment.type,
        status: appointment.status,
        userId: appointment.userId,
        vehicleId: appointment.vehicleId
      }
    });
    return this.mapToEntity(dbApp);
  }

  async update(id: string, appointment: Partial<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Appointment> {
    const dbApp = await prisma.appointment.update({
      where: { id },
      data: {
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        type: appointment.type,
        status: appointment.status
      }
    });
    return this.mapToEntity(dbApp);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.appointment.delete({
      where: { id }
    });
    return true;
  }
}
