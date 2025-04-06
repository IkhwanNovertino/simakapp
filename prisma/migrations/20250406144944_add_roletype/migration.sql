-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('STUDENT', 'LECTURER', 'ADVISOR', 'OPERATOR');

-- AlterTable
ALTER TABLE "sb25_roles" ADD COLUMN     "roleType" "RoleType";
