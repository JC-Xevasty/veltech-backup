/*
  Warnings:

  - The values [ACTIVE,INACTIVE] on the enum `Activity_Log_Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Activity_Log_Status_new" AS ENUM ('SUCCEEDED', 'FAILED');
ALTER TABLE "Activity_Log" ALTER COLUMN "status" TYPE "Activity_Log_Status_new" USING ("status"::text::"Activity_Log_Status_new");
ALTER TYPE "Activity_Log_Status" RENAME TO "Activity_Log_Status_old";
ALTER TYPE "Activity_Log_Status_new" RENAME TO "Activity_Log_Status";
DROP TYPE "Activity_Log_Status_old";
COMMIT;
