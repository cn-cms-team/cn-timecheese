/*
  Warnings:

  - Added the required column `work_hours` to the `project_members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "project_members" ADD COLUMN     "end_date" DATE,
ADD COLUMN     "start_date" DATE,
ADD COLUMN     "work_hours" INTEGER NOT NULL;
