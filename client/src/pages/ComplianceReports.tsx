import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Zap, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  Users,
  FileCheck,
  Loader2,
  RefreshCw,
  History,
  Building2,
  Shield
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: "regulatory" | "lp" | "audit" | "internal";
  estimatedTime: string;
  sections: string[];
}

interface GeneratedReport {
  id: string;
  name: string;
  generatedAt: Date;
  status: "completed" | "generating" | "failed";
  downloadUrl?: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "kyc-summary",
    name: "KYC Status Summary",
    description: "Complete overview of all client KYC statuses, pending reviews, and document expirations",
    type: "internal",
    estimatedTime: "30 seconds",
    sections: ["Client Overview", "Pending Reviews", "Document Status", "Risk Distribution"]
  },
  {
    id: "dfsa-quarterly",
    name: "DFSA Quarterly Report",
    description: "Regulatory filing for Dubai Financial Services Authority compliance",
    type: "regulatory",
    estimatedTime: "2 minutes",
    sections: ["Executive Summary", "AUM Report", "Client Classification", "Risk Assessment", "Transaction Monitoring"]
  },
  {
    id: "lp-performance",
    name: "LP Performance Letter",
    description: "Quarterly investor letter with performance attribution and market commentary",
    type: "lp",
    estimatedTime: "1 minute",
    sections: ["Performance Summary", "Portfolio Attribution", "Market Commentary", "Outlook"]
  },
  {
    id: "audit-trail",
    name: "Audit Trail Export",
    description: "Complete audit log of all compliance actions and approvals",
    type: "audit",
    estimatedTime: "45 seconds",
    sections: ["User Actions", "Client Changes", "Approvals", "Document Uploads"]
  },
  {
    id: "risk-report",
    name: "Risk Assessment Report",
    description: "Comprehensive risk analysis across all clients and portfolios",
    type: "internal",
    estimatedTime: "1 minute",
    sections: ["Risk Distribution", "High Risk Clients", "Concentration Analysis", "Recommendations"]
  }
];

const recentReports: GeneratedReport[] = [
  {
    id: "1",
    name: "KYC Status Summary - Jan 2026",
    generatedAt: new Date("2026-01-15T10:30:00"),
    status: "completed",
    downloadUrl: "#"
  },
  {
    id: "2",
    name: "Q4 2025 LP Performance Letter",
    generatedAt: new Date("2026-01-10T14:15:00"),
    status: "completed",
    downloadUrl: "#"
  },
  {
    id: "3",
    name: "DFSA Q4 2025 Filing",
    generatedAt: new Date("2026-01-05T09:00:00"),
    status: "completed",
    downloadUrl: "#"
  }
];

function ReportTypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; className: string }> = {
    regulatory: { label: "Regulatory", className: "bg-red-500/10 text-red-600" },
    lp: { label: "LP Report", className: "bg-blue-500/10 text-blue-600" },
    audit: { label: "Audit", className: "bg-purple-500/10 text-purple-600" },
    internal: { label: "Internal", className: "bg-green-500/10 text-green-600" }
  };
  
  const { label, className } = config[type] || { label: type, className: "" };
  
  return (
    <Badge variant="secondary" className={`text-xs ${className}`}>
      {label}
    </Badge>
  );
}

function ReportCard({ template, onGenerate }: { template: ReportTemplate; onGenerate: () => void }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    onGenerate();
  };

  return (
    <Card className="hover-elevate" data-testid={`card-template-${template.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{template.name}</CardTitle>
            <CardDescription className="text-xs">{template.description}</CardDescription>
          </div>
          <ReportTypeBadge type={template.type} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {template.sections.map((section, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {section}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Est. {template.estimatedTime}
          </span>
          <Button 
            size="sm" 
            onClick={handleGenerate}
            disabled={isGenerating}
            data-testid={`button-generate-${template.id}`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-1" />
                Generate
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ComplianceReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("q4-2025");
  const [generatedCount, setGeneratedCount] = useState(0);

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const handleReportGenerated = () => {
    setGeneratedCount(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="heading-compliance">
            <FileCheck className="h-8 w-8 text-primary" />
            Compliance Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Auto-generate regulatory filings, LP letters, and audit reports
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          <Zap className="h-4 w-4 mr-2" />
          AI-Powered Generation
        </Badge>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{(stats as any)?.totalClients || 12}</p>
            <p className="text-xs text-muted-foreground">Total Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{(stats as any)?.approved || 8}</p>
            <p className="text-xs text-muted-foreground">KYC Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{(stats as any)?.pending || 3}</p>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{recentReports.length + generatedCount}</p>
            <p className="text-xs text-muted-foreground">Reports Generated</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4 mr-2" />
            Report Templates
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Report History
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Calendar className="h-4 w-4 mr-2" />
            Scheduled Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>Period:</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]" data-testid="select-period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q4-2025">Q4 2025</SelectItem>
                  <SelectItem value="q3-2025">Q3 2025</SelectItem>
                  <SelectItem value="q2-2025">Q2 2025</SelectItem>
                  <SelectItem value="q1-2025">Q1 2025</SelectItem>
                  <SelectItem value="ytd-2025">YTD 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <ReportCard 
                key={template.id} 
                template={template} 
                onGenerate={handleReportGenerated}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recently Generated Reports</CardTitle>
              <CardDescription>
                Download or regenerate previous reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div 
                    key={report.id} 
                    className="flex items-center justify-between p-4 rounded-lg border"
                    data-testid={`report-${report.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Generated {report.generatedAt.toLocaleDateString()} at {report.generatedAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" data-testid={`button-download-${report.id}`}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scheduled Reports</CardTitle>
              <CardDescription>
                Set up automatic report generation on a schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Schedule automatic report generation for quarterly LP letters, 
                monthly KYC summaries, and regulatory filings.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
