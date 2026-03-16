/*
  Warnings:

  - The primary key for the `time_sheet_summaries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stamp_date` on the `time_sheet_summaries` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `time_sheet_summaries` table. All the data in the column will be lost.
  - Added the required column `sum_date` to the `time_sheet_summaries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "time_sheet_summaries" DROP CONSTRAINT "time_sheet_summaries_pkey",
DROP COLUMN "stamp_date",
DROP COLUMN "updated_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sum_date" DATE NOT NULL,
ADD CONSTRAINT "time_sheet_summaries_pkey" PRIMARY KEY ("user_id", "project_id", "sum_date");
