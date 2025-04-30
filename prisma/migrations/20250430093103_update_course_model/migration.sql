/*
  Warnings:

  - A unique constraint covering the columns `[predecessorId]` on the table `sb25_courses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "sb25_courses" ADD COLUMN     "predecessorId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "sb25_courses_predecessorId_key" ON "sb25_courses"("predecessorId");

-- AddForeignKey
ALTER TABLE "sb25_courses" ADD CONSTRAINT "sb25_courses_predecessorId_fkey" FOREIGN KEY ("predecessorId") REFERENCES "sb25_courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
