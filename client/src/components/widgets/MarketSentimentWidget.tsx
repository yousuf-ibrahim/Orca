import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MarketSentimentWidget() {
  const sentiment = "Bullish";
  const isBullish = sentiment === "Bullish";
  const date = new Date().toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric", 
    hour: "numeric",
    minute: "2-digit"
  });

  return (
    <Card className="overflow-hidden" data-testid="card-market-sentiment">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {date} · Market Closed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex gap-0.5">
            {Array.from({ length: 20 }).map((_, i) => {
              const height = isBullish 
                ? Math.min(100, 20 + (i * 4)) 
                : Math.max(20, 100 - (i * 4));
              
              return (
                <div
                  key={i}
                  className={`w-1 rounded-sm ${isBullish ? "bg-primary" : "bg-red-500"}`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
          <div>
            <p className="text-2xl font-semibold" data-testid="text-sentiment">
              {sentiment} Sentiment
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
