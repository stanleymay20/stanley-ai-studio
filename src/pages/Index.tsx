import ProfileHeader from "@/components/ProfileHeader";
import EducationSection from "@/components/EducationSection";
import CareerSection from "@/components/CareerSection";
import ProjectsSection from "@/components/ProjectsSection";
import MembershipsSection from "@/components/MembershipsSection";
import BooksSection from "@/components/BooksSection";
import CoursesSection from "@/components/CoursesSection";
import VideosSection from "@/components/VideosSection";
import RecruiterSummary from "@/components/RecruiterSummary";
import FeaturedWork from "@/components/FeaturedWork";
import { VerseOfTheDay } from "@/components/VerseOfTheDay";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-4 animate-slide-in-left">
              <ProfileHeader location={settings?.location} />
              <EducationSection />
              <CareerSection />
              <MembershipsSection />
            </div>
            
            {/* Right Content */}
            <div className="lg:col-span-8 space-y-8 animate-slide-in-right">
              {/* Recruiter Summary - Top priority visibility */}
              <RecruiterSummary />
              
              {/* Featured Work - Guides recruiters where to start */}
              <FeaturedWork />
              
              {/* Verse of the Day - Subtle, below the fold */}
              <VerseOfTheDay placement="homepage" />
              
              <ProjectsSection />
              <CoursesSection />
              <BooksSection />
              <VideosSection />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;