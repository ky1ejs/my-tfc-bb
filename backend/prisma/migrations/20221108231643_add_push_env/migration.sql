/*
  Warnings:

  - You are about to drop the column `push_token` on the `Device` table. All the data in the column will be lost.
  - Made the column `platform` on table `Device` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TokenEnv" AS ENUM ('STAGING', 'PRODUCTION');

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "push_token";
ALTER TABLE "Device" ALTER COLUMN "platform" SET NOT NULL;

-- CreateTable
CREATE TABLE "PushToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token" STRING NOT NULL,
    "env" "TokenEnv" NOT NULL,
    "device_id" UUID NOT NULL,

    CONSTRAINT "PushToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PushToken_device_id_key" ON "PushToken"("device_id");

-- AddForeignKey
ALTER TABLE "PushToken" ADD CONSTRAINT "PushToken_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
