-- CreateTable
CREATE TABLE "sb25_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sb25_sessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sb25_sessions" ADD CONSTRAINT "sb25_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sb25_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
