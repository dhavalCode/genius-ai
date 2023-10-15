/*
  Warnings:

  - You are about to drop the column `userName` on the `Brain` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Brain" DROP COLUMN "userName";

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "Category"("userId");
