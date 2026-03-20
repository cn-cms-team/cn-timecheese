/*
  Warnings:

  - You are about to drop the column `is_skill_upgraded` on the `project_task_types` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "project_task_types" DROP COLUMN "is_skill_upgraded";

-- AlterTable
ALTER TABLE "task_types" ADD COLUMN     "is_skill_upgraded" BOOLEAN NOT NULL DEFAULT false;
