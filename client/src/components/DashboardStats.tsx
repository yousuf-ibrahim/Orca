import { Card, CardContent } from "@/components/ui/card";
import { Users, FileCheck, Clock, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

function StatCard({ title, value, icon, description, trend, trendValue }: StatCardProps) {
  return (
    <Card className="border-border/50 transition-smooth hover:border-primary/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-muted-foreground"
            }`}>
              {trend === "up" ? <TrendingUp className="h-3 w-3" /> : trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
              {trendValue}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  stats: {
    totalClients: number;
    pendingReview: number;
    approvedClients: number;
    requiresAction: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Clients"
        value={stats.totalClients}
        icon={<Users className="h-5 w-5 text-primary" />}
        description="All registered clients"
        trend="up"
        trendValue="+12%"
      />
      <StatCard
        title="Pending Review"
        value={stats.pendingReview}
        icon={<Clock className="h-5 w-5 text-warning" />}
        description="Awaiting compliance review"
      />
      <StatCard
        title="Approved"
        value={stats.approvedClients}
        icon={<FileCheck className="h-5 w-5 text-success" />}
        description="KYC completed this month"
        trend="up"
        trendValue="+8%"
      />
      <StatCard
        title="Requires Action"
        value={stats.requiresAction}
        icon={<AlertCircle className="h-5 w-5 text-error" />}
        description="Needs updates"
      />
    </div>
  );
}
