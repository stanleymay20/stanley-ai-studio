export interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  tech_stack: string[] | null;
  external_link: string | null;
  github_link: string | null;
  image_url: string | null;
  featured: boolean | null;
  category: string | null;
  notebook_url: string | null;
  demo_type: string | null;
}

export const portfolioFallbackProjects: PortfolioProject[] = [
  {
    id: "github-aicis",
    title: "AICIS — AI Civilization Intelligence System",
    subtitle: "AI-assisted early-warning, resilience, and decision-support research platform",
    description:
      "An applied AI and data-engineering platform for combining heterogeneous signals, forecasting, evidence provenance, governed workflows, and human review.",
    tech_stack: ["React", "TypeScript", "Supabase", "PostgreSQL"],
    external_link: null,
    github_link: "https://github.com/stanleymay20/aicis-divine-core-6d24171b",
    image_url: null,
    featured: true,
    category: "Decision Intelligence",
    notebook_url: null,
    demo_type: null,
  },
  {
    id: "github-scrolllibrary",
    title: "ScrollLibrary — AI Publishing OS",
    subtitle: "Structured knowledge workflows and production-grade publishing automation",
    description:
      "A React/TypeScript and Supabase platform combining structured AI outputs, knowledge extraction, assessment workflows, publishing automation, security controls, and CI quality gates.",
    tech_stack: ["React", "TypeScript", "Supabase", "Playwright"],
    external_link: null,
    github_link: "https://github.com/stanleymay20/scroll-wisdom-weave-d69aa349",
    image_url: null,
    featured: false,
    category: "Applied AI",
    notebook_url: null,
    demo_type: null,
  },
  {
    id: "github-bayesian-mmm",
    title: "Bayesian Marketing Mix Modeling",
    subtitle: "Uncertainty-aware media effectiveness and ROI analysis with PyMC",
    description:
      "A Bayesian MMM project using geometric adstock, NUTS sampling, posterior diagnostics, and probabilistic ROI estimation to support business decisions under uncertainty.",
    tech_stack: ["Python", "PyMC", "ArviZ", "Pandas"],
    external_link: null,
    github_link: "https://github.com/stanleymay20/haensel-ams-bayesian-mmm",
    image_url: null,
    featured: false,
    category: "Data Science",
    notebook_url: null,
    demo_type: null,
  },
];
