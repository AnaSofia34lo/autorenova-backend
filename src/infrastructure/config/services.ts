import { BcryptPasswordHasher } from '../security/BcryptPasswordHasher.js';
import { JwtTokenService } from '../security/JwtTokenService.js';
import { SupabaseStorageService } from '../storage/SupabaseStorageService.js';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository.js';
import { PrismaVehicleRepository } from '../repositories/PrismaVehicleRepository.js';
import { PrismaAppointmentRepository } from '../repositories/PrismaAppointmentRepository.js';
import { PrismaFavoriteRepository } from '../repositories/PrismaFavoriteRepository.js';
import { PrismaReviewRepository } from '../repositories/PrismaReviewRepository.js';
import { PrismaContactRepository } from '../repositories/PrismaContactRepository.js';

// Services
export const passwordHasher = new BcryptPasswordHasher();
export const jwtService = new JwtTokenService();
export const storageService = new SupabaseStorageService();

// Repositories
export const userRepository = new PrismaUserRepository();
export const vehicleRepository = new PrismaVehicleRepository();
export const appointmentRepository = new PrismaAppointmentRepository();
export const favoriteRepository = new PrismaFavoriteRepository();
export const reviewRepository = new PrismaReviewRepository();
export const contactRepository = new PrismaContactRepository();
