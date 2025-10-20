import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Edit, FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// TODO: Remove mock data when integrating with backend
const mockClientData = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah.johnson@techcorp.com",
  phone: "+1 (555) 123-4567",
  company: "TechCorp Investments",
  businessType: "Corporate Entity",
  taxId: "12-3456789",
  address: "123 Wall Street, New York, NY 10005",
  kycStatus: "APPROVED" as const,
  riskBand: "LOW" as const,
  submittedDate: "2024-01-15",
  approvedDate: "2024-01-18",
  assignedTo: "John Smith",
  documents: [
    { id: "1", name: "Passport.pdf", type: "ID Document", uploadDate: "2024-01-15", status: "Verified" },
    { id: "2", name: "Utility_Bill.pdf", type: "Proof of Address", uploadDate: "2024-01-15", status: "Verified" },
    { id: "3", name: "Business_Registration.pdf", type: "Corporate Docs", uploadDate: "2024-01-15", status: "Verified" },
  ],
};

export default function ClientDetail() {
  const [match, params] = useRoute("/client/:id");
  const [, setLocation] = useLocation();

  if (!match) {
    return null;
  }

  const client = mockClientData;

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => setLocation("/dashboard")}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{client.name}</h1>
            <p className="text-muted-foreground mt-1">{client.email}</p>
          </div>
          <Button data-testid="button-edit-kyc">
            <Edit className="mr-2 h-4 w-4" />
            Edit KYC
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Full Name</span>
              <p className="font-medium">{client.name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Email Address</span>
              <p className="font-medium">{client.email}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Phone Number</span>
              <p className="font-medium">{client.phone}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Address</span>
              <p className="font-medium">{client.address}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Company Name</span>
              <p className="font-medium">{client.company}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Business Type</span>
              <p className="font-medium">{client.businessType}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Tax ID</span>
              <p className="font-medium font-mono">{client.taxId}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">KYC Status</span>
              <div className="mt-1">
                <StatusBadge status={client.kycStatus} type="kyc" />
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Risk Assessment</span>
              <div className="mt-1">
                <StatusBadge status={client.riskBand} type="risk" />
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Submitted Date</span>
              <p className="font-medium">{new Date(client.submittedDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Approved Date</span>
              <p className="font-medium">{new Date(client.approvedDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Assigned To</span>
              <p className="font-medium">{client.assignedTo}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {client.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted hover-elevate"
                  data-testid={`document-${doc.id}`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                      {doc.status}
                    </Badge>
                    <Button size="icon" variant="ghost" data-testid={`button-download-${doc.id}`}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
