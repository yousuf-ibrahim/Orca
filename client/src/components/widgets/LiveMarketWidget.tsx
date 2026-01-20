import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MarketQuote {
  symbol: string;
  name: string;
  current: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  timestamp: number;
}

interface MarketResponse {
  data: MarketQuote[];
  timestamp: number;
  source: 'live' | 'mock';
}

function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString('en-US', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  });
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function LiveMarketWidget() {
  const { data, isLoading, refetch, isFetching } = useQuery<MarketResponse>({
    queryKey: ['/api/market/indices'],
    refetchInterval: 60000,
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const indices = data?.data || [];
  const isLive = data?.source === 'live';

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-semibold">Market Indices</CardTitle>
            <Badge 
              variant={isLive ? "default" : "secondary"} 
              className="text-xs h-5"
            >
              {isLive ? (
                <><Wifi className="h-3 w-3 mr-1" /> Live</>
              ) : (
                <><WifiOff className="h-3 w-3 mr-1" /> Demo</>
              )}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {data?.timestamp && formatTime(data.timestamp)}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => refetch()}
              disabled={isFetching}
              data-testid="button-refresh-market"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {indices.map((quote) => {
            const isPositive = quote.change >= 0;
            return (
              <div 
                key={quote.symbol} 
                className="p-3 rounded-lg bg-card/50 border border-border/30 hover-elevate transition-all duration-200"
                data-testid={`market-quote-${quote.symbol}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {quote.name}
                  </span>
                  <div className={`flex items-center ${isPositive ? 'text-success' : 'text-error'}`}>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                  </div>
                </div>
                <div className="text-xl font-bold tracking-tight" data-testid={`text-price-${quote.symbol}`}>
                  {formatNumber(quote.current)}
                </div>
                <div className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
                  {isPositive ? '+' : ''}{formatNumber(quote.change)} ({isPositive ? '+' : ''}{formatNumber(quote.changePercent)}%)
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
