import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import type { Portfolio } from "@shared/schema";
import { MarketIndicesWidget } from "@/components/widgets/MarketIndicesWidget";
import { MarketSentimentWidget } from "@/components/widgets/MarketSentimentWidget";
import { PortfolioNewsWidget } from "@/components/widgets/PortfolioNewsWidget";
import { EquitySectorsWidget } from "@/components/widgets/EquitySectorsWidget";
import { TopMoversWidget } from "@/components/widgets/TopMoversWidget";
import { PortfolioStatsWidget } from "@/components/widgets/PortfolioStatsWidget";
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
      <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all" data-testid={`card-portfolio-${portfolio.id}`}>
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg" data-testid={`text-portfolio-name-${portfolio.id}`}>
                {portfolio.portfolioName}
              </CardTitle>
              <CardDescription data-testid={`text-account-${portfolio.id}`}>
                {portfolio.accountNumber || "No account number"}
              </CardDescription>
            </div>
            <Badge 
              variant={portfolio.status === "active" ? "default" : "secondary"}
              data-testid={`badge-status-${portfolio.id}`}
            >
              {portfolio.status}
            </Badge>
          </div>
          {portfolio.investmentRiskProfile && (
            <Badge variant="outline" className="w-fit" data-testid={`badge-risk-${portfolio.id}`}>
              {portfolio.investmentRiskProfile.replace(/_/g, " ")}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Market Value</p>
              <p className="text-2xl font-semibold" data-testid={`text-market-value-${portfolio.id}`}>
                {formatCurrency(totalMarketValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unrealized P&L</p>
              <div className="flex items-center gap-2">
                {isPositive ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p 
                    className={`text-xl font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}
                    data-testid={`text-pnl-${portfolio.id}`}
                  >
                    {formatCurrency(totalUnrealizedPnl)}
                  </p>
                  <p className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
                    {formatPercent(pnlPercent)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {portfolio.asOfDate && (
            <div className="pt-2 border-t">
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
          <Card key={i}>
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
          <Card key={i}>
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
  const { data: portfolios, isLoading } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolios"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-portfolios">
            Portfolio Monitoring
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and analyze client portfolios with real-time market insights
          </p>
        </div>
        <Link href="/portfolios/new">
          <Button data-testid="button-create-portfolio">
            <Plus className="mr-2 h-4 w-4" />
            New Portfolio
          </Button>
        </Link>
      </div>

      {portfolioList.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Portfolios Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first portfolio to start monitoring client investments
            </p>
            <Link href="/portfolios/new">
              <Button data-testid="button-create-first-portfolio">
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
            <PortfolioNewsWidget />
          </WidgetContainer>

          <WidgetContainer colSpan={6}>
            <div className="space-y-4">
              <EquitySectorsWidget />
              <TopMoversWidget />
            </div>
          </WidgetContainer>

          <WidgetContainer colSpan={12}>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Portfolios</h2>
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
