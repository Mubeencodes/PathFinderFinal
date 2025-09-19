import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, BookOpen, TrendingUp, MapPin, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const features = [
    {
      icon: Brain,
      title: "Aptitude Assessment",
      description:
        "Discover your strengths and interests through our comprehensive quiz",
      href: "/quiz",
      gradient: "bg-gradient-primary",
    },
    {
      icon: TrendingUp,
      title: "Career Roadmap",
      description: "Visualize your path from current stream to dream career",
      href: "/roadmap",
      gradient: "bg-gradient-secondary",
    },
    {
      icon: MapPin,
      title: "Find Colleges",
      description:
        "Locate the best colleges near you with detailed information",
      href: "/colleges",
      gradient: "bg-gradient-accent",
    },
    {
      icon: BookOpen,
      title: "Study Materials",
      description: "Access curated resources for your chosen stream",
      href: "/materials",
      gradient: "bg-gradient-primary",
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-full bg-background">
        <section className="relative overflow-hidden bg-gradient-hero py-24 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
                Find Your Perfect
                <span className="block bg-gradient-to-r from-accent-foreground to-secondary-foreground bg-clip-text text-transparent">
                  Career Path
                </span>
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Start your journey with PathFinder. Create an account or sign in
                to continue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  asChild
                  className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow px-8 py-3 text-lg font-semibold"
                >
                  <Link to="/login">
                    Sign In <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-3 text-lg"
                >
                  <Link to="/signup">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-accent-foreground to-secondary-foreground bg-clip-text text-transparent">
                Career Path
              </span>
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              PathFinder helps students discover their ideal career through
              personalized assessments, comprehensive roadmaps, and curated
              resources. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                asChild
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow px-8 py-3 text-lg font-semibold"
              >
                <Link to="/quiz">
                  Take Aptitude Quiz <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-3 text-lg"
              >
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and resources to
              guide you from uncertainty to a clear career path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-border/50"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 ${feature.gradient} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <Button
                    variant="outline"
                    asChild
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  >
                    <Link to={feature.href}>
                      Explore <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">0</div>
              <div className="text-muted-foreground">Students Guided</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">0</div>
              <div className="text-muted-foreground">Partner Colleges</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">67%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
