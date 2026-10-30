import { lazy, Suspense } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import RecruiterSummary from "@/components/RecruiterSummary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Seo from "@/components/Seo";
import { useSiteSettings } from "@/hooks/useSiteSettings";


const EducationSection = lazy(() => import("@/components/EducationSection"));
const CareerSection = lazy(() => import("@/components/CareerSection"));
const MembershipsSection = lazy(() => import("@/components/MembershipsSection"));
const SelectedWork = lazy(() => import("@/components/SelectedWork"));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const VideosSection = lazy(() => import("@/components/VideosSection"));
const CoursesSection = lazy(() => import("@/components/CoursesSection"));
const BooksSection = lazy(() => import("@/components/BooksSection"));
const VerseOfTheDay = lazy(() =>
  import("@/components/VerseOfTheDay").then((module) => ({ default: module.VerseOfTheDay }))
);

const HOME_TITLE = "Stanley Osei-Wusu | AI Engineer & Data Scientist";
const HOME_DESCRIPTION =
  "Applied AI and data-science portfolio of Stanley Osei-Wusu. Explore project case studies in LLM workflows, data engineering and Bayesian modelling. Based in Berlin-Brandenburg.";

const SectionFallback = ({ height = "h-32" }: { height?: string }) => (
  <div className={`${height} bg-card border border-border rounded-lg animate-pulse`} aria-hidden="true" />
);

const Index = () => {
  const { settings } = useSiteSettings();

  return (
    <div className="min-h-screen bg-background">
      <Seo title={HOME_TITLE} description={HOME_DESCRIPTION} path="/" type="profile" />
      <Header />

      <main id="main-content" tabIndex={-1} className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 order-2 lg:order-1">
              <ProfileHeader location={settings?.location} />
              <Suspense fallback={<SectionFallback />}>
                <EducationSection />
                <CareerSection />
                <MembershipsSection />
              </Suspense>
            </div>

            <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
              <RecruiterSummary />
              <Suspense fallback={<SectionFallback height="h-64" />}>
                <SelectedWork />
              </Suspense>
              <Suspense fallback={<SectionFallback height="h-96" />}>
                <ProjectsSection />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <VideosSection />
                <CoursesSection />
                <BooksSection />
                <VerseOfTheDay placement="homepage" />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
