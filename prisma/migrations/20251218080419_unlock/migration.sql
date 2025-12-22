-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_position_level_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_team_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "position_level_id" DROP NOT NULL,
ALTER COLUMN "team_id" DROP NOT NULL,
ALTER COLUMN "role_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_position_level_id_fkey" FOREIGN KEY ("position_level_id") REFERENCES "position_levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
