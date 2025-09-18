import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Search,
  Download,
  ExternalLink,
  FileText,
  Video,
  Headphones,
  Star,
  Clock,
  Users,
} from "lucide-react";

interface StudyMaterial {
  id: number;
  title: string;
  type: "pdf" | "video" | "audio" | "link";
  subject: string;
  stream: string;
  rating: number;
  downloads: number;
  duration?: string;
  description: string;
  url: string;
  author: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const studyMaterials: StudyMaterial[] = [
  {
    id: 1,
    title: "Complete Physics Notes - Class 12",
    type: "pdf",
    subject: "Physics",
    stream: "Science",
    rating: 4.8,
    downloads: 12500,
    description:
      "Comprehensive physics notes covering all topics for Class 12 CBSE curriculum",
    url: "https://economics-hub.example.com",
    author: "Dr. Rajesh Kumar",
    difficulty: "Intermediate",
  },
  {
    id: 2,
    title: "Organic Chemistry Video Lectures",
    type: "video",
    subject: "Chemistry",
    stream: "Science",
    rating: 4.9,
    downloads: 8900,
    duration: "12 hours",
    description:
      "Complete video series on organic chemistry with practical examples",
    url: "https://economics-hub.example.com",
    author: "Prof. Meera Sharma",
    difficulty: "Advanced",
  },
  {
    id: 3,
    title: "Business Studies Podcast Series",
    type: "audio",
    subject: "Business Studies",
    stream: "Commerce",
    rating: 4.6,
    downloads: 5600,
    duration: "8 hours",
    description:
      "Audio lectures covering business studies concepts and case studies",
    url: "https://economics-hub.example.com",
    author: "CA Amit Gupta",
    difficulty: "Beginner",
  },
  {
    id: 4,
    title: "English Literature Analysis Guide",
    type: "pdf",
    subject: "English",
    stream: "Arts",
    rating: 4.7,
    downloads: 7800,
    description:
      "In-depth analysis of major literary works and writing techniques",
    url: "https://economics-hub.example.com",
    author: "Prof. Sarah Johnson",
    difficulty: "Intermediate",
  },
  {
    id: 5,
    title: "Mathematics Problem Solving Course",
    type: "video",
    subject: "Mathematics",
    stream: "Science",
    rating: 4.9,
    downloads: 15200,
    duration: "20 hours",
    description: "Step-by-step solutions to complex mathematical problems",
    url: "#https://economics-hub.example.com",
    author: "Dr. Priya Singh",
    difficulty: "Advanced",
  },
  {
    id: 6,
    title: "Economics Online Resource Hub",
    type: "link",
    subject: "Economics",
    stream: "Commerce",
    rating: 4.5,
    downloads: 3400,
    description:
      "Comprehensive online resource with interactive graphs and examples",
    url: "https://economics-hub.example.com",
    author: "Economics Institute",
    difficulty: "Intermediate",
  },
];

export default function StudyMaterials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStream, setSelectedStream] = useState("all");

  const filteredMaterials = studyMaterials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStream =
      selectedStream === "all" ||
      material.stream.toLowerCase() === selectedStream.toLowerCase();
    return matchesSearch && matchesStream;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "audio":
        return <Headphones className="h-5 w-5" />;
      case "link":
        return <ExternalLink className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-primary text-primary-foreground";
      case "video":
        return "bg-secondary text-secondary-foreground";
      case "audio":
        return "bg-accent text-accent-foreground";
      case "link":
        return "bg-muted-foreground text-background";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-success bg-success/10";
      case "Intermediate":
        return "text-warning bg-warning/10";
      case "Advanced":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            Study Materials
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Access curated educational resources for your academic success
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-medium mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by title, subject, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Tabs
              value={selectedStream}
              onValueChange={setSelectedStream}
              className="w-full md:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All Streams</TabsTrigger>
                <TabsTrigger value="science">Science</TabsTrigger>
                <TabsTrigger value="commerce">Commerce</TabsTrigger>
                <TabsTrigger value="arts">Arts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {filteredMaterials.length} materials found
        </h2>
        <p className="text-muted-foreground">
          Showing results for your search criteria
        </p>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <Card
            key={material.id}
            className="shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`p-2 rounded-lg ${getTypeColor(material.type)}`}
                >
                  {getTypeIcon(material.type)}
                </div>
                <Badge className={getDifficultyColor(material.difficulty)}>
                  {material.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg text-foreground leading-tight">
                {material.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{material.stream}</Badge>
                <Badge variant="outline">{material.subject}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">
                {material.description}
              </CardDescription>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-warning" />
                  <span>{material.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{material.downloads.toLocaleString()}</span>
                </div>
                {material.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{material.duration}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  By:{" "}
                  <span className="font-medium text-foreground">
                    {material.author}
                  </span>
                </p>
                <div className="flex gap-2">
                  {material.type === "link" ? (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(material.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Resource
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(material.url, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl text-foreground mb-2">
              No materials found
            </CardTitle>
            <CardDescription>
              Try adjusting your search terms or browse all available materials
            </CardDescription>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedStream("all");
              }}
              className="mt-4"
            >
              Show All Materials
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
