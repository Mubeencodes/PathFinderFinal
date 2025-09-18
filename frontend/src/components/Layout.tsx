import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { DarkModeToggle } from "./DarkModeToggle";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {isAuthenticated && <AppSidebar />}
        
        <div className="flex-1 flex flex-col">
          <header className={`sticky top-0 z-50 h-16 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 flex items-center px-6 transition-shadow duration-200 ${
            isScrolled ? 'shadow-medium' : 'shadow-soft'
          }`}>
            {isAuthenticated && <SidebarTrigger className="mr-4" />}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PF</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">PathFinder</h1>
            </div>
            <DarkModeToggle />
          </header>
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}