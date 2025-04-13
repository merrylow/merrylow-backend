-- AlterTable
ALTER TABLE "menus" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "category" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
