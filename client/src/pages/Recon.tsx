import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  AlertTriangle, CheckCircle2, Clock, XCircle, RefreshCw,
  TrendingDown, Layers, Search, Filter, ChevronRight,
  AlertCircle, Zap, ShieldCheck, BarChart3,
} from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import type { ReconRun, ReconBreak } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    open: "bg-red-500/15 text-red-400 border-red-500/30",
    acknowledged: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    investigating: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    resolved: "bg-green-500/15 text-green-400 border-green-500/30",
    escalated: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    suppressed: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    completed: "bg-green-500/15 text-green-400 border-green-500/30",
    failed: "bg-red-500/15 text-red-400 border-red-500/30",
    running: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[status] || "bg-muted text-muted-foreground"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const variants: Record<string, string> = {
    low: "bg-slate-500/15 text-slate-400",
    medium: "bg-yellow-500/15 text-yellow-400",
    high: "bg-orange-500/15 text-orange-400",
    critical: "bg-red-500/15 text-red-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[priority] || ""}`}>
      {priority}
    </span>
  );
}

function BreakTypeLabel({ type }: { type: string }) {
  const labels: Record<string, { label: string; icon: React.ReactNode }> = {
    position_quantity: { label: "Qty Mismatch", icon: <TrendingDown className="h-3 w-3" /> },
    price_mismatch: { label: "Price Break", icon: <BarChart3 className="h-3 w-3" /> },
    cash_break: { label: "Cash Break", icon: <AlertCircle className="h-3 w-3" /> },
    missing_position: { label: "Missing Position", icon: <XCircle className="h-3 w-3" /> },
    extra_position: { label: "Extra Position", icon: <Zap className="h-3 w-3" /> },
    corporate_action: { label: "Corp Action", icon: <Layers className="h-3 w-3" /> },
  };
  const entry = labels[type] || { label: type, icon: null };
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      {entry.icon}
      {entry.label}
    </span>
  );
}

