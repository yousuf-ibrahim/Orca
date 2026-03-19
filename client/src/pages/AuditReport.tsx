import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Audit } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Printer,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Zap,
  Map,
  Building2,
  ExternalLink,
  CheckCircle2,
  Info,
} from "lucide-react";

interface Report {
  executive_summary: string;
  maturity_score: number;
  maturity_label: "Early Stage" | "Developing" | "Functional" | "Mature" | "Institutional";
  critical_risks: Array<{
    title: string;
    description: string;
    severity: "Critical" | "High" | "Medium";
    affected_systems: string[];
  }>;
  integration_gaps: Array<{
    title: string;
    description: string;
    between: string[];
    consequence: string;
  }>;
  quick_wins: Array<{
    title: string;
    description: string;
    effort: "Low" | "Medium" | "High";
    impact: "Low" | "Medium" | "High";
    time_to_value: string;
  }>;
  roadmap: Array<{
    phase: 1 | 2 | 3;
    title: string;
    timeline: string;
    actions: string[];
    outcome: string;
  }>;
  orca_recommendation: string;
}

function MaturityGauge({ score, label }: { score: number; label: string }) {
  const getColor = (s: number) => {
    if (s <= 4) return { stroke: "hsl(var(--error))", text: "text-error" };
    if (s <= 7) return { stroke: "hsl(var(--warning))", text: "text-warning" };
    return { stroke: "hsl(var(--success))", text: "text-success" };
  };

  const color = getColor(score);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const dashOffset = circumference - progress;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 50 50)"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${color.text}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/10</span>
        </div>
      </div>
      <Badge variant="outline" className={`text-xs ${color.text}`}>{label}</Badge>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: "Critical" | "High" | "Medium" }) {
  const styles = {
    Critical: "bg-error/10 text-error border-error/20",
    High: "bg-warning/10 text-warning border-warning/20",
    Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };
  return (
    <Badge variant="outline" className={`text-xs ${styles[severity]}`}>
      {severity}
    </Badge>
  );
}

