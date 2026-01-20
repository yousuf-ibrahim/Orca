import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Database,
  TrendingUp,
  Building2,
  RefreshCw,
  ChevronDown,
  MoreHorizontal,
  Eye
} from "lucide-react";
import { Link } from "wouter";
import type { SecurityMaster } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const assetClassColors: Record<string, string> = {
  equity: "bg-info/10 text-info border-info/30",
  fixed_income: "bg-success/10 text-success border-success/30",
  cash: "bg-muted text-muted-foreground",
  alternatives: "bg-warning/10 text-warning border-warning/30",
  structured_products: "bg-ember/10 text-ember border-ember/30",
  fx_commodities: "bg-primary/10 text-primary border-primary/30",
  swaps: "bg-destructive/10 text-destructive border-destructive/30",
};

function formatCurrency(value: string | number | null | undefined): string {
  if (!value) return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function SecurityRow({ security }: { security: SecurityMaster }) {
  const assetClassStyle = assetClassColors[security.assetClass] || assetClassColors.cash;
  
  return (
    <TableRow className="transition-smooth hover:bg-card/50" data-testid={`row-security-${security.id}`}>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span className="font-semibold" data-testid={`text-security-name-${security.id}`}>
            {security.ticker || security.securityName}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
            {security.securityName}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`text-xs ${assetClassStyle}`}>
          {security.assetClass.replace(/_/g, " ")}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {security.isin || "—"}
      </TableCell>
      <TableCell className="text-sm">
        {security.issuerName || "—"}
      </TableCell>
      <TableCell className="text-sm">
        {security.currency}
      </TableCell>
      <TableCell className="text-right font-mono text-sm">
        {formatCurrency(security.lastPrice)}
      </TableCell>
      <TableCell className="text-center">
        {security.prr ? (
          <Badge variant="outline" className="text-xs">
            PRR {security.prr}
          </Badge>
        ) : "—"}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Security</DropdownMenuItem>
            <DropdownMenuItem>View Positions</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function SecuritiesSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-border/50">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, description }: { 
  title: string; 
  value: string | number; 
  icon: any;
  description?: string;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Securities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [assetClassFilter, setAssetClassFilter] = useState<string>("all");
  
  const { data: securities, isLoading, refetch } = useQuery<SecurityMaster[]>({
    queryKey: ["/api/securities"],
  });

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-6">
                <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-border/50">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <SecuritiesSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  const securitiesList = securities || [];
  
  const filteredSecurities = securitiesList.filter(security => {
    const matchesSearch = searchQuery === "" || 
      security.securityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      security.ticker?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      security.isin?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAssetClass = assetClassFilter === "all" || security.assetClass === assetClassFilter;
    
    return matchesSearch && matchesAssetClass;
  });

  const assetClassCounts = securitiesList.reduce((acc, s) => {
    acc[s.assetClass] = (acc[s.assetClass] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueIssuers = new Set(securitiesList.map(s => s.issuerName).filter(Boolean)).size;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight" data-testid="heading-securities">
            Securities Master
          </h1>
          <p className="text-muted-foreground mt-1">
            Central repository for all securities with multi-identifier support
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()} data-testid="button-refresh">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Link href="/securities/import">
            <Button variant="outline" size="sm" data-testid="button-import">
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
          </Link>
          <Link href="/securities/new">
            <Button data-testid="button-add-security">
              <Plus className="mr-2 h-4 w-4" />
              Add Security
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Securities" 
          value={securitiesList.length}
          icon={Database}
          description="In master database"
        />
        <StatsCard 
          title="Equities" 
          value={assetClassCounts.equity || 0}
          icon={TrendingUp}
          description="Stocks & ETFs"
        />
        <StatsCard 
          title="Fixed Income" 
          value={assetClassCounts.fixed_income || 0}
          icon={Building2}
          description="Bonds & credit"
        />
        <StatsCard 
          title="Unique Issuers" 
          value={uniqueIssuers}
          icon={Building2}
          description="Across all securities"
        />
      </div>

      <Card className="border-border/50">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <CardTitle className="text-lg font-semibold">All Securities</CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ticker, ISIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-64"
                data-testid="input-search-securities"
              />
            </div>
            <Select value={assetClassFilter} onValueChange={setAssetClassFilter}>
              <SelectTrigger className="w-full sm:w-40" data-testid="select-asset-class">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Asset Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="equity">Equity</SelectItem>
                <SelectItem value="fixed_income">Fixed Income</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="alternatives">Alternatives</SelectItem>
                <SelectItem value="structured_products">Structured Products</SelectItem>
                <SelectItem value="fx_commodities">FX & Commodities</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" data-testid="button-export">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSecurities.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-6">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery || assetClassFilter !== "all" ? "No securities found" : "No Securities Yet"}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                {searchQuery || assetClassFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Add securities to your master database to start tracking positions and performance"
                }
              </p>
              {!searchQuery && assetClassFilter === "all" && (
                <div className="flex justify-center gap-3">
                  <Link href="/securities/import">
                    <Button variant="outline" size="lg">
                      <Upload className="mr-2 h-4 w-4" />
                      Import from CSV
                    </Button>
                  </Link>
                  <Link href="/securities/new">
                    <Button size="lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Security
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-card/50">
                    <TableHead className="w-[200px]">Security</TableHead>
                    <TableHead>Asset Class</TableHead>
                    <TableHead>ISIN</TableHead>
                    <TableHead>Issuer</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Last Price</TableHead>
                    <TableHead className="text-center">Risk</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSecurities.map((security) => (
                    <SecurityRow key={security.id} security={security} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
