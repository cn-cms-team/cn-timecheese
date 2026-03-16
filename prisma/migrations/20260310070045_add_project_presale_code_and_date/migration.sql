-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "maintenance_end_date" TIMESTAMP(3),
ADD COLUMN     "maintenance_start_date" TIMESTAMP(3),
ADD COLUMN     "pre_sale_code" VARCHAR(25);
