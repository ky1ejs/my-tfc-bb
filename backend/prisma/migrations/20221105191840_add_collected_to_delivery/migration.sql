/*
  Warnings:

  - Added the required column `collected` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "collected" BOOL NOT NULL DEFAULT FALSE;
ALTER TABLE "Delivery" ALTER COLUMN   "collected" DROP DEFAULT;
