-- AlterTable
ALTER TABLE "project_members" ADD COLUMN     "is_using" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "project_task_types" ADD COLUMN     "is_using" BOOLEAN NOT NULL DEFAULT false;
