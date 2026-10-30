# Portfolio update 30 October 2026

## Purpose

Make Stanley Osei-Wusu's portfolio useful to recruiters reviewing working-student, internship and junior AI/data applications. Retain the existing CMS, routes and personal branding.

## Findings and changes

- The custom domain served an older bundle that failed at startup with `supabaseUrl is required`. The Netlify deployment at commit cc4748c already contained the public-client configuration fallback. Publish the updated source to the existing Lovable project as well as the connected Git deployment; do not treat a successful build as proof the custom domain is updated.
- Replaced broad production-readiness positioning with concrete AI/data workflow descriptions.
- Added selected case studies for Quantivis, Bayesian marketing mix modelling and ScrollLibrary. The Bayesian case study distinguishes model-based ROI scenarios from causal or realised returns.
- Preserved CMS editing and profile photo/resume fields. Shared public profile and site-settings queries now use TanStack Query with a one-minute stale window. Public identity and summary have reviewed fallback content and do not wait for CMS requests.
- Added meaningful static homepage HTML for script failure/disabled JavaScript and basic text extraction. This is not full server rendering or per-route prerendering.
- Put the introduction and selected work before the longer biography on mobile. Added a skip link, keyboard focus treatment, active navigation semantics and reduced-motion support.
- Retained the rest of the project gallery and learning/publishing sections. Limit homepage gallery to four cards and link to the full page.
- Ensure the Bayesian repository remains visible even if absent from the CMS gallery.
- Split Supabase and query dependencies into separate cacheable build chunks. This changes chunking, not proof of reduced total network bytes or a measured page-speed score.
- Reuse the font stylesheet and correct multiple-font URL construction.

## CMS corrections

Updated only profile ad1eef75-6837-4aaa-97af-a0fda8f60da4, settings 79d45c2c-20dc-451b-8f0d-75558e96c41f and video d9588841-b76f-4afc-85b1-9b9c2b33828b in the existing portfolio database. Each write returned an affected count of one.

- Restored current Curry 36 employment and independent-project positioning.
- Replaced unsupported claims of 85% accuracy, 50% manual-effort reduction, 10 million records, 35% query improvement and 40% operational-error reduction with defensible descriptions.
- Removed the unverified renewable-energy internship entry and membership/certification entries from the public profile pending supporting evidence.
- Listed the two ongoing master's programmes separately and BSc completion in 2025; corrected location to Brandenburg an der Havel / Berlin and German to B1.
- Replaced unsupported video claims about onboarding 50+ engineers and saving 500+ monthly hours with an explainer description.
- Preserved the profile photo, contact links, resume URL, publishing content and project records.

## Evidence consulted

- Saved job-application controlled state dated 13 September 2026 and the reviewed BCG/SAP CV and letter records.
- Quantivis canonical README at Git blob e0675295ad8362d8b18ef3282dd4a36d2bc88a64.
- ScrollLibrary canonical README at Git blob 5539f7b365868d7f54fd7a844601f7206f917de0.
- Bayesian MMM README at Git blob 4e34f8c864979ab94df1c75477c5dae65f256e08.
- Direct database readback verified the corrected profile fields. No new adoption, certification, customer, revenue or performance claims added.

## Validation before publication

- TypeScript application check passed.
- Production build passed with the locked dependencies.
- ESLint on changed TSX/hooks/data passed without warnings. Full repository ESLint had zero errors and pre-existing warnings in admin/UI files; the changed site-settings warning was repaired.
- Public URL checks cover supported web/local links and rejection of executable/non-web schemes.
- Local browser preview could not access the executor's loopback server. Verify the published site in the connected browser before reporting completion.

## Remaining review boundaries

This is a recruiter-content and frontend reliability update, not a complete security audit of the admin authentication system or an independent execution of every linked project. Existing custom-domain routing was preserved.
