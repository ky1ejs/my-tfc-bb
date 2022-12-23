-- CreateEnum
CREATE TYPE "PasswordStatus" AS ENUM ('VALID', 'INVALID');

-- CreateEnum
CREATE TYPE "TokenEnv" AS ENUM ('STAGING', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "PushPlatform" AS ENUM ('IOS', 'ANDROID', 'WEB');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" STRING NOT NULL,
    "latest_access_token" STRING NOT NULL,
    "refresh_token" STRING NOT NULL,
    "hashed_password" STRING NOT NULL,
    "password_status" "PasswordStatus" NOT NULL DEFAULT 'VALID',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "device_provided_id" STRING NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token" STRING NOT NULL,
    "env" "TokenEnv" NOT NULL,
    "platform" "PushPlatform" NOT NULL,
    "device_id" UUID NOT NULL,

    CONSTRAINT "PushToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tfc_id" INT4 NOT NULL,
    "name" STRING NOT NULL,
    "comment" STRING NOT NULL,
    "date_received" TIMESTAMPTZ NOT NULL,
    "user_id" UUID NOT NULL,
    "collected_at" TIMESTAMPTZ,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Device_device_provided_id_key" ON "Device"("device_provided_id");

-- CreateIndex
CREATE UNIQUE INDEX "PushToken_device_id_key" ON "PushToken"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_tfc_id_user_id_key" ON "Delivery"("tfc_id", "user_id");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushToken" ADD CONSTRAINT "PushToken_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
