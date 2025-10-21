import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Edit, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Client, KycApplication, Document } from "@shared/schema";
import { RmKycNotesForm } from "@/components/RmKycNotesForm";
import { WealthInformationForm } from "@/components/WealthInformationForm";
import { RiskAssessmentForm } from "@/components/RiskAssessmentForm";
import { SuitabilityAssessmentForm } from "@/components/SuitabilityAssessmentForm";
import { ClientClassificationForm } from "@/components/ClientClassificationForm";

export default function ClientDetail() {
  const [match, params] = useRoute("/client/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  if (!match || !params?.id) {
    return null;
  }

  const clientId = parseInt(params.id);

  const { data: client, isLoading: clientLoading, error: clientError } = useQuery<Client>({
    queryKey: [`/api/clients/${clientId}`],
  });

  const { data: kycApp } = useQuery<KycApplication>({
    queryKey: [`/api/clients/${clientId}/kyc`],
    enabled: !!client,
  });

  const { data: documents } = useQuery<Document[]>({
    queryKey: [`/api/kyc-applications/${kycApp?.id}/documents`],
    enabled: !!kycApp,
  });

  const approveKycMutation = useMutation({
    mutationFn: async () => {
      if (!kycApp) throw new Error("No KYC application found");
      
      const updated = await apiRequest(`/api/kyc-applications/${kycApp.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "approved",
          reviewedAt: new Date().toISOString(),
          reviewNotes: "Application approved via client detail page",
        }),
      });

      // Also update client status
      await apiRequest(`/api/clients/${clientId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "approved",
        }),
      });

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", clientId] });
      queryClient.invalidateQueries({ queryKey: ["/api/clients", clientId, "kyc"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Application Approved",
        description: "KYC application has been approved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve application",
        variant: "destructive",
      });
    },
  });

  const rejectKycMutation = useMutation({
    mutationFn: async () => {
      if (!kycApp) throw new Error("No KYC application found");
      
      const updated = await apiRequest(`/api/kyc-applications/${kycApp.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "rejected",
          reviewedAt: new Date().toISOString(),
          reviewNotes: "Application requires additional documentation",
        }),
      });

      await apiRequest(`/api/clients/${clientId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "requires_update",
        }),
      });

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", clientId] });
      queryClient.invalidateQueries({ queryKey: ["/api/clients", clientId, "kyc"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Application Rejected",
        description: "Client has been notified to update their application",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject application",
        variant: "destructive",
      });
    },
  });

  if (clientLoading) {
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
          <h1 className="text-3xl font-semibold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!client) {
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
          <h1 className="text-3xl font-semibold">Client not found</h1>
        </div>
      </div>
    );
  }

  const kycStatus = kycApp?.status?.toUpperCase().replace(/_/g, '_') as any || "PENDING";
  const riskBand = (client.riskScore 
    ? (client.riskScore < 30 ? "LOW" : client.riskScore < 60 ? "MEDIUM" : "HIGH")
    : "LOW") as any;

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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="rm-notes" data-testid="tab-rm-notes">RM Notes</TabsTrigger>
          <TabsTrigger value="wealth" data-testid="tab-wealth">Wealth</TabsTrigger>
          <TabsTrigger value="risk" data-testid="tab-risk">Risk</TabsTrigger>
          <TabsTrigger value="suitability" data-testid="tab-suitability">Suitability</TabsTrigger>
          <TabsTrigger value="classification" data-testid="tab-classification">Classification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
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
                  <p className="font-medium">{client.phone || "—"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Client Type</span>
                  <p className="font-medium">{client.type}</p>
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
                    <StatusBadge status={kycStatus} type="kyc" />
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Risk Assessment</span>
                  <div className="mt-1">
                    <StatusBadge status={riskBand} type="risk" />
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Risk Score</span>
                  <p className="font-medium">{client.riskScore || "Pending"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Submitted Date</span>
                  <p className="font-medium">{new Date(client.createdAt).toLocaleDateString()}</p>
                </div>
                {kycApp?.reviewedAt && (
                  <div>
                    <span className="text-sm text-muted-foreground">Review Date</span>
                    <p className="font-medium">{new Date(kycApp.reviewedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {documents && documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover-elevate"
                      data-testid={`document-${doc.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{doc.filename}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.type} • {(doc.filesize / 1024).toFixed(0)} KB • 
                            {" "}{new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.verified ? (
                          <Badge variant="default">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                        <Button size="icon" variant="ghost" data-testid={`button-download-${doc.id}`}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {kycApp && kycApp.status === "submitted" && (
            <Card>
              <CardHeader>
                <CardTitle>Review Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button 
                  onClick={() => approveKycMutation.mutate()}
                  disabled={approveKycMutation.isPending}
                  data-testid="button-approve"
                >
                  {approveKycMutation.isPending ? "Approving..." : "Approve Application"}
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => rejectKycMutation.mutate()}
                  disabled={rejectKycMutation.isPending}
                  data-testid="button-reject"
                >
                  {rejectKycMutation.isPending ? "Rejecting..." : "Request Updates"}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rm-notes" className="mt-6">
          <RmKycNotesForm clientId={clientId} />
        </TabsContent>

        <TabsContent value="wealth" className="mt-6">
          <WealthInformationForm clientId={clientId} />
        </TabsContent>

        <TabsContent value="risk" className="mt-6">
          <RiskAssessmentForm clientId={clientId} />
        </TabsContent>

        <TabsContent value="suitability" className="mt-6">
          <SuitabilityAssessmentForm clientId={clientId} />
        </TabsContent>

        <TabsContent value="classification" className="mt-6">
          <ClientClassificationForm clientId={clientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
