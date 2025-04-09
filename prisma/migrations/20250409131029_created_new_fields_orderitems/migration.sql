/*
  Warnings:

  - You are about to drop the column `price` on the `orderItems` table. All the data in the column will be lost.
  - Added the required column `description` to the `orderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `orderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `orderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orderItems" DROP COLUMN "price",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "totalPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "unitPrice" DECIMAL(10,2) NOT NULL;
