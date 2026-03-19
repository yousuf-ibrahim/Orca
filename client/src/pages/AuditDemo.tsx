import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AuditReportContent } from "./AuditReport";

const SILVERLINE_REPORT = {
  headline:
    "You are one corporate action away from a NAV error that your fund admin catches before you do.",

  executive_summary:
    "Silverline Capital Partners is operating at a Developing (4/10) maturity level with critical single points of failure across every stage of the trade-to-NAV lifecycle. The fund's Geneva↔Interactive Brokers stack has no identifier normalization layer, meaning any reorganization event — spin-off, rights issue, ticker change — creates a silent position mismatch that neither system will surface automatically. Without an OMS, the trade lifecycle exists simultaneously in three places with no system of record, and any break requires 2–4 hours of inbox forensics. Left unaddressed, the most likely outcome is a NAV error discovered by SS&C before the ops team, surfaced to the LP base at exactly the wrong moment.",

  maturity_score: 4,
  maturity_label: "Developing" as const,

  top_priority: {
    title: "Deploy a reference data mapping layer between Geneva and Interactive Brokers",
    why:
      "Geneva books positions using SEDOL and ISIN. Interactive Brokers reports positions using ticker symbols. When a corporate action occurs — a spin-off, ticker change, rights issue — the two systems produce position files with no common identifier. The result is a silent break: Geneva shows the pre-action position, IB shows the post-action position, and neither system flags the discrepancy. You find out when SS&C calls.",
    what_orca_does:
      "Orca deploys a lightweight reference data mapping service that uses ISIN as the common key across Geneva and IB position files. The service runs nightly, normalizes identifiers across both systems, and produces a daily reconciliation report with breaks categorized by type: price variance, quantity mismatch, corporate action, or missing security. Any break above $10K triggers an automatic email alert to the ops team.",
    timeline: "2 weeks to deploy, 1 week to validate",
    outcome:
      "Daily Geneva↔IB reconciliation is automated. Corporate action breaks are caught within 24 hours instead of at month-end. The ops team recovers approximately 6 hours per month previously spent on manual position file comparison.",
  },

  critical_risks: [
    {
      title: "Geneva↔IB Silent Position Breaks on Corporate Actions",
      description:
        "Geneva books on SEDOL/ISIN; Interactive Brokers reports on ticker. When a corporate action occurs — spin-off, rights issue, merger — the two systems produce position records with no common identifier. There is no middleware to reconcile them. The break is silent: it accumulates in the general ledger until month-end, when SS&C identifies the discrepancy during shadow NAV reconciliation. By then, the position has been marked incorrectly for weeks.",
      severity: "Critical" as const,
      affected_systems: ["Advent Geneva", "Interactive Brokers"],
      cost_estimate:
        "~6 hrs/month of ops time to manually research and resolve breaks (~$450/month). Tail risk: a missed break creates a NAV error that requires a fund admin restatement — LP notification event.",
    },
    {
      title: "No OMS: Trade Lifecycle Lives in Three Systems Simultaneously",
      description:
        "Every trade executed through Interactive Brokers exists simultaneously in: (1) the IB execution blotter, (2) email confirmation threads between the PM and ops, and (3) Advent Geneva after manual booking. There is no system of record connecting them. When a break occurs — wrong account, wrong lot, partial fill booked as whole — the forensic process requires cross-referencing all three sources. Average investigation time for a disputed trade: 2–4 hours.",
      severity: "Critical" as const,
      affected_systems: ["Interactive Brokers", "Advent Geneva"],
      cost_estimate:
        "2–4 hrs per break event (~$150–$300 per incident). Estimated 3–5 incidents/month = $450–$1,500/month in ops time. Settlement failures that go undetected accumulate as failed trade charges from the prime broker.",
    },
    {
      title: "SS&C Shadow NAV: 1.5-Day Window of Unreconciled Exposure",
      description:
        "SS&C reconciles shadow NAV against Geneva at month-end using manually exported spreadsheets. This process takes 1.5 business days. During that window, the reported NAV (from Geneva) and the verified NAV (from SS&C) are unreconciled. Any LP redemption request received during month-end close is processed against an unverified NAV. A single Geneva booking error in this window creates an over- or under-redemption that requires a NAV restatement.",
      severity: "High" as const,
      affected_systems: ["SS&C Fund Admin", "Advent Geneva"],
      cost_estimate:
        "~12 hrs of ops time per month-end (~$900/month). Tail risk: an LP redemption processed against unverified NAV creates a restatement obligation — legal review cost $15K–$50K per incident.",
    },
    {
      title: "Bloomberg PORT Running on 24-Hour-Stale Position Data",
      description:
        "Bloomberg PORT is licensed but not connected to a live Geneva position feed. Positions are exported manually from Geneva as a CSV and uploaded into PORT. During normal markets, this means factor analysis and concentration risk reports are 12–24 hours stale. During volatile periods — when concentration limits are most likely to be breached — the risk team is looking at yesterday's positions. PORT alerts fire after the breach, not before.",
      severity: "High" as const,
      affected_systems: ["Bloomberg PORT", "Advent Geneva"],
      cost_estimate:
        "~2 hrs/week of ops time for manual export and upload (~$600/month). Risk exposure: a concentration breach that isn't caught until the next day's PORT run creates compliance documentation issues with your prime broker.",
    },
  ],

  integration_gaps: [
    {
      title: "No identifier normalization between Geneva and IB",
      description: "Geneva uses SEDOL/ISIN; IB reports in ticker symbols",
      between: ["Advent Geneva", "Interactive Brokers"],
      consequence:
        "Every corporate action creates a silent position break. Spin-offs produce phantom positions in one system. Rights issues create quantity mismatches. The break accumulates silently until month-end reconciliation.",
      fix: "Deploy a reference data mapping service using ISIN as the common key. Normalize all position files before comparison. Automate break reporting by category.",
    },
    {
      title: "No automated Geneva→SS&C data feed",
      description: "Month-end close requires manual CSV export from Geneva and upload to SS&C",
      between: ["Advent Geneva", "SS&C Fund Admin"],
      consequence:
        "1.5 business days of manual reconciliation per month-end. Any Geneva entry error must be communicated to SS&C by email, creating a back-and-forth cycle that extends the reconciliation window.",
      fix: "Configure Geneva's report engine to produce an SS&C-compatible NAV file on a scheduled basis. Automate the upload to SS&C's SFTP. Reduce month-end close from 1.5 days to under 4 hours.",
    },
    {
      title: "No live position feed from Geneva to Bloomberg PORT",
      description: "Positions exported manually from Geneva as CSV, uploaded to PORT ad hoc",
      between: ["Advent Geneva", "Bloomberg PORT"],
      consequence:
        "Risk reports are 12–24 hours stale. Factor exposures, concentration limits, and VaR calculations are based on yesterday's positions. During drawdowns, this is exactly when real-time risk visibility matters most.",
      fix: "Configure Geneva's BPIPE-compatible export to run at market close daily and feed Bloomberg PORT automatically. Zero additional license cost; requires only report configuration.",
    },
    {
      title: "No trade notification system between PM and operations",
      description: "Trade allocation instructions flow via email and Bloomberg chat",
      between: ["Portfolio Management", "Operations / Geneva"],
      consequence:
        "Trade booking in Geneva depends on an ops person reading and interpreting an email or chat message correctly. A misread quantity, wrong account, or missed allocation creates a booking error that isn't caught until EOD reconciliation — or later.",
      fix: "Implement a structured trade blotter (Google Sheets or Notion with required fields) as an interim OMS. Evaluate Bloomberg TSOX or SS&C Eze OMS for full lifecycle control within 90 days.",
    },
  ],

  action_plan: [
    {
      when: "This week" as const,
      action:
        "Pull the last 6 months of corporate action events from Interactive Brokers and cross-reference each one against Geneva's position records. Document every instance where the two systems diverged — this audit alone will show you the full scope of the problem.",
      role: "Ops Team",
      effort: "Low" as const,
      impact: "High" as const,
      outcome:
        "Quantified backlog of position breaks with root cause identified. This becomes the business case for the reconciliation fix.",
    },
    {
      when: "This week" as const,
      action:
        "Document the current month-end close process in a step-by-step runbook, with owner assigned to each step and estimated time. Identify which steps require the ops lead specifically vs. which can be delegated.",
      role: "Ops Team",
      effort: "Low" as const,
      impact: "Medium" as const,
      outcome:
        "Month-end close is no longer a single-person dependency. A second ops person can execute the process from the runbook.",
    },
    {
      when: "This month" as const,
      action:
        "Implement automated ISIN-based position file matching between Geneva and Interactive Brokers. Run nightly, output a break report by category. Set alert thresholds for breaks above $10K.",
      role: "External Vendor",
      effort: "Low" as const,
      impact: "High" as const,
      outcome:
        "Daily reconciliation is automated. Corporate action breaks are caught within 24 hours. Ops team recovers ~6 hours per month.",
    },
    {
      when: "This month" as const,
      action:
        "Configure Geneva's report engine to export a daily position file in BPIPE-compatible format and upload it to Bloomberg PORT automatically at market close.",
      role: "IT",
      effort: "Low" as const,
      impact: "High" as const,
      outcome:
        "Bloomberg PORT risk reports are based on current positions. Concentration limit monitoring becomes real-time.",
    },
    {
      when: "This quarter" as const,
      action:
        "Build the business case for an OMS. Compare Bloomberg TSOX, SS&C Eze OMS, and Flextrade against Silverline's current trade volume, strategy mix, and prime broker setup. Present to CIO with cost/risk framing.",
      role: "Leadership",
      effort: "Medium" as const,
      impact: "High" as const,
      outcome:
        "Decision made on OMS with implementation timeline. Trade lifecycle has a system of record for the first time.",
    },
    {
      when: "This quarter" as const,
      action:
        "Configure an automated Geneva→SS&C data feed for month-end NAV reconciliation. Eliminate the manual CSV export/upload cycle. Target: month-end close under 4 hours.",
      role: "External Vendor",
      effort: "Medium" as const,
      impact: "High" as const,
      outcome:
        "Month-end close drops from 1.5 days to under 4 hours. LP redemptions during close period are processed against verified NAV.",
    },
  ],

  orca_engagement: {
    recommended_start:
      "We would start with the Geneva↔Interactive Brokers reconciliation gap — because it's where you're most exposed right now and because it's the fastest win. The corporate action backlog audit we describe in the action plan takes a day, and the findings will be alarming enough to accelerate every other decision.",
    first_30_days:
      "In the first 30 days, Orca maps your full position file exchange between Geneva and IB, deploys the identifier normalization service, and gets automated daily break reporting live. We also configure your Bloomberg PORT feed from Geneva so your risk team is working on current positions. By day 30, you have two of your four critical risks closed.",
    investment:
      "4-week infrastructure assessment and remediation sprint. Includes full tech stack mapping, automated reconciliation deployment, Bloomberg PORT feed configuration, and a prioritized 90-day roadmap for the OMS decision and SS&C automation.",
    roi_framing:
      "Your ops team is spending approximately $1,950/month on manual work that can be automated in four weeks. The tail risk — a NAV restatement triggered by a corporate action break or an LP redemption against unverified NAV — costs $15K–$50K in legal and fund admin fees, plus LP relationship damage. The question isn't whether to fix this. It's whether you fix it before or after the event that makes you wish you had.",
  },
};

export default function AuditDemo() {
  const [, setLocation] = useLocation();

  return (
    <div className="max-w-4xl mx-auto print:max-w-full">
      {/* Demo banner */}
      <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 print:hidden">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs text-warning border-warning/40 bg-warning/10">
            Sample Report
          </Badge>
          <p className="text-sm text-muted-foreground">
            This is a demonstration report for Silverline Capital Partners. Run your own audit to get a report specific to your fund.
          </p>
        </div>
        <Button size="sm" onClick={() => setLocation("/audit")} data-testid="button-run-your-audit">
          Run Your Audit
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <AuditReportContent
        firmName="Silverline Capital Partners"
        createdAt={new Date().toISOString()}
        aumRange="$150M–$500M"
        strategy="Long/Short Equity"
        report={SILVERLINE_REPORT}
        onBack={() => setLocation("/audit")}
        backLabel="Run Your Audit"
      />
    </div>
  );
}
