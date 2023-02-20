/*
  Warnings:

  - You are about to drop the column `descriptiom` on the `Carousel` table. All the data in the column will be lost.
  - Added the required column `description` to the `Carousel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Carousel" DROP COLUMN "descriptiom",
ADD COLUMN     "description" VARCHAR(255) NOT NULL;
