import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  FileQuestion,
  TrendingUp,
  MapPin,
  Bell,
  BookOpen,
  MessageCircle,
  BarChart3,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Aptitude Quiz", url: "/quiz", icon: FileQuestion },
  { title: "Career Roadmap", url: "/roadmap", icon: TrendingUp },
  { title: "Find Colleges", url: "/colleges", icon: MapPin },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Study Materials", url: "/materials", icon: BookOpen },
  { title: "AI Assistant", url: "/chat", icon: MessageCircle },
  { title: "Compare Colleges", url: "/compare", icon: BarChart3 },
];

const accountItemsAuthed = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Logout", url: "/logout", icon: User },
];

const accountItemsGuest = [
  { title: "Login", url: "/login", icon: User },
  { title: "Signup", url: "/signup", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path)
      ? "bg-primary text-primary-foreground shadow-medium"
      : "hover:bg-hover text-foreground";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`${getNavClassName(
                        item.url
                      )} flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-sidebar-foreground/70 px-3 py-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(isAuthenticated ? accountItemsAuthed : accountItemsGuest).map(
                (item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`${getNavClassName(
                          item.url
                        )} flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {state !== "collapsed" && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
