import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { normalizeAIProvider, resolveAIConfig } from "@/lib/ai-config";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" }
    });
    const config = resolveAIConfig(settings ? {
      aiProvider: settings.aiProvider,
      aiModel: settings.aiModel,
      aiBaseUrl: settings.aiBaseUrl,
    } : null);

    if (!settings) {
      // Return default empty state if not initialized
      const defaultProvider = normalizeAIProvider(null);
      const defaultConfig = resolveAIConfig({
        aiProvider: defaultProvider,
        aiModel: null,
        aiBaseUrl: null,
      });

      return NextResponse.json({
        success: true,
        data: {
          name: "",
          title: "",
          bio: "",
          email: "",
          heroTitle: "",
          heroTagline: "",
          heroBio: "",
          avatarUrl: null,
          resumeUrl: null,
          aboutTitle: "",
          aboutGoalTitle: "",
          aboutGoalDesc: "",
          yearsOfExperience: "",
          aboutStatsWork: "",
          aboutStatsProjects: "",
          aboutStatsCommitment: "",
          projectsTitle: "",
          projectsSubtitle: "",
          projectsDesc: "",
          homeWorkTitle: "",
          homeWorkSubtitle: "",
          homeWorkDesc: "",
          homeBlogTitle: "",
          homeBlogSubtitle: "",
          heroRoles: "",
          blogTitle: "",
          blogSubtitle: "",
          blogIntro: "",
          experienceHeroTitle: "",
          experienceHeroDesc: "",
          educationHeroDesc: "",
          aboutExtraBio: "",
          contactCtaTitle: "",
          contactCtaDesc: "",
          github: null,
          linkedin: null,
          twitter: null,
          footerTitle: "",
          footerBio: "",
          openToWork: true,
          seoTitle: null,
          seoDescription: null,
          seoKeywords: null,
          ogImage: null,
          aiProvider: defaultProvider,
          aiModel: defaultConfig.model,
          aiBaseUrl: defaultConfig.baseUrl,
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...settings,
        aiProvider: config.provider,
        aiModel: config.model,
        aiBaseUrl: config.baseUrl,
      },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();

    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: body,
      create: {
        id: "singleton",
        ...body
      }
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/projects");
    revalidatePath("/blog");
    revalidatePath("/experience");
    revalidatePath("/education");
    revalidatePath("/services");
    revalidatePath("/hackathons");
    revalidatePath("/certifications");

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
