/*
  Warnings:

  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Room";

-- CreateTable
CREATE TABLE "sb25_rooms" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "location" "Location",
    "capacity" INTEGER,

    CONSTRAINT "sb25_rooms_pkey" PRIMARY KEY ("id")
);
