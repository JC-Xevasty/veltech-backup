-- CreateEnum
CREATE TYPE "Activity_Log_Category" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'AUTH', 'PRINT', 'OTHERS');

-- CreateEnum
CREATE TYPE "Activity_Log_Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Activity_Log" (
    "id" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "entry" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "category" "Activity_Log_Category" NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Activity_Log_Status" NOT NULL,

    CONSTRAINT "Activity_Log_pkey" PRIMARY KEY ("id")
);
