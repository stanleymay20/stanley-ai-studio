import { Mail, Linkedin, Github } from "lucide-react";

const ProfileHeader = () => {
  return (
    <div className="bg-card rounded-lg p-6 mb-6 border border-border">
      {/* Profile Image */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20 overflow-hidden">
          <span className="text-xl font-bold text-primary">SO</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Stanley Osei-Wusu</h1>
        <p className="text-primary font-medium mb-1">Data Scientist</p>
        <p className="text-sm text-muted-foreground">Based in Potsdam</p>
        
        {/* Contact Links */}
        <div className="flex justify-center gap-4 mt-4">
          <a
            href="https://linkedin.com/in/stanleyoseiwusu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="mailto:stanleymay20@gmail.com"
            className="text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/stanleyoseiwusu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* About Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">ABOUT</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          I specialize in predictive modeling and large-scale data analysis. My goal is to leverage my 
          technical expertise to foster innovative energy and climate policies in international environments.
        </p>
      </div>

      {/* Skills Section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">SKILLS</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Python", "Data Visualization", "Machine Learning", "AI", "SQL", 
            "Microsoft Office", "Fast learner", "Teamwork", "Good communication",
            "Management Skills", "Sustainable Management", "Data Integration"
          ].map((skill) => (
            <span
              key={skill}
              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20 hover:bg-primary/20 transition-colors duration-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;