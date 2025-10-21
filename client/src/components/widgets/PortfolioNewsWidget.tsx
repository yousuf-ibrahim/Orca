import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Position } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

interface NewsItem {
  title: string;
  summary: string;
  time: string;
  relevantTickers: string[];
}

interface Security {
  id: number;
  ticker: string | null;
  securityName: string;
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
    relevantTickers: ["AAPL", "MSFT", "NVDA", "TSLA"],
  },
  {
    title: "Energy sector rebounds on supply concerns",
    summary: "Oil and gas equities surge as OPEC+ extends production cuts and global demand remains robust. Analysts upgrade targets for major integrated producers.",
    time: "10h ago",
    relevantTickers: ["XOM", "CVX"],
  },
  {
    title: "Healthcare stocks under pressure from policy uncertainty",
    summary: "Biotech and pharma names decline amid concerns over drug pricing reforms. Investors rotate to defensive areas while awaiting regulatory clarity.",
    time: "12h ago",
    relevantTickers: ["JNJ", "PFE"],
  },
];

interface PortfolioNewsWidgetProps {
  portfolioIds?: number[];
}

export function PortfolioNewsWidget({ portfolioIds = [] }: PortfolioNewsWidgetProps) {
  const { data: positions, isLoading: positionsLoading } = useQuery<Position[]>({
    queryKey: ["/api/positions"],
    enabled: portfolioIds.length > 0,
  });

  const { data: securities } = useQuery<Security[]>({
    queryKey: ["/api/securities"],
    enabled: portfolioIds.length > 0,
  });

  const portfolioTickers = useMemo(() => {
    const tickers = new Set<string>();
    if (positions && securities && portfolioIds.length > 0) {
      const relevantPositions = positions.filter(p => portfolioIds.includes(p.portfolioId));
      const securityIds = new Set(relevantPositions.map(p => p.securityId));
      securities
        .filter(s => securityIds.has(s.id) && s.ticker)
        .forEach(s => tickers.add(s.ticker!.toUpperCase()));
    }
    return tickers;
  }, [positions, securities, portfolioIds]);

  const filteredNews = useMemo(() => {
    if (portfolioIds.length === 0 || portfolioTickers.size === 0) {
      return mockNews;
    }
    return mockNews.filter(news => 
      news.relevantTickers.some(ticker => 
        portfolioTickers.has(ticker.toUpperCase())
      )
    );
  }, [portfolioIds, portfolioTickers]);

  const displayNews = filteredNews.length > 0 ? filteredNews : mockNews.slice(0, 2);

  const hasPortfolios = portfolioIds.length > 0;
  const hasLoadedData = hasPortfolios ? (positions !== undefined && securities !== undefined) : true;
  const tickerCount = portfolioTickers.size;

  return (
    <Card data-testid="card-portfolio-news">
      <CardHeader>
        <CardTitle>Portfolio News</CardTitle>
        <p className="text-sm text-muted-foreground">
          {hasPortfolios && hasLoadedData && tickerCount > 0
            ? `News relevant to your ${tickerCount} holdings`
            : "News relevant to your portfolios"}
        </p>
      </CardHeader>
      <CardContent>
        {positionsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            {displayNews.map((news, index) => (
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
        )}
      </CardContent>
    </Card>
  );
}
