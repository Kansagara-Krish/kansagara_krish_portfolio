import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      projectCount,
      skillCount,
      messageCount,
      experienceCount,
      hackathonCount,
      educationCount,
      pageViews
    ] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.contactMessage.count({ where: { read: false } }), // Unread count
      prisma.experience.count(),
      prisma.hackathon.count(),
      prisma.education.count(),
      prisma.pageView.aggregate({ _sum: { count: true } })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects: projectCount,
        skills: skillCount,
        messages: messageCount,
        experience: experienceCount,
        hackathons: hackathonCount,
        education: educationCount,
        views: pageViews._sum.count || 0
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
