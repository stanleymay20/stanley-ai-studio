import { useEffect, useState } from "react";
import { Mail, Linkedin, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  name: string;
  title: string;
  bio: string | null;
  email: string | null;
  linkedin: string | null;
  github: string | null;
  photo_url: string | null;
  skills: string[];
}

interface ProfileHeaderProps {
  location?: string | null;
}

const FALLBACK_PROFILE: Profile = {
  name: "Stanley Osei-Wusu",
  title: "AI Engineer & Data Scientist",
  bio: "I build applied AI, data-engineering, and decision-support systems with an emphasis on reliability, explainability, and real-world use.",
  email: "stanleymay20@gmail.com",
  linkedin: "https://www.linkedin.com/in/stanley-osei-wusu",
  github: "https://github.com/stanleymay20",
  photo_url: null,
  skills: ["Python", "Machine Learning", "TypeScript", "SQL", "Supabase", "PostgreSQL", "APIs", "Data Engineering"],
};

const ProfileHeader = ({ location }: ProfileHeaderProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profile")
          .select("name, title, bio, email, linkedin, github, photo_url, skills")
          .limit(1)
          .single();

        if (error) throw error;

        const skillsData = data.skills;
        const parsedSkills: string[] = Array.isArray(skillsData)
          ? skillsData.filter((skill): skill is string => typeof skill === "string")
          : [];

        setProfile({
          ...data,
          skills: parsedSkills.length > 0 ? parsedSkills : FALLBACK_PROFILE.skills,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(FALLBACK_PROFILE);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatUrl = (url: string | null): string => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  const displayLocation = location?.trim() || "Berlin-Brandenburg, Germany";

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6 mb-6 border border-border">
        <div className="text-center mb-6">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-40 mx-auto mb-2" />
          <Skeleton className="h-4 w-32 mx-auto mb-1" />
          <Skeleton className="h-4 w-24 mx-auto" />
          <div className="flex justify-center gap-4 mt-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>
        <div className="mb-6">
          <Skeleton className="h-5 w-20 mb-3" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-16 mb-3" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const visibleProfile = profile || FALLBACK_PROFILE;

  return (
    <div className="bg-card rounded-lg p-6 mb-6 border border-border hover:shadow-medium transition-all duration-300">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/30 overflow-hidden hover:scale-105 transition-transform duration-300">
          {visibleProfile.photo_url ? (
            <img
              src={visibleProfile.photo_url}
              alt={visibleProfile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold gradient-text">
              {visibleProfile.name.split(" ").map((name) => name[0]).join("").slice(0, 2)}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">{visibleProfile.name}</h1>
        <p className="text-primary font-medium mb-1">{visibleProfile.title}</p>
        <p className="text-sm text-muted-foreground">{displayLocation}</p>

        <div className="flex justify-center gap-4 mt-4">
          {visibleProfile.linkedin && (
            <a
              href={formatUrl(visibleProfile.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Stanley Osei-Wusu on LinkedIn"
              title="LinkedIn"
              className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {visibleProfile.email && (
            <a
              href={`mailto:${visibleProfile.email}`}
              aria-label="Email Stanley Osei-Wusu"
              title="Email"
              className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <Mail className="h-5 w-5" />
            </a>
          )}
          {visibleProfile.github && (
            <a
              href={formatUrl(visibleProfile.github)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Stanley Osei-Wusu on GitHub"
              title="GitHub"
              className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>

      {visibleProfile.bio && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" aria-hidden="true"></span>
            ABOUT
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{visibleProfile.bio}</p>
        </div>
      )}

      {visibleProfile.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" aria-hidden="true"></span>
            SKILLS
          </h2>
          <div className="flex flex-wrap gap-2">
            {visibleProfile.skills.map((skill, index) => (
              <span
                key={skill}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all duration-200 cursor-default"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
