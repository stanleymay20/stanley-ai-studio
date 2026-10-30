import { Mail, Linkedin, Github } from "lucide-react";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { publicUrl } from "@/lib/publicUrl";
import { publicProfileFallback } from "@/data/publicProfile";

interface ProfileHeaderProps { location?: string | null }
const ProfileHeader = ({ location }: ProfileHeaderProps) => {
  const profile = usePublicProfile();
  const visibleProfile = { ...profile, skills: Array.isArray(profile.skills) ? profile.skills.filter((item): item is string => typeof item === "string") : publicProfileFallback.core_skills! };
  const displayLocation = location?.trim() || "Brandenburg an der Havel · Berlin, Germany";
  const formatUrl = (url: string | null) => publicUrl(url) || undefined;
  return (
    <div className="bg-card rounded-lg p-6 mb-6 border border-border hover:shadow-medium transition-all duration-300">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/30 overflow-hidden hover:scale-105 transition-transform duration-300">
          {visibleProfile.photo_url ? (
            <img
              src={visibleProfile.photo_url}
              alt={visibleProfile.name}
              width="96" height="96" decoding="async" className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold gradient-text">
              {visibleProfile.name.split(" ").map((name) => name[0]).join("").slice(0, 2)}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-1">{visibleProfile.name}</h2>
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
