import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Download,
  Table as TableIcon
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ParsedSecurity {
  ticker?: string;
  isin?: string;
  cusip?: string;
  sedol?: string;
  securityName: string;
  assetClass: string;
  securityType?: string;
  issuerName?: string;
  currency?: string;
  prr?: number;
  lastPrice?: number;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

function parseCSV(text: string): ParsedSecurity[] {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || '';
    });
    
    return {
      ticker: row.ticker || row.symbol || undefined,
      isin: row.isin || undefined,
      cusip: row.cusip || undefined,
      sedol: row.sedol || undefined,
      securityName: row.security_name || row.name || row.securityname || '',
      assetClass: row.asset_class || row.assetclass || row.class || 'equity',
      securityType: row.security_type || row.type || undefined,
      issuerName: row.issuer || row.issuer_name || row.issuername || undefined,
      currency: row.currency || row.ccy || 'USD',
      prr: row.prr ? parseInt(row.prr) : undefined,
      lastPrice: row.price || row.last_price ? parseFloat(row.price || row.last_price) : undefined,
    };
  }).filter(s => s.securityName);
}

export default function SecuritiesImport() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedSecurity[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    const text = await selectedFile.text();
    const parsed = parseCSV(text);
    setParsedData(parsed);
    setImportResult(null);
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;
    
    setImporting(true);
    setProgress(0);
    
    let success = 0;
    let failed = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < parsedData.length; i++) {
      try {
        await apiRequest('/api/securities', {
          method: 'POST',
          body: JSON.stringify({
            ...parsedData[i],
            firmId: 1,
          }),
        });
        success++;
      } catch (error: any) {
        failed++;
        errors.push(`Row ${i + 1}: ${error.message || 'Import failed'}`);
      }
      setProgress(Math.round(((i + 1) / parsedData.length) * 100));
    }
    
    setImporting(false);
    setImportResult({ success, failed, errors });
    
    queryClient.invalidateQueries({ queryKey: ['/api/securities'] });
    
    toast({
      title: "Import complete",
      description: `Successfully imported ${success} securities. ${failed} failed.`,
      variant: failed > 0 ? "destructive" : "default",
    });
  };

  const downloadTemplate = () => {
    const template = `ticker,isin,security_name,asset_class,security_type,issuer_name,currency,prr,last_price
AAPL,US0378331005,Apple Inc,equity,stock,Apple Inc,USD,2,178.50
MSFT,US5949181045,Microsoft Corp,equity,stock,Microsoft Corporation,USD,2,375.25
T 4.75 05/15/30,US912810SQ30,US Treasury 4.75% 2030,fixed_income,bond,US Treasury,USD,1,98.75`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'securities_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/securities">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">Import Securities</h1>
          <p className="text-muted-foreground mt-1">
            Bulk import securities from a CSV file
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Upload CSV File</CardTitle>
            <CardDescription>
              Upload a CSV file containing your securities data. 
              <Button variant="ghost" className="p-0 h-auto ml-1 text-primary" onClick={downloadTemplate}>
                Download template
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-file-upload"
            />
            
            <div 
              className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer transition-smooth hover:border-primary/50 hover:bg-card/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                <Upload className="h-7 w-7 text-primary" />
              </div>
              <p className="font-medium mb-1">
                {file ? file.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-muted-foreground">
                CSV files only, max 10MB
              </p>
            </div>

            {file && (
              <div className="mt-4 flex items-center gap-3 p-3 bg-card/50 rounded-lg">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {parsedData.length} securities found
                  </p>
                </div>
                <Badge variant="outline">
                  {(file.size / 1024).toFixed(1)} KB
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {parsedData.length > 0 && (
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TableIcon className="h-5 w-5" />
                  Preview
                </CardTitle>
                <CardDescription>
                  Review the parsed data before importing
                </CardDescription>
              </div>
              <Badge variant="secondary">{parsedData.length} rows</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-80">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-card/50">
                      <TableHead>Ticker</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Asset Class</TableHead>
                      <TableHead>ISIN</TableHead>
                      <TableHead>Currency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.slice(0, 10).map((security, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{security.ticker || "—"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{security.securityName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {security.assetClass}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{security.isin || "—"}</TableCell>
                        <TableCell>{security.currency || "USD"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {parsedData.length > 10 && (
                <p className="p-4 text-sm text-muted-foreground text-center border-t">
                  Showing first 10 of {parsedData.length} rows
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {importing && (
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Importing securities...</p>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {importResult && (
          <Card className={`border-border/50 ${importResult.failed > 0 ? 'border-warning/50' : 'border-success/50'}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {importResult.failed === 0 ? (
                  <CheckCircle2 className="h-6 w-6 text-success shrink-0" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-warning shrink-0" />
                )}
                <div className="space-y-2">
                  <p className="font-medium">
                    Import complete: {importResult.success} successful, {importResult.failed} failed
                  </p>
                  {importResult.errors.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">Errors:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {importResult.errors.slice(0, 5).map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                        {importResult.errors.length > 5 && (
                          <li>... and {importResult.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-3">
          <Link href="/securities">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button 
            onClick={handleImport} 
            disabled={parsedData.length === 0 || importing}
            data-testid="button-import-securities"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import {parsedData.length} Securities
          </Button>
        </div>
      </div>
    </div>
  );
}
