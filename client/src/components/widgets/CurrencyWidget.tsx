import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, RefreshCw, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface CurrencyQuote {
  symbol: string;
  name: string;
  current: number;
  change: number;
  changePercent: number;
}

interface CurrencyResponse {
  data: CurrencyQuote[];
  timestamp: number;
  source: 'live' | 'mock';
}

function formatRate(value: number): string {
  return value.toFixed(4);
}

export function CurrencyWidget() {
  const { data, isLoading, refetch, isFetching } = useQuery<CurrencyResponse>({
    queryKey: ['/api/market/currencies'],
    refetchInterval: 120000,
    staleTime: 60000,
  });

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const currencies = data?.data || [];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3 bg-gradient-to-r from-warning/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-warning" />
            <CardTitle className="text-base font-semibold">Currency Rates</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => refetch()}
            disabled={isFetching}
            data-testid="button-refresh-currency"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {currencies.map((currency) => {
            const isPositive = currency.change >= 0;
            return (
              <div 
                key={currency.symbol}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/5 transition-colors"
                data-testid={`currency-rate-${currency.symbol}`}
              >
                <span className="text-sm font-medium">{currency.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-semibold">
                    {formatRate(currency.current)}
                  </span>
                  <div className={`flex items-center text-xs font-medium min-w-[60px] justify-end ${isPositive ? 'text-success' : 'text-error'}`}>
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {isPositive ? '+' : ''}{currency.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
