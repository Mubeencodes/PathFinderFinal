import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Plus,
  X,
  Star,
  MapPin,
  GraduationCap,
  Users,
  DollarSign,
} from "lucide-react";

interface College {
  id: number;
  name: string;
  location: string;
  type: "Government" | "Private";
  rating: number;
  fees: string;
  cutoff: string;
  distance: string;
  courses: string[];
  facilities: string[];
  placements: {
    percentage: number;
    averagePackage: string;
    topPackage: string;
  };
  intake: number;
  established: number;
}

const availableColleges: College[] = [
  {
    id: 1,
    name: "IIT Delhi",
    location: "New Delhi, Delhi",
    type: "Government",
    rating: 4.9,
    fees: "₹2,50,000/year",
    cutoff: "JEE Advanced - 150+",
    distance: "8.1 km",
    courses: ["B.Tech CSE", "B.Tech EE", "B.Tech ME"],
    facilities: [
      "Research Labs",
      "Hostel",
      "Sports Complex",
      "Medical Center",
      "Library",
    ],
    placements: {
      percentage: 95,
      averagePackage: "₹17 LPA",
      topPackage: "₹1.2 Cr",
    },
    intake: 1000,
    established: 1961,
  },
  {
    id: 2,
    name: "Delhi University - SRCC",
    location: "New Delhi, Delhi",
    type: "Government",
    rating: 4.7,
    fees: "₹25,000/year",
    cutoff: "98%+ in Class 12",
    distance: "5.2 km",
    courses: ["B.Com Hons", "B.A. Economics", "B.Sc. Statistics"],
    facilities: ["Library", "Sports Complex", "Auditorium", "Canteen", "Wi-Fi"],
    placements: {
      percentage: 90,
      averagePackage: "₹8 LPA",
      topPackage: "₹25 LPA",
    },
    intake: 600,
    established: 1926,
  },
  {
    id: 3,
    name: "Amity University",
    location: "Noida, UP",
    type: "Private",
    rating: 4.2,
    fees: "₹3,50,000/year",
    cutoff: "75%+ in Class 12",
    distance: "12.5 km",
    courses: ["B.Tech", "BBA", "B.Com", "BA"],
    facilities: [
      "Modern Campus",
      "Industry Partnerships",
      "Placement Cell",
      "International Programs",
      "Hostels",
    ],
    placements: {
      percentage: 85,
      averagePackage: "₹6 LPA",
      topPackage: "₹15 LPA",
    },
    intake: 2000,
    established: 2005,
  },
  {
    id: 4,
    name: "Jamia Millia Islamia",
    location: "New Delhi, Delhi",
    type: "Government",
    rating: 4.5,
    fees: "₹25,000/year",
    cutoff: "85%+ in Class 12",
    distance: "7.8 km",
    courses: ["B.A.", "B.Sc.", "B.Tech", "B.Arch"],
    facilities: [
      "Central Library",
      "Hostels",
      "Medical Center",
      "Sports Facilities",
      "Mosque",
    ],
    placements: {
      percentage: 80,
      averagePackage: "₹5 LPA",
      topPackage: "₹12 LPA",
    },
    intake: 1500,
    established: 1920,
  },
];

