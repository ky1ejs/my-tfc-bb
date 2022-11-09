/*
  Warnings:

  - A unique constraint covering the columns `[tfc_id,user_id]` on the table `Delivery` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Delivery_tfc_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_tfc_id_user_id_key" ON "Delivery"("tfc_id", "user_id");
