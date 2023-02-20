-- CreateEnum
CREATE TYPE "Carousel_Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Carousel" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "descriptiom" VARCHAR(255) NOT NULL,
    "status" "Carousel_Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carousel_pkey" PRIMARY KEY ("id")
);
