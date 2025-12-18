import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  const ADMIN_ID = crypto.randomUUID();
  const USER_ID = crypto.randomUUID();

  const TEAM_ID = crypto.randomUUID();

  const ROLE_ADMIN_ID = crypto.randomUUID();
  const ROLE_USER_ID = crypto.randomUUID();

  const POS_DEV_ID = crypto.randomUUID();
  const POS_LEVEL_SENIOR_ID = crypto.randomUUID();
  const POS_LEVEL_JUNIOR_ID = crypto.randomUUID();

  // 2. Hash Password (use same for both for testing)
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.$transaction(async (tx) => {
    // --- POSTGRES MAGIC TRICK ---
    // This disables foreign key checks for the current session.
    // Note: This requires your DB user to have sufficient privileges (usually Superuser or Replication).
    try {
      await tx.$executeRawUnsafe(`SET session_replication_role = 'replica';`);
    } catch (e) {
      console.warn(
        '⚠️  Could not set session_replication_role. If seeding fails, it is because of circular dependencies.'
      );
    }

    // --- 1. Create Roles ---
    await tx.role.upsert({
      where: { id: ROLE_ADMIN_ID },
      update: {},
      create: {
        id: ROLE_ADMIN_ID,
        name: 'Admin',
        description: 'System Administrator',
        created_by: ADMIN_ID,
      },
    });

    await tx.role.upsert({
      where: { id: ROLE_USER_ID },
      update: {},
      create: {
        id: ROLE_USER_ID,
        name: 'Employee',
        description: 'Standard User',
        created_by: ADMIN_ID,
      },
    });

    // --- 2. Create Team ---
    await tx.team.upsert({
      where: { id: TEAM_ID },
      update: {},
      create: {
        id: TEAM_ID,
        name: 'Development Team',
        description: 'Core engineering team',
        created_by: ADMIN_ID,
      },
    });

    // --- 3. Create Position & Levels ---
    await tx.position.upsert({
      where: { id: POS_DEV_ID },
      update: {},
      create: {
        id: POS_DEV_ID,
        name: 'Software Developer',
        created_by: ADMIN_ID,
      },
    });

    await tx.positionLevel.upsert({
      where: { id: POS_LEVEL_SENIOR_ID },
      update: {},
      create: {
        id: POS_LEVEL_SENIOR_ID,
        name: 'Senior',
        position_id: POS_DEV_ID,
        created_by: ADMIN_ID,
      },
    });

    await tx.positionLevel.upsert({
      where: { id: POS_LEVEL_JUNIOR_ID },
      update: {},
      create: {
        id: POS_LEVEL_JUNIOR_ID,
        name: 'Junior',
        position_id: POS_DEV_ID,
        created_by: ADMIN_ID,
      },
    });

    // --- 4. Create Users ---

    // Admin User
    await tx.user.upsert({
      where: { code: 'ADM-001' },
      update: {},
      create: {
        id: ADMIN_ID,
        code: 'ADM-001',
        email: 'admin@company.com',
        password: passwordHash,
        first_name: 'Super',
        last_name: 'Admin',
        start_date: new Date(),
        is_active: true,
        // FKs
        role_id: ROLE_ADMIN_ID,
        team_id: TEAM_ID,
        position_level_id: POS_LEVEL_SENIOR_ID,
        created_by: ADMIN_ID, // Circular link to self
      },
    });

    // Normal User
    await tx.user.upsert({
      where: { code: 'EMP-001' },
      update: {},
      create: {
        id: USER_ID,
        code: 'EMP-001',
        email: 'john.doe@company.com',
        password: passwordHash,
        first_name: 'John',
        last_name: 'Doe',
        start_date: new Date(),
        is_active: true,
        // FKs
        role_id: ROLE_USER_ID,
        team_id: TEAM_ID,
        position_level_id: POS_LEVEL_JUNIOR_ID,
        created_by: ADMIN_ID,
      },
    });

    // --- RE-ENABLE CONSTRAINTS ---
    try {
      await tx.$executeRawUnsafe(`SET session_replication_role = 'origin';`);
    } catch (e) {
      // ignore
    }

    console.log('✅ Seeding finished successfully.');
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
