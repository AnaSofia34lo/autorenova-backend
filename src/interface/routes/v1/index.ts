import { Router } from 'express';
import { AuthController } from '../../controllers/AuthController.js';
import { VehicleController } from '../../controllers/VehicleController.js';
import { AppointmentController } from '../../controllers/AppointmentController.js';
import { FavoriteController } from '../../controllers/FavoriteController.js';
import { ReviewController } from '../../controllers/ReviewController.js';
import { ContactController } from '../../controllers/ContactController.js';

import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { adminMiddleware } from '../../middlewares/adminMiddleware.js';
import { upload } from '../../middlewares/uploadMiddleware.js';

import { validateDto } from '../../../infrastructure/validators/validateDto.js';
import * as schemas from '../../../infrastructure/validators/schemas.js';

const router = Router();

const authCtrl = new AuthController();
const vehicleCtrl = new VehicleController();
const appCtrl = new AppointmentController();
const favCtrl = new FavoriteController();
const reviewCtrl = new ReviewController();
const contactCtrl = new ContactController();

// === AUTHENTICATION ROUTES ===
router.post('/auth/register', validateDto(schemas.registerSchema), authCtrl.register);
router.post('/auth/login', validateDto(schemas.loginSchema), authCtrl.login);
router.get('/profile', authMiddleware, authCtrl.profile);

// === VEHICLE ROUTES ===
router.get('/vehicles', validateDto(schemas.listVehiclesSchema), vehicleCtrl.list);
router.get('/vehicles/:id', validateDto(schemas.uuidParamSchema), vehicleCtrl.getDetails);

// Admin-only vehicle modifications
router.post('/vehicles', authMiddleware, adminMiddleware, validateDto(schemas.createVehicleSchema), vehicleCtrl.create);
router.put('/vehicles/:id', authMiddleware, adminMiddleware, validateDto(schemas.updateVehicleSchema), vehicleCtrl.update);
router.delete('/vehicles/:id', authMiddleware, adminMiddleware, validateDto(schemas.uuidParamSchema), vehicleCtrl.delete);

// Admin-only subresource modifications
router.post('/vehicles/:id/images', authMiddleware, adminMiddleware, validateDto(schemas.uuidParamSchema), upload.single('image'), vehicleCtrl.uploadImage);
router.delete('/vehicles/:id/images/:imageId', authMiddleware, adminMiddleware, validateDto(schemas.vehicleAndImageParamSchema), vehicleCtrl.deleteImage);
router.post('/vehicles/:id/damages', authMiddleware, adminMiddleware, validateDto(schemas.createDamageSchema), vehicleCtrl.addDamage);
router.post('/vehicles/:id/restorations', authMiddleware, adminMiddleware, validateDto(schemas.createRestorationSchema), vehicleCtrl.addRestoration);

// === APPOINTMENT ROUTES ===
router.post('/appointments', authMiddleware, validateDto(schemas.createAppointmentSchema), appCtrl.create);
router.get('/appointments', authMiddleware, validateDto(schemas.listAppointmentsSchema), appCtrl.list);
router.put('/appointments/:id', authMiddleware, validateDto(schemas.updateAppointmentStatusSchema), appCtrl.updateStatus);

// === FAVORITE ROUTES ===
router.post('/favorites', authMiddleware, favCtrl.toggle);
router.get('/favorites', authMiddleware, favCtrl.list);

// === REVIEW ROUTES ===
router.post('/reviews', authMiddleware, validateDto(schemas.createReviewSchema), reviewCtrl.create);
router.get('/reviews', reviewCtrl.list);

// === CONTACT ROUTES ===
router.post('/contact', validateDto(schemas.createContactSchema), contactCtrl.create);
router.get('/contact', authMiddleware, adminMiddleware, contactCtrl.list);

export default router;
