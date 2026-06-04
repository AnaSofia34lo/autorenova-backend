import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

if (!process.env['DATABASE_URL']) {
  throw new Error('DATABASE_URL is required to run the seed');
}

const adapter = new PrismaPg({
  connectionString: process.env['DATABASE_URL'],
});

const prisma = new PrismaClient({ adapter });

const sampleVehicles = [
  {
    brand: 'Mazda',
    model: 'CX-5',
    year: 2020,
    mileage: 68400,
    price: 68500000,
    marketPrice: 82000000,
    description: 'SUV familiar restaurada. Historial visible y revisión técnica completa.',
    status: 'AVAILABLE' as const,
    damages: {
      damageType: 'Golpe frontal moderado',
      affectedParts: 'Bomper, capó, radiador y farola derecha',
      acquisitionDate: new Date('2025-02-12'),
    },
    restoration: {
      repairsPerformed: 'Reparación de frontal, cambio de radiador, alineación y pintura parcial',
      replacedParts: 'Radiador, farola derecha, bomper y soportes',
      repairDate: new Date('2025-03-18'),
      observations: 'Prueba de ruta aprobada y sistema de refrigeración verificado.',
    },
  },
  {
    brand: 'Renault',
    model: 'Logan',
    year: 2019,
    mileage: 74200,
    price: 31500000,
    marketPrice: 39000000,
    description: 'Sedán económico restaurado, ideal para uso diario y bajo costo de mantenimiento.',
    status: 'AVAILABLE' as const,
    damages: {
      damageType: 'Daño lateral izquierdo',
      affectedParts: 'Puerta delantera, guardabarros y espejo',
      acquisitionDate: new Date('2025-04-05'),
    },
    restoration: {
      repairsPerformed: 'Cambio de puerta, reparación de guardabarros y ajuste de pintura',
      replacedParts: 'Puerta delantera izquierda y espejo lateral',
      repairDate: new Date('2025-04-28'),
      observations: 'Estructura sin afectación mayor.',
    },
  },
  {
    brand: 'Chevrolet',
    model: 'Onix',
    year: 2021,
    mileage: 52100,
    price: 48500000,
    marketPrice: 58500000,
    description: 'Hatchback compacto restaurado con buen consumo y tecnología práctica.',
    status: 'RESERVED' as const,
    damages: {
      damageType: 'Afectación trasera leve',
      affectedParts: 'Bomper trasero y tapa baúl',
      acquisitionDate: new Date('2025-01-20'),
    },
    restoration: {
      repairsPerformed: 'Cambio de bomper, reparación de tapa baúl y calibración de sensores',
      replacedParts: 'Bomper trasero y sensores de reversa',
      repairDate: new Date('2025-02-10'),
      observations: 'Sensores y luces traseras funcionando correctamente.',
    },
  },
];

async function main() {
  const adminEmail = process.env['ADMIN_EMAIL'] || 'admin@autorenova.com';
  const adminPassword = process.env['ADMIN_PASSWORD'] || 'AdminPass123!';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (existingAdmin) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
    });
  } else {
    await prisma.user.create({
      data: {
        firstName: 'AutoRenova',
        lastName: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
    });
  }

  for (const vehicle of sampleVehicles) {
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
      },
    });

    if (existingVehicle) continue;

    await prisma.vehicle.create({
      data: {
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        mileage: vehicle.mileage,
        price: vehicle.price,
        marketPrice: vehicle.marketPrice,
        description: vehicle.description,
        status: vehicle.status,
        damages: {
          create: vehicle.damages,
        },
        restorations: {
          create: vehicle.restoration,
        },
      },
    });
  }
}

main()
  .catch((error) => {
    console.error('[Seed] Error durante la siembra:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
