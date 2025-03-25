-- AlterTable
ALTER TABLE "sb25_students" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "sb25_students" ADD CONSTRAINT "sb25_students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sb25_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
