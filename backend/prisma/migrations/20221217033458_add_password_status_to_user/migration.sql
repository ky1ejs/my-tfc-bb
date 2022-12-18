-- CreateEnum
CREATE TYPE "PasswordStatus" AS ENUM ('VALID', 'INVALID');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password_status" "PasswordStatus" NOT NULL DEFAULT 'VALID';
