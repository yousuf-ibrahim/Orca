import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertRiskAssessmentSchema, type RiskAssessment } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Save, Calculator } from "lucide-react";
import { z } from "zod";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

const formSchema = insertRiskAssessmentSchema.omit({ 
  clientId: true, 
  firmId: true, 
  createdAt: true 
});
type FormValues = z.infer<typeof formSchema>;

interface RiskAssessmentFormProps {
  clientId: number;
  onSuccess?: () => void;
}

// Risk scoring matrix
const RISK_SCORES = {
  country: {
    low: 5,
    medium: 10,
    high: 20,
    prohibited: 50,
  },
  occupation: {
    low: 5,
    medium: 10,
    high: 20,
  },
  product: {
    low: 5,
    medium: 15,
    high: 25,
  },
  pep: {
    none: 0,
    foreign: 15,
    domestic: 10,
    international: 20,
  },
  sourceOfWealth: {
    transparent: 5,
    complex: 15,
    opaque: 25,
  },
};

export function RiskAssessmentForm({ clientId, onSuccess }: RiskAssessmentFormProps) {
  const { toast } = useToast();

  const { data: latestAssessment } = useQuery<RiskAssessment>({
    queryKey: [`/api/clients/${clientId}/risk-assessments/latest`],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assessmentDate: new Date().toISOString().split('T')[0],
      countryRisk: null,
      occupationRisk: null,
      productRisk: null,
      pepRisk: null,
      sourceOfWealthRisk: null,
      transactionPatternRisk: null,
      totalRiskScore: null,
      riskBand: null,
      assessedBy: null,
      assessmentNotes: "",
      overrideReason: "",
      approvedBy: null,
      approvedAt: null,
      version: latestAssessment ? (latestAssessment.version || 0) + 1 : 1,
    },
  });

  // Auto-calculate total risk score
  const watchedFields = form.watch([
    "countryRisk",
    "occupationRisk",
    "productRisk",
    "pepRisk",
    "sourceOfWealthRisk",
    "transactionPatternRisk",
  ]);

  useEffect(() => {
    const [country, occupation, product, pep, wealth, transaction] = watchedFields;
    const scores = [country, occupation, product, pep, wealth, transaction].filter(
      (s): s is number => s !== null && s !== undefined
    );
    
    if (scores.length > 0) {
      const total = scores.reduce((sum, score) => sum + score, 0);
      form.setValue("totalRiskScore", total);
      
      // Auto-set risk band based on total score
      let band: string;
      if (total >= 80) {
        band = "prohibited";
      } else if (total >= 50) {
        band = "high";
      } else if (total >= 25) {
        band = "medium";
      } else {
        band = "low";
      }
      form.setValue("riskBand", band);
    }
  }, [watchedFields, form]);

  const createAssessmentMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return await apiRequest(`/api/clients/${clientId}/risk-assessments`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/risk-assessments`] });
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}`] });
      toast({
        title: "Risk Assessment Created",
        description: "Risk scoring has been saved and client risk band updated",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create risk assessment",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createAssessmentMutation.mutate(data);
  };

  const totalRiskScore = form.watch("totalRiskScore");
  const riskBand = form.watch("riskBand");

  const getRiskBandColor = (band: string | null) => {
    switch (band) {
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "prohibited":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <CardTitle>Risk Assessment Matrix</CardTitle>
            </div>
            <CardDescription>
              Auto-calculating risk scoring replacing Excel-based assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="assessmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assessment Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      data-testid="input-assessment-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="countryRisk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country/Jurisdiction Risk</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-country-risk">
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={RISK_SCORES.country.low.toString()}>
                          Low Risk (5pts) - FATF compliant, low corruption
                        </SelectItem>
                        <SelectItem value={RISK_SCORES.country.medium.toString()}>
                          Medium Risk (10pts) - Some concerns
                        </SelectItem>
                        <SelectItem value={RISK_SCORES.country.high.toString()}>
                          High Risk (20pts) - FATF greylist, high corruption
                        </SelectItem>
                        <SelectItem value={RISK_SCORES.country.prohibited.toString()}>
                          Prohibited (50pts) - Sanctioned jurisdiction
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Based on citizenship, residence, business location
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupationRisk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation/Industry Risk</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-occupation-risk">
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={RISK_SCORES.occupation.low.toString()}>
                          Low Risk (5pts) - Professional, established business
                        </SelectItem>
                        <SelectItem value={RISK_SCORES.occupation.medium.toString()}>
                          Medium Risk (10pts) - Cash-intensive business
                        </SelectItem>
                        <SelectItem value={RISK_SCORES.occupation.high.toString()}>
                          High Risk (20pts) - Arms, casinos, crypto
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Industry sector and business nature
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productRisk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product/Service Risk</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-product-risk">
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={RISK_SCORES.product.low.toString()}>
                          Low Risk (5pts) - Standard managed accounts
                        </SelectItem>
                        <SelectItem value={RISK_SCORES.product.medium.toString()}>
                          Medium Risk (15pts) - Derivatives, leverage
                        </SelectItem>
                        <SelectItem value={RISK_SCORES.product.high.toString()}>
                          High Risk (25pts) - Complex structures, offshore
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Complexity of products and services
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pepRisk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PEP (Politically Exposed Person) Risk</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-pep-risk">
                          <SelectValue placeholder="Select PEP status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={RISK_SCORES.pep.none.toString()}>
                          Not a PEP (0pts)
                        </SelectItem>
                        <SelectItem value={RISK_SCORES.pep.domestic.toString()}>
                          Domestic PEP (10pts)
                        </SelectItem>
                        <SelectItem value={RISK_SCORES.pep.foreign.toString()}>
                          Foreign PEP (15pts)
                        </SelectItem>
                        <SelectItem value={RISK_SCORES.pep.international.toString()}>
                          International Organization PEP (20pts)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Political exposure and influence
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sourceOfWealthRisk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source of Wealth Risk</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-wealth-risk">
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={RISK_SCORES.sourceOfWealth.transparent.toString()}>
                          Transparent (5pts) - Salary, documented inheritance
                        </SelectItem>
                        <SelectItem value={RISK_SCORES.sourceOfWealth.complex.toString()}>
                          Complex (15pts) - Multiple sources, business income
                        </SelectItem>
                        <SelectItem value={RISK_SCORES.sourceOfWealth.opaque.toString()}>
                          Opaque (25pts) - Difficult to verify, offshore
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Transparency of wealth origin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transactionPatternRisk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Pattern Risk (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="e.g., 10"
                        data-testid="input-transaction-risk"
                      />
                    </FormControl>
                    <FormDescription>
                      Manual score for unusual transaction patterns (0-30)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <CardTitle>Risk Score Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Risk Score</div>
                <div className="text-3xl font-bold">{totalRiskScore || 0}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Risk Band</div>
                <Badge className={getRiskBandColor(riskBand)}>
                  {riskBand?.toUpperCase() || "NOT SET"}
                </Badge>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <div>Score Ranges:</div>
              <div>• 0-24: <span className="text-green-500">Low Risk</span></div>
              <div>• 25-49: <span className="text-yellow-500">Medium Risk</span></div>
              <div>• 50-79: <span className="text-orange-500">High Risk</span></div>
              <div>• 80+: <span className="text-red-500">Prohibited</span></div>
            </div>

            <FormField
              control={form.control}
              name="assessmentNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assessment Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Additional context, rationale for scores, mitigating factors..."
                      className="min-h-[100px]"
                      data-testid="textarea-assessment-notes"
                    />
                  </FormControl>
                  <FormDescription>
                    Explain scoring rationale and any special considerations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overrideReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Override Reason (if applicable)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="If manually adjusting risk band from calculated score, explain why..."
                      className="min-h-[80px]"
                      data-testid="textarea-override-reason"
                    />
                  </FormControl>
                  <FormDescription>
                    Required if overriding auto-calculated risk band
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={createAssessmentMutation.isPending}
            data-testid="button-save-risk-assessment"
          >
            <Save className="mr-2 h-4 w-4" />
            {createAssessmentMutation.isPending ? "Saving..." : "Save Risk Assessment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
