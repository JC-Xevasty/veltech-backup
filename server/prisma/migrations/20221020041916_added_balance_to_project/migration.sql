/*
  Warnings:

  - Added the required column `remainingBalance` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "remainingBalance" MONEY NOT NULL;
