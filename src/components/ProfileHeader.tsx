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
  location?: string;
}

const ProfileHeader = ({ location = 'Based in Potsdam' }: ProfileHeaderProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('name, title, bio, email, linkedin, github, photo_url, skills')
          .limit(1)
          .single();

        if (error) throw error;

        // Parse skills from JSON
        const skillsData = data.skills;
        const parsedSkills: string[] = Array.isArray(skillsData) 
          ? skillsData.filter((s): s is string => typeof s === 'string')
          : [];

        setProfile({
          ...data,
          skills: parsedSkills,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Helper to ensure URLs have https://
  const formatUrl = (url: string | null): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

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

  if (!profile) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg p-6 mb-6 border border-border hover:shadow-medium transition-all duration-300">
      {/* Profile Image */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/30 overflow-hidden hover:scale-105 transition-transform duration-300">
          {profile.photo_url ? (
            <img 
              src={profile.photo_url} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold gradient-text">
              {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">{profile.name}</h1>
        <p className="text-primary font-medium mb-1">{profile.title}</p>
        <p className="text-sm text-muted-foreground">{location}</p>
        
        {/* Contact Links */}
        <div className="flex justify-center gap-4 mt-4">
          {profile.linkedin && (
            <a
              href={formatUrl(profile.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <Mail className="h-5 w-5" />
            </a>
          )}
          {profile.github && (
            <a
              href={formatUrl(profile.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>

      {/* About Section */}
      {profile.bio && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            ABOUT
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Skills Section */}
      {profile.skills.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            SKILLS
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
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
