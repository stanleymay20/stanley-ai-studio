import { Link } from "react-router-dom";
import { ArrowUpRight, Code2, Database, ChartNoAxesCombined } from "lucide-react";

const selected = [
  { slug: "quantivis", title: "Quantivis", label: "AI & data engineering", icon: Database,
    summary: "From inconsistent operational data to traceable decision support.",
    work: "Schema inference, data validation, analytical workflows and decision records.",
    stack: "TypeScript · PostgreSQL · Supabase" },
  { slug: "bayesian-marketing-mix", title: "Bayesian marketing mix modelling", label: "Statistical modelling", icon: ChartNoAxesCombined,
    summary: "Compare marketing channels while keeping uncertainty visible.",
    work: "Seven-channel PyMC model, adstock transformations, posterior diagnostics and ROI scenarios.",
    stack: "Python · PyMC · ArviZ" },
  { slug: "scrolllibrary", title: "ScrollLibrary", label: "AI application engineering", icon: Code2,
    summary: "Structured AI workflows for reading, learning and publishing.",
    work: "Model-output validation, database access controls and export quality checks.",
    stack: "React · TypeScript · Supabase" },
];

export default function SelectedWork() {
  return (
    <section aria-labelledby="selected-work-heading" id="selected-work" className="scroll-mt-24">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <h2 id="selected-work-heading" className="text-xl font-bold">Selected case studies</h2>
        <Link to="/projects" className="text-sm text-primary hover:underline shrink-0">All projects</Link>
      </div>
      <p className="text-sm text-muted-foreground mb-5">The problem, my approach, and the evidence you can inspect.</p>
      <div className="space-y-3">
        {selected.map(({ icon: Icon, ...project }, index) => (
          <Link key={project.slug} to={`/projects/${project.slug}`} className="group block bg-card border border-border rounded-xl p-5 sm:p-6 hover:border-primary/50 hover:shadow-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <div className="flex items-start gap-4">
              <span className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">0{index + 1} / {project.label}</p>
                <h3 className="font-semibold text-lg group-hover:text-primary">{project.title}</h3>
                <p className="text-sm text-foreground mt-2">{project.summary}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{project.work}</p>
                <p className="text-xs text-muted-foreground mt-3">{project.stack}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
