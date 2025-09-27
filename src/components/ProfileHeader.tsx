import { Mail, Linkedin, Github } from "lucide-react";

const ProfileHeader = () => {
  return (
    <section className="section-spacing bg-background">
      <div className="container-narrow">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-64 h-80 bg-muted rounded-lg flex items-center justify-center border border-border">
              <div className="text-center text-muted-foreground">
                <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">SO</span>
                </div>
                <p className="text-sm">Professional Photo</p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-hero text-foreground mb-4">
              Stanley Osei-Wusu
            </h1>
            <h2 className="text-heading text-primary mb-6">
              AI Engineer | Data Scientist | Entrepreneur
            </h2>
            
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