/*
  Warnings:

  - A unique constraint covering the columns `[numberCode]` on the table `sb25_majors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stringCode]` on the table `sb25_majors` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sb25_majors_numberCode_key" ON "sb25_majors"("numberCode");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_majors_stringCode_key" ON "sb25_majors"("stringCode");
