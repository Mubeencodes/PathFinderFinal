import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import CareerRoadmap from "./pages/CareerRoadmap";
import Colleges from "./pages/Colleges";
import StudyMaterials from "./pages/StudyMaterials";
import ChatBot from "./pages/ChatBot";
import Notifications from "./pages/Notifications";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import Logout from "./pages/Logout";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, needsOnboarding } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  if (needsOnboarding && location.pathname !== "/quiz") {
    return <Navigate to="/quiz" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/logout" element={<Logout />} />

              {/* Public Home */}
              <Route path="/" element={<Home />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/quiz"
                element={
                  <RequireAuth>
                    <Quiz />
                  </RequireAuth>
                }
              />
              <Route
                path="/roadmap"
                element={
                  <RequireAuth>
                    <CareerRoadmap />
                  </RequireAuth>
                }
              />
              <Route
                path="/colleges"
                element={
                  <RequireAuth>
                    <Colleges />
                  </RequireAuth>
                }
              />
              <Route
                path="/materials"
                element={
                  <RequireAuth>
                    <StudyMaterials />
                  </RequireAuth>
                }
              />
              <Route
                path="/chat"
                element={
                  <RequireAuth>
                    <ChatBot />
                  </RequireAuth>
                }
              />
              <Route
                path="/notifications"
                element={
                  <RequireAuth>
                    <Notifications />
                  </RequireAuth>
                }
              />
              <Route
                path="/compare"
                element={
                  <RequireAuth>
                    <Compare />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
