import { Mail, Linkedin, Github } from "lucide-react";

const ProfileHeader = () => {
  return (
    <section className="section-spacing bg-background">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h1 className="text-hero text-foreground mb-6">
            Build and share your{" "}
            <span className="text-primary">data portfolio.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            AI Engineer and Data Scientist passionate about building scroll-aligned AI systems 
            that solve global challenges in education, justice, and business intelligence.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center border-4 border-primary/20 overflow-hidden">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">SO</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <h3 className="text-xl font-semibold text-foreground">Stanley Osei-Wusu</h3>
              <p className="text-muted-foreground">AI Engineer at ScrollIntel</p>
              <p className="text-sm text-muted-foreground">Based in Germany</p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-foreground mb-4">About</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              I am a Data Scientist and AI Engineer passionate about building scroll-aligned AI systems 
              that solve global challenges in education, justice, and business intelligence. I combine 
              academic research with hands-on entrepreneurship to create scalable, impactful solutions.
            </p>
            
            {/* Contact Links */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              <a
                href="mailto:stanleymay20@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Mail className="h-5 w-5" />
                <span>stanleymay20@gmail.com</span>
              </a>
              <a
                href="https://linkedin.com/in/stanleyoseiwusu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/stanleyoseiwusu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;