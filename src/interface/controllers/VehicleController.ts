import { Request, Response, NextFunction } from 'express';
import { CreateVehicleUseCase } from '../../application/usecases/vehicles/CreateVehicleUseCase.js';
import { UpdateVehicleUseCase } from '../../application/usecases/vehicles/UpdateVehicleUseCase.js';
import { DeleteVehicleUseCase } from '../../application/usecases/vehicles/DeleteVehicleUseCase.js';
import { GetVehicleDetailsUseCase } from '../../application/usecases/vehicles/GetVehicleDetailsUseCase.js';
import { ListVehiclesUseCase } from '../../application/usecases/vehicles/ListVehiclesUseCase.js';
import { AddVehicleDamageUseCase } from '../../application/usecases/vehicles/AddVehicleDamageUseCase.js';
import { AddVehicleRestorationUseCase } from '../../application/usecases/vehicles/AddVehicleRestorationUseCase.js';
import { UploadVehicleImageUseCase } from '../../application/usecases/vehicles/UploadVehicleImageUseCase.js';
import { DeleteVehicleImageUseCase } from '../../application/usecases/vehicles/DeleteVehicleImageUseCase.js';
import { vehicleRepository, storageService } from '../../infrastructure/config/services.js';
import { UploadedFile } from '../../domain/entities/UploadedFile.js';
import { ValidationError } from '../../domain/errors/DomainError.js';

export class VehicleController {
  private readonly createUseCase = new CreateVehicleUseCase(vehicleRepository);
  private readonly updateUseCase = new UpdateVehicleUseCase(vehicleRepository);
  private readonly deleteUseCase = new DeleteVehicleUseCase(vehicleRepository);
  private readonly getDetailsUseCase = new GetVehicleDetailsUseCase(vehicleRepository);
  private readonly listUseCase = new ListVehiclesUseCase(vehicleRepository);
  private readonly addDamageUseCase = new AddVehicleDamageUseCase(vehicleRepository);
  private readonly addRestorationUseCase = new AddVehicleRestorationUseCase(vehicleRepository);
  private readonly uploadImageUseCase = new UploadVehicleImageUseCase(vehicleRepository, storageService);
  private readonly deleteImageUseCase = new DeleteVehicleImageUseCase(vehicleRepository, storageService);

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      
      const filters = { ...req.query };
      delete filters.page;
      delete filters.limit;

      const result = await this.listUseCase.execute(filters, page, limit);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  getDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.getDetailsUseCase.execute(req.params.id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.createUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.updateUseCase.execute(req.params.id, req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.deleteUseCase.execute(req.params.id);
      res.status(200).json({ message: 'Vehículo eliminado correctamente' });
    } catch (e) {
      next(e);
    }
  };

  uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vehicleId = req.params.id;
      const file = req.file;
      
      console.log(`[uploadImage] Recibido upload para vehículo ${vehicleId}`);
      console.log(`[uploadImage] Archivo: ${file?.originalname}, Tamaño: ${file?.size} bytes, MIME: ${file?.mimetype}`);
      
      if (!file) {
        throw new ValidationError('Debe proporcionar un archivo de imagen');
      }

      const domainFile = new UploadedFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        file.size
      );

      const result = await this.uploadImageUseCase.execute(vehicleId, domainFile);
      console.log(`[uploadImage] Imagen subida exitosamente: ${result.imageUrl}`);
      res.status(201).json(result);
    } catch (e) {
      console.error(`[uploadImage] Error:`, e);
      next(e);
    }
  };

  deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, imageId } = req.params;
      await this.deleteImageUseCase.execute(id, imageId);
      res.status(200).json({ message: 'Imagen eliminada correctamente' });
    } catch (e) {
      next(e);
    }
  };

  addDamage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.addDamageUseCase.execute(req.params.id, req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  };

  addRestoration = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.addRestorationUseCase.execute(req.params.id, req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  };
}

export default VehicleController;
