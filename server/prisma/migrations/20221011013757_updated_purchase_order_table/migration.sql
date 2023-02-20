/*
  Warnings:

  - You are about to drop the column `unitCost` on the `Purchase_Order_Item` table. All the data in the column will be lost.
  - Added the required column `netPrice` to the `Purchase_Order_Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `Purchase_Order_Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchase_Order_Item" DROP COLUMN "unitCost",
ADD COLUMN     "netPrice" MONEY NOT NULL,
ADD COLUMN     "unit" VARCHAR(255) NOT NULL;
