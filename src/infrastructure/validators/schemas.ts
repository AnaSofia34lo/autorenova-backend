import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Debe proporcionar un correo electrónico válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Debe proporcionar un correo electrónico válido'),
    password: z.string().min(1, 'La contraseña es requerida')
  })
});

export const listVehiclesSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(v => v ? parseInt(v, 10) : 1),
    limit: z.string().optional().transform(v => v ? parseInt(v, 10) : 10),
    brand: z.string().optional(),
    model: z.string().optional(),
    yearMin: z.string().optional().transform(v => v ? parseInt(v, 10) : undefined),
    yearMax: z.string().optional().transform(v => v ? parseInt(v, 10) : undefined),
    priceMin: z.string().optional().transform(v => v ? parseFloat(v) : undefined),
    priceMax: z.string().optional().transform(v => v ? parseFloat(v) : undefined),
    status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD']).optional(),
    mileageMax: z.string().optional().transform(v => v ? parseInt(v, 10) : undefined)
  })
});

export const createVehicleSchema = z.object({
  body: z.object({
    brand: z.string().min(1, 'La marca es obligatoria'),
    model: z.string().min(1, 'El modelo es obligatorio'),
    year: z.number().int().min(1900, 'Año inválido'),
    mileage: z.number().nonnegative('El kilometraje no puede ser negativo'),
    price: z.number().positive('El precio debe ser mayor a 0'),
    marketPrice: z.number().positive('El precio comercial debe ser mayor a 0').nullable().optional(),
    description: z.string().min(1, 'La descripción es obligatoria'),
    status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD']).optional()
  })
});

export const updateVehicleSchema = z.object({
  body: z.object({
    brand: z.string().min(1).optional(),
    model: z.string().min(1).optional(),
    year: z.number().int().min(1900).optional(),
    mileage: z.number().nonnegative().optional(),
    price: z.number().positive().optional(),
    marketPrice: z.number().positive().nullable().optional(),
    description: z.string().min(1).optional(),
    status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD']).optional()
  })
});

export const uuidParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido, debe ser un UUID')
  })
});

export const vehicleAndImageParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de vehículo inválido'),
    imageId: z.string().uuid('ID de imagen inválido')
  })
});

export const createDamageSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de vehículo inválido')
  }),
  body: z.object({
    damageType: z.string().min(1, 'El tipo de daño es obligatorio'),
    affectedParts: z.string().min(1, 'Las partes afectadas son obligatorias'),
    acquisitionDate: z.string().transform(v => new Date(v))
  })
});

export const createRestorationSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de vehículo inválido')
  }),
  body: z.object({
    repairsPerformed: z.string().min(1, 'Las reparaciones realizadas son obligatorias'),
    replacedParts: z.string().min(1, 'Las piezas reemplazadas son obligatorias'),
    repairDate: z.string().transform(v => new Date(v)),
    observations: z.string().nullable().optional()
  })
});

export const createAppointmentSchema = z.object({
  body: z.object({
    appointmentDate: z.string().transform(v => new Date(v)),
    appointmentTime: z.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'La hora debe tener formato HH:MM'),
    type: z.enum(['INSPECTION', 'TEST_DRIVE', 'FINANCIAL_ADVICE']),
    vehicleId: z.string().uuid('ID de vehículo inválido')
  })
});

export const listAppointmentsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(v => v ? parseInt(v, 10) : 1),
    limit: z.string().optional().transform(v => v ? parseInt(v, 10) : 10),
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional()
  })
});

export const updateAppointmentStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de cita inválido')
  }),
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
  })
});

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5, 'La calificación debe estar entre 1 y 5 estrellas'),
    comment: z.string().min(5, 'El comentario debe tener al menos 5 caracteres')
  })
});

export const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Debe proporcionar un correo electrónico válido'),
    message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres')
  })
});
