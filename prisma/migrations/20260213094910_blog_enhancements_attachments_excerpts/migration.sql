-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('IMAGE', 'VIDEO', 'PDF');

-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "excerpt_en" TEXT,
ADD COLUMN     "excerpt_hi" TEXT;

-- CreateTable
CREATE TABLE "blog_attachments" (
    "id" SERIAL NOT NULL,
    "blog_post_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "title_hi" TEXT,
    "title_en" TEXT,
    "type" "AttachmentType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_attachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blog_attachments" ADD CONSTRAINT "blog_attachments_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
