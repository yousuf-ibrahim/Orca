import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/DashboardStats";
import { ClientTable, type Client } from "@/components/ClientTable";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";

// TODO: Remove mock data when integrating with backend
const mockStats = {
  totalClients: 247,
  pendingReview: 18,
  approvedClients: 203,
  requiresAction: 12,
};

const mockClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    company: "TechCorp Investments",
    kycStatus: "APPROVED",
    riskBand: "LOW",
    submittedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@capitalgroup.com",
    company: "Capital Group LLC",
    kycStatus: "UNDER_REVIEW",
    riskBand: "MEDIUM",
    submittedDate: "2024-01-20",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@gmail.com",
    kycStatus: "REQUIRES_UPDATE",
    riskBand: "MEDIUM",
    submittedDate: "2024-01-18",
  },
  {
    id: "4",
    name: "David Kim",
    email: "dkim@ventures.io",
    company: "Ventures.io",
    kycStatus: "SUBMITTED",
    riskBand: "HIGH",
    submittedDate: "2024-01-22",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "l.anderson@wealth.com",
    company: "Anderson Wealth Management",
    kycStatus: "APPROVED",
    riskBand: "LOW",
    submittedDate: "2024-01-10",
  },
  {
    id: "6",
    name: "Robert Taylor",
    email: "rtaylor@investments.com",
    company: "Taylor Investments",
    kycStatus: "UNDER_REVIEW",
    riskBand: "LOW",
    submittedDate: "2024-01-21",
  },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const handleViewClient = (clientId: string) => {
    console.log("View client:", clientId);
    // TODO: Navigate to client detail page
    setLocation(`/client/${clientId}`);
  };

  const handleEditClient = (clientId: string) => {
    console.log("Edit client:", clientId);
    // TODO: Navigate to KYC edit page
    setLocation(`/kyc/${clientId}`);
  };

  const handleNewClient = () => {
    console.log("New client clicked");
    setLocation("/kyc/new");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of client KYC applications and compliance status
          </p>
        </div>
        <Button onClick={handleNewClient} data-testid="button-new-client">
          <Plus className="mr-2 h-4 w-4" />
          New Client
        </Button>
      </div>

      <DashboardStats stats={mockStats} />

      <ClientTable
        clients={mockClients}
        onViewClient={handleViewClient}
        onEditClient={handleEditClient}
      />
    </div>
  );
}
