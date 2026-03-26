-- AlterTable
ALTER TABLE "time_sheet_summaries" ADD COLUMN     "approved_at" TIMESTAMP(3),
ADD COLUMN     "approved_by" UUID,
ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "time_sheets" ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "time_sheet_summaries" ADD CONSTRAINT "time_sheet_summaries_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
