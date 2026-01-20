import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Upload, 
  FileText, 
  Zap, 
  MessageSquare, 
  Clock, 
  ArrowRight,
  Sparkles,
  BookOpen,
  FolderOpen,
  Filter,
  Calendar,
  User,
  ExternalLink,
  Loader2
} from "lucide-react";

interface ResearchDocument {
  id: string;
  title: string;
  type: "memo" | "ic_notes" | "research" | "earnings";
  date: Date;
  author: string;
  summary: string;
  relevance?: number;
}

interface SearchResult {
  document: ResearchDocument;
  excerpt: string;
  matchScore: number;
}

const sampleDocuments: ResearchDocument[] = [
  {
    id: "1",
    title: "Q3 2025 Investment Committee Notes",
    type: "ic_notes",
    date: new Date("2025-10-15"),
    author: "Investment Team",
    summary: "Discussed macro outlook, portfolio positioning, and key themes for H2 2025."
  },
  {
    id: "2",
    title: "AAPL Deep Dive Analysis",
    type: "research",
    date: new Date("2025-09-20"),
    author: "Senior Analyst",
    summary: "Comprehensive analysis of Apple's services growth and hardware margins."
  },
  {
    id: "3",
    title: "Tech Sector Thesis Memo",
    type: "memo",
    date: new Date("2025-08-05"),
    author: "Portfolio Manager",
    summary: "Our updated view on tech valuations and AI infrastructure buildout."
  },
  {
    id: "4",
    title: "Microsoft Q2 Earnings Review",
    type: "earnings",
    date: new Date("2025-07-28"),
    author: "Research Team",
    summary: "Analysis of Azure growth acceleration and margin expansion."
  }
];

const sampleSearchResults: SearchResult[] = [
  {
    document: sampleDocuments[0],
    excerpt: "...the committee expressed concern about elevated valuations in mega-cap tech. We agreed to reduce exposure by 5% over the next quarter...",
    matchScore: 0.95
  },
  {
    document: sampleDocuments[2],
    excerpt: "...while AI infrastructure spending remains robust, we see signs of demand normalization in consumer-facing applications. Our positioning reflects...",
    matchScore: 0.87
  }
];

const recentQueries = [
  "What was our thesis on AAPL last quarter?",
  "Show IC discussions about interest rates",
  "Find all mentions of AI infrastructure",
  "Compare our views on MSFT vs GOOGL"
];

function DocumentTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "ic_notes": return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case "research": return <BookOpen className="h-4 w-4 text-green-500" />;
    case "memo": return <FileText className="h-4 w-4 text-purple-500" />;
    case "earnings": return <Calendar className="h-4 w-4 text-orange-500" />;
    default: return <FileText className="h-4 w-4" />;
  }
}

function DocumentTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    ic_notes: "IC Notes",
    research: "Research",
    memo: "Memo",
    earnings: "Earnings"
  };
  
  const colors: Record<string, string> = {
    ic_notes: "bg-blue-500/10 text-blue-600",
    research: "bg-green-500/10 text-green-600",
    memo: "bg-purple-500/10 text-purple-600",
    earnings: "bg-orange-500/10 text-orange-600"
  };
  
  return (
    <Badge variant="secondary" className={`text-xs ${colors[type] || ""}`}>
      {labels[type] || type}
    </Badge>
  );
}

export default function ResearchCopilot() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSearchResults(sampleSearchResults);
    setHasSearched(true);
    setIsSearching(false);
  };

  const handleQuickQuery = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="heading-research">
            <Sparkles className="h-8 w-8 text-primary" />
            Research Copilot
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered search across your internal research, memos, and IC notes
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          <Zap className="h-4 w-4 mr-2" />
          AI-Powered Intelligence
        </Badge>
      </div>

      <Card className="border-2 border-primary/20" data-testid="card-search">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Ask anything about your research... e.g., 'What was our thesis on tech last quarter?'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 h-12 text-lg"
                data-testid="input-search"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
              className="h-12 px-6"
              data-testid="button-search"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Try:</span>
            {recentQueries.map((query, i) => (
              <Button
                key={i}
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={() => handleQuickQuery(query)}
                data-testid={`button-quick-query-${i}`}
              >
                {query}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          {hasSearched ? (
            <Card data-testid="card-results">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI-Generated Insights
                </CardTitle>
                <CardDescription>
                  Found {searchResults.length} relevant documents for "{searchQuery}"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm font-medium mb-2">Summary</p>
                  <p className="text-sm text-muted-foreground">
                    Based on your research documents, the investment committee has been cautious about 
                    mega-cap tech valuations since Q3 2025. Key concerns include AI infrastructure 
                    spending normalization and elevated multiples. The team agreed to reduce tech 
                    exposure by 5% while maintaining selective positions in companies with strong 
                    cash flow generation.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Source Documents</p>
                  {searchResults.map((result, i) => (
                    <div key={i} className="p-4 rounded-lg border hover-elevate cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <DocumentTypeIcon type={result.document.type} />
                          <span className="font-medium">{result.document.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(result.matchScore * 100)}% match
                          </Badge>
                          <DocumentTypeBadge type={result.document.type} />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        "{result.excerpt}"
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {result.document.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {result.document.date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium">Upload Documents</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      IC notes, research memos, earnings transcripts
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Search className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium">Ask Questions</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Natural language queries across all your research
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium">Get Insights</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      AI-synthesized answers with source citations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="col-span-4 space-y-4">
          <Card data-testid="card-recent-docs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Document Library
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Filter className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {sampleDocuments.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="p-3 rounded-lg border hover-elevate cursor-pointer"
                      data-testid={`doc-${doc.id}`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <DocumentTypeIcon type={doc.type} />
                          <span className="text-sm font-medium line-clamp-1">{doc.title}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {doc.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {doc.date.toLocaleDateString()}
                        </span>
                        <DocumentTypeBadge type={doc.type} />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button className="w-full" variant="outline" data-testid="button-upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Supports PDF, DOCX, and TXT files
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
