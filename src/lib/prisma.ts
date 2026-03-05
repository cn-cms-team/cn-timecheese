import { PrismaClient } from '@generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const connectionString = `${process.env.DATABASE_URL}`;

// init prisma client
const adapter = new PrismaPg({ connectionString });
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter, log: ['error'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
