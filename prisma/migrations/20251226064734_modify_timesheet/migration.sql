/*
  Warnings:

  - You are about to drop the column `task_type_id` on the `time_sheets` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "time_sheets" DROP CONSTRAINT "time_sheets_task_type_id_fkey";

-- AlterTable
ALTER TABLE "time_sheets" DROP COLUMN "task_type_id",
ADD COLUMN     "project_task_type_id" CHAR(36);

-- AddForeignKey
ALTER TABLE "time_sheets" ADD CONSTRAINT "time_sheets_project_task_type_id_fkey" FOREIGN KEY ("project_task_type_id") REFERENCES "project_task_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
