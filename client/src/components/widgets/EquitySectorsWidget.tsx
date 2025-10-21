import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Sector {
  name: string;
  value: string;
  change: number;
}

const mockSectors: Sector[] = [
  { name: "Technology", value: "$288.19", change: 1.12 },
  { name: "Energy", value: "$86.89", change: 1.06 },
  { name: "Discretionary", value: "$236.28", change: 0.79 },
  { name: "Staples", value: "$79.66", change: -0.09 },
  { name: "Communications", value: "$116.24", change: 1.13 },
  { name: "Financials", value: "$124.51", change: 0.42 },
];

export function EquitySectorsWidget() {
  return (
    <Card data-testid="card-equity-sectors">
      <CardHeader>
        <CardTitle>Equity Sectors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockSectors.map((sector) => {
            const isPositive = sector.change >= 0;
            return (
              <div
                key={sector.name}
                className="flex items-center justify-between"
                data-testid={`sector-${sector.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="text-sm font-medium">{sector.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{sector.value}</span>
                  <div className={`flex items-center gap-1 text-sm font-medium min-w-[60px] justify-end ${
                    isPositive ? "text-green-500" : "text-red-500"
                  }`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {isPositive ? "+" : ""}{sector.change.toFixed(2)}%
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
