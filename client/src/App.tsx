import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/AppSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Footer } from "@/components/Footer";
import { useAuthStore } from "@/stores/authStore";
import Dashboard from "@/pages/Dashboard";
import NewKYC from "@/pages/NewKYC";
import ClientDetail from "@/pages/ClientDetail";
import Portfolios from "@/pages/Portfolios";
import PortfolioDetail from "@/pages/PortfolioDetail";
import ResearchCopilot from "@/pages/ResearchCopilot";
import ComplianceReports from "@/pages/ComplianceReports";
import Securities from "@/pages/Securities";
import SecuritiesImport from "@/pages/SecuritiesImport";
import Recon from "@/pages/Recon";
import Capital from "@/pages/Capital";
import FundAnalytics from "@/pages/FundAnalytics";
import AuditForm from "@/pages/AuditForm";
import AuditReport from "@/pages/AuditReport";
import AuditDemo from "@/pages/AuditDemo";
import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";
import "@/lib/axios";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/onboarding">
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute requireInvestorType>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/kyc/new">
        <ProtectedRoute requireInvestorType>
          <NewKYC />
        </ProtectedRoute>
      </Route>
      <Route path="/client/:id">
        <ProtectedRoute requireInvestorType>
          <ClientDetail />
        </ProtectedRoute>
      </Route>
      <Route path="/portfolios">
        <ProtectedRoute requireInvestorType>
          <Portfolios />
        </ProtectedRoute>
      </Route>
      <Route path="/portfolios/:id">
        <ProtectedRoute requireInvestorType>
          <PortfolioDetail />
        </ProtectedRoute>
      </Route>
      <Route path="/research">
        <ProtectedRoute requireInvestorType>
          <ResearchCopilot />
        </ProtectedRoute>
      </Route>
      <Route path="/compliance/reports">
        <ProtectedRoute requireInvestorType>
          <ComplianceReports />
        </ProtectedRoute>
      </Route>
      <Route path="/securities">
        <ProtectedRoute requireInvestorType>
          <Securities />
        </ProtectedRoute>
      </Route>
      <Route path="/securities/import">
        <ProtectedRoute requireInvestorType>
          <SecuritiesImport />
        </ProtectedRoute>
      </Route>
      <Route path="/recon">
        <ProtectedRoute requireInvestorType>
          <Recon />
        </ProtectedRoute>
      </Route>
      <Route path="/capital">
        <ProtectedRoute requireInvestorType>
          <Capital />
        </ProtectedRoute>
      </Route>
      <Route path="/fund">
        <ProtectedRoute requireInvestorType>
          <FundAnalytics />
        </ProtectedRoute>
      </Route>
      <Route path="/audit/demo">
        <ProtectedRoute requireInvestorType>
          <AuditDemo />
        </ProtectedRoute>
      </Route>
      <Route path="/audit/:id">
        <ProtectedRoute requireInvestorType>
          <AuditReport />
        </ProtectedRoute>
      </Route>
      <Route path="/audit">
        <ProtectedRoute requireInvestorType>
          <AuditForm />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [location] = useLocation();
  const { user } = useAuthStore();
  const isAuthPage = location === "/" || location === "/login" || location === "/onboarding";

  const sidebarStyle = {
    "--sidebar-width": "16rem",
  };

  if (isAuthPage) {
    return <Router />;
  }

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full flex-col">
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar
            firmName="Acme Capital Partners"
            userRole={user?.investorType ? user.investorType.charAt(0).toUpperCase() + user.investorType.slice(1) + " Investor" : "Compliance Officer"}
            userName={user?.email || "Alex Morgan"}
          />
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between px-6 py-4 border-b">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <ThemeToggle />
            </header>
            <main className="flex-1 overflow-y-auto px-6 py-8">
              <div className="max-w-7xl mx-auto">
                <Router />
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AppLayout />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
