-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('PDF', 'IMAGE');

-- CreateEnum
CREATE TYPE "ApplicantType" AS ENUM ('CITIZEN', 'PUBLIC_REP');

-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('HERO', 'RICHTEXT', 'TIMELINE', 'GALLERY', 'VIDEOS', 'CONTACT_FORM', 'FEATURES', 'TESTIMONIALS', 'FAQ');

-- CreateEnum
CREATE TYPE "SettingType" AS ENUM ('TEXT', 'RICHTEXT', 'IMAGE', 'BOOLEAN');

-- CreateEnum
CREATE TYPE "SettingGroup" AS ENUM ('GENERAL', 'HERO', 'CONTACT', 'SOCIAL', 'SEO');

-- CreateEnum
CREATE TYPE "MenuPosition" AS ENUM ('HEADER', 'FOOTER', 'SIDEBAR');

-- CreateEnum
CREATE TYPE "QueryStatus" AS ENUM ('NEW', 'READ', 'RESPONDED', 'SPAM');

-- CreateTable
CREATE TABLE "vidhansabhas" (
    "id" SERIAL NOT NULL,
    "name_hi" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,

    CONSTRAINT "vidhansabhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_types" (
    "id" SERIAL NOT NULL,
    "name_hi" TEXT NOT NULL,
    "name_en" TEXT,

    CONSTRAINT "work_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citizen_apps" (
    "id" SERIAL NOT NULL,
    "c_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "father_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "vidhansabha_id" INTEGER NOT NULL,
    "type" "ApplicantType" NOT NULL,
    "post" TEXT,
    "work_type_id" INTEGER NOT NULL,
    "description" TEXT,
    "file_url" TEXT,
    "status" "AppStatus" NOT NULL DEFAULT 'PENDING',
    "submitted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citizen_apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "citizen_app_id" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "type" "DocType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "citizen_app_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "note" TEXT,
    "performed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "press_releases" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title_hi" TEXT NOT NULL,
    "title_en" TEXT,
    "content_hi" TEXT NOT NULL,
    "content_en" TEXT,
    "pdf_url" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "press_releases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title_hi" TEXT NOT NULL,
    "title_en" TEXT,
    "content_hi" TEXT NOT NULL,
    "content_en" TEXT,
    "image_url" TEXT,
    "author" TEXT NOT NULL DEFAULT 'Admin',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "title_hi" TEXT NOT NULL,
    "title_en" TEXT,
    "desc_hi" TEXT NOT NULL,
    "desc_en" TEXT,
    "image_url" TEXT,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title_hi" TEXT NOT NULL,
    "title_en" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "seo_title" TEXT,
    "seo_desc" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_sections" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "type" "SectionType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" "SettingType" NOT NULL DEFAULT 'TEXT',
    "group" "SettingGroup" NOT NULL DEFAULT 'GENERAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title_hi" TEXT NOT NULL,
    "title_en" TEXT,
    "description_hi" TEXT,
    "description_en" TEXT,
    "location_hi" TEXT,
    "location_en" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "images" TEXT[],
    "is_upcoming" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" SERIAL NOT NULL,
    "label_hi" TEXT NOT NULL,
    "label_en" TEXT,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "parent_id" INTEGER,
    "position" "MenuPosition" NOT NULL DEFAULT 'HEADER',
    "is_visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_albums" (
    "id" SERIAL NOT NULL,
    "title_hi" TEXT NOT NULL,
    "title_en" TEXT,
    "cover_image" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_photos" (
    "id" SERIAL NOT NULL,
    "album_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "caption_hi" TEXT,
    "caption_en" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "gallery_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" SERIAL NOT NULL,
    "title_hi" TEXT NOT NULL,
    "title_en" TEXT,
    "video_url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "message_hi" TEXT NOT NULL,
    "message_en" TEXT,
    "image_url" TEXT,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_queries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "mobile" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" "QueryStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_queries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "citizen_apps_c_number_key" ON "citizen_apps"("c_number");

-- CreateIndex
CREATE UNIQUE INDEX "press_releases_slug_key" ON "press_releases"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_key_key" ON "site_settings"("key");

-- AddForeignKey
ALTER TABLE "citizen_apps" ADD CONSTRAINT "citizen_apps_vidhansabha_id_fkey" FOREIGN KEY ("vidhansabha_id") REFERENCES "vidhansabhas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citizen_apps" ADD CONSTRAINT "citizen_apps_work_type_id_fkey" FOREIGN KEY ("work_type_id") REFERENCES "work_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citizen_apps" ADD CONSTRAINT "citizen_apps_submitted_by_id_fkey" FOREIGN KEY ("submitted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_citizen_app_id_fkey" FOREIGN KEY ("citizen_app_id") REFERENCES "citizen_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_citizen_app_id_fkey" FOREIGN KEY ("citizen_app_id") REFERENCES "citizen_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_photos" ADD CONSTRAINT "gallery_photos_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "gallery_albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
