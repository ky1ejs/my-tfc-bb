/*
  Warnings:

  - A unique constraint covering the columns `[tfc_id]` on the table `Delivery` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `comment` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_received` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tfc_id` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "comment" STRING NOT NULL;
ALTER TABLE "Delivery" ADD COLUMN     "date_received" TIMESTAMPTZ NOT NULL;
ALTER TABLE "Delivery" ADD COLUMN     "tfc_id" STRING NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_tfc_id_key" ON "Delivery"("tfc_id");
