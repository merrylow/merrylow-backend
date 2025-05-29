-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "channel" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'GHS',
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "reference" TEXT;
