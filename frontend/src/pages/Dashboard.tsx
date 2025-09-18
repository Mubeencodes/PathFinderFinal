import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  BookOpen,
  MapPin,
  Calendar,
  Award,
  Target,
  ArrowRight,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { listReports } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { profile } = useAuth();
  // Mock user data
  const user = {
    name: "Alex Student",
    class: "12th Grade",
    stream: "Science",
    completedTests: 3,
    totalTests: 5,
    progress: 60,
  };

  const recommendations = [
    { title: "Computer Science Engineering", match: 95, type: "Degree" },
    { title: "Data Science", match: 88, type: "Career" },
    { title: "Software Developer", match: 85, type: "Job Role" },
  ];

  const upcomingDeadlines = [
    { title: "JEE Main Registration", date: "Dec 15, 2024", type: "Exam" },
    {
      title: "Delhi University Admission",
      date: "Jan 10, 2025",
      type: "College",
    },
    {
      title: "Scholarship Application",
      date: "Dec 20, 2024",
      type: "Scholarship",
    },
  ];

  const recentActivity = [
    { action: "Logged in", time: "just now" },
    { action: "Viewed dashboard", time: "just now" },
  ];

  const [reports, setReports] = useState<
    Array<{ id: string; title: string; content?: string }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const { data } = await listReports();
        setReports(data || []);
      } catch (e: any) {
        setLoadError(e?.response?.data?.msg || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }
    load();

    let channel: any;
    try {
      channel = supabase
        .channel("reports-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "reports" },
          () => load()
        )
        .subscribe();
    } catch {}

    return () => {
      try {
        if (channel) supabase.removeChannel(channel);
      } catch {}
    };
  }, []);

  return (
    <div className="p-6 space-y-6 bg-background min-h-full">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back,{" "}
          {profile?.username || profile?.fullname || profile?.email || "Friend"}
          ! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Here's your personalized career guidance dashboard
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Assessment Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{user.progress}%</div>
            <Progress
              value={user.progress}
              className="mb-2 bg-primary-foreground/20"
            />
            <p className="text-sm opacity-90">
              {user.completedTests} of {user.totalTests} assessments completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-secondary text-secondary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {profile?.username || "—"}
            </div>
            <div className="text-lg opacity-90">{profile?.email || "—"}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10"
            >
              Update Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-accent text-accent-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">3</div>
            <p className="text-sm opacity-90 mb-2">New updates available</p>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10"
            >
              <Link to="/notifications">View All</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommendations */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>
              Based on your assessments and interests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <div className="font-medium text-foreground">{rec.title}</div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {rec.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {rec.match}%
                  </div>
                  <div className="text-xs text-muted-foreground">Match</div>
                </div>
              </div>
            ))}
            <Button asChild className="w-full mt-4">
              <Link to="/roadmap">
                View Career Roadmap <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="h-5 w-5 text-accent" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>
              Important dates you shouldn't miss
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <div className="font-medium text-foreground">
                    {deadline.title}
                  </div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {deadline.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {deadline.date}
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" asChild className="w-full mt-4">
              <Link to="/notifications">
                View All Notifications <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-medium transition-shadow cursor-pointer group">
          <CardHeader className="text-center">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-lg">Study Materials</CardTitle>
            <CardDescription>
              Access curated resources for your stream
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/materials">Browse Materials</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-shadow cursor-pointer group">
          <CardHeader className="text-center">
            <MapPin className="h-12 w-12 text-secondary mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-lg">Find Colleges</CardTitle>
            <CardDescription>Discover colleges near you</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link to="/colleges">Search Colleges</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-shadow cursor-pointer group">
          <CardHeader className="text-center">
            <TrendingUp className="h-12 w-12 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-lg">Career Roadmap</CardTitle>
            <CardDescription>Visualize your career path</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link to="/roadmap">View Roadmap</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
          <CardDescription>Your latest actions on PathFinder</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-foreground">{activity.action}</span>
                <span className="text-sm text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
