import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  RefreshCw, 
  Users, 
  FileCheck, 
  AlertTriangle, 
  TrendingUp,
  Briefcase,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  ClipboardCheck
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Client, Portfolio } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveMarketWidget } from "@/components/widgets/LiveMarketWidget";
import { LiveNewsWidget } from "@/components/widgets/LiveNewsWidget";
import { CurrencyWidget } from "@/components/widgets/CurrencyWidget";

interface DashboardStats {
  totalClients: number;
  pendingReviews: number;
  approvedThisMonth: number;
  requiresUpdate: number;
  totalAum: number;
  portfolioCount: number;
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  trendValue,
  variant = "default" 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: any; 
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
}) {
  const variantStyles = {
    default: "from-primary/10 to-primary/5 text-primary",
    success: "from-success/10 to-success/5 text-success",
    warning: "from-warning/10 to-warning/5 text-warning",
    error: "from-error/10 to-error/5 text-error",
    info: "from-info/10 to-info/5 text-info",
  };

  return (
    <Card className="border-border/50 overflow-hidden hover-elevate transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className={`p-2.5 rounded-lg bg-gradient-to-br ${variantStyles[variant]}`}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && trendValue && (
            <div className={`flex items-center text-xs font-medium ${
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-muted-foreground'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              ) : trend === 'down' ? (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              ) : null}
              {trendValue}
            </div>
          )}
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/70">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  variant = "default"
}: {
  title: string;
  description: string;
  icon: any;
  onClick: () => void;
  variant?: "default" | "primary";
}) {
  return (
    <Card 
      className={`border-border/50 cursor-pointer hover-elevate transition-all duration-300 ${
        variant === 'primary' ? 'bg-primary/5 border-primary/20' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-2 rounded-lg ${
          variant === 'primary' 
            ? 'bg-primary/20 text-primary' 
            : 'bg-muted text-muted-foreground'
        }`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}

function RecentClientsWidget({ clients }: { clients: Client[] }) {
  const recentClients = clients.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'pending': 
      case 'under_review': return 'bg-warning/10 text-warning border-warning/20';
      case 'rejected': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Recent Clients</CardTitle>
            <CardDescription>Latest KYC applications</CardDescription>
          </div>
          <Link href="/kyc/new">
            <Button size="sm" data-testid="button-new-kyc">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {recentClients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No clients yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentClients.map((client) => (
              <Link key={client.id} href={`/client/${client.id}`}>
                <div className="flex items-center justify-between p-3 rounded-lg hover-elevate transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                        {client.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(client.status)}`}>
                    {client.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PortfolioSummaryWidget({ portfolios }: { portfolios: Portfolio[] }) {
  const activePortfolios = portfolios.filter(p => p.status === 'active');
  const totalAum = activePortfolios.reduce((sum, p) => sum + parseFloat(p.totalMarketValue || '0'), 0);
  const totalPnl = activePortfolios.reduce((sum, p) => sum + parseFloat(p.totalUnrealizedPnl || '0'), 0);
  const pnlPercent = totalAum > 0 ? (totalPnl / totalAum) * 100 : 0;
  const isPositive = totalPnl >= 0;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Portfolio Summary</CardTitle>
            <CardDescription>Total assets under management</CardDescription>
          </div>
          <Link href="/portfolios">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Total AUM</p>
            <p className="text-2xl font-bold">
              ${(totalAum / 1000000).toFixed(2)}M
            </p>
            <div className={`flex items-center mt-2 text-sm font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {isPositive ? '+' : ''}${(totalPnl / 1000).toFixed(0)}K ({isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%)
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground">Active Portfolios</p>
              <p className="text-lg font-semibold">{activePortfolios.length}</p>
            </div>
            <div className="p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground">Avg. Size</p>
              <p className="text-lg font-semibold">
                ${activePortfolios.length > 0 
                  ? ((totalAum / activePortfolios.length) / 1000000).toFixed(1) 
                  : '0'}M
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
      
      <Skeleton className="h-40 rounded-lg" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-96 lg:col-span-2 rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: clientsData = [], isLoading: clientsLoading, refetch: refetchClients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const { data: portfoliosData = [], isLoading: portfoliosLoading, refetch: refetchPortfolios } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolios"],
  });

  const handleRefresh = () => {
    refetchStats();
    refetchClients();
    refetchPortfolios();
  };

  const isLoading = statsLoading || clientsLoading || portfoliosLoading;

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <LoadingSkeleton />
      </div>
    );
  }

  const requiresUpdateCount = clientsData.filter(c => c.status === 'requires_update').length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-1">
            Real-time market intelligence and operations overview
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/audit/demo">
            <Button variant="outline" size="sm" data-testid="button-view-sample-report">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Sample Audit Report
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleRefresh} data-testid="button-refresh-all">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh All
          </Button>
          <Button onClick={() => setLocation("/kyc/new")} data-testid="button-new-client">
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clients"
          value={stats?.totalClients || clientsData.length || 0}
          subtitle="Across all portfolios"
          icon={Users}
          variant="info"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Pending Review"
          value={stats?.pendingReviews || 0}
          subtitle="Awaiting action"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Approved This Month"
          value={stats?.approvedThisMonth || 0}
          subtitle="Successfully onboarded"
          icon={FileCheck}
          variant="success"
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Requires Update"
          value={requiresUpdateCount}
          subtitle="Action needed"
          icon={AlertTriangle}
          variant={requiresUpdateCount > 0 ? "error" : "default"}
        />
      </div>

      <LiveMarketWidget />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LiveNewsWidget />
        </div>
        
        <div className="space-y-6">
          <CurrencyWidget />
          <PortfolioSummaryWidget portfolios={portfoliosData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentClientsWidget clients={clientsData} />
        
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <QuickActionCard
              title="New KYC Application"
              description="Start client onboarding"
              icon={Plus}
              onClick={() => setLocation('/kyc/new')}
              variant="primary"
            />
            <QuickActionCard
              title="Securities Master"
              description="Manage securities database"
              icon={Briefcase}
              onClick={() => setLocation('/securities')}
            />
            <QuickActionCard
              title="Compliance Reports"
              description="Generate regulatory reports"
              icon={Shield}
              onClick={() => setLocation('/compliance/reports')}
            />
            <QuickActionCard
              title="Portfolio Overview"
              description="View all portfolios"
              icon={TrendingUp}
              onClick={() => setLocation('/portfolios')}
            />
            <QuickActionCard
              title="Infrastructure Audit"
              description="AI analysis of your ops stack"
              icon={ClipboardCheck}
              onClick={() => setLocation('/audit')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
