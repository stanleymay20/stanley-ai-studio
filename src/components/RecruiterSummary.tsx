import { useEffect, useState } from "react";
import { Mail, Linkedin, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  role_title: string | null;
  value_proposition: string | null;
  core_skills: string[] | null;
  resume_url: string | null;
  email: string | null;
  linkedin: string | null;
}

const RecruiterSummary = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('role_title, value_proposition, core_skills, resume_url, email, linkedin')
          .limit(1)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.log('Profile fetch error:', error);
        // Use defaults if fetch fails
        setProfile({
          role_title: 'AI Engineer & Data Scientist',
          value_proposition: 'I build production-ready AI systems, data pipelines, and automation tools that deliver measurable business impact.',
          core_skills: ['Python', 'Machine Learning', 'NLP', 'SQL', 'Data Pipelines', 'Cloud (AWS/GCP)', 'APIs', 'TensorFlow'],
          resume_url: null,
          email: 'stanleymay20@gmail.com',
          linkedin: 'https://linkedin.com/in/stanleyoseiwusu',
        });
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

  if (!profile) return null;

  const coreSkills = profile.core_skills || [
    "Python",
    "Machine Learning", 
    "NLP",
    "SQL",
    "Data Pipelines",
    "Cloud (AWS/GCP)",
    "APIs",
    "TensorFlow"
  ];

  return (
    <div className="bg-gradient-to-r from-card via-card to-primary/5 rounded-xl p-6 border border-border shadow-soft">
      {/* Role & Value Proposition */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {profile.role_title || 'AI Engineer & Data Scientist'}
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {profile.value_proposition || (
            <>
              I build <span className="text-foreground font-medium">production-ready AI systems</span>, 
              data pipelines, and automation tools that deliver measurable business impact.
            </>
          )}
        </p>
      </div>

      {/* Tech Stack Chips - Scannable Keywords */}
      <div className="flex flex-wrap gap-2 mb-5">
        {coreSkills.map((skill) => (
          <span
            key={skill}
            className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Recruiter CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-sm text-muted-foreground">Interested in working together?</span>
        <div className="flex items-center gap-2 flex-wrap">
          {profile.email && (
            <a href={`mailto:${profile.email}`}>
              <Button size="sm" className="gap-2">
                <Mail className="h-4 w-4" />
                Get in Touch
              </Button>
            </a>
          )}
          {profile.linkedin && (
            <a 
              href={profile.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline" className="gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </a>
          )}
          {profile.resume_url && (
            <a 
              href={profile.resume_url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Resume
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterSummary;