function formatCurrency(val: string | number | null | undefined) {
  if (!val) return "—";
  const n = typeof val === "string" ? parseFloat(val) : val;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

function formatQty(val: string | number | null | undefined) {
  if (!val) return "—";
  const n = typeof val === "string" ? parseFloat(val) : val;
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// Simulated recon data for demo — in production these come from custodian file ingestion
const DEMO_RUNS: ReconRun[] = [
  {
    id: 1, firmId: 1, custodianId: 1, runDate: "2026-03-19", status: "completed",
    totalPositions: 142, matchedPositions: 136, breakCount: 5, cashBreakCount: 1,
    toleranceBreachCount: 0, runDurationMs: 3420, notes: null, runBy: null,
    createdAt: new Date("2026-03-19T07:00:00"), updatedAt: new Date("2026-03-19T07:00:03"),
  },
  {
    id: 2, firmId: 1, custodianId: 2, runDate: "2026-03-19", status: "completed",
    totalPositions: 98, matchedPositions: 96, breakCount: 2, cashBreakCount: 0,
    toleranceBreachCount: 1, runDurationMs: 2180, notes: null, runBy: null,
    createdAt: new Date("2026-03-19T07:01:00"), updatedAt: new Date("2026-03-19T07:01:02"),
  },
  {
    id: 3, firmId: 1, custodianId: 3, runDate: "2026-03-18", status: "completed",
    totalPositions: 65, matchedPositions: 63, breakCount: 2, cashBreakCount: 0,
    toleranceBreachCount: 0, runDurationMs: 1850, notes: null, runBy: null,
    createdAt: new Date("2026-03-18T07:00:00"), updatedAt: new Date("2026-03-18T07:00:02"),
  },
];

const DEMO_BREAKS: ReconBreak[] = [
  {
    id: 1, firmId: 1, reconRunId: 1, portfolioId: 1, custodianId: 1, securityId: 3,
    breakType: "position_quantity", priority: "high",
    orcaQuantity: "15000", orcaPrice: "142.50", orcaValue: "2137500",
    custodianQuantity: "14500", custodianPrice: "142.50", custodianValue: "2066250",
    quantityDifference: "500", valueDifference: "71250", differencePercent: "3.3333",
    securityName: "Apple Inc", ticker: "AAPL", portfolioName: "Alpha Opportunities Fund",
    custodianName: "Goldman Sachs Prime",
    status: "open", resolutionNotes: null, rootCause: null, resolvedById: null,
    resolvedAt: null, agingDays: 1, breakDate: "2026-03-19",
    createdAt: new Date("2026-03-19T07:00:01"), updatedAt: new Date("2026-03-19T07:00:01"),
  },
  {
    id: 2, firmId: 1, reconRunId: 1, portfolioId: 2, custodianId: 1, securityId: 5,
    breakType: "cash_break", priority: "critical",
    orcaQuantity: null, orcaPrice: null, orcaValue: "2500000",
    custodianQuantity: null, custodianPrice: null, custodianValue: "2450000",
    quantityDifference: null, valueDifference: "50000", differencePercent: "2.0000",
    securityName: "USD Cash", ticker: "CASH.USD", portfolioName: "Beta Long/Short",
    custodianName: "Goldman Sachs Prime",
    status: "investigating", resolutionNotes: "Checking with fund admin re: pending wire", rootCause: null,
    resolvedById: null, resolvedAt: null, agingDays: 1, breakDate: "2026-03-19",
    createdAt: new Date("2026-03-19T07:00:02"), updatedAt: new Date("2026-03-19T09:14:00"),
  },
  {
    id: 3, firmId: 1, reconRunId: 1, portfolioId: 1, custodianId: 1, securityId: 8,
    breakType: "price_mismatch", priority: "medium",
    orcaQuantity: "5000", orcaPrice: "98.75", orcaValue: "493750",
    custodianQuantity: "5000", custodianPrice: "99.10", custodianValue: "495500",
    quantityDifference: "0", valueDifference: "-1750", differencePercent: "-0.3543",
    securityName: "US Treasury 4.5% 2029", ticker: "T 4.5 29", portfolioName: "Alpha Opportunities Fund",
    custodianName: "Goldman Sachs Prime",
    status: "acknowledged", resolutionNotes: "Pricing source lag — Bloomberg vs custodian COB", rootCause: "timing_difference",
    resolvedById: null, resolvedAt: null, agingDays: 1, breakDate: "2026-03-19",
    createdAt: new Date("2026-03-19T07:00:03"), updatedAt: new Date("2026-03-19T08:30:00"),
  },
  {
    id: 4, firmId: 1, reconRunId: 2, portfolioId: 3, custodianId: 2, securityId: 12,
    breakType: "missing_position", priority: "high",
    orcaQuantity: "2000", orcaPrice: "285.30", orcaValue: "570600",
    custodianQuantity: "0", custodianPrice: null, custodianValue: "0",
    quantityDifference: "2000", valueDifference: "570600", differencePercent: "100",
    securityName: "Microsoft Corp", ticker: "MSFT", portfolioName: "Gamma Market Neutral",
    custodianName: "Morgan Stanley Prime",
    status: "open", resolutionNotes: null, rootCause: null, resolvedById: null,
    resolvedAt: null, agingDays: 1, breakDate: "2026-03-19",
    createdAt: new Date("2026-03-19T07:01:01"), updatedAt: new Date("2026-03-19T07:01:01"),
  },
  {
    id: 5, firmId: 1, reconRunId: 2, portfolioId: 3, custodianId: 2, securityId: 7,
    breakType: "position_quantity", priority: "low",
    orcaQuantity: "10200", orcaPrice: "54.20", orcaValue: "552840",
    custodianQuantity: "10000", custodianPrice: "54.20", custodianValue: "542000",
    quantityDifference: "200", valueDifference: "10840", differencePercent: "1.9605",
    securityName: "Nvidia Corp", ticker: "NVDA", portfolioName: "Gamma Market Neutral",
    custodianName: "Morgan Stanley Prime",
    status: "resolved", resolutionNotes: "Corporate action — stock split adjustment applied", rootCause: "corporate_action",
    resolvedById: 1, resolvedAt: new Date("2026-03-19T11:00:00"), agingDays: 0,
    breakDate: "2026-03-19",
    createdAt: new Date("2026-03-19T07:01:02"), updatedAt: new Date("2026-03-19T11:00:00"),
  },
  {
    id: 6, firmId: 1, reconRunId: 3, portfolioId: 2, custodianId: 3, securityId: 2,
    breakType: "position_quantity", priority: "medium",
    orcaQuantity: "3500", orcaPrice: "178.90", orcaValue: "626150",
    custodianQuantity: "3300", custodianPrice: "178.90", custodianValue: "590370",
    quantityDifference: "200", valueDifference: "35780", differencePercent: "5.7143",
    securityName: "Alphabet Inc", ticker: "GOOGL", portfolioName: "Beta Long/Short",
    custodianName: "JP Morgan Prime",
    status: "open", resolutionNotes: null, rootCause: null, resolvedById: null,
    resolvedAt: null, agingDays: 2, breakDate: "2026-03-18",
    createdAt: new Date("2026-03-18T07:00:01"), updatedAt: new Date("2026-03-18T07:00:01"),
  },
];

const CUSTODIAN_MAP: Record<number, string> = {
  1: "Goldman Sachs Prime",
  2: "Morgan Stanley Prime",
  3: "JP Morgan Prime",
};

export default function Recon() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Use demo data — in production these would be real API calls
  const breaks = DEMO_BREAKS;
  const runs = DEMO_RUNS;

  const filteredBreaks = breaks.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (priorityFilter !== "all" && b.priority !== priorityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !b.securityName?.toLowerCase().includes(q) &&
        !b.ticker?.toLowerCase().includes(q) &&
        !b.portfolioName?.toLowerCase().includes(q) &&
        !b.custodianName?.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const openBreaks = breaks.filter((b) => b.status === "open").length;
  const criticalBreaks = breaks.filter((b) => b.priority === "critical" && b.status !== "resolved").length;
  const resolvedToday = breaks.filter((b) => b.status === "resolved").length;
  const totalBreaks = breaks.length;

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    // In production: await axios.patch(`/api/recon/breaks/${id}`, { status: newStatus })
    setTimeout(() => {
      setUpdatingId(null);
      toast({
        title: "Break updated",
        description: `Break #${id} marked as ${newStatus.replace(/_/g, " ")}`,
      });
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orca Recon</h1>
          <p className="text-muted-foreground mt-1">
            Automated multi-custodian reconciliation — exceptions, breaks, and resolution workflow
          </p>
        </div>
        <Button className="gap-2" data-testid="button-run-recon">
          <RefreshCw className="h-4 w-4" />
          Run Reconciliation
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Open Breaks</span>
              <XCircle className="h-4 w-4 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-red-400" data-testid="stat-open-breaks">{openBreaks}</p>
            <p className="text-xs text-muted-foreground mt-1">Require attention</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Critical</span>
              <AlertTriangle className="h-4 w-4 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-orange-400" data-testid="stat-critical">{criticalBreaks}</p>
            <p className="text-xs text-muted-foreground mt-1">Critical priority</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Resolved Today</span>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-400" data-testid="stat-resolved">{resolvedToday}</p>
            <p className="text-xs text-muted-foreground mt-1">Closed breaks</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Total Breaks</span>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="text-3xl font-bold" data-testid="stat-total">{totalBreaks}</p>
            <p className="text-xs text-muted-foreground mt-1">All time today</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Recon Runs */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Today's Reconciliation Runs</CardTitle>
          <CardDescription>Custodian-level batch reconciliation status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Custodian</TableHead>
                <TableHead className="text-right">Positions</TableHead>
                <TableHead className="text-right">Matched</TableHead>
                <TableHead className="text-right">Breaks</TableHead>
                <TableHead className="text-right">Cash Breaks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => {
                const matchRate = run.totalPositions
                  ? Math.round(((run.matchedPositions || 0) / run.totalPositions) * 100)
                  : 0;
                return (
                  <TableRow key={run.id} className="border-border/50" data-testid={`row-run-${run.id}`}>
                    <TableCell className="font-medium">{CUSTODIAN_MAP[run.custodianId] || `Custodian ${run.custodianId}`}</TableCell>
                    <TableCell className="text-right">{run.totalPositions}</TableCell>
                    <TableCell className="text-right">
                      <span className={matchRate === 100 ? "text-green-400" : matchRate >= 95 ? "text-yellow-400" : "text-red-400"}>
                        {run.matchedPositions} ({matchRate}%)
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {(run.breakCount || 0) > 0
                        ? <span className="text-red-400 font-medium">{run.breakCount}</span>
                        : <span className="text-green-400">0</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      {(run.cashBreakCount || 0) > 0
                        ? <span className="text-orange-400 font-medium">{run.cashBreakCount}</span>
                        : <span className="text-green-400">0</span>}
                    </TableCell>
                    <TableCell><StatusBadge status={run.status} /></TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">
                      {run.runDurationMs ? `${(run.runDurationMs / 1000).toFixed(1)}s` : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Break Exceptions */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Break Exceptions</CardTitle>
              <CardDescription>All breaks requiring investigation or resolution</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by security, ticker, portfolio…"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-breaks"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]" data-testid="select-priority-filter">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>Security</TableHead>
                <TableHead>Break Type</TableHead>
                <TableHead>Portfolio / Custodian</TableHead>
                <TableHead className="text-right">Orca Side</TableHead>
                <TableHead className="text-right">Custodian Side</TableHead>
                <TableHead className="text-right">Difference</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBreaks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No breaks match the current filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredBreaks.map((b) => (
                  <TableRow
                    key={b.id}
                    className={`border-border/50 ${b.status === "resolved" ? "opacity-60" : ""}`}
                    data-testid={`row-break-${b.id}`}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{b.securityName}</p>
                        <p className="text-xs text-muted-foreground">{b.ticker}</p>
                      </div>
                    </TableCell>
                    <TableCell><BreakTypeLabel type={b.breakType} /></TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{b.portfolioName}</p>
                        <p className="text-xs text-muted-foreground">{b.custodianName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {b.breakType === "cash_break"
                        ? formatCurrency(b.orcaValue)
                        : <>{formatQty(b.orcaQuantity)} <span className="text-muted-foreground text-xs">@ {formatCurrency(b.orcaPrice)}</span></>}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {b.breakType === "cash_break"
                        ? formatCurrency(b.custodianValue)
                        : <>{formatQty(b.custodianQuantity)} <span className="text-muted-foreground text-xs">@ {formatCurrency(b.custodianPrice)}</span></>}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={parseFloat(b.valueDifference || "0") > 0 ? "text-red-400 font-medium" : "text-green-400 font-medium"}>
                        {formatCurrency(b.valueDifference)}
                      </span>
                    </TableCell>
                    <TableCell><PriorityBadge priority={b.priority} /></TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
                    <TableCell>
                      {b.status !== "resolved" && (
                        <div className="flex gap-1">
                          {b.status === "open" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleUpdateStatus(b.id, "acknowledged")}
                              disabled={updatingId === b.id}
                              data-testid={`button-ack-${b.id}`}
                            >
                              Ack
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-green-400 hover:text-green-300"
                            onClick={() => handleUpdateStatus(b.id, "resolved")}
                            disabled={updatingId === b.id}
                            data-testid={`button-resolve-${b.id}`}
                          >
                            Resolve
                          </Button>
                        </div>
                      )}
                      {b.resolutionNotes && (
                        <p className="text-xs text-muted-foreground mt-1 max-w-[160px] truncate" title={b.resolutionNotes}>
                          {b.resolutionNotes}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
