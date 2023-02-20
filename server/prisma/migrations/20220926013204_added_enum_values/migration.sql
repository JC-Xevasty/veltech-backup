/*
  Warnings:

  - Added the required column `description` to the `Project_Milestone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Project_Milestone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Project_Payment_Status" ADD VALUE 'PAID_BILLING';

-- AlterEnum
ALTER TYPE "Project_Status" ADD VALUE 'SET_MILESTONE';

-- AlterTable
ALTER TABLE "Project_Milestone" ADD COLUMN     "description" VARCHAR(255) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
