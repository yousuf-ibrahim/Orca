import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const DEMO_REPORT = {
  firmName: "Silverline Capital Partners",
  createdAt: new Date().toISOString(),
  aumRange: "$150M–$500M",
  report: {
    executive_summary:
      "Silverline Capital Partners is operating at a Developing (4/10) maturity level, with critical single points of failure across the entire trade-to-NAV lifecycle. The fund's core risk is a Geneva↔Interactive Brokers stack with no middleware, no OMS, and a fund admin reconciliation process that is entirely manual — any corporate action or dividend event will produce position breaks that require forensic investigation across email threads and broker portals.",
    maturity_score: 4,
    maturity_label: "Developing" as const,
    critical_risks: [
      {
        title: "Geneva↔IB Reconciliation Breaks on Corporate Actions",
        description:
          "Advent Geneva and Interactive Brokers exchange position files in incompatible formats with no middleware normalizing them. When IB processes a dividend reinvestment or stock split, Geneva's lot-level accounting won't match IB's aggregated position report, creating a P&L discrepancy that takes hours to manually forensic.",
        severity: "Critical" as const,
        affected_systems: ["Advent Geneva", "Interactive Brokers"],
      },
      {
        title: "No OMS: Trade Lifecycle Lives in Email",
        description:
          "Without an OMS, allocation instructions flow from PMs via email or Bloomberg chat to the prime broker. Any break between execution and settlement requires manually cross-referencing broker confirms, Geneva blotter entries, and IB confirmations — there is no system of record for the trade lifecycle.",
        severity: "Critical" as const,
        affected_systems: ["Interactive Brokers", "Advent Geneva", "Bloomberg"],
      },
      {
        title: "SS&C Shadow NAV Reconciled Manually at Month-End",
        description:
          "SS&C's shadow NAV is reconciled against Geneva monthly using exported spreadsheets. This 1.5-day manual process creates a window where reported NAV and actual NAV are unreconciled, exposing the fund to LP reporting errors and audit findings.",
        severity: "High" as const,
        affected_systems: ["SS&C Fund Admin", "Advent Geneva"],
      },
      {
        title: "Bloomberg PORT Risk Running Off Stale Excel Snapshots",
        description:
          "Bloomberg PORT is licensed but not connected to Geneva via automated position feeds. Risk is calculated off Excel snapshots exported manually, meaning risk reports are 12–24 hours stale and risk limits cannot be enforced in real time.",
        severity: "High" as const,
        affected_systems: ["Bloomberg PORT", "Advent Geneva"],
      },
    ],
    integration_gaps: [
      {
        title: "No position feed from Geneva to Bloomberg PORT",
        description: "Positions are exported manually from Geneva as CSV and imported into Bloomberg PORT",
        between: ["Advent Geneva", "Bloomberg PORT"],
        consequence:
          "Risk reports are 12–24 hours stale. Risk breaches are discovered after the fact. Month-end risk attribution requires manual Excel reconciliation before PORT can run.",
      },
      {
        title: "No IB→Geneva middleware for corporate actions",
        description: "IB corporate action notices arrive via portal; Geneva requires manual lots adjustment",
        between: ["Interactive Brokers", "Advent Geneva"],
        consequence:
          "Every dividend, stock split, or rights issue creates position breaks. Resolving a single complex corporate action (e.g., a spinoff with fractional shares) can take 3–6 hours of ops time.",
      },
      {
        title: "No Geneva→SS&C automated data feed",
        description: "Month-end close requires manual export from Geneva and upload to SS&C",
        between: ["Advent Geneva", "SS&C Fund Admin"],
        consequence:
          "1.5 business days of manual reconciliation at each month-end. A single Geneva entry error will cascade into SS&C, requiring back-and-forth email with the fund admin to identify root cause.",
      },
      {
        title: "No trade notification system between PM and ops",
        description: "Trade allocation instructions communicated via email or Bloomberg chat",
        between: ["Portfolio Management", "Operations"],
        consequence:
          "Any trade error (wrong account, wrong quantity, wrong security) is discovered at end-of-day reconciliation, not at execution. Busted trades require manual reversal and re-entry in both Geneva and IB.",
      },
    ],
    quick_wins: [
      {
        title: "Automate Geneva↔IB position file reconciliation",
        description:
          "Deploy a Python script (or Orca Recon) that pulls the IB daily position file at 5pm and reconciles it against Geneva's EOD positions, flagging breaks by category (corporate action, price, quantity). Eliminates 60% of manual recon time immediately.",
        effort: "Low" as const,
        impact: "High" as const,
        time_to_value: "1 week",
      },
      {
        title: "Set up daily Bloomberg PORT position feed from Geneva",
        description:
          "Configure Geneva's report engine to export a BPIPE-compatible position file at market close and upload it to Bloomberg PORT automatically. Real-time risk visibility for zero incremental license cost.",
        effort: "Low" as const,
        impact: "High" as const,
        time_to_value: "3 days",
      },
      {
        title: "Build a trade blotter in Excel/Notion as interim OMS",
        description:
          "Create a structured trade blotter with required fields (security, quantity, account, execution price, time, broker) shared between PM and ops. Not ideal but eliminates email-based trade instructions immediately.",
        effort: "Low" as const,
        impact: "Medium" as const,
        time_to_value: "2 days",
      },
      {
        title: "Document the month-end close checklist",
        description:
          "Codify the current manual SS&C reconciliation process in a step-by-step runbook. Reduces key-person risk on the ops head and makes the process trainable.",
        effort: "Low" as const,
        impact: "Medium" as const,
        time_to_value: "1 day",
      },
    ],
    roadmap: [
      {
        phase: 1 as const,
        title: "Stabilize Recon & Reduce Manual Ops",
        timeline: "Weeks 1–4",
        actions: [
          "Automate Geneva↔IB daily position reconciliation with automated break reporting",
          "Configure Bloomberg PORT daily position feed from Geneva report engine",
          "Document month-end close checklist and assign backup ops owner",
          "Implement structured trade blotter to eliminate email-based allocations",
        ],
        outcome:
          "Daily recon breaks are caught automatically, risk reporting is current, and the ops team has a backup for key-person dependencies.",
      },
      {
        phase: 2 as const,
        title: "Integrate SS&C and Add OMS Controls",
        timeline: "Weeks 5–12",
        actions: [
          "Set up automated Geneva→SS&C data feed to eliminate month-end manual export",
          "Evaluate lightweight OMS (Bloomberg TSOX or SS&C Eze) for trade lifecycle control",
          "Connect IB corporate action feed to Geneva lot-level accounting",
          "Build LP reporting dashboard from Geneva data, reducing report prep time",
        ],
        outcome:
          "Month-end close drops from 1.5 days to under 4 hours. Trade breaks are caught at execution, not EOD. LP reports are generated in under 2 hours.",
      },
      {
        phase: 3 as const,
        title: "Build Institutional-Grade Data Infrastructure",
        timeline: "Weeks 13–24",
        actions: [
          "Deploy a central data warehouse (Snowflake or DuckDB) as single source of truth for positions",
          "Automate investor reporting from warehouse data, eliminating Excel-based LP letters",
          "Evaluate risk system upgrade (Axioma or MSCI Barra) to replace Bloomberg PORT workarounds",
          "Implement data lineage tracking for audit trail across Geneva, IB, and SS&C",
        ],
        outcome:
          "A fully integrated ops stack where every position, trade, and NAV figure has an auditable lineage from execution to LP report.",
      },
    ],
    orca_recommendation:
      "For Silverline Capital Partners, Orca would start with Orca Recon — our automated reconciliation engine that connects directly to Advent Geneva and Interactive Brokers prime broker files. Within a week, we would have your Geneva↔IB position breaks categorized by type (price, quantity, corporate action), with automated email alerts to your ops team on any break above $10K. This immediately eliminates the daily 2–3 hours your ops person spends manually comparing position files. From there, we would configure your Bloomberg PORT feed from Geneva's report engine, giving you real-time risk visibility at zero additional cost. The combination of these two integrations — which Orca deploys as a managed service — would move you from a 4/10 to a 6/10 maturity score within 60 days, and free up enough ops capacity to add the SS&C automation in month three.",
  },
};

