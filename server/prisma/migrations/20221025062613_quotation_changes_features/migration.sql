/*
  Warnings:

  - The values [SPRINKLER] on the enum `Project_Features` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `establishmentSize` on the `Quotation` table. All the data in the column will be lost.
  - Added the required column `establishmentSizeHeight` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `establishmentSizeWidth` to the `Quotation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Project_Features_new" AS ENUM ('AUFSS', 'WDFHS', 'KHFSS', 'CDFSS', 'FS', 'FDAS', 'FM2S', 'ARFSS', 'KHFPS', 'DS', 'WMS', 'DCES', 'PS');
ALTER TABLE "Quotation" ALTER COLUMN "projectFeatures" TYPE "Project_Features_new"[] USING ("projectFeatures"::text::"Project_Features_new"[]);
ALTER TYPE "Project_Features" RENAME TO "Project_Features_old";
ALTER TYPE "Project_Features_new" RENAME TO "Project_Features";
DROP TYPE "Project_Features_old";
COMMIT;

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "establishmentSize",
ADD COLUMN     "establishmentSizeHeight" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "establishmentSizeWidth" DECIMAL(65,30) NOT NULL;
