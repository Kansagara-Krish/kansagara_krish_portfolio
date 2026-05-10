-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "aboutArsenal" TEXT[],
ADD COLUMN     "aboutArsenalDesc" TEXT[],
ADD COLUMN     "aboutVision" TEXT,
ADD COLUMN     "location" TEXT DEFAULT 'Gujarat, India';

-- CreateIndex
CREATE INDEX "BlogPost_published_idx" ON "BlogPost"("published");

-- CreateIndex
CREATE INDEX "BlogPost_createdAt_idx" ON "BlogPost"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "Certification_date_idx" ON "Certification"("date" DESC);

-- CreateIndex
CREATE INDEX "Certification_slug_idx" ON "Certification"("slug");

-- CreateIndex
CREATE INDEX "Education_order_idx" ON "Education"("order");

-- CreateIndex
CREATE INDEX "Education_slug_idx" ON "Education"("slug");

-- CreateIndex
CREATE INDEX "Experience_order_idx" ON "Experience"("order");

-- CreateIndex
CREATE INDEX "Hackathon_date_idx" ON "Hackathon"("date" DESC);

-- CreateIndex
CREATE INDEX "Hackathon_slug_idx" ON "Hackathon"("slug");

-- CreateIndex
CREATE INDEX "Project_featured_idx" ON "Project"("featured");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Project_slug_idx" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Skill_order_idx" ON "Skill"("order");

-- CreateIndex
CREATE INDEX "Skill_category_idx" ON "Skill"("category");