export default function Compare() {
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);
  const [availableToAdd, setAvailableToAdd] = useState(availableColleges);

  const addCollege = (collegeId: string) => {
    const college = availableToAdd.find((c) => c.id.toString() === collegeId);
    if (college && selectedColleges.length < 3) {
      setSelectedColleges([...selectedColleges, college]);
      setAvailableToAdd(availableToAdd.filter((c) => c.id !== college.id));
    }
  };

  const removeCollege = (collegeId: number) => {
    const college = selectedColleges.find((c) => c.id === collegeId);
    if (college) {
      setSelectedColleges(selectedColleges.filter((c) => c.id !== collegeId));
      setAvailableToAdd([...availableToAdd, college]);
    }
  };

  const comparisonRows = [
    { label: "Type", key: "type" },
    { label: "Rating", key: "rating" },
    { label: "Annual Fees", key: "fees" },
    { label: "Cutoff Requirements", key: "cutoff" },
    { label: "Distance from you", key: "distance" },
    { label: "Student Intake", key: "intake" },
    { label: "Established", key: "established" },
    { label: "Placement %", key: "placementPercentage" },
    { label: "Average Package", key: "averagePackage" },
    { label: "Highest Package", key: "topPackage" },
  ];

  const getComparisonValue = (college: College, key: string) => {
    switch (key) {
      case "type":
        return (
          <Badge
            variant={college.type === "Government" ? "default" : "secondary"}
          >
            {college.type}
          </Badge>
        );
      case "rating":
        return (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-warning" />
            <span>{college.rating}</span>
          </div>
        );
      case "placementPercentage":
        return `${college.placements.percentage}%`;
      case "averagePackage":
        return college.placements.averagePackage;
      case "topPackage":
        return college.placements.topPackage;
      case "intake":
        return college.intake.toLocaleString();
      default:
        return college[key as keyof College] as React.ReactNode;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            Compare Colleges
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Compare colleges side-by-side to make an informed decision
        </p>
      </div>

      {/* Add College Section */}
      {selectedColleges.length < 3 && (
        <Card className="shadow-medium mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add College to Compare
            </CardTitle>
            <CardDescription>
              You can compare up to 3 colleges at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={addCollege}>
              <SelectTrigger>
                <SelectValue placeholder="Select a college to add" />
              </SelectTrigger>
              <SelectContent>
                {availableToAdd.map((college) => (
                  <SelectItem key={college.id} value={college.id.toString()}>
                    {college.name} - {college.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Selected Colleges Preview */}
      {selectedColleges.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {selectedColleges.map((college) => (
            <Card key={college.id} className="shadow-medium">
              <CardHeader className="relative">
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => removeCollege(college.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardTitle className="text-lg pr-8">{college.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {college.location}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Type:</span>
                    <Badge
                      variant={
                        college.type === "Government" ? "default" : "secondary"
                      }
                    >
                      {college.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-warning" />
                      <span>{college.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fees:</span>
                    <span className="text-sm font-medium">{college.fees}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Comparison Table */}
      {selectedColleges.length >= 2 && (
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">
              Detailed Comparison
            </CardTitle>
            <CardDescription>
              Side-by-side comparison of your selected colleges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-foreground min-w-[150px]">
                      Criteria
                    </th>
                    {selectedColleges.map((college) => (
                      <th
                        key={college.id}
                        className="text-left p-3 font-semibold text-foreground min-w-[200px]"
                      >
                        <div>
                          <div className="font-medium">{college.name}</div>
                          <div className="text-sm text-muted-foreground font-normal">
                            {college.location}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <tr
                      key={row.key}
                      className={index % 2 === 0 ? "bg-muted/30" : ""}
                    >
                      <td className="p-3 font-medium text-foreground border-r border-border">
                        {row.label}
                      </td>
                      {selectedColleges.map((college) => (
                        <td key={college.id} className="p-3 text-foreground">
                          {getComparisonValue(college, row.key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-muted/50">
                    <td className="p-3 font-medium text-foreground border-r border-border">
                      Courses Offered
                    </td>
                    {selectedColleges.map((college) => (
                      <td key={college.id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {college.courses.slice(0, 3).map((course, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {course}
                            </Badge>
                          ))}
                          {college.courses.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{college.courses.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground border-r border-border">
                      Key Facilities
                    </td>
                    {selectedColleges.map((college) => (
                      <td key={college.id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {college.facilities
                            .slice(0, 3)
                            .map((facility, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {facility}
                              </Badge>
                            ))}
                          {college.facilities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{college.facilities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Colleges Selected */}
      {selectedColleges.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl text-foreground mb-2">
              No colleges selected
            </CardTitle>
            <CardDescription>
              Add at least 2 colleges to start comparing them side-by-side
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {/* Single College Selected */}
      {selectedColleges.length === 1 && (
        <Card className="text-center py-12 bg-primary/5">
          <CardContent>
            <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-xl text-foreground mb-2">
              Add one more college
            </CardTitle>
            <CardDescription>
              You need at least 2 colleges to make a meaningful comparison
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
