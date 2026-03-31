-- CreateTable
CREATE TABLE "feeling_project_reports" (
    "user_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "feeling" "Feeling" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "feeling_project_reports_pkey" PRIMARY KEY ("user_id","project_id","feeling")
);

-- AddForeignKey
ALTER TABLE "feeling_project_reports" ADD CONSTRAINT "feeling_project_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeling_project_reports" ADD CONSTRAINT "feeling_project_reports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
