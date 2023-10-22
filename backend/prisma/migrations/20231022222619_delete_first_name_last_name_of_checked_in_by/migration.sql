/*
  Warnings:

  - You are about to drop the column `booked_in_by_first_name` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `booked_in_by_last_name` on the `Delivery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "booked_in_by_first_name";
ALTER TABLE "Delivery" DROP COLUMN "booked_in_by_last_name";
