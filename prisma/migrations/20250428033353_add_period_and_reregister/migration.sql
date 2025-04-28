-- CreateTable
CREATE TABLE "sb25_periods" (
    "id" TEXT NOT NULL,
    "year" INTEGER,
    "semesterType" "SemesterType",
    "name" TEXT,
    "isActive" BOOLEAN DEFAULT false,

    CONSTRAINT "sb25_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_reregisters" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "periodId" TEXT,
    "isReregisterActive" BOOLEAN DEFAULT false,

    CONSTRAINT "sb25_reregisters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sb25_periods_name_key" ON "sb25_periods"("name");

-- AddForeignKey
ALTER TABLE "sb25_reregisters" ADD CONSTRAINT "sb25_reregisters_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "sb25_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
