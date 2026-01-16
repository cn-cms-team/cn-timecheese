import { PrismaClient } from '@generated/prisma/client';
// import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const connectionString = `${process.env.DATABASE_URL}`;

// init prisma client
const adapter = new PrismaTiDBCloud({ url: connectionString });

// const adapter = new PrismaMariaDb({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   port: parseInt(process.env.DATABASE_PORT || '4000'),
//   ssl: process.env.DATABASE_SSL === 'true',
// });
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter, log: ['error'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
