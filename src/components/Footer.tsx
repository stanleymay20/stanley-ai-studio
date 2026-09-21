import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Twitter, ExternalLink, type LucideIcon } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const normalizeExternalUrl = (url: string): string => {
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:")) {
    return url;
  }
  return `https://${url}`;
};

const Footer = () => {
  const { settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      url: normalizeExternalUrl(settings?.social_github || "https://github.com/stanleymay20"),
      icon: Github,
      description: "View my code and public engineering work",
    },
    {
      name: "LinkedIn",
      url: normalizeExternalUrl(
        settings?.social_linkedin || "https://www.linkedin.com/in/stanley-osei-wusu",
      ),
      icon: Linkedin,
      description: "Connect with me professionally",
    },
    settings?.social_twitter
      ? {
          name: "Twitter",
          url: normalizeExternalUrl(settings.social_twitter),
          icon: Twitter,
          description: "Follow my work and ideas",
        }
      : null,
    {
      name: "Email",
      url: `mailto:${settings?.social_email || "stanleymay20@gmail.com"}`,
      icon: Mail,
      description: "Get in touch directly",
    },
  ].filter(Boolean) as { name: string; url: string; icon: LucideIcon; description: string }[];

  const quickLinks = [
    { label: "Projects", href: "/projects" },
    { label: "Videos", href: "/videos" },
    { label: "Courses", href: "/courses" },
    { label: "Books", href: "/books" },
  ];

  const tagline =
    settings?.footer_tagline ||
    "AI Engineer & Data Scientist building reliable applied-AI, data-engineering, and decision-support systems.";

  const availability =
    settings?.footer_availability || "Open to AI engineering, applied AI, and data science opportunities";

  const copyright = settings?.footer_copyright || "All rights reserved.";

  return (
    <footer id="contact" className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-foreground mb-4">Stanley Osei-Wusu</h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">{tagline}</p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true"></div>
              <span>{availability}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
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

          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="space-y-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const isEmail = social.name === "Email";

                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target={isEmail ? undefined : "_blank"}
                    rel={isEmail ? undefined : "noopener noreferrer"}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors duration-200 group"
                    title={social.description}
                  >
                    <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-sm">{social.name}</span>
                    {!isEmail && (
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} Stanley Osei-Wusu. {copyright}
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
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
