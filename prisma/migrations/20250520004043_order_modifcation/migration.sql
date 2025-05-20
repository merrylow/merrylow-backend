/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `PendingUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `restaurantId` to the `orderItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_restaurantId_fkey";

-- AlterTable
ALTER TABLE "orderItems" ADD COLUMN     "restaurantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "restaurantId";

-- DropTable
DROP TABLE "PendingUser";

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
