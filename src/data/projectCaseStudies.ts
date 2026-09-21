export interface ProjectCaseStudy {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  repository: string;
  liveUrl?: string;
  stack: string[];
  problem: string;
  approach: string[];
  evidence: string[];
  architecture: string[];
  boundaries: string[];
}

export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    slug: "quantivis",
    title: "Quantivis",
    eyebrow: "Decision Intelligence & Data Quality",
    summary:
      "An AI-assisted decision-intelligence platform for turning messy operational data into validated analytical outputs, forecasts, structured insights, and governed decision support.",
    repository: "https://github.com/stanleymay20/quantisights-pro-c6abd242",
    liveUrl: "https://www.quantivis.io",
    stack: ["React", "TypeScript", "Supabase", "PostgreSQL", "Edge Functions", "Forecasting"],
    problem:
      "Operational decisions are often made from fragmented datasets with inconsistent schemas, weak quality checks, and little traceability between raw data and a recommendation.",
    approach: [
      "Ingest operational and business datasets rather than assuming one fixed schema.",
      "Detect dates, regions, dimensions, metrics, and data types before analysis.",
      "Surface data-quality diagnostics instead of silently converting weak inputs into confident outputs.",
      "Run analytical and forecasting workflows that feed structured decision support.",
      "Keep multi-tenant application delivery, authentication, release controls, and evidence boundaries part of the engineering system.",
    ],
    evidence: [
      "The canonical repository documents ingestion, schema inference, quality scoring, forecasting, KPI workflows, and recommendation support.",
      "The maintained lineage includes CI/CD, security controls, staging/deployment controls, and audit evidence.",
      "The public application is available at quantivis.io.",
    ],
    architecture: [
      "Raw operational data",
      "Schema and type detection",
      "Validation and quality diagnostics",
      "Analysis and forecasting",
      "Structured intelligence",
      "Human decision",
      "Outcome and feedback",
    ],
    boundaries: [
      "Specific forecast-accuracy or business-impact claims depend on the deployment and dataset being evaluated.",
      "Roadmap items are kept separate from currently supported capabilities.",
      "The platform is decision support, not a substitute for accountable human judgment.",
    ],
  },
  {
    slug: "aicis",
    title: "AICIS — AI Civilization Intelligence System",
    eyebrow: "Applied AI · Resilience · Governed Decision Support",
    summary:
      "A research and engineering platform exploring how heterogeneous signals, forecasting, evidence provenance, governance workflows, and human review can support complex resilience and risk decisions.",
    repository: "https://github.com/stanleymay20/aicis-divine-core-6d24171b",
    stack: ["React", "TypeScript", "Supabase", "PostgreSQL", "Realtime", "Edge Functions"],
    problem:
      "Complex socioeconomic, climate, infrastructure, and governance risks rarely arrive in one clean dataset, while consequential decisions still require evidence, provenance, and human accountability.",
    approach: [
      "Canonicalize and deduplicate heterogeneous signals before downstream analysis.",
      "Enrich signals and represent cross-domain risk variables explicitly.",
      "Separate observed evidence from predictive or causal inference.",
      "Use review and approval concepts for sensitive interventions.",
      "Treat provenance, uncertainty, and auditability as product requirements rather than presentation details.",
    ],
    evidence: [
      "The public repository documents telemetry, enrichment, cross-domain risk representations, analytical workflows, governance concepts, and typed operational pipelines.",
      "The implementation uses Supabase Postgres, Auth, Realtime, and Edge Functions with a React/TypeScript frontend.",
      "The project README explicitly distinguishes implemented engineering from unvalidated national-security, humanitarian, or emergency-management claims.",
    ],
    architecture: [
      "Open APIs, signals, and feeds",
      "Telemetry intake",
      "Canonicalization and deduplication",
      "Enrichment and relevance scoring",
      "Predictive and causal analysis",
      "Evidence and governance review",
      "Decision-support interfaces",
      "Human operational coordination",
    ],
    boundaries: [
      "The platform is an evolving research and engineering system, not a certified operational authority.",
      "Forecasts and causal outputs require validation for the specific data, geography, and decision context.",
      "Human review remains central for consequential decisions.",
    ],
  },
  {
    slug: "scrolllibrary",
    title: "ScrollLibrary",
    eyebrow: "AI Publishing OS · Structured Knowledge Workflows",
    summary:
      "An AI-assisted publishing and knowledge-work platform combining structured model outputs, knowledge extraction, assessment workflows, publishing automation, security controls, and reproducible release gates.",
    repository: "https://github.com/stanleymay20/scroll-wisdom-weave-d69aa349",
    liveUrl: "https://scrolllibrary.org",
    stack: ["React", "TypeScript", "Supabase", "PostgreSQL", "Playwright", "CodeQL"],
    problem:
      "Long-form AI publishing systems need more than text generation: they must preserve structure, validate machine-readable outputs, enforce data and authorization boundaries, and produce conformant release artifacts.",
    approach: [
      "Require structured AI outputs for downstream workflows rather than depending on free-form parsing alone.",
      "Use database-backed publishing, learning, and creator workflows with authentication and RLS.",
      "Exercise real auth and RLS behavior in browser/database end-to-end tests.",
      "Run migration-safety, dependency, static-analysis, secret-scan, and build gates in CI.",
      "Validate generated EPUB archives against official conformance tooling.",
    ],
    evidence: [
      "The canonical public repository documents structured AI/tool-call workflows, knowledge-graph extraction, interactive assessment, and production-readiness gates.",
      "Playwright, CodeQL, dependency review, migration-safety checks, and EPUB conformance are part of the repository quality system.",
      "The live platform is available at scrolllibrary.org.",
    ],
    architecture: [
      "React and TypeScript client",
      "Authentication and application state",
      "Supabase Postgres and RLS",
      "Edge Functions and structured AI workflows",
      "Publishing, learning, and creator operations",
      "Export, conformance, and release checks",
    ],
    boundaries: [
      "Passing repository gates demonstrates only the conditions those gates actually test.",
      "Production claims are kept separate from broader certification or deployment claims.",
      "Privileged credentials remain server-side and are not part of the public client.",
    ],
  },
];

export const getCaseStudyBySlug = (slug?: string) =>
  projectCaseStudies.find((project) => project.slug === slug);

export const getCaseStudySlug = (title: string) => {
  const normalized = title.toLowerCase();

  if (normalized.startsWith("quantivis")) return "quantivis";
  if (normalized.startsWith("aicis")) return "aicis";
  if (normalized.startsWith("scrolllibrary")) return "scrolllibrary";

  return null;
};
