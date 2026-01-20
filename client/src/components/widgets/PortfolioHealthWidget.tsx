import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Activity, Shield, Zap } from "lucide-react";
import type { Portfolio, Position } from "@shared/schema";

interface PortfolioHealthWidgetProps {
  portfolios: Portfolio[];
  positions?: Position[];
}

interface HealthMetric {
  label: string;
  value: number;
  status: "healthy" | "warning" | "critical";
  description: string;
}

interface ConcentrationAlert {
  type: "sector" | "single_name" | "geography";
  name: string;
  percentage: number;
  threshold: number;
}

function calculateHealthScore(portfolios: Portfolio[]): number {
  if (portfolios.length === 0) return 0;
  
  let score = 100;
  
  portfolios.forEach(p => {
    const pnlRatio = parseFloat(p.totalUnrealizedPnl || "0") / parseFloat(p.totalMarketValue || "1");
    if (pnlRatio < -0.1) score -= 15;
    else if (pnlRatio < -0.05) score -= 8;
    
    const leverageRatio = parseFloat((p as any).leverageRatio || "0");
    if (leverageRatio > 2) score -= 10;
    else if (leverageRatio > 1.5) score -= 5;
  });
  
  return Math.max(0, Math.min(100, score));
}

function getHealthMetrics(portfolios: Portfolio[]): HealthMetric[] {
  const totalValue = portfolios.reduce((sum, p) => sum + parseFloat(p.totalMarketValue || "0"), 0);
  const totalPnl = portfolios.reduce((sum, p) => sum + parseFloat(p.totalUnrealizedPnl || "0"), 0);
  const avgLeverage = portfolios.length > 0 
    ? portfolios.reduce((sum, p) => sum + parseFloat((p as any).leverageRatio || "0"), 0) / portfolios.length 
    : 0;
  
  const pnlPercent = totalValue > 0 ? (totalPnl / totalValue) * 100 : 0;
  
  return [
    {
      label: "P&L Health",
      value: pnlPercent,
      status: pnlPercent >= 0 ? "healthy" : pnlPercent > -5 ? "warning" : "critical",
      description: `${pnlPercent >= 0 ? "+" : ""}${pnlPercent.toFixed(2)}% unrealized`
    },
    {
      label: "Leverage",
      value: avgLeverage * 50,
      status: avgLeverage < 1.5 ? "healthy" : avgLeverage < 2 ? "warning" : "critical",
      description: `${avgLeverage.toFixed(2)}x average`
    },
    {
      label: "Diversification",
      value: Math.min(100, portfolios.length * 25),
      status: portfolios.length >= 3 ? "healthy" : portfolios.length >= 2 ? "warning" : "critical",
      description: `${portfolios.length} active portfolios`
    }
  ];
}

function getConcentrationAlerts(portfolios: Portfolio[]): ConcentrationAlert[] {
  const alerts: ConcentrationAlert[] = [];
  
  const totalValue = portfolios.reduce((sum, p) => sum + parseFloat(p.totalMarketValue || "0"), 0);
  
  portfolios.forEach(p => {
    const portfolioValue = parseFloat(p.totalMarketValue || "0");
    const concentration = totalValue > 0 ? (portfolioValue / totalValue) * 100 : 0;
    
    if (concentration > 40) {
      alerts.push({
        type: "single_name",
        name: p.portfolioName,
        percentage: concentration,
        threshold: 40
      });
    }
  });
  
  if (portfolios.length > 0 && portfolios.length < 3) {
    alerts.push({
      type: "sector",
      name: "Portfolio Count",
      percentage: portfolios.length,
      threshold: 3
    });
  }
  
  return alerts;
}

function StatusIcon({ status }: { status: "healthy" | "warning" | "critical" }) {
  if (status === "healthy") return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (status === "warning") return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  return <AlertTriangle className="h-4 w-4 text-red-500" />;
}

export function PortfolioHealthWidget({ portfolios }: PortfolioHealthWidgetProps) {
  const healthScore = calculateHealthScore(portfolios);
  const metrics = getHealthMetrics(portfolios);
  const alerts = getConcentrationAlerts(portfolios);
  
  const scoreColor = healthScore >= 80 ? "text-green-500" : healthScore >= 60 ? "text-yellow-500" : "text-red-500";
  const scoreBg = healthScore >= 80 ? "bg-green-500/10" : healthScore >= 60 ? "bg-yellow-500/10" : "bg-red-500/10";
  
  return (
    <Card data-testid="widget-portfolio-health">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Portfolio Health Summary
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          <Zap className="h-3 w-3 mr-1" />
          AI-Powered
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-20 h-20 rounded-full ${scoreBg}`}>
            <span className={`text-2xl font-bold ${scoreColor}`} data-testid="text-health-score">
              {healthScore}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Overall Health Score</p>
            <p className="text-xs text-muted-foreground">
              Based on P&L, leverage, and diversification analysis
            </p>
            <Progress value={healthScore} className="mt-2 h-2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{metric.label}</span>
                <StatusIcon status={metric.status} />
              </div>
              <p className="text-sm font-semibold">{metric.description}</p>
            </div>
          ))}
        </div>

        {alerts.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Concentration Alerts
            </p>
            {alerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{alert.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {alert.type === "single_name" ? `${alert.percentage.toFixed(1)}% concentration` : `Below ${alert.threshold} portfolios`}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {alerts.length === 0 && (
          <div className="flex items-center gap-2 p-3 rounded bg-green-500/10 border border-green-500/20">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700 dark:text-green-400">
              No concentration alerts detected
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
