import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  GraduationCap,
  Briefcase,
  Star,
  Clock,
  ChevronRight,
  BarChart3,
  PieChart,
  Target,
  Users,
  DollarSign,
  Award,
  BookOpen,
  Zap,
  Activity,
  TrendingDown,
} from "lucide-react";
import { useState } from "react";

interface CareerPath {
  id: string;
  stream: string;
  degree: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  growthRate: number;
  jobSatisfaction: number;
  avgSalary: number;
  marketSize: number;
  jobs: {
    title: string;
    salary: string;
    demand: "High" | "Medium" | "Low";
    skills: string[];
    growth: number;
    satisfaction: number;
    marketShare: number;
  }[];
}

const careerPaths: CareerPath[] = [
  {
    id: "1",
    stream: "Science - PCM",
    degree: "Computer Science Engineering",
    duration: "4 years",
    difficulty: "Hard",
    growthRate: 85,
    jobSatisfaction: 78,
    avgSalary: 18,
    marketSize: 45,
    jobs: [
      {
        title: "Software Developer",
        salary: "₹8-25 LPA",
        demand: "High",
        skills: ["Programming", "Problem Solving", "Team Work"],
        growth: 90,
        satisfaction: 82,
        marketShare: 35,
      },
      {
        title: "Data Scientist",
        salary: "₹12-35 LPA",
        demand: "High",
        skills: ["Python", "Machine Learning", "Statistics"],
        growth: 95,
        satisfaction: 85,
        marketShare: 25,
      },
      {
        title: "DevOps Engineer",
        salary: "₹10-30 LPA",
        demand: "High",
        skills: ["Cloud Computing", "Automation", "System Administration"],
        growth: 88,
        satisfaction: 80,
        marketShare: 20,
      },
    ],
  },
  {
    id: "2",
    stream: "Commerce",
    degree: "Bachelor of Commerce",
    duration: "3 years",
    difficulty: "Medium",
    growthRate: 72,
    jobSatisfaction: 75,
    avgSalary: 12,
    marketSize: 30,
    jobs: [
      {
        title: "Chartered Accountant",
        salary: "₹6-20 LPA",
        demand: "High",
        skills: ["Accounting", "Taxation", "Financial Analysis"],
        growth: 80,
        satisfaction: 78,
        marketShare: 40,
      },
      {
        title: "Financial Analyst",
        salary: "₹5-15 LPA",
        demand: "Medium",
        skills: ["Excel", "Financial Modeling", "Market Analysis"],
        growth: 65,
        satisfaction: 72,
        marketShare: 30,
      },
      {
        title: "Business Analyst",
        salary: "₹7-18 LPA",
        demand: "High",
        skills: ["Business Intelligence", "SQL", "Communication"],
        growth: 75,
        satisfaction: 76,
        marketShare: 30,
      },
    ],
  },
  {
    id: "3",
    stream: "Arts - Humanities",
    degree: "Bachelor of Arts",
    duration: "3 years",
    difficulty: "Easy",
    growthRate: 68,
    jobSatisfaction: 82,
    avgSalary: 8,
    marketSize: 25,
    jobs: [
      {
        title: "Content Writer",
        salary: "₹3-12 LPA",
        demand: "Medium",
        skills: ["Writing", "Research", "SEO"],
        growth: 70,
        satisfaction: 85,
        marketShare: 35,
      },
      {
        title: "UX Designer",
        salary: "₹6-20 LPA",
        demand: "High",
        skills: ["Design Thinking", "Prototyping", "User Research"],
        growth: 85,
        satisfaction: 88,
        marketShare: 30,
      },
      {
        title: "Digital Marketer",
        salary: "₹4-15 LPA",
        demand: "High",
        skills: ["Social Media", "Analytics", "Campaign Management"],
        growth: 80,
        satisfaction: 83,
        marketShare: 35,
      },
    ],
  },
];

