/*
  Warnings:

  - Added the required column `currentBalance` to the `Proof_Of_Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proof_Of_Payment" ADD COLUMN     "currentBalance" DECIMAL(65,30) NOT NULL;
