/*
  Warnings:

  - Added the required column `contact` to the `Purchase_Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchase_Order" ADD COLUMN     "contact" TEXT NOT NULL,
ADD COLUMN     "payment" TEXT[],
ADD COLUMN     "paymentProof" TEXT[];
