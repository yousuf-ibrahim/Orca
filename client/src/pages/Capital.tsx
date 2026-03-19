import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign, Users, TrendingUp, Calendar, ChevronRight,
  ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, Plus,
  Building2, AlertCircle, Percent,
} from "lucide-react";
import type { FundStructure, LpCommitment, CapitalCall, CapitalDistribution } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    draft: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    sent: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    partially_received: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    fully_received: "bg-green-500/15 text-green-400 border-green-500/30",
    committed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    fully_called: "bg-green-500/15 text-green-400 border-green-500/30",
    fundraising: "bg-primary/15 text-primary border-primary/30",
    investing: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    harvesting: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    paid: "bg-green-500/15 text-green-400 border-green-500/30",
    approved: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[status] || "bg-muted text-muted-foreground border-border"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function formatCurrency(val: string | number | null | undefined, compact = false) {
  if (!val) return "$0";
  const n = typeof val === "string" ? parseFloat(val) : val;
  if (compact) {
    if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
    if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
    if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

function formatPct(val: string | number | null | undefined) {
  if (!val) return "0%";
  const n = typeof val === "string" ? parseFloat(val) : val;
  return `${n.toFixed(1)}%`;
}

// Demo data
const DEMO_FUND: FundStructure = {
  id: 1, firmId: 1,
  fundName: "Orca Partners Fund I",
  fundCode: "OPF-I",
  strategyType: "long_short_equity",
  legalStructure: "cayman_exempted",
  currency: "USD",
  vintage: 2023,
  targetFundSize: "250000000",
  hardCap: "300000000",
  totalCommitments: "187500000",
  calledCapital: "112500000",
  uncalledCapital: "75000000",
  distributedCapital: "8750000",
  managementFeeRate: "0.0200",
  performanceFeeRate: "0.2000",
  hurdleRate: "0.0800",
  highWaterMark: true,
  fundAdministrator: "Apex Fund Services",
  auditor: "Deloitte LLP",
  legalCounsel: "Walkers Global",
  primeBroker: "Goldman Sachs Prime Services",
  inceptionDate: "2023-01-15",
  firstCloseDate: "2023-03-31",
  finalCloseDate: null,
  investmentPeriodEnd: "2026-01-15",
  fundTermDate: "2030-01-15",
  status: "investing",
  createdAt: new Date("2023-01-15"), updatedAt: new Date("2026-03-01"),
};

const DEMO_COMMITMENTS: LpCommitment[] = [
  {
    id: 1, firmId: 1, fundId: 1, clientId: 1, lpName: "Al Mansouri Family Office",
    lpType: "family_office", lpJurisdiction: "UAE",
    committedCapital: "25000000", currency: "USD",
    calledCapital: "15000000", uncalledCapital: "10000000", calledPercent: "60.0000",
    distributedCapital: "1500000", netContributions: "13500000",
    commitmentDate: "2023-03-01", firstCloseDate: "2023-03-31", subscribedDate: "2023-02-15",
    subscriptionDocsSigned: true, kycApproved: true, wireReceived: true,
    status: "committed", notes: null,
    createdAt: new Date("2023-03-01"), updatedAt: new Date("2025-12-01"),
  },
  {
    id: 2, firmId: 1, fundId: 1, clientId: 2, lpName: "Thornton Capital Partners",
    lpType: "fund_of_funds", lpJurisdiction: "Cayman Islands",
    committedCapital: "50000000", currency: "USD",
    calledCapital: "30000000", uncalledCapital: "20000000", calledPercent: "60.0000",
    distributedCapital: "3000000", netContributions: "27000000",
    commitmentDate: "2023-03-01", firstCloseDate: "2023-03-31", subscribedDate: "2023-02-20",
    subscriptionDocsSigned: true, kycApproved: true, wireReceived: true,
    status: "committed", notes: null,
    createdAt: new Date("2023-03-01"), updatedAt: new Date("2025-12-01"),
  },
  {
    id: 3, firmId: 1, fundId: 1, clientId: 3, lpName: "OMERS Private Markets",
    lpType: "pension_fund", lpJurisdiction: "Canada",
    committedCapital: "75000000", currency: "USD",
    calledCapital: "45000000", uncalledCapital: "30000000", calledPercent: "60.0000",
    distributedCapital: "4250000", netContributions: "40750000",
    commitmentDate: "2023-06-15", firstCloseDate: null, subscribedDate: "2023-05-30",
    subscriptionDocsSigned: true, kycApproved: true, wireReceived: true,
    status: "committed", notes: null,
    createdAt: new Date("2023-06-15"), updatedAt: new Date("2025-12-01"),
  },
  {
    id: 4, firmId: 1, fundId: 1, clientId: null, lpName: "Blue Sky Endowment Fund",
    lpType: "endowment", lpJurisdiction: "USA",
    committedCapital: "20000000", currency: "USD",
    calledCapital: "12000000", uncalledCapital: "8000000", calledPercent: "60.0000",
    distributedCapital: "0", netContributions: "12000000",
    commitmentDate: "2023-09-01", firstCloseDate: null, subscribedDate: "2023-08-15",
    subscriptionDocsSigned: true, kycApproved: true, wireReceived: true,
    status: "committed", notes: null,
    createdAt: new Date("2023-09-01"), updatedAt: new Date("2025-12-01"),
  },
  {
    id: 5, firmId: 1, fundId: 1, clientId: null, lpName: "Gulf Coast Sovereign Fund",
    lpType: "sovereign_wealth", lpJurisdiction: "Qatar",
    committedCapital: "17500000", currency: "USD",
    calledCapital: "10500000", uncalledCapital: "7000000", calledPercent: "60.0000",
    distributedCapital: "0", netContributions: "10500000",
    commitmentDate: "2023-09-15", firstCloseDate: null, subscribedDate: "2023-09-01",
    subscriptionDocsSigned: true, kycApproved: false, wireReceived: true,
    status: "committed", notes: "KYC refresh in progress — EDD required",
    createdAt: new Date("2023-09-15"), updatedAt: new Date("2026-01-15"),
  },
];

const DEMO_CALLS: CapitalCall[] = [
  {
    id: 1, firmId: 1, fundId: 1, callNumber: 1, callDate: "2023-04-15", dueDate: "2023-05-01",
    callPercent: "20.0000", callAmount: "37500000",
    purpose: "investment", investmentAmount: "35000000", managementFeeAmount: "1875000", expensesAmount: "625000",
    totalNoticed: "37500000", totalReceived: "37500000", receiptPercent: "100.0000",
    fundAdminReference: "OPF-CC-001", wireInstructions: null,
    status: "fully_received", notes: "Initial deployment — Apex and tech sector longs",
    createdAt: new Date("2023-04-15"), updatedAt: new Date("2023-05-03"),
  },
  {
    id: 2, firmId: 1, fundId: 1, callNumber: 2, callDate: "2023-10-01", dueDate: "2023-10-20",
    callPercent: "20.0000", callAmount: "37500000",
    purpose: "investment", investmentAmount: "36000000", managementFeeAmount: "1125000", expensesAmount: "375000",
    totalNoticed: "37500000", totalReceived: "37500000", receiptPercent: "100.0000",
    fundAdminReference: "OPF-CC-002", wireInstructions: null,
    status: "fully_received", notes: "Q4 deployment — credit and macro book expansion",
    createdAt: new Date("2023-10-01"), updatedAt: new Date("2023-10-22"),
  },
  {
    id: 3, firmId: 1, fundId: 1, callNumber: 3, callDate: "2024-06-01", dueDate: "2024-06-20",
    callPercent: "20.0000", callAmount: "37500000",
    purpose: "investment", investmentAmount: "35500000", managementFeeAmount: "1500000", expensesAmount: "500000",
    totalNoticed: "37500000", totalReceived: "37500000", receiptPercent: "100.0000",
    fundAdminReference: "OPF-CC-003", wireInstructions: null,
    status: "fully_received", notes: "Mid-year deployment",
    createdAt: new Date("2024-06-01"), updatedAt: new Date("2024-06-23"),
  },
  {
    id: 4, firmId: 1, fundId: 1, callNumber: 4, callDate: "2026-03-15", dueDate: "2026-04-05",
    callPercent: "10.0000", callAmount: "18750000",
    purpose: "investment", investmentAmount: "17500000", managementFeeAmount: "937500", expensesAmount: "312500",
    totalNoticed: "18750000", totalReceived: "11250000", receiptPercent: "60.0000",
    fundAdminReference: "OPF-CC-004", wireInstructions: "Wire to Goldman Sachs Trust Account — details distributed by Apex",
    status: "partially_received", notes: "Q1 2026 deployment — AI infrastructure thesis",
    createdAt: new Date("2026-03-15"), updatedAt: new Date("2026-03-19"),
  },
];

const DEMO_DISTRIBUTIONS: CapitalDistribution[] = [
  {
    id: 1, firmId: 1, fundId: 1, distributionNumber: 1, distributionDate: "2025-06-30",
    totalAmount: "5250000", currency: "USD",
    distributionType: "realized_gains",
    returnOfCapitalAmount: "2000000", realizedGainsAmount: "3250000",
    lpAllocations: [
      { lpCommitmentId: 1, lpName: "Al Mansouri Family Office", amount: 700000 },
      { lpCommitmentId: 2, lpName: "Thornton Capital Partners", amount: 1400000 },
      { lpCommitmentId: 3, lpName: "OMERS Private Markets", amount: 2100000 },
      { lpCommitmentId: 4, lpName: "Blue Sky Endowment Fund", amount: 560000 },
      { lpCommitmentId: 5, lpName: "Gulf Coast Sovereign Fund", amount: 490000 },
    ],
    fundAdminReference: "OPF-DIST-001", relatedInvestment: "Partial exit — Biotech position",
    status: "paid", notes: "Q2 2025 distribution from biotech position partial exit",
    createdAt: new Date("2025-06-25"), updatedAt: new Date("2025-07-02"),
  },
  {
    id: 2, firmId: 1, fundId: 1, distributionNumber: 2, distributionDate: "2025-12-31",
    totalAmount: "3500000", currency: "USD",
    distributionType: "realized_gains",
    returnOfCapitalAmount: "1500000", realizedGainsAmount: "2000000",
    lpAllocations: [
      { lpCommitmentId: 1, lpName: "Al Mansouri Family Office", amount: 466667 },
      { lpCommitmentId: 2, lpName: "Thornton Capital Partners", amount: 933333 },
      { lpCommitmentId: 3, lpName: "OMERS Private Markets", amount: 1400000 },
      { lpCommitmentId: 4, lpName: "Blue Sky Endowment Fund", amount: 373333 },
      { lpCommitmentId: 5, lpName: "Gulf Coast Sovereign Fund", amount: 326667 },
    ],
    fundAdminReference: "OPF-DIST-002", relatedInvestment: "Full exit — Legacy energy short cover",
    status: "paid", notes: "Year-end 2025 realized gains distribution",
    createdAt: new Date("2025-12-20"), updatedAt: new Date("2026-01-05"),
  },
];

export default function Capital() {
  const { toast } = useToast();
  const [tab, setTab] = useState("overview");

  const fund = DEMO_FUND;
  const commitments = DEMO_COMMITMENTS;
  const calls = DEMO_CALLS;
  const distributions = DEMO_DISTRIBUTIONS;

  const calledPct = fund.totalCommitments
    ? (parseFloat(fund.calledCapital || "0") / parseFloat(fund.totalCommitments)) * 100
    : 0;
  const raisedPct = fund.targetFundSize
    ? (parseFloat(fund.totalCommitments || "0") / parseFloat(fund.targetFundSize)) * 100
    : 0;

  const lpCount = commitments.length;
  const pendingCall = calls.find((c) => c.status === "partially_received" || c.status === "sent");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orca Capital</h1>
          <p className="text-muted-foreground mt-1">
            Capital event workflow — LP commitments, calls, distributions, and fund lifecycle
          </p>
        </div>
        <Button className="gap-2" data-testid="button-new-call">
          <Plus className="h-4 w-4" />
          New Capital Call
        </Button>
      </div>

      {/* Fund Header Card */}
      <Card className="border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{fund.fundName}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">{fund.fundCode}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground capitalize">{fund.strategyType?.replace(/_/g, " ")}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{fund.legalStructure?.replace(/_/g, " ").toUpperCase()}</span>
                  <StatusBadge status={fund.status} />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-right">
              <div>
                <p className="text-xs text-muted-foreground">Target Size</p>
                <p className="text-lg font-semibold">{formatCurrency(fund.targetFundSize, true)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Commitments</p>
                <p className="text-lg font-semibold text-primary">{formatCurrency(fund.totalCommitments, true)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mgmt Fee / Carry</p>
                <p className="text-lg font-semibold">
                  {formatPct(parseFloat(fund.managementFeeRate || "0") * 100)} / {formatPct(parseFloat(fund.performanceFeeRate || "0") * 100)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Fundraising Progress</span>
                <span className="text-sm font-medium">{raisedPct.toFixed(0)}% of target</span>
              </div>
              <Progress value={raisedPct} className="h-2" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">{formatCurrency(fund.totalCommitments, true)} raised</span>
                <span className="text-xs text-muted-foreground">{formatCurrency(fund.targetFundSize, true)} target</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Capital Called</span>
                <span className="text-sm font-medium">{calledPct.toFixed(0)}% of commitments</span>
              </div>
              <Progress value={calledPct} className="h-2" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">{formatCurrency(fund.calledCapital, true)} called</span>
                <span className="text-xs text-muted-foreground">{formatCurrency(fund.uncalledCapital, true)} uncalled</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">LP Investors</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-3xl font-bold" data-testid="stat-lp-count">{lpCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Active commitments</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Called Capital</span>
              <ArrowDownLeft className="h-4 w-4 text-teal-400" />
            </div>
            <p className="text-3xl font-bold text-teal-400" data-testid="stat-called">{formatCurrency(fund.calledCapital, true)}</p>
            <p className="text-xs text-muted-foreground mt-1">{calledPct.toFixed(0)}% of commitments</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Uncalled Capital</span>
              <Clock className="h-4 w-4 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-yellow-400" data-testid="stat-uncalled">{formatCurrency(fund.uncalledCapital, true)}</p>
            <p className="text-xs text-muted-foreground mt-1">Dry powder remaining</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Distributed</span>
              <ArrowUpRight className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-400" data-testid="stat-distributed">{formatCurrency(fund.distributedCapital, true)}</p>
            <p className="text-xs text-muted-foreground mt-1">Returned to LPs</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Capital Call Alert */}
      {pendingCall && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="font-medium">Capital Call #{pendingCall.callNumber} In Progress</p>
                  <p className="text-sm text-muted-foreground">
                    Due {pendingCall.dueDate} — {formatCurrency(pendingCall.totalReceived, true)} received of {formatCurrency(pendingCall.callAmount, true)} ({pendingCall.receiptPercent}% collected)
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2 border-yellow-500/30 text-yellow-400 hover:text-yellow-300">
                View Details <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">LP Commitments</TabsTrigger>
          <TabsTrigger value="calls" data-testid="tab-calls">Capital Calls</TabsTrigger>
          <TabsTrigger value="distributions" data-testid="tab-distributions">Distributions</TabsTrigger>
        </TabsList>

        {/* LP Commitments */}
        <TabsContent value="overview" className="mt-6">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">LP Commitment Register</CardTitle>
                  <CardDescription>All limited partner commitments and capital call status</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2" data-testid="button-add-lp">
                  <Plus className="h-4 w-4" /> Add LP
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>LP Name</TableHead>
                    <TableHead>Type / Jurisdiction</TableHead>
                    <TableHead className="text-right">Commitment</TableHead>
                    <TableHead className="text-right">Called</TableHead>
                    <TableHead className="text-right">Uncalled</TableHead>
                    <TableHead className="text-right">Distributed</TableHead>
                    <TableHead>Called %</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commitments.map((c) => {
                    const calledPctNum = parseFloat(c.calledPercent || "0");
                    return (
                      <TableRow key={c.id} className="border-border/50" data-testid={`row-lp-${c.id}`}>
                        <TableCell>
                          <p className="font-medium text-sm">{c.lpName}</p>
                          <p className="text-xs text-muted-foreground">{c.commitmentDate}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm capitalize">{c.lpType?.replace(/_/g, " ")}</p>
                          <p className="text-xs text-muted-foreground">{c.lpJurisdiction}</p>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(c.committedCapital, true)}</TableCell>
                        <TableCell className="text-right text-teal-400">{formatCurrency(c.calledCapital, true)}</TableCell>
                        <TableCell className="text-right text-yellow-400">{formatCurrency(c.uncalledCapital, true)}</TableCell>
                        <TableCell className="text-right text-green-400">{formatCurrency(c.distributedCapital, true)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={calledPctNum} className="h-1.5 w-16" />
                            <span className="text-xs">{calledPctNum.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {c.kycApproved
                            ? <CheckCircle2 className="h-4 w-4 text-green-400" />
                            : <AlertCircle className="h-4 w-4 text-yellow-400" />}
                        </TableCell>
                        <TableCell><StatusBadge status={c.status} /></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capital Calls */}
        <TabsContent value="calls" className="mt-6">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Capital Call History</CardTitle>
                  <CardDescription>All capital calls with collection status</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2" data-testid="button-new-capital-call">
                  <Plus className="h-4 w-4" /> Draft Call
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Call #</TableHead>
                    <TableHead>Call Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Received</TableHead>
                    <TableHead>Collection</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.map((call) => {
                    const receiptPct = parseFloat(call.receiptPercent || "0");
                    return (
                      <TableRow key={call.id} className="border-border/50" data-testid={`row-call-${call.id}`}>
                        <TableCell>
                          <span className="font-medium">CC-{String(call.callNumber).padStart(3, "0")}</span>
                          <p className="text-xs text-muted-foreground">{call.fundAdminReference}</p>
                        </TableCell>
                        <TableCell>{call.callDate}</TableCell>
                        <TableCell>{call.dueDate}</TableCell>
                        <TableCell className="capitalize text-sm">{call.purpose.replace(/_/g, " ")}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(call.callAmount, true)}</TableCell>
                        <TableCell className="text-right">
                          <span className={receiptPct === 100 ? "text-green-400" : "text-yellow-400"}>
                            {formatCurrency(call.totalReceived, true)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={receiptPct}
                              className={`h-1.5 w-20 ${receiptPct === 100 ? "[&>div]:bg-green-500" : "[&>div]:bg-yellow-500"}`}
                            />
                            <span className="text-xs">{receiptPct.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell><StatusBadge status={call.status} /></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {pendingCall && (
                <div className="mt-6 p-4 border border-border/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-3">CC-{String(pendingCall.callNumber).padStart(3, "0")} — LP Allocation Breakdown</h4>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50">
                        <TableHead>LP</TableHead>
                        <TableHead className="text-right">Allocated</TableHead>
                        <TableHead className="text-right">Received</TableHead>
                        <TableHead className="text-right">Outstanding</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commitments.map((lp) => {
                        const share = parseFloat(lp.committedCapital) / parseFloat(fund.totalCommitments || "1");
                        const allocated = parseFloat(pendingCall.callAmount) * share;
                        const received = allocated * (parseFloat(pendingCall.receiptPercent || "0") / 100);
                        const outstanding = allocated - received;
                        return (
                          <TableRow key={lp.id} className="border-border/50">
                            <TableCell className="text-sm">{lp.lpName}</TableCell>
                            <TableCell className="text-right text-sm">{formatCurrency(allocated, true)}</TableCell>
                            <TableCell className="text-right text-sm text-green-400">{formatCurrency(received, true)}</TableCell>
                            <TableCell className="text-right text-sm text-yellow-400">
                              {outstanding > 0 ? formatCurrency(outstanding, true) : "—"}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={outstanding > 0 ? "partially_received" : "fully_received"} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distributions */}
        <TabsContent value="distributions" className="mt-6">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Distribution History</CardTitle>
                  <CardDescription>Capital distributions returned to LPs</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2" data-testid="button-new-distribution">
                  <Plus className="h-4 w-4" /> Draft Distribution
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {distributions.map((dist) => (
                <div key={dist.id} className="border border-border/50 rounded-lg p-4" data-testid={`card-dist-${dist.id}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">Distribution #{dist.distributionNumber}</span>
                        <StatusBadge status={dist.status} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{dist.distributionDate} — {dist.relatedInvestment}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-400">{formatCurrency(dist.totalAmount, true)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{dist.distributionType.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Return of Capital: </span>
                      <span>{formatCurrency(dist.returnOfCapitalAmount, true)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Realized Gains: </span>
                      <span className="text-green-400">{formatCurrency(dist.realizedGainsAmount, true)}</span>
                    </div>
                  </div>
                  <div className="border-t border-border/50 pt-3">
                    <p className="text-xs text-muted-foreground mb-2">LP Allocations</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {(dist.lpAllocations as Array<{ lpName: string; amount: number }>).map((alloc, i) => (
                        <div key={i} className="flex items-center justify-between text-xs bg-muted/30 rounded px-2 py-1.5">
                          <span className="truncate text-muted-foreground">{alloc.lpName}</span>
                          <span className="font-medium ml-2 shrink-0">{formatCurrency(alloc.amount, true)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {dist.notes && (
                    <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">{dist.notes}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
