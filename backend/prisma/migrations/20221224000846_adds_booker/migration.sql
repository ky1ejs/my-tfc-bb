/*
  Warnings:

  - Added the required column `booked_in_by_first_name` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `booked_in_by_last_name` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "booked_in_by_first_name" STRING NOT NULL;
ALTER TABLE "Delivery" ADD COLUMN     "booked_in_by_last_name" STRING NOT NULL;
