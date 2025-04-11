/*
  Warnings:

  - A unique constraint covering the columns `[nim]` on the table `sb25_students` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "sb25_users" ADD COLUMN     "isStatus" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "sb25_students_nim_key" ON "sb25_students"("nim");
