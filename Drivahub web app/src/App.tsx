
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Dashboard } from '@/components/Dashboard';
import { Loads } from '@/components/Loads';
import { Statements } from '@/components/Statements';
import { Profile } from '@/components/Profile';
import { Auth } from '@/components/Auth';
import { Onboarding } from '@/components/Onboarding';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show auth page
  if (!user) {
    return <Auth />;
  }

  // Authenticated but onboarding not completed - show onboarding
  if (!profile?.onboarding_completed) {
    return <Onboarding />;
  }

  // Authenticated and onboarded - show main app
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-md mx-auto bg-background min-h-screen">
        <div className="pb-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/loads" element={<Loads />} />
            <Route path="/statements" element={<Statements />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppProvider>
              <AppRoutes />
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
