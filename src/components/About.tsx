import { Download, MapPin, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const About = () => {
  const skills = [
    { category: "Programming", items: ["Python", "R", "SQL", "JavaScript", "TypeScript"] },
    { category: "ML/AI", items: ["TensorFlow", "PyTorch", "Scikit-learn", "Hugging Face", "OpenAI"] },
    { category: "Data Tools", items: ["Pandas", "NumPy", "Apache Spark", "Kafka", "Airflow"] },
    { category: "Cloud", items: ["AWS", "Google Cloud", "Azure", "Docker", "Kubernetes"] },
    { category: "Databases", items: ["PostgreSQL", "MongoDB", "Redis", "Cassandra", "BigQuery"] },
    { category: "Web", items: ["React", "FastAPI", "Node.js", "GraphQL", "REST APIs"] },
  ];

  const education = [
    {
      degree: "M.Sc. Data Science",
      institution: "Stanford University",
      year: "2020-2022",
      description: "Specialized in Machine Learning and Statistical Methods"
    },
    {
      degree: "B.Sc. Computer Science",
      institution: "University of California, Berkeley",
      year: "2016-2020",
      description: "Graduated Magna Cum Laude, Focus on AI and Algorithms"
    }
  ];

  const certifications = [
    "AWS Certified Machine Learning - Specialty",
    "Google Cloud Professional Data Engineer",
    "Deep Learning Specialization (Coursera)",
    "TensorFlow Developer Certificate"
  ];

  return (
    <section id="about" className="section-spacing">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-display font-bold text-foreground mb-6">
            About Me
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate about turning data into actionable insights and building intelligent systems 
            that solve real-world problems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile & Bio */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Card */}
            <Card className="glass-card animate-slide-in-left">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>My Story</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    I'm a Data Scientist and AI Engineer with over 4 years of experience building 
                    intelligent systems that drive business impact. My journey began with a fascination 
                    for mathematics and evolved into a passion for extracting insights from complex datasets.
                  </p>
                  <p>
                    Currently, I'm the founder of <strong className="text-primary">ScrollIntel</strong>, 
                    a real-time analytics platform that helps businesses understand user behavior through 
                    advanced machine learning. I specialize in NLP, computer vision, and time series 
                    analysis, with a focus on building scalable, production-ready solutions.
                  </p>
                  <p>
                    When I'm not coding or analyzing data, you'll find me contributing to open-source 
                    projects, writing about AI developments, or exploring the latest research in 
                    machine learning.
                  </p>
                </div>

                <div className="flex items-center space-x-6 mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Available for projects</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Download className="h-4 w-4 mr-2" />
                    Download CV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="glass-card animate-slide-in-left animate-stagger-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Education</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-6 relative">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary"></div>
                      <div>
                        <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                        <p className="text-primary font-medium">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">{edu.year}</p>
                        <p className="text-sm text-muted-foreground mt-1">{edu.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills & Certifications */}
          <div className="space-y-8">
            {/* Skills */}
            <Card className="glass-card animate-slide-in-right">
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skills.map((skillGroup, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-foreground mb-3">{skillGroup.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.items.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="skill-badge text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="glass-card animate-slide-in-right animate-stagger-1">
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{cert}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-card animate-slide-in-right animate-stagger-2">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">4+</div>
                    <div className="text-xs text-muted-foreground">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">50+</div>
                    <div className="text-xs text-muted-foreground">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">10+</div>
                    <div className="text-xs text-muted-foreground">Research Papers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">3</div>
                    <div className="text-xs text-muted-foreground">Open Source</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;