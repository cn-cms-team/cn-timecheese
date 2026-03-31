-- CreateEnum
CREATE TYPE "Feeling" AS ENUM ('TERRIBLE', 'BAD', 'NEUTRAL', 'GOOD', 'GREAT');

-- AlterTable
ALTER TABLE "project_members" ADD COLUMN     "man_hours" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "time_sheets" ADD COLUMN     "feeling" "Feeling" NOT NULL DEFAULT 'NEUTRAL';
