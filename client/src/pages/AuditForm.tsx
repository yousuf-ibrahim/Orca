import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronRight, 
  ChevronLeft, 
  ClipboardCheck, 
  Loader2,
  Check,
  Building2,
  Server,
  AlertCircle,
  MessageSquare,
  FileText,
  ExternalLink
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Fund Profile", icon: Building2, description: "Basic information about your fund" },
  { id: 2, title: "Systems Inventory", icon: Server, description: "Your current technology stack" },
  { id: 3, title: "Pain Points", icon: AlertCircle, description: "Operational challenges you face" },
  { id: 4, title: "Open Questions", icon: MessageSquare, description: "Context for a better report" },
  { id: 5, title: "Review & Generate", icon: FileText, description: "Confirm and generate your audit" },
];

const STRATEGIES = [
  "Long/Short Equity",
  "Quantitative",
  "Multi-Strategy",
  "Fixed Income",
  "Macro",
  "Private Credit",
  "Other",
];

const PAIN_POINTS = [
  "Reconciliation takes too long or breaks regularly",
  "NAV calculation is manual or error-prone",
  "No single source of truth for positions",
  "Market data costs are unclear or poorly managed",
  "Risk reporting is delayed or inconsistent",
  "Investor reporting requires significant manual effort",
  "Onboarding new systems takes months",
  "Key operational knowledge lives in one or two people",
  "Trade errors tracked in spreadsheets",
  "No audit trail for data lineage",
  "AI/automation initiatives stall due to data quality",
  "End-of-month close takes more than 2 business days",
];

type SelectWithOtherProps = {
  value: string;
  otherValue: string;
  onChange: (value: string) => void;
  onOtherChange: (value: string) => void;
  options: string[];
  placeholder: string;
  label: string;
};

