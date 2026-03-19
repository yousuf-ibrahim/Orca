import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3,
  Calendar, CheckCircle2, Clock, Plus, Download,
  Shield, Percent, Activity,
} from "lucide-react";
import type { NavRecord } from "@shared/schema";

function formatCurrency(val: number, compact = false) {
  if (compact) {
    if (Math.abs(val) >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (Math.abs(val) >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    if (Math.abs(val) >= 1e3) return `$${(val / 1e3).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(val);
}

function formatPct(val: number | null | undefined, decimals = 2) {
  if (val === null || val === undefined) return "—";
  return `${val >= 0 ? "+" : ""}${(val * 100).toFixed(decimals)}%`;
}

// Demo NAV history — monthly data since inception
const navHistory = [
  { month: "Jan '23", navDate: "2023-01-31", netAum: 0, navPerShare: 1000.00, mtdReturn: 0, ytdReturn: 0, grossReturn: 0 },
  { month: "Mar '23", navDate: "2023-03-31", netAum: 37500000, navPerShare: 1000.00, mtdReturn: 0, ytdReturn: 0, grossReturn: 0 },
  { month: "Apr '23", navDate: "2023-04-30", netAum: 39125000, navPerShare: 1043.33, mtdReturn: 0.0433, ytdReturn: 0.0433, grossReturn: 0.0480 },
  { month: "May '23", navDate: "2023-05-31", netAum: 40820000, navPerShare: 1087.20, mtdReturn: 0.0420, ytdReturn: 0.0872, grossReturn: 0.0470 },
  { month: "Jun '23", navDate: "2023-06-30", netAum: 41225000, navPerShare: 1098.00, mtdReturn: 0.0099, ytdReturn: 0.0980, grossReturn: 0.0125 },
  { month: "Jul '23", navDate: "2023-07-31", netAum: 43850000, navPerShare: 1168.00, mtdReturn: 0.0638, ytdReturn: 0.1680, grossReturn: 0.0705 },
  { month: "Aug '23", navDate: "2023-08-31", netAum: 42100000, navPerShare: 1121.33, mtdReturn: -0.0399, ytdReturn: 0.1213, grossReturn: -0.0365 },
  { month: "Sep '23", navDate: "2023-09-30", netAum: 40800000, navPerShare: 1086.67, mtdReturn: -0.0309, ytdReturn: 0.0867, grossReturn: -0.0275 },
  { month: "Oct '23", navDate: "2023-10-31", netAum: 115750000, navPerShare: 1125.33, mtdReturn: 0.0356, ytdReturn: 0.1253, grossReturn: 0.0410 },
  { month: "Nov '23", navDate: "2023-11-30", netAum: 122350000, navPerShare: 1188.00, mtdReturn: 0.0557, ytdReturn: 0.1880, grossReturn: 0.0620 },
  { month: "Dec '23", navDate: "2023-12-31", netAum: 119200000, navPerShare: 1155.20, mtdReturn: -0.0276, ytdReturn: 0.1552, grossReturn: -0.0240 },
  { month: "Jan '24", navDate: "2024-01-31", netAum: 124400000, navPerShare: 1205.33, mtdReturn: 0.0434, ytdReturn: 0.0434, grossReturn: 0.0490 },
  { month: "Feb '24", navDate: "2024-02-29", netAum: 130200000, navPerShare: 1261.33, mtdReturn: 0.0465, ytdReturn: 0.0917, grossReturn: 0.0530 },
  { month: "Mar '24", navDate: "2024-03-31", netAum: 127800000, navPerShare: 1238.00, mtdReturn: -0.0185, ytdReturn: 0.0715, grossReturn: -0.0150 },
  { month: "Apr '24", navDate: "2024-04-30", netAum: 131500000, navPerShare: 1273.80, mtdReturn: 0.0289, ytdReturn: 0.1023, grossReturn: 0.0340 },
  { month: "May '24", navDate: "2024-05-31", netAum: 136800000, navPerShare: 1325.00, mtdReturn: 0.0402, ytdReturn: 0.1464, grossReturn: 0.0460 },
  { month: "Jun '24", navDate: "2024-06-30", netAum: 243200000, navPerShare: 1311.80, mtdReturn: -0.0100, ytdReturn: 0.1353, grossReturn: -0.0065 },
  { month: "Jul '24", navDate: "2024-07-31", netAum: 255400000, navPerShare: 1378.40, mtdReturn: 0.0508, ytdReturn: 0.1934, grossReturn: 0.0570 },
  { month: "Aug '24", navDate: "2024-08-31", netAum: 261100000, navPerShare: 1412.20, mtdReturn: 0.0245, ytdReturn: 0.2231, grossReturn: 0.0280 },
  { month: "Sep '24", navDate: "2024-09-30", netAum: 268900000, navPerShare: 1457.00, mtdReturn: 0.0317, ytdReturn: 0.2617, grossReturn: 0.0370 },
  { month: "Oct '24", navDate: "2024-10-31", netAum: 265200000, navPerShare: 1437.00, mtdReturn: -0.0137, ytdReturn: 0.2442, grossReturn: -0.0100 },
  { month: "Nov '24", navDate: "2024-11-30", netAum: 278500000, navPerShare: 1509.20, mtdReturn: 0.0502, ytdReturn: 0.3065, grossReturn: 0.0565 },
  { month: "Dec '24", navDate: "2024-12-31", netAum: 271800000, navPerShare: 1472.80, mtdReturn: -0.0241, ytdReturn: 0.2750, grossReturn: -0.0205 },
  { month: "Jan '25", navDate: "2025-01-31", netAum: 280200000, navPerShare: 1519.40, mtdReturn: 0.0316, ytdReturn: 0.0316, grossReturn: 0.0375 },
  { month: "Feb '25", navDate: "2025-02-28", netAum: 274600000, navPerShare: 1489.00, mtdReturn: -0.0200, ytdReturn: 0.0110, grossReturn: -0.0163 },
  { month: "Mar '25", navDate: "2025-03-31", netAum: 282400000, navPerShare: 1531.40, mtdReturn: 0.0285, ytdReturn: 0.0401, grossReturn: 0.0340 },
  { month: "Apr '25", navDate: "2025-04-30", netAum: 291800000, navPerShare: 1582.40, mtdReturn: 0.0333, ytdReturn: 0.0749, grossReturn: 0.0392 },
  { month: "May '25", navDate: "2025-05-31", netAum: 297500000, navPerShare: 1613.20, mtdReturn: 0.0195, ytdReturn: 0.0960, grossReturn: 0.0242 },
  { month: "Jun '25", navDate: "2025-06-30", netAum: 303200000, navPerShare: 1644.00, mtdReturn: 0.0191, ytdReturn: 0.1161, grossReturn: 0.0240 },
  { month: "Jul '25", navDate: "2025-07-31", netAum: 311600000, navPerShare: 1689.60, mtdReturn: 0.0277, ytdReturn: 0.1475, grossReturn: 0.0335 },
  { month: "Aug '25", navDate: "2025-08-31", netAum: 304800000, navPerShare: 1652.60, mtdReturn: -0.0219, ytdReturn: 0.1224, grossReturn: -0.0180 },
  { month: "Sep '25", navDate: "2025-09-30", netAum: 315400000, navPerShare: 1709.80, mtdReturn: 0.0346, ytdReturn: 0.1609, grossReturn: 0.0405 },
  { month: "Oct '25", navDate: "2025-10-31", netAum: 323900000, navPerShare: 1755.60, mtdReturn: 0.0268, ytdReturn: 0.1922, grossReturn: 0.0325 },
  { month: "Nov '25", navDate: "2025-11-30", netAum: 330800000, navPerShare: 1793.20, mtdReturn: 0.0214, ytdReturn: 0.2177, grossReturn: 0.0270 },
  { month: "Dec '25", navDate: "2025-12-31", netAum: 322400000, navPerShare: 1747.60, mtdReturn: -0.0254, ytdReturn: 0.1858, grossReturn: -0.0215 },
  { month: "Jan '26", navDate: "2026-01-31", netAum: 334200000, navPerShare: 1811.60, mtdReturn: 0.0366, ytdReturn: 0.0366, grossReturn: 0.0428 },
  { month: "Feb '26", navDate: "2026-02-28", netAum: 341800000, navPerShare: 1852.40, mtdReturn: 0.0225, ytdReturn: 0.0598, grossReturn: 0.0280 },
  { month: "Mar '26", navDate: "2026-03-19", netAum: 348600000, navPerShare: 1889.00, mtdReturn: 0.0197, ytdReturn: 0.0806, grossReturn: 0.0251 },
];

const latest = navHistory[navHistory.length - 1];
const prevMonth = navHistory[navHistory.length - 2];
const yearStart = navHistory.find((n) => n.navDate.startsWith("2026-01"));
const inceptionNav = navHistory.find((n) => n.navDate === "2023-03-31");

const inceptionReturn = inceptionNav
  ? (latest.navPerShare - inceptionNav.navPerShare) / inceptionNav.navPerShare
  : 0;

// Monthly returns for bar chart
const monthlyReturns = navHistory
  .filter((n) => n.mtdReturn !== 0)
  .slice(-24)
  .map((n) => ({
    month: n.month,
    return: parseFloat((n.mtdReturn * 100).toFixed(2)),
    gross: parseFloat((n.grossReturn * 100).toFixed(2)),
  }));

// Benchmark comparison (SPY simulated)
const benchmarkData = navHistory
  .filter((n) => n.netAum > 0)
  .map((n, i, arr) => {
    const spyStart = 1000;
    const spyCumulative = spyStart * (1 + (i / arr.length) * 0.35 + Math.sin(i / 4) * 0.05);
    return {
      month: n.month,
      orcaNAV: n.navPerShare,
      spyNAV: parseFloat(spyCumulative.toFixed(2)),
    };
  });

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-medium">{p.name?.includes("Return") || p.name?.includes("return") ? `${p.value}%` : `$${p.value?.toLocaleString()}`}</span>
        </div>
      ))}
    </div>
  );
};

export default function FundAnalytics() {
  const [tab, setTab] = useState("performance");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fund Analytics</h1>
          <p className="text-muted-foreground mt-1">
            NAV, performance attribution, and fund-level command center — Orca Partners Fund I
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" data-testid="button-export-nav">
            <Download className="h-4 w-4" />
            Export NAV
          </Button>
          <Button className="gap-2" data-testid="button-add-nav">
            <Plus className="h-4 w-4" />
            Record NAV
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Net AUM</span>
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold" data-testid="stat-net-aum">{formatCurrency(latest.netAum, true)}</p>
            <p className="text-xs text-muted-foreground mt-1">As of {latest.navDate}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">NAV per Share</span>
              <Activity className="h-4 w-4 text-teal-400" />
            </div>
            <p className="text-2xl font-bold" data-testid="stat-nav-per-share">{formatCurrency(latest.navPerShare)}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${latest.mtdReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
              {latest.mtdReturn >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {formatPct(latest.mtdReturn)} MTD
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">YTD Return</span>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <p className={`text-2xl font-bold ${latest.ytdReturn >= 0 ? "text-green-400" : "text-red-400"}`} data-testid="stat-ytd">
              {formatPct(latest.ytdReturn)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">2026 year-to-date</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Since Inception</span>
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary" data-testid="stat-inception">
              {formatPct(inceptionReturn)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Mar 2023 — present</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="performance" data-testid="tab-performance">NAV Performance</TabsTrigger>
          <TabsTrigger value="monthly" data-testid="tab-monthly">Monthly Returns</TabsTrigger>
          <TabsTrigger value="vs-benchmark" data-testid="tab-benchmark">vs Benchmark</TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">NAV History</TabsTrigger>
        </TabsList>

        {/* NAV Performance Chart */}
        <TabsContent value="performance" className="mt-6">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Net Asset Value — Since Inception</CardTitle>
              <CardDescription>NAV per share trajectory with AUM overlay</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={navHistory.filter((n) => n.netAum > 0)} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis
                    tickFormatter={(v) => `$${v.toLocaleString()}`}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false} axisLine={false}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={1000} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" opacity={0.5} />
                  <Area
                    type="monotone"
                    dataKey="navPerShare"
                    name="NAV/Share"
                    stroke="hsl(var(--primary))"
                    fill="url(#navGradient)"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Returns */}
        <TabsContent value="monthly" className="mt-6">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Monthly Net Returns</CardTitle>
              <CardDescription>Last 24 months — net of all fees and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyReturns} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false} axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="hsl(var(--border))" />
                  <Bar
                    dataKey="return"
                    name="Net Return %"
                    radius={[3, 3, 0, 0]}
                    fill="hsl(var(--primary))"
                    label={false}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border/50 pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Best Month</p>
                  <p className="text-sm font-semibold text-green-400">
                    +{Math.max(...monthlyReturns.map((m) => m.return)).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Worst Month</p>
                  <p className="text-sm font-semibold text-red-400">
                    {Math.min(...monthlyReturns.map((m) => m.return)).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">% Positive Months</p>
                  <p className="text-sm font-semibold">
                    {Math.round((monthlyReturns.filter((m) => m.return > 0).length / monthlyReturns.length) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* vs Benchmark */}
        <TabsContent value="vs-benchmark" className="mt-6">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Orca Fund I vs S&P 500 (SPY)</CardTitle>
              <CardDescription>Indexed to 1,000 at fund inception — cumulative performance comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={benchmarkData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis
                    tickFormatter={(v) => `$${v.toLocaleString()}`}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false} axisLine={false}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="orcaNAV" name="Orca Fund I" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="spyNAV" name="S&P 500 (SPY)" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border/50 pt-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Orca Fund I Since Inception</p>
                  <p className="text-xl font-bold text-primary">{formatPct(inceptionReturn)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Alpha vs SPY (Est.)</p>
                  <p className="text-xl font-bold text-green-400">+{formatPct(inceptionReturn - 0.35, 1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NAV History Table */}
        <TabsContent value="history" className="mt-6">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">NAV Record History</CardTitle>
                  <CardDescription>Monthly fund administrator confirmed NAV records</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" /> Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Net AUM</TableHead>
                    <TableHead className="text-right">NAV/Share</TableHead>
                    <TableHead className="text-right">MTD Net</TableHead>
                    <TableHead className="text-right">YTD Net</TableHead>
                    <TableHead className="text-right">MTD Gross</TableHead>
                    <TableHead>Fund Admin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {navHistory
                    .filter((n) => n.netAum > 0)
                    .slice(-18)
                    .reverse()
                    .map((record, i) => (
                      <TableRow key={i} className="border-border/50" data-testid={`row-nav-${record.navDate}`}>
                        <TableCell className="font-medium">{record.month}</TableCell>
                        <TableCell className="text-right">{formatCurrency(record.netAum, true)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(record.navPerShare)}</TableCell>
                        <TableCell className={`text-right font-medium ${record.mtdReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {formatPct(record.mtdReturn)}
                        </TableCell>
                        <TableCell className={`text-right ${record.ytdReturn >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {formatPct(record.ytdReturn)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatPct(record.grossReturn)}
                        </TableCell>
                        <TableCell>
                          {i < 3 ? (
                            <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
                              <Clock className="h-3 w-3" /> Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-green-400">
                              <CheckCircle2 className="h-3 w-3" /> Confirmed
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fund Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Percent className="h-4 w-4 text-primary" />
              Fee Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Management Fee", value: "2.00% p.a." },
              { label: "Performance Fee", value: "20% above 8% hurdle" },
              { label: "High Water Mark", value: "Yes — Series basis" },
              { label: "Hurdle Rate", value: "8.00% p.a." },
              { label: "Liquidity", value: "Quarterly (90-day notice)" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Service Providers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Fund Administrator", value: "Apex Fund Services" },
              { label: "Prime Broker", value: "Goldman Sachs Prime" },
              { label: "Auditor", value: "Deloitte LLP" },
              { label: "Legal Counsel", value: "Walkers Global" },
              { label: "Custodian (secondary)", value: "Morgan Stanley Prime" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Key Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Inception", value: "January 15, 2023" },
              { label: "First Close", value: "March 31, 2023" },
              { label: "Investment Period Ends", value: "January 15, 2026" },
              { label: "Fund Term", value: "January 15, 2030" },
              { label: "Next Fund Admin NAV", value: "April 1, 2026" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
