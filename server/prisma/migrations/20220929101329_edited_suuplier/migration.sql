/*
  Warnings:

  - You are about to drop the column `address` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `contactNumber` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `contactPerson` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `contactPersonPosition` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `emailAddress` on the `Supplier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[supplier_AddressId]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `landline` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier_AddressId` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Supplier_address_key";

-- DropIndex
DROP INDEX "Supplier_contactNumber_key";

-- DropIndex
DROP INDEX "Supplier_emailAddress_key";

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "address",
DROP COLUMN "contactNumber",
DROP COLUMN "contactPerson",
DROP COLUMN "contactPersonPosition",
DROP COLUMN "emailAddress",
ADD COLUMN     "landline" VARCHAR(15) NOT NULL,
ADD COLUMN     "note" VARCHAR(255) NOT NULL,
ADD COLUMN     "phone" VARCHAR(15) NOT NULL,
ADD COLUMN     "supplier_AddressId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Supplier_Contact" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "emailAddress" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "supplierId" TEXT,

    CONSTRAINT "Supplier_Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier_Address" (
    "id" TEXT NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "suite" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "province" VARCHAR(255) NOT NULL,
    "zipCode" VARCHAR(255) NOT NULL,

    CONSTRAINT "Supplier_Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_Contact_emailAddress_key" ON "Supplier_Contact"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_Contact_phone_key" ON "Supplier_Contact"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_supplier_AddressId_key" ON "Supplier"("supplier_AddressId");

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_supplier_AddressId_fkey" FOREIGN KEY ("supplier_AddressId") REFERENCES "Supplier_Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier_Contact" ADD CONSTRAINT "Supplier_Contact_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
