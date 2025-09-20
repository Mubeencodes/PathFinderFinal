import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Search,
  Star,
  GraduationCap,
  Users,
  Phone,
  Globe,
  Clock,
  Loader2,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchColleges, fetchFilterOptions } from "@/lib/api";

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  city: string;
  rating: number;
  type: "Government" | "Private";
  stream: string;
  courses: string[];
  ug_fee: number;
  pg_fee: number;
  contact_phone?: string;
  website?: string;
  facilities: string[];
  established_year?: number;
  intake?: number;
  cutoff_requirements?: string;
  admission_deadline?: string;
  placement_percentage?: number;
  average_package?: string;
  highest_package?: string;
  latitude?: number;
  longitude?: number;
}

interface FilterOptions {
  streams: string[];
  types: string[];
  states: string[];
  cities: string[];
}

export default function Colleges() {
  const [searchLocation, setSearchLocation] = useState("");
  const [streamFilter, setStreamFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    streams: [],
    types: [],
    states: [],
    cities: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null
  );
  const [geoError, setGeoError] = useState<string | null>(null);

  // Fix Leaflet marker icons in bundlers
  // @ts-ignore
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  // Fetch colleges and filter options on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [collegesResponse, filterOptionsResponse] = await Promise.all([
          fetchColleges({ limit: 100 }),
          fetchFilterOptions(),
        ]);

        if (collegesResponse.data.success) {
          setColleges(collegesResponse.data.data);
          setFilteredColleges(collegesResponse.data.data);
        }

        if (filterOptionsResponse.data.success) {
          setFilterOptions(filterOptionsResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => setGeoError(err.message || "Unable to get your location"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      const params: any = {
        limit: 100,
        sort_by: "rating",
        sort_order: "desc",
      };

      if (searchLocation && searchLocation.trim()) {
        params.search = searchLocation.trim();
      }

      if (streamFilter !== "all") {
        // Use the original case from filterOptions
        const originalStream = filterOptions.streams.find(
          (s) => s.toLowerCase() === streamFilter
        );
        params.stream = originalStream || streamFilter;
      }

      if (typeFilter !== "all") {
        // Use the original case from filterOptions
        const originalType = filterOptions.types.find(
          (t) => t.toLowerCase() === typeFilter
        );
        params.type = originalType || typeFilter;
      }

      if (stateFilter !== "all") {
        params.state = stateFilter;
      }

      if (cityFilter !== "all") {
        params.city = cityFilter;
      }

      console.log("Search params:", params); // Debug log

      const response = await fetchColleges(params);

      if (response.data.success) {
        setFilteredColleges(response.data.data);
        console.log(
          "Search results:",
          response.data.data.length,
          "colleges found"
        );
      } else {
        console.error("Search failed:", response.data.error);
        setFilteredColleges([]);
      }
    } catch (error) {
      console.error("Error searching colleges:", error);
      setFilteredColleges([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Auto-search when filters change
  useEffect(() => {
    if (!loading && filterOptions.streams.length > 0) {
      handleSearch();
    }
  }, [streamFilter, typeFilter, stateFilter, cityFilter]);

  // Initial load - show all colleges when no filters are applied
  useEffect(() => {
    if (
      !loading &&
      filterOptions.streams.length > 0 &&
      streamFilter === "all" &&
      typeFilter === "all" &&
      stateFilter === "all" &&
      cityFilter === "all" &&
      !searchLocation
    ) {
      setFilteredColleges(colleges);
    }
  }, [
    loading,
    filterOptions,
    colleges,
    streamFilter,
    typeFilter,
    stateFilter,
    cityFilter,
    searchLocation,
  ]);

  // Debounced search for text input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!loading && filterOptions.streams.length > 0) {
        handleSearch();
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchLocation]);

  // Reset filters
  const handleReset = () => {
    setSearchLocation("");
    setStreamFilter("all");
    setTypeFilter("all");
    setStateFilter("all");
    setCityFilter("all");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative z-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            Find Colleges Near You
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Discover the best colleges in your area with detailed information and
          requirements
        </p>
      </div>

      {/* User Location Map */}
      <Card className="shadow-medium mb-8">
        <CardHeader>
          <CardTitle className="text-foreground">Your Location</CardTitle>
          <CardDescription>
            {userPosition
              ? "Showing your current location on the map"
              : geoError || "Requesting location..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[420px] w-full rounded-md overflow-hidden relative z-0 isolate">
            <MapContainer
              // @ts-ignore
              center={userPosition || [20.5937, 78.9629]}
              zoom={userPosition ? 13 : 5}
              scrollWheelZoom={true}
              style={{
                height: "100%",
                width: "100%",
                zIndex: 0,
                position: "relative",
              }}
              className="map-container z-0"
            >
              <TileLayer
                // @ts-ignore
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {userPosition && (
                <Marker position={userPosition}>
                  <Popup>You are here</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Section */}
      <Card className="shadow-medium mb-8 relative z-20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Colleges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Enter college name, location, or state..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="lg:col-span-1"
            />
            <Select value={streamFilter} onValueChange={setStreamFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select Stream" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Streams</SelectItem>
                {filterOptions.streams.map((stream) => (
                  <SelectItem key={stream} value={stream.toLowerCase()}>
                    {stream}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="College Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {filterOptions.types.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {filterOptions.states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {filterOptions.cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              className="flex-1 md:flex-none"
              disabled={searchLoading}
            >
              {searchLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {searchLoading ? "Searching..." : "Search Colleges"}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1 md:flex-none"
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {(searchLocation ||
        streamFilter !== "all" ||
        typeFilter !== "all" ||
        stateFilter !== "all" ||
        cityFilter !== "all") && (
        <Card className="mb-6 relative z-20">
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-foreground">
                Active filters:
              </span>
              {searchLocation && (
                <Badge variant="secondary" className="text-xs">
                  Search: {searchLocation}
                </Badge>
              )}
              {streamFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Stream: {streamFilter}
                </Badge>
              )}
              {typeFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Type: {typeFilter}
                </Badge>
              )}
              {stateFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  State: {stateFilter}
                </Badge>
              )}
              {cityFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  City: {cityFilter}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {loading
            ? "Loading colleges..."
            : `Found ${filteredColleges.length} colleges`}
        </h2>
        <p className="text-muted-foreground">
          {loading
            ? "Please wait while we fetch the data"
            : "Based on your search criteria"}
        </p>
      </div>

      {/* Loading State */}
      {(loading || searchLoading) && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            {loading ? "Loading colleges..." : "Searching..."}
          </span>
        </div>
      )}

      {/* College List */}
      {!loading && !searchLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-20">
          {filteredColleges.map((college) => (
            <Card
              key={college.id}
              className="shadow-medium hover:shadow-strong transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl text-foreground leading-tight">
                    {college.name}
                  </CardTitle>
                  <Badge
                    variant={
                      college.type === "Government" ? "default" : "secondary"
                    }
                  >
                    {college.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {college.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📊 {college.stream}</span>
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
                    <span className="font-medium text-foreground">
                      Courses Offered:
                    </span>
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
                      <span className="font-medium text-foreground">
                        UG Fees:
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ₹{college.ug_fee?.toLocaleString()}/year
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-accent" />
                      <span className="font-medium text-foreground">
                        Established:
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {college.established_year || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <span className="font-medium text-foreground mb-2 block">
                    Key Facilities:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {college.facilities.map((facility, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {college.contact_phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {college.contact_phone}
                      </div>
                    )}
                    {college.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <span className="truncate">{college.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button className="flex-1">Apply Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !searchLoading && filteredColleges.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl text-foreground mb-2">
              No colleges found
            </CardTitle>
            <CardDescription>
              Try adjusting your search criteria, expanding your location range,
              or clearing some filters
            </CardDescription>
            <Button onClick={handleReset} className="mt-4">
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
