/*
  Warnings:

  - You are about to drop the column `collected` on the `Delivery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "collected";
ALTER TABLE "Delivery" ADD COLUMN     "collected_at" TIMESTAMPTZ;
