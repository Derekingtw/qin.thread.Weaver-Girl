ALTER TYPE "CooperationMode" ADD VALUE IF NOT EXISTS 'READY_MADE_TO_PLATFORM';

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "preferred_style" TEXT;

ALTER TABLE "cms_pages" ADD COLUMN IF NOT EXISTS "title_zh_hant" TEXT;
ALTER TABLE "cms_pages" ADD COLUMN IF NOT EXISTS "title_zh_hans" TEXT;
ALTER TABLE "cms_pages" ADD COLUMN IF NOT EXISTS "title_en" TEXT;
ALTER TABLE "cms_pages" ADD COLUMN IF NOT EXISTS "content_zh_hant" TEXT;
ALTER TABLE "cms_pages" ADD COLUMN IF NOT EXISTS "content_zh_hans" TEXT;
ALTER TABLE "cms_pages" ADD COLUMN IF NOT EXISTS "content_en" TEXT;
UPDATE "cms_pages"
SET "title_zh_hant" = COALESCE("title_zh_hant", "title"),
    "content_zh_hant" = COALESCE("content_zh_hant", "content");

ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "hero_badge_en" TEXT;
ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "hero_slogan_en" TEXT;
ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "hero_subtitle_en" TEXT;
ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "primary_cta_text_en" TEXT;
ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "secondary_cta_text_en" TEXT;
ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "hero_image_alt_en" TEXT;
ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "hero_stat_label_en" TEXT;
ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "hero_stat_extra_en" TEXT;
ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "trust_point_1_en" TEXT;
ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "trust_point_2_en" TEXT;
ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "trust_point_3_en" TEXT;
ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "default_style" TEXT;
ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "allow_style_switch" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "homepage_settings" ADD COLUMN IF NOT EXISTS "enabled_styles" JSONB;

ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "title_en" TEXT;
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "summary_en" TEXT;
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "content_en" TEXT;

ALTER TABLE "ad_packages" ADD COLUMN IF NOT EXISTS "name_en" TEXT;
ALTER TABLE "ad_packages" ADD COLUMN IF NOT EXISTS "description_en" TEXT;

ALTER TABLE "ad_slots" ADD COLUMN IF NOT EXISTS "name_en" TEXT;

ALTER TABLE "ad_applications" ADD COLUMN IF NOT EXISTS "ad_title_en" TEXT;
ALTER TABLE "ad_applications" ADD COLUMN IF NOT EXISTS "ad_subtitle_en" TEXT;
