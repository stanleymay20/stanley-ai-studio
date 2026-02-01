import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Twitter, ExternalLink } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  // Use settings or fallbacks
  const socialLinks = [
    settings?.social_github && {
      name: "GitHub",
      url: settings.social_github,
      icon: Github,
      description: "View my code and contributions"
    },
    settings?.social_linkedin && {
      name: "LinkedIn",
      url: settings.social_linkedin,
      icon: Linkedin,
      description: "Connect with me professionally"
    },
    settings?.social_twitter && {
      name: "Twitter",
      url: settings.social_twitter,
      icon: Twitter,
      description: "Follow my thoughts on AI & data"
    },
    settings?.social_email && {
      name: "Email",
      url: `mailto:${settings.social_email}`,
      icon: Mail,
      description: "Get in touch directly"
    }
  ].filter(Boolean) as { name: string; url: string; icon: any; description: string }[];

  const quickLinks = [
    { label: "Projects", href: "/projects" },
    { label: "Videos", href: "/videos" },
    { label: "Courses", href: "/courses" },
    { label: "Books", href: "/books" }
  ];

  const tagline = settings?.footer_tagline || 
    "Data Scientist & AI Engineer passionate about building intelligent systems that solve real-world problems. Always open to new opportunities and collaborations.";
  
  const availability = settings?.footer_availability || "Available for freelance projects";
  const copyright = settings?.footer_copyright || "All rights reserved.";

  return (
    <footer id="contact" className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Stanley Osei-Wusu
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              {tagline}
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>{availability}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <div className="space-y-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target={social.name !== "Email" ? "_blank" : undefined}
                      rel={social.name !== "Email" ? "noopener noreferrer" : undefined}
                      className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                      title={social.description}
                    >
                      <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-sm">{social.name}</span>
                      {social.name !== "Email" && (
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} Stanley Osei-Wusu. {copyright}
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <button className="hover:text-primary transition-colors duration-200">
                Privacy Policy
              </button>
              <button className="hover:text-primary transition-colors duration-200">
                Terms of Service
              </button>
              <div className="flex items-center space-x-2">
                <span>Built with</span>
                <span className="text-primary">React</span>
                <span>&</span>
                <span className="text-primary">Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
