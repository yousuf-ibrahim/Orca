import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/DashboardStats";
import { ClientTable } from "@/components/ClientTable";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Client } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: clientsData, isLoading: clientsLoading } = useQuery<Client[]>({
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

  // Transform database clients to match ClientTable interface
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Loading...
            </p>
          </div>
        </div>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of client KYC applications and compliance status
          </p>
        </div>
        <Button onClick={handleNewClient} data-testid="button-new-client">
          <Plus className="mr-2 h-4 w-4" />
          New Client
        </Button>
      </div>

      <DashboardStats stats={dashboardStats} />

      <ClientTable
        clients={transformedClients}
        onViewClient={handleViewClient}
        onEditClient={handleEditClient}
      />
    </div>
  );
}
