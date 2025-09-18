import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  MapPin,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  class: string;
  stream: string;
  location: string;
}

export default function Signup() {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    class: "",
    stream: "",
    location: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.class) {
      newErrors.class = "Please select your class";
    }

    if (!formData.stream) {
      newErrors.stream = "Please select your stream";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await signUp({
          username: formData.name,
          email: formData.email,
          password: formData.password,
        });
        toast({
          title: "Account created successfully!",
          description: "Welcome to PathFinder.",
        });
        navigate("/quiz", { replace: true });
      } catch (err: any) {
        toast({
          title: "Signup failed",
          description: err?.response?.data?.msg || "Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-strong">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <UserPlus className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Join PathFinder
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Create your account to start your career journey
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Class/Grade
                </Label>
                <Select
                  value={formData.class}
                  onValueChange={(value) => handleInputChange("class", value)}
                >
                  <SelectTrigger
                    className={errors.class ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8th">8th Grade</SelectItem>
                    <SelectItem value="9th">9th Grade</SelectItem>
                    <SelectItem value="10th">10th Grade</SelectItem>
                    <SelectItem value="11th">11th Grade</SelectItem>
                    <SelectItem value="12th">12th Grade</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="postgraduate">Post Graduate</SelectItem>
                  </SelectContent>
                </Select>
                {errors.class && (
                  <p className="text-sm text-destructive">{errors.class}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Stream
                </Label>
                <Select
                  value={formData.stream}
                  onValueChange={(value) => handleInputChange("stream", value)}
                >
                  <SelectTrigger
                    className={errors.stream ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="arts">Arts/Humanities</SelectItem>
                    <SelectItem value="vocational">Vocational</SelectItem>
                    <SelectItem value="undecided">Undecided</SelectItem>
                  </SelectContent>
                </Select>
                {errors.stream && (
                  <p className="text-sm text-destructive">{errors.stream}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location (City, State)
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter your location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={errors.location ? "border-destructive" : ""}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
