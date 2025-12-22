/*
  Warnings:

  - You are about to drop the column `total_hours` on the `time_sheets` table. All the data in the column will be lost.
  - Added the required column `total_seconds` to the `time_sheets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project_members" ADD COLUMN     "hour_price" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "people_cost" DOUBLE PRECISION,
ADD COLUMN     "people_cost_percent" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "time_sheets" DROP COLUMN "total_hours",
ADD COLUMN     "total_seconds" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "salary_range" VARCHAR(100);
