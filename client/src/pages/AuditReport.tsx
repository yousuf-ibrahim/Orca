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
  Building2,
  ExternalLink,
  CheckCircle2,
  Info,
  Target,
  ListChecks,
  GitMerge,
  Handshake,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Report {
  // New structure
  headline?: string;
  top_priority?: {
    title: string;
    why: string;
    what_orca_does: string;
    timeline: string;
    outcome: string;
  };
  action_plan?: Array<{
    when: "This week" | "This month" | "This quarter";
    action: string;
    role?: string;
    effort: "Low" | "Medium" | "High";
    impact: "Low" | "Medium" | "High";
    outcome: string;
  }>;
  orca_engagement?: {
    recommended_start: string;
    first_30_days: string;
    investment: string;
    roi_framing: string;
  };

  // Shared / updated
  executive_summary: string;
  maturity_score: number;
  maturity_label: "Early Stage" | "Developing" | "Functional" | "Mature" | "Institutional";
  critical_risks: Array<{
    title: string;
    description: string;
    severity: "Critical" | "High" | "Medium";
    affected_systems: string[];
    cost_estimate?: string;
  }>;
  integration_gaps: Array<{
    title: string;
    description: string;
    between: string[];
    consequence: string;
    fix?: string;
  }>;

  // Legacy fields (graceful degradation)
  quick_wins?: Array<{
    title: string;
    description: string;
    effort: "Low" | "Medium" | "High";
    impact: "Low" | "Medium" | "High";
    time_to_value?: string;
  }>;
  roadmap?: Array<{
    phase: 1 | 2 | 3;
    title: string;
    timeline: string;
    actions: string[];
    outcome: string;
  }>;
  orca_recommendation?: string;
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function MaturityGauge({ score, label }: { score: number; label: string }) {
  const getColor = (s: number) => {
    if (s <= 4) return { stroke: "hsl(var(--error))", text: "text-error" };
    if (s <= 7) return { stroke: "hsl(var(--warning))", text: "text-warning" };
    return { stroke: "hsl(var(--success))", text: "text-success" };
  };
  const color = getColor(score);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={color.stroke} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
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
  return <Badge variant="outline" className={`text-xs ${styles[severity]}`}>{severity}</Badge>;
}

function RoleBadge({ role }: { role?: string }) {
  if (!role) return null;
  const styles: Record<string, string> = {
    "Ops Team": "bg-info/10 text-info border-info/20",
    "IT": "bg-primary/10 text-primary border-primary/20",
    "External Vendor": "bg-success/10 text-success border-success/20",
    "Leadership": "bg-warning/10 text-warning border-warning/20",
  };
  const cls = styles[role] || "bg-muted text-muted-foreground";
  return <Badge variant="outline" className={`text-xs ${cls}`}>{role}</Badge>;
}

function EffortImpactBadges({ effort, impact }: { effort: string; impact: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Badge variant="outline" className="text-xs">Effort: {effort}</Badge>
      <Badge variant="outline" className="text-xs">Impact: {impact}</Badge>
    </div>
  );
}

// ─── Section: Top Priority ───────────────────────────────────────────────────

function TopPrioritySection({ priority }: { priority: NonNullable<Report["top_priority"]> }) {
  return (
    <Card className="border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-sm font-semibold text-primary uppercase tracking-wider">
            Top Priority
          </CardTitle>
        </div>
        <p className="text-base font-bold mt-2">{priority.title}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Why this first</p>
            <p className="text-sm">{priority.why}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">What Orca does</p>
            <p className="text-sm">{priority.what_orca_does}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Timeline</p>
            <p className="text-sm font-medium">{priority.timeline}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Outcome</p>
            <p className="text-sm">{priority.outcome}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Section: Action Plan ────────────────────────────────────────────────────

function ActionPlanSection({ items }: { items: NonNullable<Report["action_plan"]> }) {
  const groups: Array<{ label: "This week" | "This month" | "This quarter"; color: string; dot: string }> = [
    { label: "This week", color: "border-error/40 bg-error/5", dot: "bg-error" },
    { label: "This month", color: "border-warning/40 bg-warning/5", dot: "bg-warning" },
    { label: "This quarter", color: "border-info/40 bg-info/5", dot: "bg-info" },
  ];

  return (
    <div className="space-y-4">
      {groups.map(({ label, color, dot }) => {
        const groupItems = items.filter((a) => a.when === label);
        if (groupItems.length === 0) return null;
        return (
          <div key={label}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-2 w-2 rounded-full ${dot}`} />
              <h3 className="text-sm font-semibold">{label}</h3>
            </div>
            <div className={`rounded-lg border-2 ${color} divide-y divide-border/50`}>
              {groupItems.map((item, i) => (
                <div key={i} className="p-4 space-y-2">
                  <p className="text-sm font-medium">{item.action}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <RoleBadge role={item.role} />
                    <EffortImpactBadges effort={item.effort} impact={item.impact} />
                  </div>
                  <p className="text-xs text-muted-foreground">{item.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Section: Working with Orca ──────────────────────────────────────────────

function OrcaEngagementSection({ engagement }: { engagement: NonNullable<Report["orca_engagement"]> }) {
  const fields = [
    { label: "Where we start", value: engagement.recommended_start },
    { label: "First 30 days", value: engagement.first_30_days },
    { label: "Engagement scope", value: engagement.investment },
    { label: "Why the ROI makes sense", value: engagement.roi_framing },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map(({ label, value }) => (
        <div key={label} className="space-y-1">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">{label}</p>
          <p className="text-sm leading-relaxed">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Legacy: Quick Wins list ─────────────────────────────────────────────────

function LegacyQuickWins({ items }: { items: NonNullable<Report["quick_wins"]> }) {
  return (
    <div className="space-y-3">
      {items.map((qw, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/50">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
            {i + 1}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-sm font-medium">{qw.title}</p>
            <p className="text-xs text-muted-foreground">{qw.description}</p>
            <div className="flex flex-wrap gap-1.5">
              <EffortImpactBadges effort={qw.effort} impact={qw.impact} />
              {qw.time_to_value && <span className="text-xs text-muted-foreground">{qw.time_to_value}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Legacy: Roadmap ─────────────────────────────────────────────────────────

function LegacyRoadmap({ roadmap }: { roadmap: NonNullable<Report["roadmap"]> }) {
  const phaseColors = ["border-info bg-info/5", "border-primary bg-primary/5", "border-success bg-success/5"];
  const dotColors = ["bg-info", "bg-primary", "bg-success"];
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {roadmap.map((phase, i) => (
        <div key={phase.phase} className={`flex-1 min-w-56 border-2 rounded-lg p-4 space-y-3 ${phaseColors[i] ?? "border-border bg-muted/5"}`}>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${dotColors[i] ?? "bg-muted"}`} />
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

// ─── Main content renderer (shared between /audit/:id and /audit/demo) ───────

export function AuditReportContent({
  firmName,
  createdAt,
  aumRange,
  strategy,
  report,
  onBack,
  backLabel = "New Audit",
}: {
  firmName: string;
  createdAt: string;
  aumRange?: string;
  strategy?: string;
  report: Report;
  onBack: () => void;
  backLabel?: string;
}) {
  const hasNewStructure = !!(report.top_priority || report.action_plan || report.orca_engagement);

  return (
    <div className="space-y-8 print:space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 print:hidden">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{firmName}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              {aumRange && <><span>·</span><span>{aumRange} AUM</span></>}
              {strategy && <><span>·</span><span>{strategy}</span></>}
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
            <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-back-to-audit">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLabel}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Headline pull-quote ── */}
      {report.headline && (
        <div className="border-l-4 border-warning pl-4 py-1">
          <p className="text-base font-semibold text-warning leading-snug">{report.headline}</p>
        </div>
      )}

      {/* ── Executive Summary ── */}
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

      {/* ── Top Priority (new structure) ── */}
      {report.top_priority && <TopPrioritySection priority={report.top_priority} />}

      {/* ── Critical Risks ── */}
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
                {risk.cost_estimate && (
                  <p className="text-xs text-warning/80 font-medium">{risk.cost_estimate}</p>
                )}
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

      {/* ── Integration Gaps ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <GitMerge className="h-4 w-4 text-warning" />
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
                    {hasNewStructure && (
                      <th className="text-left p-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Fix</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {report.integration_gaps.map((gap, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-medium align-top">
                        <div>{gap.title}</div>
                        {gap.description && (
                          <p className="text-xs text-muted-foreground mt-1 font-normal">{gap.description}</p>
                        )}
                      </td>
                      <td className="p-3 align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {gap.between.map((sys) => (
                            <Badge key={sys} variant="outline" className="text-xs">{sys}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground text-xs align-top">{gap.consequence}</td>
                      {hasNewStructure && (
                        <td className="p-3 text-xs align-top text-success/90">{gap.fix ?? "—"}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Action Plan (new) OR Quick Wins (legacy) ── */}
      {report.action_plan && report.action_plan.length > 0 ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="h-4 w-4 text-success" />
            <h2 className="text-lg font-semibold">Action Plan</h2>
          </div>
          <ActionPlanSection items={report.action_plan} />
        </div>
      ) : report.quick_wins && report.quick_wins.length > 0 ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="h-4 w-4 text-success" />
            <h2 className="text-lg font-semibold">Quick Wins</h2>
          </div>
          <LegacyQuickWins items={report.quick_wins} />
        </div>
      ) : null}

      {/* ── Roadmap (legacy only) ── */}
      {!hasNewStructure && report.roadmap && report.roadmap.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-info" />
            <h2 className="text-lg font-semibold">Roadmap</h2>
          </div>
          <LegacyRoadmap roadmap={report.roadmap} />
        </div>
      )}

      {/* ── Working with Orca (new) OR Orca's Recommendation (legacy) ── */}
      <Card className="border-l-4 border-primary bg-primary/5 print:border print:border-l-4">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Handshake className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold text-primary">
              {report.orca_engagement ? "Working with Orca" : "Orca's Recommendation"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {report.orca_engagement ? (
            <OrcaEngagementSection engagement={report.orca_engagement} />
          ) : (
            <p className="text-sm leading-relaxed">{report.orca_recommendation}</p>
          )}
          <div className="pt-2">
            <Button
              onClick={() => window.location.href = "mailto:hello@tryorca.com?subject=Infrastructure%20Audit%20Discovery%20Call"}
              data-testid="button-discovery-call"
            >
              Book a Discovery Call
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────

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
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
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
        <p className="text-muted-foreground">This audit is still being generated. Please refresh in a moment.</p>
      </div>
    );
  }

  const formData = audit.formData as any;

  return (
    <div className="max-w-4xl mx-auto print:max-w-full">
      <AuditReportContent
        firmName={audit.firmName}
        createdAt={audit.createdAt as unknown as string}
        aumRange={formData?.fundProfile?.aumRange}
        strategy={formData?.fundProfile?.strategies?.join(", ")}
        report={audit.report as unknown as Report}
        onBack={() => setLocation("/audit")}
        backLabel="New Audit"
      />
    </div>
  );
}
