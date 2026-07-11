import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import CursorTrail from "@/components/CursorTrail";
import CursorGlow from "@/components/CursorGlow";
import Preloader from "@/components/Preloader";
import BackToTop from "@/components/BackToTop";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import DarkModeProvider from "@/components/DarkModeProvider";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/* Page title updater */
function usePageTitle() {
  const [location] = useLocation();
  useEffect(() => {
    const base = "Mar · Artist Portfolio";
    if (location === "/admin") document.title = "Admin Login";
    else if (location === "/admin/dashboard") document.title = "Dashboard";
    else document.title = base;
  }, [location]);
}

function Router() {
  usePageTitle();
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DarkModeProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <CursorTrail />
            <CursorGlow />
            <Preloader>
              <SmoothScrollProvider>
                <Router />
              </SmoothScrollProvider>
            </Preloader>
            <BackToTop />
          </WouterRouter>
          <Toaster />
        </DarkModeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
