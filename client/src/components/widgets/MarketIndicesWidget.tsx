import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  data: number[];
}

const mockIndices: MarketIndex[] = [
  {
    name: "S&P Futures",
    symbol: "ES/USD",
    value: 6783.5,
    change: 9.75,
    changePercent: 0.14,
    data: [6750, 6755, 6760, 6758, 6765, 6770, 6775, 6780, 6783.5],
  },
  {
    name: "NASDAQ Fut.",
    symbol: "NQ/USD",
    value: 25350.25,
    change: 45,
    changePercent: 0.18,
    data: [25200, 25220, 25240, 25260, 25280, 25300, 25320, 25340, 25350],
  },
  {
    name: "Dow Futures",
    symbol: "YM/USD",
    value: 46953,
    change: 48,
    changePercent: 0.10,
    data: [46800, 46820, 46850, 46880, 46900, 46920, 46940, 46950, 46953],
  },
  {
    name: "VIX",
    symbol: "VIX · INDEX",
    value: 18.23,
    change: -2.55,
    changePercent: -12.27,
    data: [21, 20.5, 20, 19.5, 19, 18.8, 18.5, 18.3, 18.23],
  },
];

export function MarketIndicesWidget() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {mockIndices.map((index) => {
        const isPositive = index.change >= 0;
        const isVIX = index.symbol === "VIX · INDEX";
        
        return (
          <Card 
            key={index.symbol} 
            className="overflow-hidden"
            data-testid={`card-market-index-${index.symbol}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium">{index.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{index.symbol}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  isVIX 
                    ? (isPositive ? "text-red-500" : "text-green-500")
                    : (isPositive ? "text-green-500" : "text-red-500")
                }`}>
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {isPositive ? "+" : ""}{index.changePercent.toFixed(2)}%
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold" data-testid={`text-index-value-${index.symbol}`}>
                    {index.value.toLocaleString()}
                  </span>
                  <span className={`text-sm ${
                    isVIX
                      ? (isPositive ? "text-red-500" : "text-green-500")
                      : (isPositive ? "text-green-500" : "text-red-500")
                  }`}>
                    {isPositive ? "+" : ""}{index.change}
                  </span>
                </div>
                <div className="h-12 -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={index.data.map((value, i) => ({ value, index: i }))}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={
                          isVIX
                            ? (isPositive ? "#ef4444" : "#22c55e")
                            : (isPositive ? "#22c55e" : "#ef4444")
                        }
                        strokeWidth={2}
                        dot={false}
                        animationDuration={300}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
