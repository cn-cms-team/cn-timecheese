-- CreateTable
CREATE TABLE "time_sheet_summaries" (
    "user_id" CHAR(36) NOT NULL,
    "project_id" CHAR(36) NOT NULL,
    "year" INTEGER NOT NULL,
    "total_seconds" INTEGER NOT NULL,
    "stamp_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "time_sheet_summaries_pkey" PRIMARY KEY ("user_id","project_id","year")
);
