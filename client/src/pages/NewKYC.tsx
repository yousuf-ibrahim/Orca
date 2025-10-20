import { KYCFormStepper } from "@/components/KYCFormStepper";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function NewKYC() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const createClientMutation = useMutation({
    mutationFn: async (data: any) => {
      const { firstName, lastName, email, phone, companyName, businessType } = data;
      
      // Create client first
      const client = await apiRequest("/api/clients", {
        method: "POST",
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          type: businessType || "Individual",
          status: "pending",
        }),
      });

      // Then create KYC application
      const kycApp = await apiRequest("/api/kyc-applications", {
        method: "POST",
        body: JSON.stringify({
          clientId: client.id,
          status: "submitted",
          step: 4,
          data: {
            personalInfo: { firstName, lastName, email, phone },
            businessInfo: { companyName, businessType },
          },
          submittedAt: new Date().toISOString(),
        }),
      });

      return { client, kycApp };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "KYC application submitted successfully",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit KYC application",
        variant: "destructive",
      });
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async (data: any) => {
      const { firstName, lastName, email, phone, companyName, businessType } = data;
      
      const client = await apiRequest("/api/clients", {
        method: "POST",
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          type: businessType || "Individual",
          status: "pending",
        }),
      });

      const kycApp = await apiRequest("/api/kyc-applications", {
        method: "POST",
        body: JSON.stringify({
          clientId: client.id,
          status: "draft",
          step: 1,
          data: {
            personalInfo: { firstName, lastName, email, phone },
            businessInfo: { companyName, businessType },
          },
        }),
      });

      return { client, kycApp };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Draft saved",
        description: "Your progress has been saved",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save draft",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    createClientMutation.mutate(data);
  };

  const handleSaveDraft = (data: any) => {
    saveDraftMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => setLocation("/dashboard")}
          className="mb-4"
          data-testid="button-back-to-dashboard"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-semibold">New KYC Application</h1>
        <p className="text-muted-foreground mt-1">
          Complete the client onboarding and compliance verification process
        </p>
      </div>

      <KYCFormStepper 
        onSubmit={handleSubmit} 
        onSaveDraft={handleSaveDraft}
        isSubmitting={createClientMutation.isPending}
        isSavingDraft={saveDraftMutation.isPending}
      />
    </div>
  );
}
