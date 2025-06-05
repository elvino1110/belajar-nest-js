-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
