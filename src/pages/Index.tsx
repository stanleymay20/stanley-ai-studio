import ProfileHeader from "@/components/ProfileHeader";
import AboutSection from "@/components/AboutSection";
import EducationSection from "@/components/EducationSection";
import CareerSection from "@/components/CareerSection";
import ProjectsSection from "@/components/ProjectsSection";
import MembershipsSection from "@/components/MembershipsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <ProfileHeader />
        <AboutSection />
        <EducationSection />
        <CareerSection />
        <ProjectsSection />
        <MembershipsSection />
      </main>
    </div>
  );
};

export default Index;