import ProfileHeader from "@/components/ProfileHeader";
import EducationSection from "@/components/EducationSection";
import CareerSection from "@/components/CareerSection";
import ProjectsSection from "@/components/ProjectsSection";
import MembershipsSection from "@/components/MembershipsSection";
import BooksSection from "@/components/BooksSection";
import VideosSection from "@/components/VideosSection";
import { VerseOfTheDay } from "@/components/VerseOfTheDay";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 animate-slide-in-left">
            <ProfileHeader />
            <EducationSection />
            <CareerSection />
            <MembershipsSection />
          </div>
          
          {/* Right Content */}
          <div className="lg:col-span-8 space-y-8 animate-slide-in-right">
            {/* Verse of the Day - Homepage placement */}
            <VerseOfTheDay placement="homepage" />
            
            <ProjectsSection />
            <BooksSection />
            <VideosSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;