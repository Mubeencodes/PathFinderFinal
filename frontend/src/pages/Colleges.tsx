import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Star, GraduationCap, Users, Phone, Globe, Clock } from "lucide-react";

interface College {
  id: number;
  name: string;
  location: string;
  distance: string;
  rating: number;
  type: 'Government' | 'Private';
  courses: string[];
  fees: string;
  admissionDeadline: string;
  contact: {
    phone: string;
    website: string;
  };
  facilities: string[];
}

const mockColleges: College[] = [
  {
    id: 1,
    name: "Delhi University - Miranda House",
    location: "New Delhi, Delhi",
    distance: "5.2 km",
    rating: 4.8,
    type: "Government",
    courses: ["B.A. Hons", "B.Sc. Hons", "B.Com Hons"],
    fees: "₹15,000/year",
    admissionDeadline: "June 30, 2024",
    contact: {
      phone: "+91-11-2766-7000",
      website: "www.mirandahouse.ac.in"
    },
    facilities: ["Library", "Hostel", "Sports Complex", "Wi-Fi"]
  },
  {
    id: 2,
    name: "Indian Institute of Technology Delhi",
    location: "Hauz Khas, New Delhi",
    distance: "8.1 km",
    rating: 4.9,
    type: "Government",
    courses: ["B.Tech", "M.Tech", "PhD"],
    fees: "₹2,50,000/year",
    admissionDeadline: "June 15, 2024",
    contact: {
      phone: "+91-11-2659-1000",
      website: "www.iitd.ac.in"
    },
    facilities: ["Research Labs", "Hostel", "Sports Complex", "Medical Center"]
  },
  {
    id: 3,
    name: "Amity University",
    location: "Sector 125, Noida",
    distance: "12.5 km",
    rating: 4.2,
    type: "Private",
    courses: ["B.Tech", "BBA", "B.Com", "BA"],
    fees: "₹3,50,000/year",
    admissionDeadline: "July 15, 2024",
    contact: {
      phone: "+91-120-4392-500",
      website: "www.amity.edu"
    },
    facilities: ["Modern Campus", "Industry Partnerships", "Placement Cell", "International Programs"]
  },
  {
    id: 4,
    name: "Jamia Millia Islamia",
    location: "New Delhi, Delhi",
    distance: "7.8 km",
    rating: 4.5,
    type: "Government",
    courses: ["B.A.", "B.Sc.", "B.Tech", "B.Arch"],
    fees: "₹25,000/year",
    admissionDeadline: "June 25, 2024",
    contact: {
      phone: "+91-11-2698-1717",
      website: "www.jmi.ac.in"
    },
    facilities: ["Central Library", "Hostels", "Medical Center", "Sports Facilities"]
  }
];

export default function Colleges() {
  const [searchLocation, setSearchLocation] = useState("");
  const [streamFilter, setStreamFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [filteredColleges, setFilteredColleges] = useState(mockColleges);

  const handleSearch = () => {
    let filtered = mockColleges;

    if (searchLocation) {
      filtered = filtered.filter(college => 
        college.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    if (streamFilter !== "all") {
      filtered = filtered.filter(college => 
        college.courses.some(course => 
          course.toLowerCase().includes(streamFilter.toLowerCase())
        )
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(college => 
        college.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    setFilteredColleges(filtered);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Find Colleges Near You</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Discover the best colleges in your area with detailed information and requirements
        </p>
      </div>

      {/* Search and Filter Section */}
      <Card className="shadow-medium mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Colleges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Enter your location or pincode..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="md:col-span-2"
            />
            <Select value={streamFilter} onValueChange={setStreamFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select Stream" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Streams</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="arts">Arts</SelectItem>
                <SelectItem value="commerce">Commerce</SelectItem>
                <SelectItem value="science">Science</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="College Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSearch} className="w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Search Colleges
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Found {filteredColleges.length} colleges
        </h2>
        <p className="text-muted-foreground">
          Based on your search criteria
        </p>
      </div>

      {/* College List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredColleges.map((college) => (
          <Card key={college.id} className="shadow-medium hover:shadow-strong transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-xl text-foreground leading-tight">
                  {college.name}
                </CardTitle>
                <Badge variant={college.type === 'Government' ? 'default' : 'secondary'}>
                  {college.type}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {college.location}
                </div>
                <div className="flex items-center gap-1">
                  <span>📍 {college.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-warning" />
                  {college.rating}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Courses */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Courses Offered:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {college.courses.map((course, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {course}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Fees and Deadline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-secondary" />
                    <span className="font-medium text-foreground">Fees:</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{college.fees}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-accent" />
                    <span className="font-medium text-foreground">Deadline:</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{college.admissionDeadline}</p>
                </div>
              </div>

              {/* Facilities */}
              <div>
                <span className="font-medium text-foreground mb-2 block">Key Facilities:</span>
                <div className="flex flex-wrap gap-2">
                  {college.facilities.map((facility, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {college.contact.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">{college.contact.website}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1">
                  View Details
                </Button>
                <Button className="flex-1">
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredColleges.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl text-foreground mb-2">No colleges found</CardTitle>
            <CardDescription>
              Try adjusting your search criteria or expanding your location range
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}