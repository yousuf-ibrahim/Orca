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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertSuitabilityAssessmentSchema, type SuitabilityAssessment } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, Save, TrendingUp } from "lucide-react";
import { z } from "zod";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

const formSchema = insertSuitabilityAssessmentSchema.omit({ 
  clientId: true, 
  firmId: true, 
  createdAt: true 
});
type FormValues = z.infer<typeof formSchema>;

interface SuitabilityAssessmentFormProps {
  clientId: number;
  onSuccess?: () => void;
}

export function SuitabilityAssessmentForm({ clientId, onSuccess }: SuitabilityAssessmentFormProps) {
  const { toast } = useToast();

  const { data: latestAssessment } = useQuery<SuitabilityAssessment>({
    queryKey: [`/api/clients/${clientId}/suitability-assessments/latest`],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assessmentDate: new Date().toISOString().split('T')[0],
      investmentObjective: null,
      productKnowledge: [],
      investmentTimeHorizon: null,
      timeHorizonScore: null,
      relianceOnAssets: null,
      marketDeclineResponse: null,
      portfolioDeclineTolerance: null,
      percentageOfNetWorth: null,
      totalScore: null,
      suitabilityRating: null,
      assessedBy: null,
      approvedBy: null,
      version: latestAssessment ? (latestAssessment.version || 0) + 1 : 1,
    },
  });

  // Auto-calculate suitability score
  const watchedFields = form.watch([
    "timeHorizonScore",
    "relianceOnAssets",
    "marketDeclineResponse",
    "portfolioDeclineTolerance",
  ]);

  useEffect(() => {
    const [timeHorizon, reliance, marketResponse, declineTolerance] = watchedFields;
    const scores = [timeHorizon, reliance, marketResponse, declineTolerance].filter(
      (s): s is number => s !== null && s !== undefined
    );
    
    if (scores.length === 4) {
      const total = scores.reduce((sum, score) => sum + score, 0);
      form.setValue("totalScore", total);
      
      // Auto-set suitability rating (higher score = more aggressive)
      let rating: string;
      if (total >= 16) {
        rating = "aggressive";
      } else if (total >= 12) {
        rating = "growth";
      } else if (total >= 8) {
        rating = "balanced";
      } else if (total >= 5) {
        rating = "moderate";
      } else {
        rating = "conservative";
      }
      form.setValue("suitabilityRating", rating);
    }
  }, [watchedFields, form]);

  const createAssessmentMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return await apiRequest(`/api/clients/${clientId}/suitability-assessments`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/suitability-assessments`] });
      toast({
        title: "Suitability Assessment Created",
        description: "Investment suitability has been assessed and saved",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create suitability assessment",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createAssessmentMutation.mutate(data);
  };

  const totalScore = form.watch("totalScore");
  const suitabilityRating = form.watch("suitabilityRating");

  const getRatingColor = (rating: string | null) => {
    switch (rating) {
      case "conservative":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "moderate":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      case "balanced":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "growth":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "aggressive":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
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
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Investment Suitability Assessment</CardTitle>
            </div>
            <CardDescription>
              Comprehensive appropriateness determination for SEC/FINRA/DIFC compliance
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

            <FormField
              control={form.control}
              name="investmentObjective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Objective</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger data-testid="select-investment-objective">
                        <SelectValue placeholder="Select primary objective" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="capital_preservation">Capital Preservation</SelectItem>
                      <SelectItem value="income">Income Generation</SelectItem>
                      <SelectItem value="balanced">Balanced Growth & Income</SelectItem>
                      <SelectItem value="growth">Capital Growth</SelectItem>
                      <SelectItem value="aggressive">Aggressive Growth</SelectItem>
                      <SelectItem value="speculation">Speculation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Client's primary investment goal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="investmentTimeHorizon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Time Horizon</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Auto-set time horizon score
                      const scoreMap: Record<string, number> = {
                        "0-1yr": 1,
                        "1-3yr": 2,
                        "3-5yr": 3,
                        "5-10yr": 4,
                        "10+yr": 5,
                      };
                      form.setValue("timeHorizonScore", scoreMap[value] || null);
                    }}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-time-horizon">
                        <SelectValue placeholder="Select time horizon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-1yr">Less than 1 year (1pt)</SelectItem>
                      <SelectItem value="1-3yr">1-3 years (2pts)</SelectItem>
                      <SelectItem value="3-5yr">3-5 years (3pts)</SelectItem>
                      <SelectItem value="5-10yr">5-10 years (4pts)</SelectItem>
                      <SelectItem value="10+yr">10+ years (5pts)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Expected investment duration
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Tolerance Questionnaire</CardTitle>
            <CardDescription>
              Required for suitability determination (SEC/FINRA standards)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="relianceOnAssets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    "I am financially dependent on my investment portfolio for living expenses"
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-reliance">
                        <SelectValue placeholder="Select response" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Strongly Agree (1pt) - High reliance</SelectItem>
                      <SelectItem value="2">Agree (2pts)</SelectItem>
                      <SelectItem value="3">Neutral (3pts)</SelectItem>
                      <SelectItem value="4">Disagree (4pts)</SelectItem>
                      <SelectItem value="5">Strongly Disagree (5pts) - Low reliance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Lower reliance = higher risk tolerance
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketDeclineResponse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    "If my portfolio declined 20%, I would..."
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-market-decline">
                        <SelectValue placeholder="Select response" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Sell immediately (1pt) - Very conservative</SelectItem>
                      <SelectItem value="2">Reduce risk exposure (2pts)</SelectItem>
                      <SelectItem value="3">Hold steady (3pts)</SelectItem>
                      <SelectItem value="4">Hold and maybe buy (4pts)</SelectItem>
                      <SelectItem value="5">Buy more aggressively (5pts) - Very aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Response to significant market volatility
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="portfolioDeclineTolerance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    "The maximum decline I could tolerate in a year before becoming uncomfortable"
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-decline-tolerance">
                        <SelectValue placeholder="Select tolerance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Less than 5% (1pt)</SelectItem>
                      <SelectItem value="2">5-10% (2pts)</SelectItem>
                      <SelectItem value="3">10-20% (3pts)</SelectItem>
                      <SelectItem value="4">20-30% (4pts)</SelectItem>
                      <SelectItem value="5">More than 30% (5pts)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Maximum acceptable portfolio decline
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="percentageOfNetWorth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentage of Net Worth Being Invested</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="e.g., 25"
                      data-testid="input-percentage-net-worth"
                    />
                  </FormControl>
                  <FormDescription>
                    What percentage of total net worth is represented by this account? (0-100)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Suitability Score Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Score</div>
                <div className="text-3xl font-bold">{totalScore || 0}/20</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Suitability Rating</div>
                <Badge className={getRatingColor(suitabilityRating)}>
                  {suitabilityRating?.toUpperCase() || "NOT SET"}
                </Badge>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <div>Score Ranges & Suitable Products:</div>
              <div>• 4-5pts: <span className="text-blue-500">Conservative</span> - Money market, short-term bonds</div>
              <div>• 6-7pts: <span className="text-cyan-500">Moderate</span> - Balanced funds, investment-grade bonds</div>
              <div>• 8-11pts: <span className="text-green-500">Balanced</span> - 60/40 equity/fixed income</div>
              <div>• 12-15pts: <span className="text-yellow-500">Growth</span> - Equity-heavy portfolios</div>
              <div>• 16-20pts: <span className="text-orange-500">Aggressive</span> - High equity, alternatives, leverage</div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={createAssessmentMutation.isPending}
            data-testid="button-save-suitability"
          >
            <Save className="mr-2 h-4 w-4" />
            {createAssessmentMutation.isPending ? "Saving..." : "Save Suitability Assessment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
