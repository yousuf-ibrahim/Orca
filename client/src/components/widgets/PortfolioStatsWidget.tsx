import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import type { Portfolio } from "@shared/schema";

function formatCurrency(value: string | number | null | undefined): string {
  if (!value) return "$0.00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

interface PortfolioStatsWidgetProps {
  portfolios: Portfolio[];
}

export function PortfolioStatsWidget({ portfolios }: PortfolioStatsWidgetProps) {
  const totalMarketValue = portfolios.reduce((sum, p) => sum + parseFloat(p.totalMarketValue || "0"), 0);
  const totalUnrealizedPnl = portfolios.reduce((sum, p) => sum + parseFloat(p.totalUnrealizedPnl || "0"), 0);
  const activeCount = portfolios.filter(p => p.status === "active").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card data-testid="widget-total-aum">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-total-aum">
            {formatCurrency(totalMarketValue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {activeCount} active {activeCount === 1 ? "portfolio" : "portfolios"}
          </p>
        </CardContent>
      </Card>

      <Card data-testid="widget-total-pnl">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Unrealized P&L</CardTitle>
          {totalUnrealizedPnl >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div 
            className={`text-2xl font-bold ${totalUnrealizedPnl >= 0 ? "text-green-500" : "text-red-500"}`}
            data-testid="text-total-pnl"
          >
            {formatCurrency(totalUnrealizedPnl)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalUnrealizedPnl >= 0 ? "Gain" : "Loss"} across all portfolios
          </p>
        </CardContent>
      </Card>

      <Card data-testid="widget-portfolio-count">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolios</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-portfolio-count">
            {portfolios.length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {activeCount} active, {portfolios.length - activeCount} inactive
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
