-- CreateEnum
CREATE TYPE "SemesterType" AS ENUM ('GANJIL', 'GENAP', 'GANJIL_PENDEK', 'GENAP_PENDEK');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('PRIA', 'WANITA');

-- CreateEnum
CREATE TYPE "Religion" AS ENUM ('ISLAM', 'KATOLIK', 'PROTESTAN', 'BUDDHA', 'HINDU', 'KONGHUCU', 'DLL');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('AKTIF', 'NONAKTIF', 'CUTI', 'DO', 'MENGUNDURKAN_DIRI', 'LULUS');

-- CreateEnum
CREATE TYPE "SemesterStatus" AS ENUM ('AKTIF', 'NONAKTIF', 'CUTI', 'DO', 'MENGUNDURKAN_DIRI', 'LULUS');

-- CreateEnum
CREATE TYPE "CampusType" AS ENUM ('BJB', 'BJM', 'SORE', 'ONLINE');

-- CreateEnum
CREATE TYPE "Location" AS ENUM ('BJB', 'BJM');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('LUNAS', 'BELUM_LUNAS');

-- CreateEnum
CREATE TYPE "DegreeStatus" AS ENUM ('S1', 'S2', 'S3');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('STUDENT', 'LECTURER', 'ADVISOR', 'OPERATOR');

-- CreateTable
CREATE TABLE "sb25_roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "roleType" "RoleType" NOT NULL DEFAULT 'OPERATOR',

    CONSTRAINT "sb25_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,

    CONSTRAINT "sb25_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_role_permissions" (
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "sb25_role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "sb25_users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "isStatus" BOOLEAN DEFAULT false,
    "roleId" INTEGER,

    CONSTRAINT "sb25_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sb25_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_majors" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "numberCode" INTEGER,
    "stringCode" TEXT,

    CONSTRAINT "sb25_majors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_courses" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "code" TEXT,
    "sks" INTEGER,
    "majorId" INTEGER,
    "isPKL" BOOLEAN NOT NULL DEFAULT false,
    "isSkripsi" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sb25_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_lecturers" (
    "id" TEXT NOT NULL,
    "npk" TEXT,
    "nidn" TEXT,
    "nuptk" TEXT,
    "name" TEXT,
    "frontTitle" TEXT,
    "backTitle" TEXT,
    "degree" "DegreeStatus",
    "year" INTEGER,
    "religion" "Religion",
    "gender" "Gender",
    "address" TEXT,
    "email" TEXT,
    "hp" TEXT,
    "photo" TEXT,
    "majorId" INTEGER,
    "userId" TEXT,

    CONSTRAINT "sb25_lecturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_operators" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "department" TEXT,
    "userId" TEXT,

    CONSTRAINT "sb25_operators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_students" (
    "id" TEXT NOT NULL,
    "nim" TEXT,
    "name" TEXT,
    "year" INTEGER,
    "religion" "Religion",
    "gender" "Gender",
    "address" TEXT,
    "email" TEXT,
    "hp" TEXT,
    "photo" TEXT,
    "fatherName" TEXT,
    "motherName" TEXT,
    "guardianName" TEXT,
    "guardianHp" TEXT,
    "majorId" INTEGER,
    "lecturerId" TEXT,
    "statusRegister" TEXT,
    "userId" TEXT,

    CONSTRAINT "sb25_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_rooms" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "location" "Location",
    "capacity" INTEGER,

    CONSTRAINT "sb25_rooms_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "sb25_roles_name_key" ON "sb25_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_permissions_name_key" ON "sb25_permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_users_email_key" ON "sb25_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_majors_numberCode_key" ON "sb25_majors"("numberCode");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_majors_stringCode_key" ON "sb25_majors"("stringCode");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_lecturers_userId_key" ON "sb25_lecturers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_operators_userId_key" ON "sb25_operators"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_students_nim_key" ON "sb25_students"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_students_userId_key" ON "sb25_students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_periods_name_key" ON "sb25_periods"("name");

-- AddForeignKey
ALTER TABLE "sb25_role_permissions" ADD CONSTRAINT "sb25_role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "sb25_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_role_permissions" ADD CONSTRAINT "sb25_role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "sb25_permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_users" ADD CONSTRAINT "sb25_users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "sb25_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_sessions" ADD CONSTRAINT "sb25_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sb25_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_courses" ADD CONSTRAINT "sb25_courses_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "sb25_majors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_lecturers" ADD CONSTRAINT "sb25_lecturers_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "sb25_majors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_lecturers" ADD CONSTRAINT "sb25_lecturers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sb25_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_operators" ADD CONSTRAINT "sb25_operators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sb25_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_students" ADD CONSTRAINT "sb25_students_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "sb25_majors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_students" ADD CONSTRAINT "sb25_students_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "sb25_lecturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_students" ADD CONSTRAINT "sb25_students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sb25_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_reregisters" ADD CONSTRAINT "sb25_reregisters_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "sb25_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
