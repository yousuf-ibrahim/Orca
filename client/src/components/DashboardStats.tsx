import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileCheck, Clock, AlertCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
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
        icon={<Users className="h-4 w-4" />}
        description="All registered clients"
      />
      <StatCard
        title="Pending Review"
        value={stats.pendingReview}
        icon={<Clock className="h-4 w-4" />}
        description="Awaiting compliance review"
      />
      <StatCard
        title="Approved"
        value={stats.approvedClients}
        icon={<FileCheck className="h-4 w-4" />}
        description="KYC completed"
      />
      <StatCard
        title="Requires Action"
        value={stats.requiresAction}
        icon={<AlertCircle className="h-4 w-4" />}
        description="Needs updates"
      />
    </div>
  );
}
