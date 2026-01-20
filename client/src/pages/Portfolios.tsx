import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Plus, TrendingUp, TrendingDown, Wallet, RefreshCw } from "lucide-react";
import type { Portfolio } from "@shared/schema";
import { MarketIndicesWidget } from "@/components/widgets/MarketIndicesWidget";
import { MarketSentimentWidget } from "@/components/widgets/MarketSentimentWidget";
import { PortfolioNewsWidget } from "@/components/widgets/PortfolioNewsWidget";
import { EquitySectorsWidget } from "@/components/widgets/EquitySectorsWidget";
import { TopMoversWidget } from "@/components/widgets/TopMoversWidget";
import { PortfolioStatsWidget } from "@/components/widgets/PortfolioStatsWidget";
import { PortfolioHealthWidget } from "@/components/widgets/PortfolioHealthWidget";
import { RiskInsightsWidget } from "@/components/widgets/RiskInsightsWidget";
import { WidgetGrid, WidgetContainer } from "@/components/widgets/WidgetGrid";

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

function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const totalMarketValue = parseFloat(portfolio.totalMarketValue || "0");
  const totalUnrealizedPnl = parseFloat(portfolio.totalUnrealizedPnl || "0");
  const pnlPercent = totalMarketValue ? (totalUnrealizedPnl / totalMarketValue) * 100 : 0;
  const isPositive = totalUnrealizedPnl >= 0;

  return (
    <Link href={`/portfolios/${portfolio.id}`}>
      <Card className="border-border/50 hover:border-primary/30 transition-smooth cursor-pointer h-full" data-testid={`card-portfolio-${portfolio.id}`}>
        <CardHeader className="space-y-2 pb-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-lg truncate" data-testid={`text-portfolio-name-${portfolio.id}`}>
                {portfolio.portfolioName}
              </CardTitle>
              <CardDescription className="truncate" data-testid={`text-account-${portfolio.id}`}>
                {portfolio.accountNumber || "No account number"}
              </CardDescription>
            </div>
            <Badge 
              variant={portfolio.status === "active" ? "default" : "secondary"}
              className="shrink-0"
              data-testid={`badge-status-${portfolio.id}`}
            >
              {portfolio.status}
            </Badge>
          </div>
          {portfolio.investmentRiskProfile && (
            <Badge variant="outline" className="w-fit text-xs" data-testid={`badge-risk-${portfolio.id}`}>
              {portfolio.investmentRiskProfile.replace(/_/g, " ")}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Market Value</p>
              <p className="text-xl font-semibold" data-testid={`text-market-value-${portfolio.id}`}>
                {formatCurrency(totalMarketValue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Unrealized P&L</p>
              <div className="flex items-center gap-2">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-success shrink-0" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-error shrink-0" />
                )}
                <div>
                  <p 
                    className={`text-lg font-semibold ${isPositive ? "text-success" : "text-error"}`}
                    data-testid={`text-pnl-${portfolio.id}`}
                  >
                    {formatCurrency(totalUnrealizedPnl)}
                  </p>
                  <p className={`text-xs ${isPositive ? "text-success" : "text-error"}`}>
                    {formatPercent(pnlPercent)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {portfolio.asOfDate && (
            <div className="pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                As of {new Date(portfolio.asOfDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function PortfoliosSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/50">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/50">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Portfolios() {
  const { data: portfolios, isLoading, refetch } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolios"],
  });

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <PortfoliosSkeleton />
      </div>
    );
  }

  const portfolioList = portfolios || [];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight" data-testid="heading-portfolios">
            Portfolio Monitoring
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and analyze client portfolios with real-time market insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()} data-testid="button-refresh">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Link href="/portfolios/new">
            <Button data-testid="button-create-portfolio">
              <Plus className="mr-2 h-4 w-4" />
              New Portfolio
            </Button>
          </Link>
        </div>
      </div>

      {portfolioList.length === 0 ? (
        <Card className="border-border/50 text-center py-16">
          <CardContent>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-6">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Portfolios Yet</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Create your first portfolio to start monitoring client investments and tracking performance
            </p>
            <Link href="/portfolios/new">
              <Button size="lg" data-testid="button-create-first-portfolio">
                <Plus className="mr-2 h-4 w-4" />
                Create Portfolio
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <WidgetGrid>
          <WidgetContainer colSpan={12}>
            <MarketIndicesWidget />
          </WidgetContainer>

          <WidgetContainer colSpan={12}>
            <MarketSentimentWidget />
          </WidgetContainer>

          {portfolioList.length > 0 && (
            <WidgetContainer colSpan={12}>
              <PortfolioStatsWidget portfolios={portfolioList} />
            </WidgetContainer>
          )}

          <WidgetContainer colSpan={6}>
            <PortfolioHealthWidget portfolios={portfolioList} />
          </WidgetContainer>

          <WidgetContainer colSpan={6}>
            <RiskInsightsWidget portfolios={portfolioList} />
          </WidgetContainer>

          <WidgetContainer colSpan={6}>
            <PortfolioNewsWidget portfolioIds={portfolioList.map(p => p.id)} />
          </WidgetContainer>

          <WidgetContainer colSpan={6}>
            <div className="space-y-4">
              <EquitySectorsWidget />
              <TopMoversWidget />
            </div>
          </WidgetContainer>

          <WidgetContainer colSpan={12}>
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Your Portfolios</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolioList.map((portfolio) => (
                  <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                ))}
              </div>
            </div>
          </WidgetContainer>
        </WidgetGrid>
      )}
    </div>
  );
}
