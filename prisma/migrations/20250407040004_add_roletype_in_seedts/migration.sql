/*
  Warnings:

  - Made the column `roleType` on table `sb25_roles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "sb25_roles" ALTER COLUMN "roleType" SET NOT NULL,
ALTER COLUMN "roleType" SET DEFAULT 'OPERATOR';
