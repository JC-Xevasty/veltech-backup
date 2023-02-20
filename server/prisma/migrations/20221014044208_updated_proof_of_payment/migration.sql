/*
  Warnings:

  - You are about to drop the column `dateUploaded` on the `Proof_Of_Payment` table. All the data in the column will be lost.
  - Added the required column `dateOfPayment` to the `Proof_Of_Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Proof_Of_Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Proof_Of_Payment_Status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterEnum
ALTER TYPE "Proof_Of_Payment_Category" ADD VALUE 'OTHERS';

-- AlterTable
ALTER TABLE "Proof_Of_Payment" DROP COLUMN "dateUploaded",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateOfPayment" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "milestoneNo" INTEGER,
ADD COLUMN     "paymentStatus" "Proof_Of_Payment_Status" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
