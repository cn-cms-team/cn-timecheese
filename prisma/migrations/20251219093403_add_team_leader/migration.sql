-- CreateTable
CREATE TABLE "team_leaders" (
    "id" CHAR(36) NOT NULL,
    "user_id" CHAR(36) NOT NULL,
    "team_id" CHAR(36) NOT NULL,

    CONSTRAINT "team_leaders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "team_leaders" ADD CONSTRAINT "team_leaders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_leaders" ADD CONSTRAINT "team_leaders_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
