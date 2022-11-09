/*
  Warnings:

  - You are about to drop the column `platform` on the `Device` table. All the data in the column will be lost.
  - Added the required column `platform` to the `PushToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PushPlatform" AS ENUM ('IOS', 'ANDROID', 'WEB');

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "platform";

-- AlterTable
ALTER TABLE "PushToken" ADD COLUMN     "platform" "PushPlatform" NOT NULL;

-- DropEnum
DROP TYPE "DevicePlatform";
