/*
  Warnings:

  - Changed the type of `period` on the `Budget` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BudgetPeriod" AS ENUM ('MONTH', 'YEAR', 'WEEK');

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "period",
ADD COLUMN     "period" "BudgetPeriod" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Budget_userId_categoryId_period_startDate_key" ON "Budget"("userId", "categoryId", "period", "startDate");
