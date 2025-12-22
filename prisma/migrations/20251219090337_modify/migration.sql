/*
  Warnings:

  - The primary key for the `project_task_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `description` to the `project_task_types` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `project_task_types` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `project_task_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `project_task_types` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_task_types" DROP CONSTRAINT "project_task_types_task_type_id_fkey";

-- AlterTable
ALTER TABLE "project_task_types" DROP CONSTRAINT "project_task_types_pkey",
ADD COLUMN     "description" VARCHAR(255) NOT NULL,
ADD COLUMN     "id" CHAR(36) NOT NULL,
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ADD COLUMN     "type" "TaskTypeCode" NOT NULL,
ALTER COLUMN "task_type_id" DROP NOT NULL,
ADD CONSTRAINT "project_task_types_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "project_task_types" ADD CONSTRAINT "project_task_types_task_type_id_fkey" FOREIGN KEY ("task_type_id") REFERENCES "task_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
