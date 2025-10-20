import { ClientTable, type Client } from "../ClientTable";

const mockClients: Client[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    company: "TechCorp Investments",
    kycStatus: "APPROVED",
    riskBand: "LOW",
    submittedDate: "2024-01-15",
    assignedTo: "John Smith",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@capitalgroup.com",
    company: "Capital Group LLC",
    kycStatus: "UNDER_REVIEW",
    riskBand: "MEDIUM",
    submittedDate: "2024-01-20",
    assignedTo: "Jane Doe",
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
];

export default function ClientTableExample() {
  const handleView = (clientId: string) => {
    console.log("View client:", clientId);
  };

  const handleEdit = (clientId: string) => {
    console.log("Edit client:", clientId);
  };

  return (
    <div className="p-8">
      <ClientTable
        clients={mockClients}
        onViewClient={handleView}
        onEditClient={handleEdit}
      />
    </div>
  );
}
