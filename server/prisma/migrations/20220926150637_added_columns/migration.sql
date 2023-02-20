/*
  Warnings:

  - Added the required column `contractFileName` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signedContractFileName` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingStatus` to the `Project_Milestone` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Project_Milestone_Billing_Status" AS ENUM ('PAID', 'UNPAID');

-- CreateEnum
CREATE TYPE "Proof_Of_Payment_Category" AS ENUM ('MILESTONE', 'DOWNPAYMENT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Project_Payment_Status" ADD VALUE 'WAITING_DOWNPAYMENT';
ALTER TYPE "Project_Payment_Status" ADD VALUE 'PAID_DOWNPAYMENT';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "contractFileName" TEXT NOT NULL,
ADD COLUMN     "signedContractFileName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project_Milestone" ADD COLUMN     "billingStatus" "Project_Milestone_Billing_Status" NOT NULL;

-- CreateTable
CREATE TABLE "Proof_Of_Payment" (
    "imageFileName" TEXT NOT NULL,
    "referenceNo" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "category" "Proof_Of_Payment_Category" NOT NULL,
    "dateUploaded" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Proof_Of_Payment_pkey" PRIMARY KEY ("projectId","userId")
);

-- AddForeignKey
ALTER TABLE "Proof_Of_Payment" ADD CONSTRAINT "Proof_Of_Payment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proof_Of_Payment" ADD CONSTRAINT "Proof_Of_Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
