/*
  Warnings:

  - Added the required column `type` to the `task_types` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskTypeCode" AS ENUM ('DEVELOPMENT', 'BUSINESS', 'OPERATION', 'SALES', 'QA', 'IT', 'OTHER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PRE_SALE', 'PLANNING', 'IN_PROGRESS', 'MAINTENANCE', 'ON_HOLD', 'CANCELLED', 'TERMINATED');

-- AlterTable
ALTER TABLE "task_types" ADD COLUMN     "is_company" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "TaskTypeCode" NOT NULL;

-- CreateTable
CREATE TABLE "projects" (
    "id" CHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "value" DOUBLE PRECISION,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" "ProjectStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" CHAR(36) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" CHAR(36),
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_members" (
    "project_id" CHAR(36) NOT NULL,
    "user_id" CHAR(36) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "day_price" DOUBLE PRECISION,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("project_id","user_id")
);

-- CreateTable
CREATE TABLE "project_task_types" (
    "project_id" CHAR(36) NOT NULL,
    "task_type_id" CHAR(36) NOT NULL,

    CONSTRAINT "project_task_types_pkey" PRIMARY KEY ("project_id","task_type_id")
);

-- CreateTable
CREATE TABLE "time_sheets" (
    "id" CHAR(36) NOT NULL,
    "user_id" CHAR(36) NOT NULL,
    "project_id" CHAR(36) NOT NULL,
    "task_type_id" CHAR(36) NOT NULL,
    "stamp_date" DATE NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "total_hours" DOUBLE PRECISION NOT NULL,
    "detail" VARCHAR(500),
    "remark" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "time_sheets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_types" ADD CONSTRAINT "project_task_types_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_task_types" ADD CONSTRAINT "project_task_types_task_type_id_fkey" FOREIGN KEY ("task_type_id") REFERENCES "task_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_sheets" ADD CONSTRAINT "time_sheets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_sheets" ADD CONSTRAINT "time_sheets_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_sheets" ADD CONSTRAINT "time_sheets_task_type_id_fkey" FOREIGN KEY ("task_type_id") REFERENCES "task_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
