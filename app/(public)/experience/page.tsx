import { Metadata } from "next";
import { getExperiences, getSkills, getHackathons, getCertifications, getSiteSettings, getEducation } from "@/lib/data";
import { ExperienceClient } from "@/components/public/ExperienceClient";

import { defaultSettings } from "@/lib/defaults";

export const metadata: Metadata = {
  title: "Experience | Professional Trajectory",
  description: "A comprehensive archive of engineering roles, technical mastery, and verified credentials.",
};

export default async function ExperiencePage() {
  const [experiences, skills, hackathons, certifications, settingsData, education] = await Promise.all([
    getExperiences(),
    getSkills(),
    getHackathons(),
    getCertifications(),
    getSiteSettings(),
    getEducation(),
  ]);

  const settings = settingsData || defaultSettings;

  return (
    <ExperienceClient 
      experiences={experiences} 
      skills={skills} 
      hackathons={hackathons} 
      certifications={certifications} 
      settings={settings} 
      education={education}
    />
  );
}
