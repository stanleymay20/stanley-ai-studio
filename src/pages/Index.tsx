import ProfileHeader from "@/components/ProfileHeader";
import AboutSection from "@/components/AboutSection";
import EducationSection from "@/components/EducationSection";
import CareerSection from "@/components/CareerSection";
import ProjectsSection from "@/components/ProjectsSection";
import MembershipsSection from "@/components/MembershipsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-4">
            <ProfileHeader />
            <EducationSection />
            <CareerSection />
            <MembershipsSection />
          </div>
          
          {/* Right Content */}
          <div className="lg:col-span-8">
            <ProjectsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;