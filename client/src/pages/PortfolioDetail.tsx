import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Building2,
  PieChart,
  TableIcon,
  Settings,
  BarChart3
} from "lucide-react";
import type { Portfolio, Position, SecurityMaster, Custodian } from "@shared/schema";

function formatCurrency(value: string | number | null | undefined): string {
  if (!value) return "$0.00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function formatPercent(value: string | number | null | undefined): string {
  if (!value) return "0.00%";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `${num.toFixed(2)}%`;
}

interface PositionWithDetails extends Position {
  security?: SecurityMaster;
  custodian?: Custodian;
}

function PortfolioHeader({ portfolio }: { portfolio: Portfolio }) {
  const totalMarketValue = parseFloat(portfolio.totalMarketValue || "0");
  const totalUnrealizedPnl = parseFloat(portfolio.totalUnrealizedPnl || "0");
  const pnlPercent = totalMarketValue ? (totalUnrealizedPnl / totalMarketValue) * 100 : 0;
  const isPositive = totalUnrealizedPnl >= 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/portfolios">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold" data-testid="heading-portfolio-name">
              {portfolio.portfolioName}
            </h1>
            <Badge variant={portfolio.status === "active" ? "default" : "secondary"}>
              {portfolio.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {portfolio.accountNumber || "No account number"} 
            {portfolio.investmentRiskProfile && ` • ${portfolio.investmentRiskProfile.replace(/_/g, " ")}`}
          </p>
        </div>
        <Button variant="outline" size="icon" data-testid="button-settings">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Market Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-market-value">
              {formatCurrency(totalMarketValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unrealized P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : (
                <TrendingDown className="h-5 w-5 text-error" />
              )}
              <div>
                <p 
                  className={`text-2xl font-bold ${isPositive ? "text-success" : "text-error"}`}
                  data-testid="text-unrealized-pnl"
                >
                  {formatCurrency(totalUnrealizedPnl)}
                </p>
                <p className={`text-xs ${isPositive ? "text-success" : "text-error"}`}>
                  {formatPercent(pnlPercent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gross Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-gross-assets">
              {formatCurrency(portfolio.grossAssets)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="text-net-assets">
              {formatCurrency(portfolio.netAssets)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AssetAllocationChart({ positions }: { positions: PositionWithDetails[] }) {
  const allocationByAssetClass = positions.reduce((acc, pos) => {
    const assetClass = pos.security?.assetClass || "unknown";
    const marketValue = parseFloat(pos.marketValue || "0");
    acc[assetClass] = (acc[assetClass] || 0) + marketValue;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(allocationByAssetClass).reduce((sum, val) => sum + val, 0);

  const assetClassColors: Record<string, string> = {
    cash: "bg-chart-1",
    fixed_income: "bg-chart-3",
    equity: "bg-chart-2",
    alternatives: "bg-chart-4",
    structured_products: "bg-chart-5",
    fx_commodities: "bg-primary",
    swaps: "bg-destructive",
    unknown: "bg-muted",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Asset Allocation
        </CardTitle>
        <CardDescription>Portfolio allocation by asset class</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(allocationByAssetClass)
            .sort(([, a], [, b]) => b - a)
            .map(([assetClass, value]) => {
              const percent = total > 0 ? (value / total) * 100 : 0;
              return (
                <div key={assetClass} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">
                      {assetClass.replace(/_/g, " ")}
                    </span>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(value)}</div>
                      <div className="text-xs text-muted-foreground">{formatPercent(percent)}</div>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${assetClassColors[assetClass] || assetClassColors.unknown}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}

function HoldingsTable({ positions }: { positions: PositionWithDetails[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TableIcon className="h-5 w-5" />
          Holdings
        </CardTitle>
        <CardDescription>Detailed position-level breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="table-holdings">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-sm">Security</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Custodian</th>
                <th className="text-right py-3 px-4 font-medium text-sm">Quantity</th>
                <th className="text-right py-3 px-4 font-medium text-sm">Price</th>
                <th className="text-right py-3 px-4 font-medium text-sm">Market Value</th>
                <th className="text-right py-3 px-4 font-medium text-sm">Allocation</th>
                <th className="text-right py-3 px-4 font-medium text-sm">P&L</th>
              </tr>
            </thead>
            <tbody>
              {positions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No positions found
                  </td>
                </tr>
              ) : (
                positions.map((position) => {
                  const pnl = parseFloat(position.unrealizedPnl || "0");
                  const isPositive = pnl >= 0;
                  return (
                    <tr 
                      key={position.id} 
                      className="border-b hover:bg-accent/50"
                      data-testid={`row-position-${position.id}`}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium" data-testid={`text-security-name-${position.id}`}>
                            {position.security?.securityName || "Unknown Security"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {position.security?.ticker || "—"} • {position.security?.assetClass?.replace(/_/g, " ")}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" data-testid={`badge-custodian-${position.id}`}>
                          {position.custodian?.shortName || position.custodian?.name || "—"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right" data-testid={`text-quantity-${position.id}`}>
                        {parseFloat(position.quantity).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right" data-testid={`text-price-${position.id}`}>
                        {formatCurrency(position.currentPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium" data-testid={`text-market-value-${position.id}`}>
                        {formatCurrency(position.marketValue)}
                      </td>
                      <td className="py-3 px-4 text-right" data-testid={`text-allocation-${position.id}`}>
                        {formatPercent(position.allocationPercent)}
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${isPositive ? "text-success" : "text-error"}`} data-testid={`text-pnl-${position.id}`}>
                        {formatCurrency(pnl)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function CustodianBreakdown({ positions }: { positions: PositionWithDetails[] }) {
  const byCustodian = positions.reduce((acc, pos) => {
    const custodianName = pos.custodian?.name || "Unknown Custodian";
    const marketValue = parseFloat(pos.marketValue || "0");
    acc[custodianName] = (acc[custodianName] || 0) + marketValue;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(byCustodian).reduce((sum, val) => sum + val, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Custodian Breakdown
        </CardTitle>
        <CardDescription>Assets held at each custodian</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(byCustodian)
            .sort(([, a], [, b]) => b - a)
            .map(([custodian, value]) => {
              const percent = total > 0 ? (value / total) * 100 : 0;
              return (
                <div key={custodian} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">{custodian}</div>
                    <div className="text-sm text-muted-foreground">{formatPercent(percent)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(value)}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PortfolioDetail() {
  const [, params] = useRoute("/portfolios/:id");
  const portfolioId = params?.id ? parseInt(params.id) : null;

  const { data: portfolio, isLoading: portfolioLoading } = useQuery<Portfolio>({
    queryKey: [`/api/portfolios/${portfolioId}`],
    enabled: !!portfolioId,
  });

  const { data: positions = [], isLoading: positionsLoading } = useQuery<Position[]>({
    queryKey: [`/api/portfolios/${portfolioId}/positions`],
    enabled: !!portfolioId,
  });

  const { data: securities = [] } = useQuery<SecurityMaster[]>({
    queryKey: ["/api/securities"],
  });

  const { data: custodians = [] } = useQuery<Custodian[]>({
    queryKey: ["/api/custodians"],
  });

  const positionsWithDetails: PositionWithDetails[] = positions.map(pos => ({
    ...pos,
    security: securities.find(s => s.id === pos.securityId),
    custodian: custodians.find(c => c.id === pos.custodianId),
  }));

  if (portfolioLoading || positionsLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="p-6 lg:p-8 text-center py-16">
        <h2 className="text-2xl font-bold">Portfolio Not Found</h2>
        <p className="text-muted-foreground mt-2">The requested portfolio does not exist.</p>
        <Link href="/portfolios">
          <Button className="mt-4">Back to Portfolios</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <PortfolioHeader portfolio={portfolio} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings" data-testid="tab-holdings">Holdings</TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AssetAllocationChart positions={positionsWithDetails} />
            <CustodianBreakdown positions={positionsWithDetails} />
          </div>
        </TabsContent>

        <TabsContent value="holdings" className="mt-6">
          <HoldingsTable positions={positionsWithDetails} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Coming soon: Risk metrics, performance attribution, and stress testing</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12 text-muted-foreground">
              <BarChart3 className="mx-auto h-12 w-12 mb-4" />
              <p>Advanced analytics features will be available soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
