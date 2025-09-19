import { useState } from "react";
import { ExternalLink, Github, TrendingUp, Database, Brain, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  metrics: {
    accuracy?: string;
    datasetSize?: string;
    model?: string;
    performance?: string;
  };
  links: {
    github?: string;
    demo?: string;
    paper?: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  featured: boolean;
}

const projects: Project[] = [
  {
    id: "scrollintel",
    title: "ScrollIntel Analytics Platform",
    description: "Real-time web analytics platform with AI-powered insights and predictive user behavior modeling.",
    longDescription: "Built a comprehensive analytics platform that processes millions of user interactions daily, providing businesses with actionable insights through advanced machine learning algorithms.",
    tags: ["React", "Python", "TensorFlow", "FastAPI", "PostgreSQL", "Redis"],
    metrics: {
      accuracy: "94.2%",
      datasetSize: "2.5M interactions",
      model: "Transformer + LSTM",
      performance: "< 100ms response"
    },
    links: {
      github: "https://github.com",
      demo: "https://scrollintel.com",
    },
    icon: TrendingUp,
    featured: true,
  },
  {
    id: "nlp-sentiment",
    title: "Multi-Modal Sentiment Analysis",
    description: "Advanced NLP system combining text, audio, and visual cues for comprehensive sentiment analysis.",
    longDescription: "Developed a state-of-the-art sentiment analysis system that processes multiple modalities to achieve superior accuracy in emotion detection and sentiment classification.",
    tags: ["Python", "PyTorch", "Transformers", "OpenCV", "Docker", "AWS"],
    metrics: {
      accuracy: "96.8%",
      datasetSize: "500K samples",
      model: "BERT + ResNet + Audio CNN",
    },
    links: {
      github: "https://github.com",
      paper: "https://arxiv.org",
    },
    icon: Brain,
    featured: true,
  },
  {
    id: "time-series",
    title: "Financial Time Series Prediction",
    description: "Deep learning model for cryptocurrency price prediction using technical indicators and market sentiment.",
    longDescription: "Implemented an ensemble model combining LSTM networks with attention mechanisms to predict cryptocurrency prices with high accuracy.",
    tags: ["Python", "Keras", "Pandas", "NumPy", "Plotly", "Alpha Vantage API"],
    metrics: {
      accuracy: "87.3%",
      datasetSize: "3 years daily data",
      model: "LSTM-Attention",
    },
    links: {
      github: "https://github.com",
      demo: "https://crypto-predictor.com",
    },
    icon: BarChart3,
    featured: false,
  },
  {
    id: "data-pipeline",
    title: "Real-time Data Pipeline",
    description: "Scalable ETL pipeline processing TB-scale data with Apache Kafka and Spark for real-time analytics.",
    longDescription: "Architected a high-throughput data pipeline capable of processing terabytes of streaming data with sub-second latency.",
    tags: ["Apache Kafka", "Spark", "Airflow", "Cassandra", "Docker", "Kubernetes"],
    metrics: {
      performance: "1M events/sec",
      datasetSize: "5TB processed daily",
      model: "Stream Processing",
    },
    links: {
      github: "https://github.com",
    },
    icon: Database,
    featured: false,
  },
];

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <section id="projects" className="section-spacing bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-display font-bold text-foreground mb-6">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of my latest work in data science, machine learning, and AI engineering.
            Each project demonstrates different aspects of the modern data stack.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            const isHovered = hoveredProject === project.id;
            
            return (
              <Card
                key={project.id}
                className={`project-card glass-card border-2 transition-all duration-300 ${
                  project.featured ? "md:col-span-2 lg:col-span-1" : ""
                } ${isHovered ? "border-primary shadow-glow" : "border-border hover:border-primary/50"}`}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-foreground">
                          {project.title}
                        </CardTitle>
                        {project.featured && (
                          <Badge variant="secondary" className="mt-1">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground mt-3 leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="skill-badge text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Metrics - Show on Hover */}
                  <div className={`transition-all duration-300 ${
                    isHovered ? "opacity-100 max-h-40" : "opacity-0 max-h-0"
                  } overflow-hidden mb-6`}>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      {project.metrics.accuracy && (
                        <div className="text-center">
                          <div className="text-lg font-semibold text-success">
                            {project.metrics.accuracy}
                          </div>
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                        </div>
                      )}
                      {project.metrics.datasetSize && (
                        <div className="text-center">
                          <div className="text-lg font-semibold text-primary">
                            {project.metrics.datasetSize}
                          </div>
                          <div className="text-xs text-muted-foreground">Dataset</div>
                        </div>
                      )}
                      {project.metrics.model && (
                        <div className="text-center col-span-2">
                          <div className="text-sm font-medium text-accent">
                            {project.metrics.model}
                          </div>
                          <div className="text-xs text-muted-foreground">Model Architecture</div>
                        </div>
                      )}
                      {project.metrics.performance && (
                        <div className="text-center col-span-2">
                          <div className="text-sm font-medium text-accent">
                            {project.metrics.performance}
                          </div>
                          <div className="text-xs text-muted-foreground">Performance</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {project.links.github && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {project.links.demo && (
                      <Button
                        size="sm"
                        className="flex-1 bg-primary hover:bg-primary/90"
                        asChild
                      >
                        <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.links.paper && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a href={project.links.paper} target="_blank" rel="noopener noreferrer">
                          Paper
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Projects Button */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View All Projects on GitHub
            <Github className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;