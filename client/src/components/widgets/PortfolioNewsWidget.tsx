import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";

interface NewsItem {
  title: string;
  summary: string;
  time: string;
  relevantTickers: string[];
}

const mockNews: NewsItem[] = [
  {
    title: "Hedge fund strategies outperform amid volatility",
    summary: "Long/short equity and multi-strategy funds deliver strong returns as market uncertainty persists. Managers cite opportunistic positioning in technology and healthcare sectors.",
    time: "2h ago",
    relevantTickers: ["SPY", "QQQ"],
  },
  {
    title: "Alternative investments see record inflows",
    summary: "Private equity and structured products attract institutional capital as investors seek diversification beyond traditional equities and fixed income.",
    time: "4h ago",
    relevantTickers: ["Private Equity"],
  },
  {
    title: "Credit markets show resilience despite regional banking stress",
    summary: "Concerns about banking sector fade as major institutions report strong earnings. Credit spreads narrow across investment grade and high yield segments.",
    time: "6h ago",
    relevantTickers: ["HYG", "LQD"],
  },
  {
    title: "Technology sector leads index gains on AI optimism",
    summary: "Major tech names rally on strong earnings and continued enthusiasm for artificial intelligence applications. Analysts raise price targets across the sector.",
    time: "8h ago",
    relevantTickers: ["AAPL", "MSFT", "NVDA"],
  },
];

export function PortfolioNewsWidget() {
  return (
    <Card data-testid="card-portfolio-news">
      <CardHeader>
        <CardTitle>Market Summary</CardTitle>
        <p className="text-sm text-muted-foreground">
          News relevant to your portfolios
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {mockNews.map((news, index) => (
            <div key={index}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-2">
                <h4 className="font-semibold leading-tight">{news.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {news.summary}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {news.time}
                  </div>
                  <div className="flex gap-2">
                    {news.relevantTickers.map((ticker) => (
                      <span key={ticker} className="text-primary font-medium">
                        {ticker}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
