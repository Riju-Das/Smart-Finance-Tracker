/*
  Warnings:

  - Made the column `startDate` on table `Budget` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Budget" ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;
