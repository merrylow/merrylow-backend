/*
  Warnings:

  - You are about to drop the column `menuId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `menuId` on the `orderItems` table. All the data in the column will be lost.
  - Added the required column `productId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `orderItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_menuId_fkey";

-- DropForeignKey
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_menuId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "menuId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orderItems" DROP COLUMN "menuId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
