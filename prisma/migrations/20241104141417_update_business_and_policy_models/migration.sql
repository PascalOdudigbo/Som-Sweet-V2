/*
  Warnings:

  - You are about to drop the column `refundsPolicy` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Policy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[businessId,title]` on the table `Policy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Policy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "refundsPolicy";

-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "name",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Policy_businessId_title_key" ON "Policy"("businessId", "title");
