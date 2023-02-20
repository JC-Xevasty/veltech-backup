/*
  Warnings:

  - The values [CLIENT_REVIEW] on the enum `Project_Quotation_Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `companyName` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `contactNumber` on the `Quotation` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Project_Quotation_Status_new" AS ENUM ('NOT_AVAILABLE', 'FOR_REVIEW', 'WAITING_OCULAR', 'DRAFTING', 'CLIENT_APPROVAL', 'FOR_APPROVAL', 'FOR_REVISION', 'APPROVED', 'CANCELED', 'REJECTED');
ALTER TABLE "Quotation" ALTER COLUMN "quotationStatus" DROP DEFAULT;
ALTER TABLE "Quotation" ALTER COLUMN "quotationStatus" TYPE "Project_Quotation_Status_new" USING ("quotationStatus"::text::"Project_Quotation_Status_new");
ALTER TYPE "Project_Quotation_Status" RENAME TO "Project_Quotation_Status_old";
ALTER TYPE "Project_Quotation_Status_new" RENAME TO "Project_Quotation_Status";
DROP TYPE "Project_Quotation_Status_old";
ALTER TABLE "Quotation" ALTER COLUMN "quotationStatus" SET DEFAULT 'FOR_REVIEW';
COMMIT;

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "companyName",
DROP COLUMN "contactNumber";
