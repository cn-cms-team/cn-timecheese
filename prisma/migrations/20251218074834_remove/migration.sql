/*
  Warnings:

  - You are about to drop the column `created_at` on the `position_levels` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `position_levels` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `position_levels` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `position_levels` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "position_levels" DROP CONSTRAINT "position_levels_created_by_fkey";

-- DropForeignKey
ALTER TABLE "position_levels" DROP CONSTRAINT "position_levels_updated_by_fkey";

-- AlterTable
ALTER TABLE "position_levels" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";
