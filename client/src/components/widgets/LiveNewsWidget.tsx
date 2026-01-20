import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, Clock, Newspaper, Wifi, WifiOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
  category: string;
  related: string;
}

interface NewsResponse {
  data: NewsArticle[];
  timestamp: number;
  source: 'live' | 'mock';
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function getSourceColor(source: string): string {
  const sourceColors: Record<string, string> = {
    'Bloomberg': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'Reuters': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'WSJ': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Financial Times': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    'FT': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    'CNBC': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };
  return sourceColors[source] || 'bg-muted text-muted-foreground border-border/50';
}

export function LiveNewsWidget() {
  const { data, isLoading, refetch, isFetching } = useQuery<NewsResponse>({
    queryKey: ['/api/market/news'],
    refetchInterval: 300000,
    staleTime: 120000,
  });

  if (isLoading) {
    return (
      <Card className="border-border/50 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2 pb-4 border-b border-border/30 last:border-0">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const articles = data?.data || [];
  const isLive = data?.source === 'live';

  return (
    <Card className="border-border/50 h-full flex flex-col">
      <CardHeader className="pb-3 bg-gradient-to-r from-info/5 to-transparent flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Newspaper className="h-4 w-4 text-info" />
            <CardTitle className="text-base font-semibold">Market News</CardTitle>
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => refetch()}
            disabled={isFetching}
            data-testid="button-refresh-news"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden pt-0">
        <ScrollArea className="h-[400px] pr-3">
          <div className="space-y-1 pt-4">
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 -mx-1 rounded-lg hover-elevate transition-all duration-200 group"
                data-testid={`news-article-${article.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {article.headline}
                  </h4>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={`text-xs h-5 ${getSourceColor(article.source)}`}>
                    {article.source}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(article.datetime)}
                  </span>
                  {article.related && (
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {article.related.split(',').slice(0, 2).join(', ')}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
