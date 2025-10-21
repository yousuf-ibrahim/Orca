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
import { insertWealthInformationSchema, type WealthInformation } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Save, TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useEffect } from "react";
import { z } from "zod";

const formSchema = insertWealthInformationSchema.omit({ clientId: true, firmId: true, createdAt: true, updatedAt: true });
type FormValues = z.infer<typeof formSchema>;

interface WealthInformationFormProps {
  clientId: number;
  onSuccess?: () => void;
}

export function WealthInformationForm({ clientId, onSuccess }: WealthInformationFormProps) {
  const { toast } = useToast();

  const { data: existingWealth } = useQuery<WealthInformation>({
    queryKey: [`/api/clients/${clientId}/wealth`],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceOfWealthNarrative: "",
      sourceOfFundsNarrative: "",
      totalNetWorth: null,
      liquidAssets: null,
      illiquidAssets: null,
      liabilities: null,
      annualIncome: null,
      incomeSource: "",
      assetBreakdown: null,
      wealthVerificationStatus: "pending",
      verificationPercentage: 0,
      verifiedBy: null,
      verifiedAt: null,
      verificationNotes: "",
      version: 1,
    },
  });

  useEffect(() => {
    if (existingWealth) {
      form.reset({
        sourceOfWealthNarrative: existingWealth.sourceOfWealthNarrative || "",
        sourceOfFundsNarrative: existingWealth.sourceOfFundsNarrative || "",
        totalNetWorth: existingWealth.totalNetWorth || null,
        liquidAssets: existingWealth.liquidAssets || null,
        illiquidAssets: existingWealth.illiquidAssets || null,
        liabilities: existingWealth.liabilities || null,
        annualIncome: existingWealth.annualIncome || null,
        incomeSource: existingWealth.incomeSource || "",
        assetBreakdown: existingWealth.assetBreakdown || null,
        wealthVerificationStatus: existingWealth.wealthVerificationStatus || "pending",
        verificationPercentage: existingWealth.verificationPercentage || 0,
        verifiedBy: existingWealth.verifiedBy,
        verifiedAt: existingWealth.verifiedAt,
        verificationNotes: existingWealth.verificationNotes || "",
        version: existingWealth.version || 1,
      });
    }
  }, [existingWealth, form]);

  const createOrUpdateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (existingWealth) {
        return await apiRequest(`/api/wealth/${existingWealth.id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
      } else {
        return await apiRequest(`/api/clients/${clientId}/wealth`, {
          method: "POST",
          body: JSON.stringify(data),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/wealth`] });
      toast({
        title: existingWealth ? "Wealth Information Updated" : "Wealth Information Created",
        description: "Source of wealth and funds information has been saved",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save wealth information",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createOrUpdateMutation.mutate(data);
  };

  const verificationPercentage = form.watch("verificationPercentage");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <CardTitle>Source of Wealth & Funds</CardTitle>
            </div>
            <CardDescription>
              Comprehensive wealth verification replacing manual Excel tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="sourceOfWealthNarrative"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source of Wealth (Narrative)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Describe how the client accumulated their overall wealth (e.g., business ownership, professional career, inheritance, investments, property appreciation)..."
                      className="min-h-[120px]"
                      data-testid="textarea-source-of-wealth"
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed explanation of wealth accumulation over time
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sourceOfFundsNarrative"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source of Funds (Narrative)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Describe the origin of funds for this specific investment (e.g., sale of business, salary savings, liquidation of securities, loan proceeds)..."
                      className="min-h-[120px]"
                      data-testid="textarea-source-of-funds"
                    />
                  </FormControl>
                  <FormDescription>
                    Specific origin of funds for this account/transaction
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
              <CardTitle>Financial Position</CardTitle>
            </div>
            <CardDescription>
              Asset and liability breakdown with verification tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalNetWorth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Net Worth (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? e.target.value : null)}
                        placeholder="e.g., 5000000"
                        data-testid="input-total-net-worth"
                      />
                    </FormControl>
                    <FormDescription>
                      Assets minus liabilities
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="annualIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? e.target.value : null)}
                        placeholder="e.g., 500000"
                        data-testid="input-annual-income"
                      />
                    </FormControl>
                    <FormDescription>
                      Annual income from all sources
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="liquidAssets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liquid Assets (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? e.target.value : null)}
                        placeholder="e.g., 3000000"
                        data-testid="input-liquid-assets"
                      />
                    </FormControl>
                    <FormDescription>
                      Cash, securities, readily tradable assets
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="illiquidAssets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Illiquid Assets (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? e.target.value : null)}
                        placeholder="e.g., 2500000"
                        data-testid="input-illiquid-assets"
                      />
                    </FormControl>
                    <FormDescription>
                      Real estate, private equity, illiquid holdings
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="liabilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Liabilities (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? e.target.value : null)}
                        placeholder="e.g., 500000"
                        data-testid="input-liabilities"
                      />
                    </FormControl>
                    <FormDescription>
                      Mortgages, loans, debt obligations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="incomeSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Income Source</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder="e.g., Business income, Salary, Investments"
                        data-testid="input-income-source"
                      />
                    </FormControl>
                    <FormDescription>
                      Primary sources of income
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
            <CardTitle className="text-lg">Wealth Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="verificationNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="List documents reviewed: bank statements, tax returns, audited financials, property valuations, brokerage statements..."
                      className="min-h-[100px]"
                      data-testid="textarea-verification-notes"
                    />
                  </FormControl>
                  <FormDescription>
                    Documents and evidence used to verify wealth statements
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verificationPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Verification Level: {verificationPercentage}%
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={[field.value || 0]}
                      onValueChange={(values) => field.onChange(values[0])}
                      className="w-full"
                      data-testid="slider-verification-percentage"
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage of stated wealth verified through documentation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verifiedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
                      data-testid="input-verified-at"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={createOrUpdateMutation.isPending}
            data-testid="button-save-wealth"
          >
            <Save className="mr-2 h-4 w-4" />
            {createOrUpdateMutation.isPending ? "Saving..." : existingWealth ? "Update Wealth Information" : "Save Wealth Information"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
