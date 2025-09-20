import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { fetchColleges, compareColleges } from "@/lib/api";

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  city: string;
  type: "Government" | "Private";
  stream: string;
  rating: number;
  ug_fee: number;
  pg_fee: number;
  cutoff_requirements?: string;
  courses: string[];
  facilities: string[];
  placement_percentage?: number;
  average_package?: string;
  highest_package?: string;
  intake?: number;
  established_year?: number;
}

// Remove mock data - will be fetched from API

export default function Compare() {
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);
  const [availableToAdd, setAvailableToAdd] = useState<College[]>([]);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch colleges on component mount
  useEffect(() => {
    const fetchCollegesData = async () => {
      try {
        setLoading(true);
        const response = await fetchColleges({ limit: 100 });

        if (response.data.success) {
          setAllColleges(response.data.data);
          setAvailableToAdd(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegesData();
  }, []);

  const addCollege = (collegeId: string) => {
    const college = availableToAdd.find((c) => c.id === collegeId);
    if (college && selectedColleges.length < 3) {
      setSelectedColleges([...selectedColleges, college]);
      setAvailableToAdd(availableToAdd.filter((c) => c.id !== college.id));
    }
  };

  const removeCollege = (collegeId: string) => {
    const college = selectedColleges.find((c) => c.id === collegeId);
    if (college) {
      setSelectedColleges(selectedColleges.filter((c) => c.id !== collegeId));
      setAvailableToAdd([...availableToAdd, college]);
    }
  };

  const comparisonRows = [
    { label: "Type", key: "type" },
    { label: "Stream", key: "stream" },
    { label: "Rating", key: "rating" },
    { label: "UG Fees", key: "ug_fee" },
    { label: "Cutoff Requirements", key: "cutoff_requirements" },
    { label: "Student Intake", key: "intake" },
    { label: "Established", key: "established_year" },
    { label: "Placement %", key: "placement_percentage" },
    { label: "Average Package", key: "average_package" },
    { label: "Highest Package", key: "highest_package" },
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
      case "ug_fee":
        return `₹${college.ug_fee?.toLocaleString()}/year`;
      case "placement_percentage":
        return `${college.placement_percentage || "N/A"}%`;
      case "average_package":
        return college.average_package || "N/A";
      case "highest_package":
        return college.highest_package || "N/A";
      case "intake":
        return college.intake?.toLocaleString() || "N/A";
      case "established_year":
        return college.established_year || "N/A";
      case "cutoff_requirements":
        return college.cutoff_requirements || "N/A";
      case "stream":
        return college.stream;
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

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Add College Section */}
      {!loading && selectedColleges.length < 3 && (
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
                  <SelectItem key={college.id} value={college.id}>
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
                    <span className="text-sm">UG Fees:</span>
                    <span className="text-sm font-medium">
                      ₹{college.ug_fee?.toLocaleString()}/year
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Comparison Table */}
      {!loading && selectedColleges.length >= 2 && (
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
      {!loading && selectedColleges.length === 0 && (
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
      {!loading && selectedColleges.length === 1 && (
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
