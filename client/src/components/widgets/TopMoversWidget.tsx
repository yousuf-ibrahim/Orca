import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Position {
  name: string;
  ticker: string;
  value: string;
  change: number;
}

const mockGainers: Position[] = [
  { name: "GSI Technology, Inc.", ticker: "GSIT · NASDAQ", value: "$12.97", change: 155 },
  { name: "Beyond Meat, Inc.", ticker: "BYND · NASDAQ", value: "$1.47", change: 128 },
  { name: "Replimune Group, Inc.", ticker: "REPL · NASDAQ", value: "$9.95", change: 90.78 },
];

const mockLosers: Position[] = [
  { name: "Alto Neuroscience, Inc.", ticker: "ANRO · NYSE", value: "$11.00", change: -80.92 },
  { name: "Microvast Holdings, Inc.", ticker: "MVST · NASDAQ", value: "$2.15", change: -15.3 },
  { name: "Coinbase Global, Inc.", ticker: "COIN · NASDAQ", value: "$285.43", change: -8.5 },
];

export function TopMoversWidget() {
  return (
    <Card data-testid="card-top-movers">
      <CardHeader>
        <CardTitle>Top Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gainers" data-testid="tab-gainers">Gainers</TabsTrigger>
            <TabsTrigger value="losers" data-testid="tab-losers">Losers</TabsTrigger>
          </TabsList>
          <TabsContent value="gainers" className="space-y-3 mt-4">
            {mockGainers.map((position) => (
              <div
                key={position.ticker}
                className="flex items-center justify-between"
                data-testid={`gainer-${position.ticker}`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{position.name}</p>
                  <p className="text-xs text-muted-foreground">{position.ticker}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{position.value}</p>
                  <div className="flex items-center gap-1 text-xs text-green-500 font-medium justify-end">
                    <TrendingUp className="h-3 w-3" />
                    +{position.change}%
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="losers" className="space-y-3 mt-4">
            {mockLosers.map((position) => (
              <div
                key={position.ticker}
                className="flex items-center justify-between"
                data-testid={`loser-${position.ticker}`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{position.name}</p>
                  <p className="text-xs text-muted-foreground">{position.ticker}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{position.value}</p>
                  <div className="flex items-center gap-1 text-xs text-red-500 font-medium justify-end">
                    <TrendingDown className="h-3 w-3" />
                    {position.change}%
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
