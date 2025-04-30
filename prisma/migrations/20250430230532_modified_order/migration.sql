/*
  Warnings:

  - Added the required column `address` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPhone` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'PLACED';
ALTER TYPE "OrderStatus" ADD VALUE 'DECLINED';
ALTER TYPE "OrderStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "customerPhone" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL;
