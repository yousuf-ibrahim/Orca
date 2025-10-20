import { KYCFormStepper } from "@/components/KYCFormStepper";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NewKYC() {
  const [, setLocation] = useLocation();

  const handleSubmit = (data: any) => {
    console.log("KYC submitted:", data);
    // TODO: Submit to backend API
    alert("KYC application submitted successfully!");
    setLocation("/");
  };

  const handleSaveDraft = (data: any) => {
    console.log("Draft saved:", data);
    // TODO: Save draft to backend
    alert("Draft saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
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

      <KYCFormStepper onSubmit={handleSubmit} onSaveDraft={handleSaveDraft} />
    </div>
  );
}
