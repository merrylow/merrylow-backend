-- DropForeignKey
ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_riderId_fkey";

-- AlterTable
ALTER TABLE "deliveries" ADD COLUMN     "amount" DECIMAL(4,2) NOT NULL DEFAULT 5,
ALTER COLUMN "riderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "riders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
