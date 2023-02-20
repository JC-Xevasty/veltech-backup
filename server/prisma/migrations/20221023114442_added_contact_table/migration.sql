-- CreateEnum
CREATE TYPE "Contact_Subject" AS ENUM ('SCHEDULE_APPOINTMENT', 'SUGGESTION', 'SERVICE_RELATED_INQUIRY', 'PARTNERSHIP_COLLABORATION', 'JOB_OPPORTUNITIES');

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "subject" "Contact_Subject" NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "companyName" VARCHAR(255) NOT NULL,
    "emailAddress" VARCHAR(320) NOT NULL,
    "message" VARCHAR(512) NOT NULL,
    "isReplied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
