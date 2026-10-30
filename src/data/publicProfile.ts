import type { Tables } from "@/integrations/supabase/types";

export type PublicProfile = Pick<Tables<"profile">,
  "name" | "title" | "bio" | "email" | "linkedin" | "github" | "photo_url" |
  "skills" | "role_title" | "value_proposition" | "core_skills" | "resume_url" |
  "education" | "career" | "memberships" | "languages">;

// Reviewed against the candidate's application records on 30 October 2026.
// Also used while the CMS loads, so the portfolio remains useful offline.
export const publicProfileFallback: PublicProfile = {
  name: "Stanley Osei-Wusu",
  title: "AI Engineer & Data Scientist",
  role_title: "Applied AI, grounded in data and business.",
  bio: "Data science graduate, master's student and independent AI product builder. I combine Python, TypeScript and SQL with experience in business operations, planning and reporting.",
  value_proposition: "I build AI-assisted workflows and data applications, from ingestion and validation to model integration, testing and documentation. Explore the implementation, analytical choices and limitations behind my work.",
  email: "stanleymay20@gmail.com",
  linkedin: "https://www.linkedin.com/in/stanley-osei-wusu",
  github: "https://github.com/stanleymay20",
  photo_url: null,
  resume_url: null,
  skills: ["Python", "TypeScript", "SQL / PostgreSQL", "React", "Supabase", "LLM APIs"],
  core_skills: ["Python", "TypeScript", "SQL", "LLM workflows", "Data validation", "PyMC"],
  education: [
    { degree: "MSc Data Science, AI & Digital Business", institution: "GISMA University of Applied Sciences", year: "In progress · Expected 2027" },
    { degree: "MSc International Business Management", institution: "Kingston University London · Delivered at GISMA", year: "In progress · Expected 2027" },
    { degree: "BSc Data Science, AI & Digital Business", institution: "GISMA University of Applied Sciences", year: "Completed 2025" },
  ],
  career: [
    { title: "Independent AI Product Builder", company: "Berlin / Brandenburg", period: "Sep 2024 – Present", description: "Develop AI and data workflows, including API integration, testing and documentation." },
    { title: "Working Student", company: "Curry 36, Berlin", period: "Apr 2023 – Present", description: "Combine student employment with postgraduate study and independent technical projects." },
    { title: "Deputy Managing Director", company: "Jimp Company Ltd., Ghana", period: "2010 – 2022", description: "Led operations, planning, reporting and resource allocation." },
  ],
  memberships: [],
  languages: [{ language: "English", level: "Fluent" }, { language: "German", level: "B1 · Actively improving" }],
};

export const jsonRecords = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null && !Array.isArray(item))
    : [];