type Report = typeof DEMO_REPORT.report;

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

function EffortImpactMatrix({ quickWins }: { quickWins: Report["quick_wins"] }) {
  const levelToNum = (level: string) => level === "Low" ? 0 : level === "Medium" ? 1 : 2;
  const colors = ["bg-info/80", "bg-primary/80", "bg-success/80", "bg-warning/80", "bg-error/80"];

  return (
    <div className="relative h-72 border border-border rounded-lg overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-px bg-border">
        {[...Array(9)].map((_, i) => <div key={i} className="bg-card" />)}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-around pb-1 px-2">
        {["Low Effort", "Med Effort", "High Effort"].map((l) => (
          <span key={l} className="text-xs text-muted-foreground">{l}</span>
        ))}
      </div>
      <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-around pl-1">
        {["High", "Med", "Low"].map((l) => (
          <span key={l} className="text-xs text-muted-foreground">{l}</span>
        ))}
      </div>
      <div className="absolute inset-0 pb-6 pl-8">
        {quickWins.map((qw, i) => {
          const x = levelToNum(qw.effort);
          const y = 2 - levelToNum(qw.impact);
          return (
            <div
              key={i}
              className={`absolute flex h-6 w-6 items-center justify-center rounded-full ${colors[i % colors.length]} text-white text-xs font-bold cursor-pointer`}
              style={{ left: `${(x / 3) * 100 + 16}%`, top: `${(y / 3) * 100 + 5}%` }}
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

function RoadmapTimeline({ roadmap }: { roadmap: Report["roadmap"] }) {
  const phaseColors = ["border-info bg-info/5", "border-primary bg-primary/5", "border-success bg-success/5"];
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

export default function AuditDemo() {
  const [, setLocation] = useLocation();
  const { report, firmName, aumRange } = DEMO_REPORT;

  return (
    <div className="max-w-4xl mx-auto space-y-8 print:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 print:hidden">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{firmName}</h1>
              <Badge variant="secondary" className="text-xs">Sample Report</Badge>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              <span>·</span>
              <span>{aumRange} AUM</span>
              <span>·</span>
              <span>Long/Short Equity</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MaturityGauge score={report.maturity_score} label={report.maturity_label} />
          <div className="flex flex-col gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/audit")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Run Your Audit
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
                <div className="flex flex-wrap gap-1.5">
                  {risk.affected_systems.map((sys) => (
                    <Badge key={sys} variant="secondary" className="text-xs">{sys}</Badge>
                  ))}
                </div>
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
            <p className="text-xs text-muted-foreground mb-3">Effort vs. Impact matrix</p>
            <EffortImpactMatrix quickWins={report.quick_wins} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-3">Numbered items correspond to matrix</p>
            <div className="space-y-3">
              {report.quick_wins.map((qw, i) => {
                const colors = ["bg-info/80", "bg-primary/80", "bg-success/80", "bg-warning/80"];
                return (
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
                );
              })}
            </div>
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

      <Card className="border-l-4 border-primary bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-primary">Orca's Recommendation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{report.orca_recommendation}</p>
          <Button
            onClick={() => window.location.href = "mailto:hello@tryorca.com?subject=Infrastructure%20Audit%20Discovery%20Call"}
            data-testid="button-discovery-call-demo"
          >
            Book a Discovery Call
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
