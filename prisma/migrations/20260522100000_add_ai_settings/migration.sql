-- AlterTable
ALTER TABLE "SiteSettings"
ADD COLUMN     "aiProvider" TEXT DEFAULT 'openrouter',
ADD COLUMN     "aiModel" TEXT,
ADD COLUMN     "aiBaseUrl" TEXT;