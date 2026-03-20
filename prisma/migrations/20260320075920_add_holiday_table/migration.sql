-- CreateTable
CREATE TABLE "holidays" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "date" DATE NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);
