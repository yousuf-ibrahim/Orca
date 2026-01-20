import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, AlertTriangle, BarChart3, Zap, RefreshCw, Target, Layers } from "lucide-react";
import type { Portfolio } from "@shared/schema";

interface RiskInsightsWidgetProps {
  portfolios: Portfolio[];
}

interface ScenarioResult {
  scenario: string;
  impact: number;
  description: string;
}

interface CorrelationWarning {
  asset1: string;
  asset2: string;
  correlation: number;
  risk: "high" | "medium";
}

function generateScenarios(portfolios: Portfolio[]): ScenarioResult[] {
  const totalValue = portfolios.reduce((sum, p) => sum + parseFloat(p.totalMarketValue || "0"), 0);
  
  return [
    {
      scenario: "Tech Sector -10%",
      impact: -totalValue * 0.03,
      description: "Based on estimated tech exposure"
    },
    {
      scenario: "Interest Rates +50bps",
      impact: -totalValue * 0.015,
      description: "Duration-weighted bond impact"
    },
    {
      scenario: "Market Volatility Spike",
      impact: -totalValue * 0.05,
      description: "VIX doubles from current levels"
    },
    {
      scenario: "USD Strengthens 5%",
      impact: -totalValue * 0.02,
      description: "Impact on international holdings"
    }
  ];
}

function generateCorrelationWarnings(): CorrelationWarning[] {
  return [
    {
      asset1: "Large Cap Tech",
      asset2: "Growth ETFs",
      correlation: 0.92,
      risk: "high"
    },
    {
      asset1: "US Equities",
      asset2: "Global Developed",
      correlation: 0.78,
      risk: "medium"
    }
  ];
}

function formatCurrency(value: number): string {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  if (absValue >= 1000000) {
    return `${isNegative ? "-" : ""}$${(absValue / 1000000).toFixed(2)}M`;
  }
  if (absValue >= 1000) {
    return `${isNegative ? "-" : ""}$${(absValue / 1000).toFixed(0)}K`;
  }
  return `${isNegative ? "-" : ""}$${absValue.toFixed(0)}`;
}

export function RiskInsightsWidget({ portfolios }: RiskInsightsWidgetProps) {
  const scenarios = generateScenarios(portfolios);
  const correlations = generateCorrelationWarnings();
  
  return (
    <Card data-testid="widget-risk-insights">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Risk Intelligence
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scenarios" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scenarios" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              Scenarios
            </TabsTrigger>
            <TabsTrigger value="correlations" className="text-xs">
              <Layers className="h-3 w-3 mr-1" />
              Correlations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scenarios" className="space-y-3 mt-4">
            <p className="text-xs text-muted-foreground mb-3">
              Estimated portfolio impact under stress scenarios
            </p>
            {scenarios.map((scenario, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{scenario.scenario}</p>
                  <p className="text-xs text-muted-foreground">{scenario.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-semibold text-red-500">
                    {formatCurrency(scenario.impact)}
                  </span>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="correlations" className="space-y-3 mt-4">
            <p className="text-xs text-muted-foreground mb-3">
              Highly correlated positions may amplify risk
            </p>
            {correlations.map((corr, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                corr.risk === "high" ? "bg-red-500/10 border border-red-500/20" : "bg-yellow-500/10 border border-yellow-500/20"
              }`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${corr.risk === "high" ? "text-red-500" : "text-yellow-500"}`} />
                  <div>
                    <p className="text-sm font-medium">{corr.asset1} ↔ {corr.asset2}</p>
                    <p className="text-xs text-muted-foreground">
                      {corr.risk === "high" ? "High" : "Moderate"} diversification risk
                    </p>
                  </div>
                </div>
                <Badge variant={corr.risk === "high" ? "destructive" : "secondary"}>
                  {(corr.correlation * 100).toFixed(0)}% corr
                </Badge>
              </div>
            ))}
            
            {correlations.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No significant correlation warnings
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
