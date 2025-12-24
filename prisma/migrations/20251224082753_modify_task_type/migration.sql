/*
  Warnings:

  - You are about to drop the column `created_at` on the `task_types` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `task_types` table. All the data in the column will be lost.
  - You are about to drop the column `is_company` on the `task_types` table. All the data in the column will be lost.
  - You are about to drop the column `is_enabled` on the `task_types` table. All the data in the column will be lost.
  - You are about to drop the column `is_leave` on the `task_types` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `task_types` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `task_types` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TaskTypeCode" ADD VALUE 'COMPANY';
ALTER TYPE "TaskTypeCode" ADD VALUE 'LEAVE';

-- DropForeignKey
ALTER TABLE "task_types" DROP CONSTRAINT "task_types_created_by_fkey";

-- DropForeignKey
ALTER TABLE "task_types" DROP CONSTRAINT "task_types_updated_by_fkey";

-- AlterTable
ALTER TABLE "task_types" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "is_company",
DROP COLUMN "is_enabled",
DROP COLUMN "is_leave",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
