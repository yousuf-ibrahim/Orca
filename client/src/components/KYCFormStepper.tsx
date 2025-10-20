import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Personal Information" },
  { id: 2, name: "Business Details" },
  { id: 3, name: "Documents" },
  { id: 4, name: "Review" },
];

interface KYCFormStepperProps {
  onSubmit?: (data: any) => void;
  onSaveDraft?: (data: any) => void;
}

export function KYCFormStepper({ onSubmit, onSaveDraft }: KYCFormStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    companyName: "",
    businessType: "",
    taxId: "",
    riskBand: "MEDIUM" as const,
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    onSubmit?.(formData);
  };

  const handleSaveDraft = () => {
    console.log("Draft saved:", formData);
    onSaveDraft?.(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  step.id < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : step.id === currentStep
                    ? "border-primary text-primary"
                    : "border-muted text-muted-foreground"
                )}
                data-testid={`step-indicator-${step.id}`}
              >
                {step.id < currentStep ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              <span className="text-xs mt-2 hidden sm:block">{step.name}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 -mt-6",
                  step.id < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>
            Step {currentStep} of {steps.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    data-testid="input-first-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  data-testid="input-phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  data-testid="input-address"
                />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormData("companyName", e.target.value)}
                  data-testid="input-company-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={formData.businessType} onValueChange={(val) => updateFormData("businessType", val)}>
                  <SelectTrigger data-testid="select-business-type">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Investor</SelectItem>
                    <SelectItem value="corporate">Corporate Entity</SelectItem>
                    <SelectItem value="trust">Trust</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / EIN</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => updateFormData("taxId", e.target.value)}
                  data-testid="input-tax-id"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="riskBand">Risk Assessment</Label>
                <Select value={formData.riskBand} onValueChange={(val) => updateFormData("riskBand", val)}>
                  <SelectTrigger data-testid="select-risk-band">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low Risk</SelectItem>
                    <SelectItem value="MEDIUM">Medium Risk</SelectItem>
                    <SelectItem value="HIGH">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Drag and drop documents here or click to browse
                </p>
                <Button variant="outline" data-testid="button-upload-documents">
                  Upload Documents
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Required: Government-issued ID, Proof of Address, Business Registration (if applicable)
              </p>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <h3 className="font-semibold">Personal Information</h3>
                <p className="text-sm">
                  <span className="text-muted-foreground">Name:</span> {formData.firstName} {formData.lastName}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Email:</span> {formData.email}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Phone:</span> {formData.phone || "—"}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <h3 className="font-semibold">Business Details</h3>
                <p className="text-sm">
                  <span className="text-muted-foreground">Company:</span> {formData.companyName || "—"}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Business Type:</span> {formData.businessType || "—"}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Risk Band:</span> {formData.riskBand}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack} data-testid="button-back">
                  Back
                </Button>
              )}
              <Button variant="outline" onClick={handleSaveDraft} data-testid="button-save-draft">
                Save Draft
              </Button>
            </div>
            <div>
              {currentStep < steps.length ? (
                <Button onClick={handleNext} data-testid="button-next">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} data-testid="button-submit">
                  Submit for Review
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
