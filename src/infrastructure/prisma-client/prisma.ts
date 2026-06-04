import { PrismaClient } from '../../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import config from '../config/index.js';

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required to initialize Prisma');
}

const adapter = new PrismaPg({
  connectionString: config.databaseUrl,
});

export const prisma = new PrismaClient({ adapter });
export default prisma;
export { Prisma } from '../../../generated/prisma/client.js';
