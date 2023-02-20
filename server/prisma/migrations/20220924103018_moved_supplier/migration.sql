/*
  Warnings:

  - You are about to drop the column `supplierId` on the `Purchase_Order_Item` table. All the data in the column will be lost.
  - Added the required column `supplierId` to the `Purchase_Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Purchase_Order_Item" DROP CONSTRAINT "Purchase_Order_Item_supplierId_fkey";

-- AlterTable
ALTER TABLE "Purchase_Order" ADD COLUMN     "supplierId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Purchase_Order_Item" DROP COLUMN "supplierId";

-- AddForeignKey
ALTER TABLE "Purchase_Order" ADD CONSTRAINT "Purchase_Order_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
