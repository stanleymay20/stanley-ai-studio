import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Seo from "@/components/Seo";
import { getCaseStudyBySlug } from "@/data/projectCaseStudies";

const ProjectCaseStudyPage = () => {
  const { slug } = useParams();
  const project = getCaseStudyBySlug(slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Seo
          title="Project Case Study Not Found | Stanley Osei-Wusu"
          description="The requested project case study could not be found."
          path={`/projects/${slug || "not-found"}`}
        />
        <Header />
        <main className="pt-28 pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/projects" className="inline-flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to projects
            </Link>
            <h1 className="text-3xl font-bold mt-8 mb-3">Case study not found</h1>
            <p className="text-muted-foreground">This project case study does not exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canonicalPath = `/projects/${project.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${project.title} Case Study | Stanley Osei-Wusu`}
        description={project.summary}
        path={canonicalPath}
      />
      <Header />

      <main className="pt-24 pb-16">
        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <header className="border-b border-border pb-8 mb-10">
            <p className="text-sm uppercase tracking-[0.18em] text-primary font-semibold mb-3">
              {project.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {project.summary}
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Github className="h-4 w-4" />
                View repository
              </a>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View live project
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-6" aria-label="Technology stack">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium border border-primary/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </header>

          <div className="space-y-10">
            <section aria-labelledby="problem-heading">
              <h2 id="problem-heading" className="text-2xl font-bold mb-3">The problem</h2>
              <p className="text-muted-foreground leading-relaxed">{project.problem}</p>
            </section>

            <section aria-labelledby="approach-heading">
              <h2 id="approach-heading" className="text-2xl font-bold mb-4">Engineering approach</h2>
              <ul className="space-y-3">
                {project.approach.map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="architecture-heading">
              <h2 id="architecture-heading" className="text-2xl font-bold mb-4">System flow</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {project.architecture.map((item, index) => (
                  <div key={item} className="bg-card border border-border rounded-lg p-4">
                    <span className="text-xs font-semibold text-primary">STEP {index + 1}</span>
                    <p className="font-medium text-foreground mt-1">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="evidence-heading">
              <h2 id="evidence-heading" className="text-2xl font-bold mb-4">What a reviewer can verify</h2>
              <ul className="space-y-3">
                {project.evidence.map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="boundaries-heading" className="bg-muted/30 border border-border rounded-xl p-6">
              <h2 id="boundaries-heading" className="text-xl font-bold mb-4">Evidence boundaries</h2>
              <ul className="space-y-3">
                {project.boundaries.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default ProjectCaseStudyPage;
