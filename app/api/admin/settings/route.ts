import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" }
    });

    if (!settings) {
      // Return default empty state if not initialized
      return NextResponse.json({
        success: true,
        data: {
          name: "",
          title: "",
          bio: "",
          email: "",
          heroTitle: "Engineering Great Websites.",
          heroTagline: "FULL-STACK ENGINEER",
          aboutTitle: "Building things that work well.",
          aboutGoalTitle: "My Goal",
          yearsOfExperience: "2+",
          aboutStatsWork: "2+",
          aboutStatsProjects: "15+",
          aboutStatsCommitment: "100%",
          projectsTitle: "My Projects",
          projectsSubtitle: "My Work",
          projectsDesc: "I have built many projects that are fast and easy to use.",
          homeWorkTitle: "Work History",
          homeWorkSubtitle: "History",
          homeBlogTitle: "Recent Posts",
          homeBlogSubtitle: "Blog",
          contactCtaTitle: "Have a project in mind?",
          contactCtaDesc: "I'm currently open for freelance work and new jobs. Let's build something great together.",
          openToWork: true
        }
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    
    // We only want one record, so we use upsert
    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: body,
      create: {
        id: "singleton",
        ...body
      }
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
