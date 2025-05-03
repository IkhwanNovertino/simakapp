/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `sb25_sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sb25_sessions_userId_key" ON "sb25_sessions"("userId");
