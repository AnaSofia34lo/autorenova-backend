import { Request, Response, NextFunction } from 'express';
import { CreateAppointmentUseCase } from '../../application/usecases/appointments/CreateAppointmentUseCase.js';
import { ListAppointmentsUseCase } from '../../application/usecases/appointments/ListAppointmentsUseCase.js';
import { UpdateAppointmentStatusUseCase } from '../../application/usecases/appointments/UpdateAppointmentStatusUseCase.js';
import { appointmentRepository, vehicleRepository } from '../../infrastructure/config/services.js';
import { ForbiddenError } from '../../domain/errors/DomainError.js';

export class AppointmentController {
  private readonly createUseCase = new CreateAppointmentUseCase(appointmentRepository, vehicleRepository);
  private readonly listUseCase = new ListAppointmentsUseCase(appointmentRepository);
  private readonly updateStatusUseCase = new UpdateAppointmentStatusUseCase(appointmentRepository);

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new ForbiddenError('No autenticado');
      }

      const result = await this.createUseCase.execute({
        ...req.body,
        userId
      });
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const role = req.user?.role;
      if (!userId || !role) {
        throw new ForbiddenError('No autenticado');
      }

      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const filters: any = {};
      if (req.query.status) {
        filters.status = req.query.status;
      }

      // Enforce user ownership: users can only see their own appointments
      if (role !== 'ADMIN') {
        filters.userId = userId;
      } else if (req.query.userId) {
        // Admins can filter by user
        filters.userId = req.query.userId;
      }

      const result = await this.listUseCase.execute(filters, page, limit);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const role = req.user?.role;
      if (!userId || !role) {
        throw new ForbiddenError('No autenticado');
      }

      const appointmentId = req.params.id;
      const { status } = req.body;

      const result = await this.updateStatusUseCase.execute(
        appointmentId,
        status,
        { userId, role }
      );

      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}

export default AppointmentController;
