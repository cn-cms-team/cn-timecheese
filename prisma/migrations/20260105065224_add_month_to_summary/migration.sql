/*
  Warnings:

  - Added the required column `month` to the `time_sheet_summaries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "time_sheet_summaries" ADD COLUMN     "month" INTEGER NOT NULL;