export default function CareerRoadmap() {
  const [selectedStream, setSelectedStream] = useState("all");

  const filteredPaths =
    selectedStream === "all"
      ? careerPaths
      : careerPaths.filter((path) =>
          path.stream.toLowerCase().includes(selectedStream.toLowerCase())
        );

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "High":
        return "text-success bg-success/10";
      case "Medium":
        return "text-warning bg-warning/10";
      case "Low":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-success bg-success/10";
      case "Medium":
        return "text-warning bg-warning/10";
      case "Hard":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  // Simple Bar Chart Component
  const BarChart = ({
    data,
    title,
    color = "bg-primary",
  }: {
    data: { label: string; value: number }[];
    title: string;
    color?: string;
  }) => {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">
                  {item.value}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`${color} h-2 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Simple Pie Chart Component
  const PieChart = ({
    data,
    title,
  }: {
    data: { label: string; value: number; color: string }[];
    title: string;
  }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground text-sm">{title}</h4>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = -cumulativePercentage;
                cumulativePercentage += percentage;

                return (
                  <circle
                    key={index}
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="2"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                );
              })}
            </svg>
          </div>
          <div className="space-y-1">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Career Roadmap</h1>
        </div>
        <p className="text-muted-foreground text-lg mb-6">
          Explore career paths from your stream to your dream job
        </p>

        {/* Statistics Overview with Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Market Overview */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                Market Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { label: "Science", value: 45 },
                  { label: "Commerce", value: 30 },
                  { label: "Arts", value: 25 },
                ]}
                title="Market Size (%)"
                color="bg-primary"
              />
            </CardContent>
          </Card>

          {/* Growth Trends */}
          <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-success" />
                Growth Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={[
                  { label: "Science", value: 85 },
                  { label: "Commerce", value: 72 },
                  { label: "Arts", value: 68 },
                ]}
                title="Growth Rate (%)"
                color="bg-success"
              />
            </CardContent>
          </Card>

          {/* Salary Distribution */}
          <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-accent" />
                Salary Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={[
                  { label: "Science", value: 18, color: "stroke-accent" },
                  { label: "Commerce", value: 12, color: "stroke-warning" },
                  { label: "Arts", value: 8, color: "stroke-muted-foreground" },
                ]}
                title="Avg. Salary (LPA)"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="shadow-medium mb-8">
        <CardHeader>
          <CardTitle>Filter by Stream</CardTitle>
          <CardDescription>
            Select a stream to see relevant career paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedStream} onValueChange={setSelectedStream}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Select Stream" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Streams</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="commerce">Commerce</SelectItem>
              <SelectItem value="arts">Arts & Humanities</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Career Paths */}
      <div className="space-y-8">
        {filteredPaths.map((path) => (
          <Card
            key={path.id}
            className="shadow-strong border-l-4 border-l-primary"
          >
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl text-foreground flex items-center gap-3">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    {path.degree}
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    <Badge variant="outline" className="mr-2">
                      {path.stream}
                    </Badge>
                    <Badge className={getDifficultyColor(path.difficulty)}>
                      {path.difficulty}
                    </Badge>
                    <span className="text-muted-foreground ml-2">
                      Duration: {path.duration}
                    </span>
                  </CardDescription>

                  {/* Visual Metrics */}
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-foreground">
                          {path.growthRate}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Growth</p>
                      <Progress value={path.growthRate} className="h-2 mt-1" />
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-warning" />
                        <span className="text-sm font-medium text-foreground">
                          {path.jobSatisfaction}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Satisfaction
                      </p>
                      <Progress
                        value={path.jobSatisfaction}
                        className="h-2 mt-1"
                      />
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <DollarSign className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-foreground">
                          ₹{path.avgSalary}L
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Avg. Salary
                      </p>
                      <Progress
                        value={(path.avgSalary / 25) * 100}
                        className="h-2 mt-1"
                      />
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium text-foreground">
                          {path.marketSize}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Market Size
                      </p>
                      <Progress value={path.marketSize} className="h-2 mt-1" />
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="ml-4">
                  View Colleges
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-secondary" />
                  Career Opportunities
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {path.jobs.map((job, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-medium transition-all duration-300 border border-border/50 hover:border-primary/30 group"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getDemandColor(job.demand)}>
                          {job.demand} Demand
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                      </div>

                      {/* Job Metrics with Mini Graphs */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">
                                Growth
                              </span>
                              <span className="text-xs font-medium text-foreground">
                                {job.growth}%
                              </span>
                            </div>
                            <Progress value={job.growth} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">
                                Satisfaction
                              </span>
                              <span className="text-xs font-medium text-foreground">
                                {job.satisfaction}%
                              </span>
                            </div>
                            <Progress
                              value={job.satisfaction}
                              className="h-2"
                            />
                          </div>
                        </div>

                        {/* Market Share Mini Pie Chart */}
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 relative">
                            <svg
                              className="w-8 h-8 transform -rotate-90"
                              viewBox="0 0 16 16"
                            >
                              <circle
                                cx="8"
                                cy="8"
                                r="6"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="2"
                              />
                              <circle
                                cx="8"
                                cy="8"
                                r="6"
                                fill="none"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2"
                                strokeDasharray={`${job.marketShare} ${
                                  100 - job.marketShare
                                }`}
                                strokeDashoffset="0"
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">
                              Market Share:{" "}
                            </span>
                            <span className="font-medium text-foreground">
                              {job.marketShare}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-sm font-medium text-foreground mb-2 block flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          Key Skills Required:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {job.skills.map((skill, skillIndex) => (
                            <Badge
                              key={skillIndex}
                              variant="secondary"
                              className="text-xs hover:bg-secondary/80 transition-colors"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Enhanced Roadmap Timeline with Visual Progress */}
              <div className="mt-8 p-6 bg-gradient-to-br from-muted/50 to-muted rounded-xl border border-border/50">
                <h4 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Your Career Journey Timeline
                </h4>

                {/* Timeline with connecting lines */}
                <div className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Step 1 */}
                    <div className="relative text-center group">
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <GraduationCap className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="text-sm font-semibold text-foreground mb-1">
                          Complete 12th Grade
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Current Stage
                        </div>
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      </div>
                      {/* Connecting line */}
                      <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-secondary z-0"></div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative text-center group">
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-secondary rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <BookOpen className="h-6 w-6 text-secondary-foreground" />
                        </div>
                        <div className="text-sm font-semibold text-foreground mb-1">
                          Entrance Exams
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Next 6 months
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Upcoming
                        </Badge>
                      </div>
                      <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-secondary to-accent z-0"></div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative text-center group">
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-accent rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-6 w-6 text-accent-foreground" />
                        </div>
                        <div className="text-sm font-semibold text-foreground mb-1">
                          College Admission
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          1 year
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Future
                        </Badge>
                      </div>
                      <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-accent to-muted-foreground z-0"></div>
                    </div>

                    {/* Step 4 */}
                    <div className="relative text-center group">
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-muted-foreground rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Award className="h-6 w-6 text-background" />
                        </div>
                        <div className="text-sm font-semibold text-foreground mb-1">
                          Career Start
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {parseInt(path.duration) + 1} years
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Goal
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Overall Progress
                      </span>
                      <span className="text-sm text-muted-foreground">
                        25% Complete
                      </span>
                    </div>
                    <Progress value={25} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>12th Grade</span>
                      <span>Entrance</span>
                      <span>College</span>
                      <span>Career</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPaths.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl text-foreground mb-2">
              No career paths found
            </CardTitle>
            <CardDescription>
              Try selecting a different stream or view all available paths
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
