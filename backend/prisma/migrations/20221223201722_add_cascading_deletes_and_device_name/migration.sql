/*
  Warnings:

  - Added the required column `name` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PushToken" DROP CONSTRAINT "PushToken_device_id_fkey";

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "name" STRING NOT NULL;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushToken" ADD CONSTRAINT "PushToken_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
