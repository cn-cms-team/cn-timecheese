-- CreateTable
CREATE TABLE "okr_objectives" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "owner_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "okr_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "okr_key_results" (
    "id" UUID NOT NULL,
    "objective_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "target" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "okr_key_results_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "okr_objectives" ADD CONSTRAINT "okr_objectives_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "okr_key_results" ADD CONSTRAINT "okr_key_results_objective_id_fkey" FOREIGN KEY ("objective_id") REFERENCES "okr_objectives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