function SelectWithOther({ value, otherValue, onChange, onOtherChange, options, placeholder, label }: SelectWithOtherProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger data-testid={`select-${label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
          <SelectItem value="Other (specify)">Other (specify)</SelectItem>
        </SelectContent>
      </Select>
      {value === "Other (specify)" && (
        <Input
          placeholder="Please specify..."
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          className="mt-2"
        />
      )}
    </div>
  );
}

interface FormData {
  fundName: string;
  aumRange: string;
  strategies: string[];
  teamSize: string;
  opsHeadcount: string;
  pms: string; pmsOther: string;
  oms: string; omsOther: string;
  riskSystem: string; riskOther: string;
  marketData: string; marketDataOther: string;
  fundAdmin: string; fundAdminOther: string;
  custodian: string; custodianOther: string;
  primeBroker: string; primeBrokerOther: string;
  dataWarehouse: string; dataWarehouseOther: string;
  investorReporting: string; investorReportingOther: string;
  researchMgmt: string; researchMgmtOther: string;
  painPoints: string[];
  biggestPain: string;
  successVision: string;
  manualHours: string;
}

const initialFormData: FormData = {
  fundName: "", aumRange: "", strategies: [], teamSize: "", opsHeadcount: "",
  pms: "", pmsOther: "", oms: "", omsOther: "", riskSystem: "", riskOther: "",
  marketData: "", marketDataOther: "", fundAdmin: "", fundAdminOther: "",
  custodian: "", custodianOther: "", primeBroker: "", primeBrokerOther: "",
  dataWarehouse: "", dataWarehouseOther: "", investorReporting: "", investorReportingOther: "",
  researchMgmt: "", researchMgmtOther: "",
  painPoints: [], biggestPain: "", successVision: "", manualHours: "",
};

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((step, idx) => {
        const isComplete = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        return (
          <div key={step.id} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
              isComplete 
                ? 'bg-primary text-primary-foreground' 
                : isCurrent 
                  ? 'bg-primary/20 text-primary border-2 border-primary' 
                  : 'bg-muted text-muted-foreground'
            }`}>
              {isComplete ? <Check className="h-4 w-4" /> : step.id}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.title}
            </span>
            {idx < STEPS.length - 1 && (
              <div className={`h-px w-4 sm:w-8 mx-1 transition-all ${isComplete ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fund-name" className="text-sm font-medium">Fund Name <span className="text-error">*</span></Label>
        <Input
          id="fund-name"
          data-testid="input-fund-name"
          placeholder="e.g. Silverline Capital Partners"
          value={data.fundName}
          onChange={(e) => onChange("fundName", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">AUM Range <span className="text-error">*</span></Label>
        <Select value={data.aumRange} onValueChange={(v) => onChange("aumRange", v)}>
          <SelectTrigger data-testid="select-aum-range">
            <SelectValue placeholder="Select AUM range" />
          </SelectTrigger>
          <SelectContent>
            {["<$50M", "$50M–$150M", "$150M–$500M", "$500M–$1B", "$1B+"].map((v) => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Strategy (select all that apply) <span className="text-error">*</span></Label>
        <div className="grid grid-cols-2 gap-3">
          {STRATEGIES.map((s) => (
            <div key={s} className="flex items-center gap-2">
              <Checkbox
                id={`strategy-${s}`}
                data-testid={`checkbox-strategy-${s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                checked={data.strategies.includes(s)}
                onCheckedChange={(checked) => {
                  onChange("strategies", checked
                    ? [...data.strategies, s]
                    : data.strategies.filter((x) => x !== s)
                  );
                }}
              />
              <Label htmlFor={`strategy-${s}`} className="text-sm cursor-pointer">{s}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Total Team Size</Label>
          <Select value={data.teamSize} onValueChange={(v) => onChange("teamSize", v)}>
            <SelectTrigger data-testid="select-team-size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {["1–5", "6–15", "16–50", "50+"].map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Ops Headcount</Label>
          <Select value={data.opsHeadcount} onValueChange={(v) => onChange("opsHeadcount", v)}>
            <SelectTrigger data-testid="select-ops-headcount">
              <SelectValue placeholder="Select count" />
            </SelectTrigger>
            <SelectContent>
              {["0", "1", "2–3", "4+"].map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function Step2({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: any) => void }) {
  const systems = [
    {
      key: "pms" as keyof FormData, otherKey: "pmsOther" as keyof FormData,
      label: "Portfolio Management System",
      options: ["Advent Geneva", "d1g1t", "Addepar", "Charles River", "SS&C Eze", "Bloomberg AIM", "None"],
    },
    {
      key: "oms" as keyof FormData, otherKey: "omsOther" as keyof FormData,
      label: "Order Management System",
      options: ["SS&C Eze OMS", "Charles River", "Flextrade", "Bloomberg TSOX", "None"],
    },
    {
      key: "riskSystem" as keyof FormData, otherKey: "riskOther" as keyof FormData,
      label: "Risk System",
      options: ["Axioma", "Bloomberg PORT", "MSCI Barra", "FactSet", "In-house", "None"],
    },
    {
      key: "marketData" as keyof FormData, otherKey: "marketDataOther" as keyof FormData,
      label: "Market Data",
      options: ["Bloomberg", "Refinitiv/LSEG", "FactSet", "Databento", "yCharts", "Multiple", "None"],
    },
    {
      key: "fundAdmin" as keyof FormData, otherKey: "fundAdminOther" as keyof FormData,
      label: "Fund Admin / Shadow NAV",
      options: ["SS&C", "Citco", "NAV Consulting", "Apex", "In-house", "None"],
    },
    {
      key: "custodian" as keyof FormData, otherKey: "custodianOther" as keyof FormData,
      label: "Custodian(s)",
      options: ["RBC", "CIBC", "TD", "Goldman Sachs", "Morgan Stanley", "Interactive Brokers", "Multiple"],
    },
    {
      key: "primeBroker" as keyof FormData, otherKey: "primeBrokerOther" as keyof FormData,
      label: "Prime Broker(s)",
      options: ["Goldman Sachs", "Morgan Stanley", "JPMorgan", "Interactive Brokers", "None", "Multiple"],
    },
    {
      key: "dataWarehouse" as keyof FormData, otherKey: "dataWarehouseOther" as keyof FormData,
      label: "Data Warehouse",
      options: ["Snowflake", "AWS (S3/Redshift)", "Azure", "GCP BigQuery", "DuckDB", "None (Excel/SharePoint)"],
    },
    {
      key: "investorReporting" as keyof FormData, otherKey: "investorReportingOther" as keyof FormData,
      label: "Investor Reporting",
      options: ["Salesforce", "Backstop", "Allvue", "Excel/Manual", "None"],
    },
    {
      key: "researchMgmt" as keyof FormData, otherKey: "researchMgmtOther" as keyof FormData,
      label: "Research Management",
      options: ["VisibleAlpha", "FactSet", "Bloomberg", "Internal Wiki/Notion", "None"],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {systems.map((sys) => (
          <SelectWithOther
            key={sys.key}
            label={sys.label}
            placeholder={`Select ${sys.label.toLowerCase()}`}
            options={sys.options}
            value={data[sys.key] as string}
            otherValue={data[sys.otherKey] as string}
            onChange={(v) => onChange(sys.key, v)}
            onOtherChange={(v) => onChange(sys.otherKey, v)}
          />
        ))}
      </div>
    </div>
  );
}

function Step3({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: any) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Select all that apply to your fund's current operations.</p>
      <div className="space-y-3">
        {PAIN_POINTS.map((point) => (
          <div key={point} className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-all cursor-pointer"
            onClick={() => {
              onChange("painPoints", data.painPoints.includes(point)
                ? data.painPoints.filter((x) => x !== point)
                : [...data.painPoints, point]
              );
            }}
          >
            <Checkbox
              id={`pain-${point}`}
              data-testid={`checkbox-pain-${point.substring(0, 20).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
              checked={data.painPoints.includes(point)}
              onCheckedChange={(checked) => {
                onChange("painPoints", checked
                  ? [...data.painPoints, point]
                  : data.painPoints.filter((x) => x !== point)
                );
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <Label htmlFor={`pain-${point}`} className="text-sm cursor-pointer leading-relaxed">{point}</Label>
          </div>
        ))}
      </div>
      {data.painPoints.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs text-muted-foreground">Selected:</span>
          <Badge variant="secondary">{data.painPoints.length} pain points</Badge>
        </div>
      )}
    </div>
  );
}

function Step4({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="biggest-pain" className="text-sm font-medium">
          What is the single most painful operational problem you face today? <span className="text-error">*</span>
        </Label>
        <Textarea
          id="biggest-pain"
          data-testid="textarea-biggest-pain"
          placeholder="Be as specific as possible — name systems, workflows, or team members involved..."
          value={data.biggestPain}
          onChange={(e) => onChange("biggestPain", e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="success-vision" className="text-sm font-medium">
          What would success look like in 12 months? <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Textarea
          id="success-vision"
          data-testid="textarea-success-vision"
          placeholder="Describe the operational state you're aiming for..."
          value={data.successVision}
          onChange={(e) => onChange("successVision", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">
          How many hours per week does your ops team spend on manual data work?
        </Label>
        <Select value={data.manualHours} onValueChange={(v) => onChange("manualHours", v)}>
          <SelectTrigger data-testid="select-manual-hours">
            <SelectValue placeholder="Select estimate" />
          </SelectTrigger>
          <SelectContent>
            {["<5 hrs", "5–15 hrs", "15–30 hrs", "30+ hrs", "Unknown"].map((v) => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function Step5({ data }: { data: FormData }) {
  const sections = [
    { title: "Fund Profile", items: [
      { label: "Fund Name", value: data.fundName },
      { label: "AUM Range", value: data.aumRange },
      { label: "Strategy", value: data.strategies.join(", ") || "—" },
      { label: "Team Size", value: data.teamSize || "—" },
      { label: "Ops Headcount", value: data.opsHeadcount || "—" },
    ]},
    { title: "Key Systems", items: [
      { label: "PMS", value: data.pms === "Other (specify)" ? data.pmsOther : data.pms || "—" },
      { label: "OMS", value: data.oms === "Other (specify)" ? data.omsOther : data.oms || "—" },
      { label: "Risk System", value: data.riskSystem === "Other (specify)" ? data.riskOther : data.riskSystem || "—" },
      { label: "Market Data", value: data.marketData === "Other (specify)" ? data.marketDataOther : data.marketData || "—" },
      { label: "Fund Admin", value: data.fundAdmin === "Other (specify)" ? data.fundAdminOther : data.fundAdmin || "—" },
      { label: "Custodian", value: data.custodian === "Other (specify)" ? data.custodianOther : data.custodian || "—" },
      { label: "Prime Broker", value: data.primeBroker === "Other (specify)" ? data.primeBrokerOther : data.primeBroker || "—" },
    ]},
    { title: "Operational Context", items: [
      { label: "Pain Points", value: `${data.painPoints.length} identified` },
      { label: "Manual Hours/Week", value: data.manualHours || "—" },
    ]},
  ];

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          Review your answers below. Clicking "Generate Audit Report" will send this data to our infrastructure intelligence engine, which will analyze your stack and produce a detailed report in ~30 seconds.
        </p>
      </div>

      {sections.map((section) => (
        <Card key={section.title} className="border-border/50">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-semibold">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="py-0 px-4 pb-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {section.items.map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {data.biggestPain && (
        <Card className="border-border/50">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-semibold">Biggest Pain Point</CardTitle>
          </CardHeader>
          <CardContent className="py-0 px-4 pb-4">
            <p className="text-sm">{data.biggestPain}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AuditForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const onChange = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const generateMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        firmName: formData.fundName,
        formData: {
          fundProfile: {
            fundName: formData.fundName,
            aumRange: formData.aumRange,
            strategies: formData.strategies,
            teamSize: formData.teamSize,
            opsHeadcount: formData.opsHeadcount,
          },
          systemsInventory: {
            pms: formData.pms === "Other (specify)" ? formData.pmsOther : formData.pms,
            oms: formData.oms === "Other (specify)" ? formData.omsOther : formData.oms,
            riskSystem: formData.riskSystem === "Other (specify)" ? formData.riskOther : formData.riskSystem,
            marketData: formData.marketData === "Other (specify)" ? formData.marketDataOther : formData.marketData,
            fundAdmin: formData.fundAdmin === "Other (specify)" ? formData.fundAdminOther : formData.fundAdmin,
            custodian: formData.custodian === "Other (specify)" ? formData.custodianOther : formData.custodian,
            primeBroker: formData.primeBroker === "Other (specify)" ? formData.primeBrokerOther : formData.primeBroker,
            dataWarehouse: formData.dataWarehouse === "Other (specify)" ? formData.dataWarehouseOther : formData.dataWarehouse,
            investorReporting: formData.investorReporting === "Other (specify)" ? formData.investorReportingOther : formData.investorReporting,
            researchMgmt: formData.researchMgmt === "Other (specify)" ? formData.researchMgmtOther : formData.researchMgmt,
          },
          painPoints: formData.painPoints,
          openQuestions: {
            biggestPain: formData.biggestPain,
            successVision: formData.successVision,
            manualHours: formData.manualHours,
          },
        },
      };
      return apiRequest("POST", "/api/audit/generate", payload);
    },
    onSuccess: async (res) => {
      const data = await res.json();
      setLocation(`/audit/${data.id}`);
    },
    onError: (err: any) => {
      toast({
        title: "Generation failed",
        description: err.message || "Failed to generate audit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const canProceed = () => {
    if (currentStep === 1) return formData.fundName.trim() && formData.aumRange && formData.strategies.length > 0;
    if (currentStep === 4) return formData.biggestPain.trim();
    return true;
  };

  const currentStepInfo = STEPS[currentStep - 1];
  const StepIcon = currentStepInfo.icon;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Infrastructure Audit</h1>
            <p className="text-muted-foreground text-sm">AI-powered analysis of your operational tech stack</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <a href="/audit/demo" className="text-xs text-primary hover:underline flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            View a sample report
          </a>
        </div>
      </div>

      <StepIndicator currentStep={currentStep} />

      <Card className="border-border/50">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <StepIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{currentStepInfo.title}</CardTitle>
              <CardDescription>{currentStepInfo.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {currentStep === 1 && <Step1 data={formData} onChange={onChange} />}
          {currentStep === 2 && <Step2 data={formData} onChange={onChange} />}
          {currentStep === 3 && <Step3 data={formData} onChange={onChange} />}
          {currentStep === 4 && <Step4 data={formData} onChange={onChange} />}
          {currentStep === 5 && <Step5 data={formData} />}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={currentStep === 1}
          data-testid="button-prev-step"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">Step {currentStep} of {STEPS.length}</span>

        {currentStep < 5 ? (
          <Button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!canProceed()}
            data-testid="button-next-step"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            data-testid="button-generate-report"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Generate Audit Report
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
