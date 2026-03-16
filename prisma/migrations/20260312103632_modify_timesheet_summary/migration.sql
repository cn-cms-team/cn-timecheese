/*
  Warnings:

  - The primary key for the `time_sheet_summaries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `month` on the `time_sheet_summaries` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `time_sheet_summaries` table. All the data in the column will be lost.
  - Added the required column `stamp_date` to the `time_sheet_summaries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "time_sheet_summaries" DROP CONSTRAINT "time_sheet_summaries_pkey",
DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "stamp_date" DATE NOT NULL,
ADD CONSTRAINT "time_sheet_summaries_pkey" PRIMARY KEY ("user_id", "project_id", "stamp_date");
