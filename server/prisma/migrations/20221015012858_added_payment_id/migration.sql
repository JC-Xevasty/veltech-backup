/*
  Warnings:

  - The primary key for the `Proof_Of_Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `Proof_Of_Payment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `poDocument` to the `Purchase_Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proof_Of_Payment" DROP CONSTRAINT "Proof_Of_Payment_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Proof_Of_Payment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Purchase_Order" ADD COLUMN     "poDocument" TEXT NOT NULL;
