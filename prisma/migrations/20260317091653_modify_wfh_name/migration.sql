/*
  Warnings:

  - You are about to drop the column `isWorkFromHome` on the `time_sheets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "time_sheets" DROP COLUMN "isWorkFromHome",
ADD COLUMN     "is_work_from_home" BOOLEAN NOT NULL DEFAULT false;