function EffortImpactMatrix({ quickWins }: { quickWins: Report["quick_wins"] }) {
  const levelToNum = (level: "Low" | "Medium" | "High") =>
    level === "Low" ? 0 : level === "Medium" ? 1 : 2;

  const colors = ["bg-info/80", "bg-primary/80", "bg-success/80", "bg-warning/80", "bg-error/80"];

  return (
    <div className="relative h-72 border border-border rounded-lg overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-px bg-border">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-card" />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-around pb-1 px-2">
        {["Low Effort", "Med Effort", "High Effort"].map((l) => (
          <span key={l} className="text-xs text-muted-foreground">{l}</span>
        ))}
      </div>
      <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-around pl-1">
        {["High", "Med", "Low"].map((l) => (
          <span key={l} className="text-xs text-muted-foreground" style={{ writingMode: "horizontal-tb" }}>
            {l}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 pb-6 pl-8">
        {quickWins.map((qw, i) => {
          const x = levelToNum(qw.effort);
          const y = 2 - levelToNum(qw.impact);
          const left = `${(x / 3) * 100 + 16}%`;
          const top = `${(y / 3) * 100 + 5}%`;
          return (
            <div
              key={i}
              className={`absolute flex h-6 w-6 items-center justify-center rounded-full ${colors[i % colors.length]} text-white text-xs font-bold cursor-pointer`}
              style={{ left, top }}
              title={`${qw.title}: ${qw.description}`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickWinLegend({ quickWins }: { quickWins: Report["quick_wins"] }) {
  const colors = ["bg-info/80", "bg-primary/80", "bg-success/80", "bg-warning/80", "bg-error/80"];
  return (
    <div className="space-y-2">
      {quickWins.map((qw, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${colors[i % colors.length]} text-white text-xs font-bold`}>
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{qw.title}</p>
            <p className="text-xs text-muted-foreground">{qw.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">Effort: {qw.effort}</Badge>
              <Badge variant="outline" className="text-xs">Impact: {qw.impact}</Badge>
              <span className="text-xs text-muted-foreground">{qw.time_to_value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RoadmapTimeline({ roadmap }: { roadmap: Report["roadmap"] }) {
  const phaseColors = [
    "border-info bg-info/5",
    "border-primary bg-primary/5",
    "border-success bg-success/5",
  ];
  const dotColors = ["bg-info", "bg-primary", "bg-success"];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {roadmap.map((phase, i) => (
        <div key={phase.phase} className={`flex-1 min-w-56 border-2 rounded-lg p-4 space-y-3 ${phaseColors[i]}`}>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${dotColors[i]}`} />
            <div>
              <p className="text-xs text-muted-foreground">{phase.timeline}</p>
              <p className="font-semibold text-sm">{phase.title}</p>
            </div>
          </div>
          <ul className="space-y-1.5">
            {phase.actions.map((action, j) => (
              <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0 text-muted-foreground/60" />
                {action}
              </li>
            ))}
          </ul>
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs font-medium text-foreground/70">{phase.outcome}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AuditReportContent({ audit }: { audit: Audit & { report: Report } }) {
  const report = audit.report;
  const formData = audit.formData as any;
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-8 print:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 print:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 print:hidden">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{audit.firmName}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(audit.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              {formData?.fundProfile?.aumRange && (
                <>
                  <span>·</span>
                  <span>{formData.fundProfile.aumRange} AUM</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MaturityGauge score={report.maturity_score} label={report.maturity_label} />
          <div className="flex flex-col gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={() => window.print()} data-testid="button-print-report">
              <Printer className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/audit")} data-testid="button-back-to-audit">
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Audit
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{report.executive_summary}</p>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-error" />
          <h2 className="text-lg font-semibold">Critical Risks</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.critical_risks.map((risk, i) => (
            <Card key={i} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold">{risk.title}</CardTitle>
                  <SeverityBadge severity={risk.severity} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{risk.description}</p>
                {risk.affected_systems?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {risk.affected_systems.map((sys) => (
                      <Badge key={sys} variant="secondary" className="text-xs">{sys}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <ExternalLink className="h-4 w-4 text-warning" />
          <h2 className="text-lg font-semibold">Integration Gaps</h2>
        </div>
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Gap</th>
                    <th className="text-left p-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Between</th>
                    <th className="text-left p-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Consequence</th>
                  </tr>
                </thead>
                <tbody>
                  {report.integration_gaps.map((gap, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-medium align-top">{gap.title}</td>
                      <td className="p-3 align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {gap.between.map((sys) => (
                            <Badge key={sys} variant="outline" className="text-xs">{sys}</Badge>
                          ))}
                        </div>
                        {gap.description && (
                          <p className="text-xs text-muted-foreground mt-1">{gap.description}</p>
                        )}
                      </td>
                      <td className="p-3 text-muted-foreground text-xs align-top">{gap.consequence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-success" />
          <h2 className="text-lg font-semibold">Quick Wins</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-muted-foreground mb-3">Effort vs. Impact matrix — hover dots for details</p>
            <EffortImpactMatrix quickWins={report.quick_wins} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-3">Numbered items correspond to matrix</p>
            <QuickWinLegend quickWins={report.quick_wins} />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Map className="h-4 w-4 text-info" />
          <h2 className="text-lg font-semibold">Roadmap</h2>
        </div>
        <RoadmapTimeline roadmap={report.roadmap} />
      </div>

      <Card className="border-l-4 border-primary bg-primary/5 print:border print:border-l-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-primary">Orca's Recommendation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{report.orca_recommendation}</p>
          <Button
            onClick={() => window.location.href = "mailto:hello@tryorca.com?subject=Infrastructure%20Audit%20Discovery%20Call"}
            data-testid="button-discovery-call"
          >
            Book a Discovery Call
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuditReport() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: audit, isLoading, error } = useQuery<Audit>({
    queryKey: ["/api/audit", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/audit/${params.id}`);
      if (!res.ok) throw new Error("Audit not found");
      return res.json();
    },
    enabled: !!params.id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <AlertTriangle className="h-12 w-12 text-error mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Audit not found</h2>
        <p className="text-muted-foreground mb-6">This audit report doesn't exist or may have been removed.</p>
        <Button onClick={() => setLocation("/audit")}>Start New Audit</Button>
      </div>
    );
  }

  if (!audit.report) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Report pending</h2>
        <p className="text-muted-foreground">This audit is still being generated. Please wait a moment and refresh.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto print:max-w-full">
      <AuditReportContent audit={audit as any} />
    </div>
  );
}
