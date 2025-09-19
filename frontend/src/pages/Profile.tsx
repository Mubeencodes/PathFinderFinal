import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, MapPin, GraduationCap, BookOpen, Camera, Save } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  class: string;
  stream: string;
  location: string;
  bio: string;
}

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "John Doe",
    email: "john.doe@example.com",
    class: "12th",
    stream: "science",
    location: "Mumbai, Maharashtra",
    bio: "Aspiring engineer passionate about technology and innovation."
  });
  const [editData, setEditData] = useState<ProfileData>(profileData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    toast({
      title: "Profile updated successfully!",
      description: "Your changes have been saved.",
    });
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-strong">
        <CardHeader className="text-center space-y-4">
          <div className="relative mx-auto">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src="/placeholder.svg" alt="Profile" />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Your Profile</CardTitle>
            <p className="text-muted-foreground mt-2">Manage your PathFinder account settings</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md text-foreground">
                  {profileData.name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md text-foreground">
                  {profileData.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Class/Grade
              </Label>
              {isEditing ? (
                <Select value={editData.class} onValueChange={(value) => handleInputChange('class', value)}>
                  <SelectTrigger>
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
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md text-foreground">
                  {profileData.class} Grade
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Stream
              </Label>
              {isEditing ? (
                <Select value={editData.stream} onValueChange={(value) => handleInputChange('stream', value)}>
                  <SelectTrigger>
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
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md text-foreground capitalize">
                  {profileData.stream}
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              {isEditing ? (
                <Input
                  id="location"
                  type="text"
                  value={editData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md text-foreground">
                  {profileData.location}
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">
                Bio
              </Label>
              {isEditing ? (
                <textarea
                  id="bio"
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  value={editData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md text-foreground min-h-[80px]">
                  {profileData.bio}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4 border-t border-border">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}