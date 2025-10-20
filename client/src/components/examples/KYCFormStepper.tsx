import { KYCFormStepper } from "../KYCFormStepper";

export default function KYCFormStepperExample() {
  const handleSubmit = (data: any) => {
    console.log("KYC Form submitted:", data);
    alert("KYC application submitted for review!");
  };

  const handleSaveDraft = (data: any) => {
    console.log("Draft saved:", data);
    alert("Draft saved successfully!");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <KYCFormStepper onSubmit={handleSubmit} onSaveDraft={handleSaveDraft} />
    </div>
  );
}
