-- CreateTable
CREATE TABLE "sb25_reregisterDetail" (
    "reregisterId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "nominal" DECIMAL(65,30),
    "paymentReceiptFile" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'BELUM_LUNAS',
    "semester" INTEGER,
    "semesterStatus" "SemesterStatus" NOT NULL DEFAULT 'NONAKTIF',
    "campusType" "CampusType",

    CONSTRAINT "sb25_reregisterDetail_pkey" PRIMARY KEY ("reregisterId","studentId")
);

-- AddForeignKey
ALTER TABLE "sb25_reregisterDetail" ADD CONSTRAINT "sb25_reregisterDetail_reregisterId_fkey" FOREIGN KEY ("reregisterId") REFERENCES "sb25_reregisters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_reregisterDetail" ADD CONSTRAINT "sb25_reregisterDetail_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "sb25_students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
