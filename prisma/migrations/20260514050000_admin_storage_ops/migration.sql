CREATE TYPE "StorageProvider" AS ENUM ('MOCK', 'LOCAL_DEV', 'S3', 'R2', 'COS', 'OSS');

ALTER TABLE "homepage_settings"
  ADD COLUMN "hero_image_asset_id" TEXT,
  ADD COLUMN "hero_image_position" TEXT DEFAULT 'center',
  ADD COLUMN "hero_image_mobile_position" TEXT DEFAULT 'center';

ALTER TABLE "media_assets"
  ADD COLUMN "width" INTEGER,
  ADD COLUMN "height" INTEGER,
  ADD COLUMN "storage_provider" "StorageProvider" NOT NULL DEFAULT 'MOCK',
  ADD COLUMN "storage_key" TEXT,
  ADD COLUMN "deleted_at" TIMESTAMP(3);
