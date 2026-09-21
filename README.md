# Stanley AI Studio

Stanley AI Studio is the canonical repository for a Supabase-backed portfolio and content-management application used to present projects, books, courses, videos, education, career history and featured work through a recruiter-oriented public interface.

The repository also contains administrative surfaces for maintaining that content. It supersedes the old `AI_Studio` placeholder repository.

## Public application

Current routes include:

- `/` — portfolio home and recruiter summary;
- `/projects` — project portfolio;
- `/videos` — video content;
- `/courses` — courses and learning evidence;
- `/books` — books and publishing work.

The home page is organized around recruiter signal strength, including a recruiter summary, featured work, project previews, videos, courses and books.

## Production deployment

Production hosting is configured for Netlify from the `main` branch.

- build command: `npm run build`;
- publish directory: `dist`;
- runtime: Node.js 22;
- SPA fallback routing and security headers are defined in `netlify.toml`;
- public Supabase client configuration is supplied through the hosting environment rather than committed environment files.

The custom production domain should only be switched after the independent Netlify deployment has been verified end to end.

## Administration

The application currently exposes administrative routes for:

- profile;
- projects;
- books;
- videos;
- media;
- verses;
- courses;
- site settings.

Administrative access is verified through a Supabase Edge Function and the client automatically clears the local admin session after inactivity. This is an application control, not a claim of production-grade identity or authorization hardening.

## Technology

- TypeScript
- React 18
- Vite
- React Router
- TanStack Query
- Supabase
- shadcn/ui / Radix UI
- Tailwind CSS
- Zod
- Netlify configuration

## Local development

### Requirements

- Node.js
- npm

### Setup

```bash
git clone https://github.com/stanleymay20/stanley-ai-studio.git
cd stanley-ai-studio
npm ci
cp .env.example .env
npm run dev
```

The frontend expects these public client values:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Do not commit populated environment files. `.env` and `.env.*` are ignored; `.env.example` is the intentional template.

## Quality commands

```bash
npm run lint
npm run build
```

A repository CI workflow is being used to verify those commands against the locked dependency graph.

## Security notes

- The previously tracked `.env` file has been removed from the current tree and future environment files are ignored.
- Any credential that was ever committed to public Git history should be treated as exposed and rotated outside GitHub.
- Only publishable Supabase client configuration belongs in the frontend.
- Administrative authorization must continue to be enforced server-side; possession of client state alone must never confer privileged database access.

## Canonical status

**Canonical AI Studio repository.**

The repository `stanleymay20/AI_Studio` is retained only as a legacy name/redirect and should not receive new feature work.
