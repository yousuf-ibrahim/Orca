import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/DashboardStats";
import { ClientTable } from "@/components/ClientTable";
import { Plus, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Client } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: clientsData, isLoading: clientsLoading, refetch: refetchClients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const handleViewClient = (clientId: string) => {
    setLocation(`/client/${clientId}`);
  };

  const handleEditClient = (clientId: string) => {
    setLocation(`/kyc/${clientId}`);
  };

  const handleNewClient = () => {
    setLocation("/kyc/new");
  };

  const handleRefresh = () => {
    refetchStats();
    refetchClients();
  };

  const transformedClients = clientsData?.map(client => ({
    id: client.id.toString(),
    name: client.name,
    email: client.email,
    company: client.type,
    kycStatus: client.status.toUpperCase().replace(/_/g, '_') as any,
    riskBand: (client.riskScore 
      ? (client.riskScore < 30 ? "LOW" : client.riskScore < 60 ? "MEDIUM" : "HIGH")
      : "LOW") as any,
    submittedDate: new Date(client.createdAt).toLocaleDateString('en-US'),
  })) || [];

  if (statsLoading || clientsLoading) {
    return (
      <div className="p-6 lg:p-8">
        <LoadingSkeleton />
      </div>
    );
  }

  const dashboardStats = {
    totalClients: (stats as any)?.totalClients || 0,
    pendingReview: (stats as any)?.pendingReviews || 0,
    approvedClients: (stats as any)?.approvedThisMonth || 0,
    requiresAction: transformedClients.filter(c => c.kycStatus === "REQUIRES_UPDATE").length,
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            KYC applications and compliance overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} data-testid="button-refresh">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleNewClient} data-testid="button-new-client">
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Button>
        </div>
      </div>

      <DashboardStats stats={dashboardStats} />

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
          <CardTitle className="text-lg font-semibold">Recent Clients</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ClientTable
            clients={transformedClients}
            onViewClient={handleViewClient}
            onEditClient={handleEditClient}
          />
        </CardContent>
      </Card>
    </div>
  );
}
