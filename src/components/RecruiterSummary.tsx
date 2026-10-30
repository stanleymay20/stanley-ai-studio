import { Link } from "react-router-dom";
import { ArrowRight, Download, Github, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { publicProfileFallback } from "@/data/publicProfile";
import { publicUrl } from "@/lib/publicUrl";

const RecruiterSummary = () => {
  const profile = usePublicProfile();
  const resume = publicUrl(profile.resume_url);
  const github = publicUrl(profile.github);
  const skills = profile.core_skills?.length ? profile.core_skills : publicProfileFallback.core_skills!;

  return (
    <section aria-labelledby="recruiter-summary-title" className="relative overflow-hidden bg-card rounded-2xl p-6 sm:p-9 border border-border shadow-soft">
      <div className="absolute top-0 left-0 h-1 w-full bg-primary" aria-hidden="true" />
      <p className="text-xs uppercase tracking-[0.16em] text-primary font-semibold mb-5">Stanley Osei-Wusu · Applied AI & data science</p>
      <h1 id="recruiter-summary-title" className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.15] text-foreground mb-5 max-w-xl">
        {profile.role_title || publicProfileFallback.role_title}
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-6">
        {profile.value_proposition || publicProfileFallback.value_proposition}
      </p>
      <div className="flex flex-wrap gap-2 mb-7" aria-label="Core skills">
        {skills.map(skill => <span key={skill} className="bg-muted text-foreground px-3 py-1.5 rounded-md text-sm border border-border">{skill}</span>)}
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button asChild><Link to="/projects" className="gap-2">Explore my work<ArrowRight className="h-4 w-4" /></Link></Button>
        <Button variant="outline" asChild><a href={`mailto:${profile.email || publicProfileFallback.email}`} className="gap-2"><Mail className="h-4 w-4" />Get in touch</a></Button>
        {resume && <Button variant="outline" asChild><a href={resume} target="_blank" rel="noopener noreferrer" className="gap-2"><Download className="h-4 w-4" />View CV</a></Button>}
        {github && <Button variant="ghost" asChild><a href={github} target="_blank" rel="noopener noreferrer" className="gap-2"><Github className="h-4 w-4" />GitHub</a></Button>}
      </div>
      <div className="mt-7 pt-5 border-t border-border flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />Berlin–Brandenburg, Germany</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 bg-emerald-500 rounded-full" aria-hidden="true" />Open to working-student & internship roles</span>
      </div>
    </section>
  );
};
export default RecruiterSummary;
