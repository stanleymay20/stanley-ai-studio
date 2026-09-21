import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Github, Linkedin, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  role_title: string | null;
  value_proposition: string | null;
  core_skills: string[] | null;
  resume_url: string | null;
  email: string | null;
  linkedin: string | null;
  github: string | null;
}

const FALLBACK_PROFILE: ProfileData = {
  role_title: "AI Engineer & Data Scientist",
  value_proposition:
    "I build production-ready AI systems, data pipelines, and automation tools that turn complex data into reliable decision support.",
  core_skills: ["Python", "Machine Learning", "NLP", "SQL", "TypeScript", "Supabase", "APIs", "Data Engineering"],
  resume_url: null,
  email: "stanleymay20@gmail.com",
  linkedin: "https://www.linkedin.com/in/stanley-osei-wusu",
  github: "https://github.com/stanleymay20",
};

const normalizeUrl = (url: string | null): string | null => {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
};

const RecruiterSummary = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profile")
          .select("role_title, value_proposition, core_skills, resume_url, email, linkedin, github")
          .limit(1)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Profile fetch error:", error);
        setProfile(FALLBACK_PROFILE);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const visibleProfile = profile || FALLBACK_PROFILE;
  const coreSkills = visibleProfile.core_skills?.length
    ? visibleProfile.core_skills
    : FALLBACK_PROFILE.core_skills!;

  return (
    <section
      aria-labelledby="recruiter-summary-title"
      className="bg-gradient-to-r from-card via-card to-primary/5 rounded-xl p-6 border border-border shadow-soft"
    >
      <div className="mb-3">
        <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-2">
          Applied AI · Data Engineering · Decision Intelligence
        </p>
        <h2 id="recruiter-summary-title" className="text-2xl font-bold text-foreground mb-1">
          {visibleProfile.role_title || FALLBACK_PROFILE.role_title}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {visibleProfile.value_proposition || FALLBACK_PROFILE.value_proposition}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5" aria-label="Core skills">
        {coreSkills.map((skill) => (
          <span
            key={skill}
            className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button size="sm" asChild>
          <Link to="/projects" className="gap-2">
            View selected work
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        {visibleProfile.github && (
          <Button size="sm" variant="outline" asChild>
            <a href={normalizeUrl(visibleProfile.github)!} target="_blank" rel="noopener noreferrer" className="gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </Button>
        )}

        {visibleProfile.linkedin && (
          <Button size="sm" variant="outline" asChild>
            <a href={normalizeUrl(visibleProfile.linkedin)!} target="_blank" rel="noopener noreferrer" className="gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </Button>
        )}

        {visibleProfile.email && (
          <Button size="sm" variant="outline" asChild>
            <a href={`mailto:${visibleProfile.email}`} className="gap-2">
              <Mail className="h-4 w-4" />
              Contact
            </a>
          </Button>
        )}

        {visibleProfile.resume_url && (
          <Button size="sm" variant="outline" asChild>
            <a href={normalizeUrl(visibleProfile.resume_url)!} target="_blank" rel="noopener noreferrer" className="gap-2">
              <Download className="h-4 w-4" />
              Resume
            </a>
          </Button>
        )}
      </div>
    </section>
  );
};

export default RecruiterSummary;
