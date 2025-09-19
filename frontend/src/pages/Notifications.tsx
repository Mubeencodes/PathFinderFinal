import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Clock, ExternalLink, GraduationCap, Award, AlertCircle } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  description: string;
  type: 'exam' | 'admission' | 'scholarship' | 'deadline' | 'announcement';
  priority: 'high' | 'medium' | 'low';
  date: string;
  deadline?: string;
  link?: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: "JEE Main 2024 Registration Open",
    description: "Registration for JEE Main 2024 is now open. Last date to apply is December 15, 2024.",
    type: "exam",
    priority: "high",
    date: "2024-11-20",
    deadline: "December 15, 2024",
    link: "https://jeemain.nta.nic.in",
    read: false
  },
  {
    id: 2,
    title: "Delhi University Admission 2024",
    description: "DU admissions for undergraduate courses will begin from January 2025. Prepare your documents.",
    type: "admission",
    priority: "high",
    date: "2024-11-18",
    deadline: "January 31, 2025",
    read: false
  },
  {
    id: 3,
    title: "National Merit Scholarship",
    description: "Applications are now open for the National Merit Scholarship program for 2024-25.",
    type: "scholarship",
    priority: "medium",
    date: "2024-11-15",
    deadline: "December 30, 2024",
    read: true
  },
  {
    id: 4,
    title: "NEET 2024 Exam Pattern Updated",
    description: "NTA has released the updated exam pattern for NEET 2024. Check the new syllabus and marking scheme.",
    type: "announcement",
    priority: "medium",
    date: "2024-11-10",
    read: true
  },
  {
    id: 5,
    title: "IIT Scholarship Program",
    description: "Special scholarship program for economically weaker sections applying to IIT courses.",
    type: "scholarship",
    priority: "low",
    date: "2024-11-05",
    deadline: "January 15, 2025",
    read: true
  }
];

export default function Notifications() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return <AlertCircle className="h-5 w-5" />;
      case 'admission': return <GraduationCap className="h-5 w-5" />;
      case 'scholarship': return <Award className="h-5 w-5" />;
      case 'deadline': return <Clock className="h-5 w-5" />;
      case 'announcement': return <Bell className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'text-destructive bg-destructive/10';
      case 'admission': return 'text-primary bg-primary/10';
      case 'scholarship': return 'text-success bg-success/10';
      case 'deadline': return 'text-warning bg-warning/10';
      case 'announcement': return 'text-secondary bg-secondary/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-destructive bg-destructive/5';
      case 'medium': return 'border-l-warning bg-warning/5';
      case 'low': return 'border-l-success bg-success/5';
      default: return 'border-l-muted';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Bell className="h-8 w-8 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} new</Badge>
          )}
        </div>
        <p className="text-muted-foreground text-lg">
          Stay updated with important deadlines, admissions, and opportunities
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm opacity-90">Exam Updates</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary text-secondary-foreground">
          <CardContent className="p-4 text-center">
            <GraduationCap className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm opacity-90">Admissions</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-accent text-accent-foreground">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm opacity-90">Scholarships</div>
          </CardContent>
        </Card>
        <Card className="border-warning bg-warning/10">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-warning" />
            <div className="text-2xl font-bold text-warning">3</div>
            <div className="text-sm text-warning">Urgent</div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`
              shadow-medium hover:shadow-strong transition-shadow border-l-4 
              ${getPriorityColor(notification.priority)}
              ${!notification.read ? 'ring-2 ring-primary/20' : ''}
            `}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground flex items-center gap-2">
                      {notification.title}
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTypeColor(notification.type)} variant="outline">
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(notification.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={notification.priority === 'high' ? 'destructive' : 
                          notification.priority === 'medium' ? 'secondary' : 'outline'}
                >
                  {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-foreground mb-4 leading-relaxed">
                {notification.description}
              </CardDescription>
              
              {notification.deadline && (
                <div className="flex items-center gap-2 mb-4 p-3 bg-warning/10 rounded-lg">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-warning">
                    Deadline: {notification.deadline}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button size="sm">
                    Mark as Read
                  </Button>
                  {notification.link && (
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Link
                    </Button>
                  )}
                </div>
                <Button size="sm" variant="ghost">
                  Save for Later
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Notifications */}
      {notifications.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl text-foreground mb-2">No notifications</CardTitle>
            <CardDescription>
              You're all caught up! Check back later for new updates.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-foreground">Notification Preferences</CardTitle>
            <CardDescription>
              Customize what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Manage Preferences
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-foreground">Email Digest</CardTitle>
            <CardDescription>
              Get a weekly summary of important updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Subscribe to Digest
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}