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
import { Checkbox } from "@/components/ui/checkbox";
import { insertClientClassificationSchema, type ClientClassification } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Save } from "lucide-react";
import { z } from "zod";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

const formSchema = insertClientClassificationSchema.omit({ 
  clientId: true, 
  firmId: true, 
  createdAt: true 
});
type FormValues = z.infer<typeof formSchema>;

interface ClientClassificationFormProps {
  clientId: number;
  onSuccess?: () => void;
}

export function ClientClassificationForm({ clientId, onSuccess }: ClientClassificationFormProps) {
  const { toast } = useToast();

  const { data: existingClassification } = useQuery<ClientClassification>({
    queryKey: [`/api/clients/${clientId}/classification`],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classification: "",
      classificationBasis: "",
      meetsNetWorthRequirement: false,
      meetsPortfolioRequirement: false,
      meetsExperienceRequirement: false,
      classificationDate: new Date().toISOString().split('T')[0],
      classifiedBy: null,
      approvedBy: null,
      version: existingClassification ? (existingClassification.version || 0) + 1 : 1,
    },
  });

  useEffect(() => {
    if (existingClassification) {
      form.reset({
        classification: existingClassification.classification || "",
        classificationBasis: existingClassification.classificationBasis || "",
        meetsNetWorthRequirement: existingClassification.meetsNetWorthRequirement || false,
        meetsPortfolioRequirement: existingClassification.meetsPortfolioRequirement || false,
        meetsExperienceRequirement: existingClassification.meetsExperienceRequirement || false,
        classificationDate: existingClassification.classificationDate || new Date().toISOString().split('T')[0],
        classifiedBy: existingClassification.classifiedBy,
        approvedBy: existingClassification.approvedBy,
        version: (existingClassification.version || 0) + 1,
      });
    }
  }, [existingClassification, form]);

  const createOrUpdateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return await apiRequest(`/api/clients/${clientId}/classification`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/classification`] });
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}`] });
      toast({
        title: "Client Classification Saved",
        description: "Client category has been updated",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save client classification",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createOrUpdateMutation.mutate(data);
  };

  const classification = form.watch("classification");
  const meetsNetWorth = form.watch("meetsNetWorthRequirement");
  const meetsPortfolio = form.watch("meetsPortfolioRequirement");
  const meetsExperience = form.watch("meetsExperienceRequirement");

  const qualifiesForProfessional = meetsNetWorth && meetsPortfolio && meetsExperience;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Client Classification (DFSA/DIFC)</CardTitle>
            </div>
            <CardDescription>
              Professional client determination per DFSA Conduct of Business rules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="classification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-classification">
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="retail">Retail Client</SelectItem>
                      <SelectItem value="professional">Professional Client</SelectItem>
                      <SelectItem value="market_counterparty">Market Counterparty</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Classification determines regulatory protections and disclosure requirements
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classificationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classification Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      data-testid="input-classification-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Professional Client Criteria (DFSA COB 2.3.3)</CardTitle>
            <CardDescription>
              Must meet ALL three criteria to qualify as Professional Client
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="meetsNetWorthRequirement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-net-worth"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Net Worth Requirement
                    </FormLabel>
                    <FormDescription>
                      Net assets of at least USD $1,000,000 (or equivalent) calculated in accordance with COB App4
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meetsPortfolioRequirement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-portfolio"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Portfolio Requirement
                    </FormLabel>
                    <FormDescription>
                      Has (or had within preceding 2 years) a portfolio of at least USD $500,000
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meetsExperienceRequirement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-experience"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Experience Requirement
                    </FormLabel>
                    <FormDescription>
                      Has worked in the financial sector for at least 1 year in a professional position requiring knowledge of transactions or services OR has been a party to ≥10 significant financial transactions in preceding 2 years
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="rounded-md border p-4 space-y-2">
              <div className="text-sm font-medium">Qualification Status</div>
              {qualifiesForProfessional ? (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  ✓ Meets All Criteria - Eligible for Professional Classification
                </Badge>
              ) : (
                <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  ⚠ Does Not Meet All Criteria - Should be Retail Client
                </Badge>
              )}
            </div>

            <FormField
              control={form.control}
              name="classificationBasis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classification Basis / Rationale</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Explain the basis for this classification, including supporting evidence for each criterion met..."
                      className="min-h-[120px]"
                      data-testid="textarea-classification-basis"
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed explanation of why client qualifies (or doesn't) for Professional status
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Market Counterparty Criteria (DFSA COB 2.3.5)</CardTitle>
            <CardDescription>
              Higher classification for sophisticated institutional clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="font-medium">Eligible entities include:</div>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>DFSA Authorized Firms</li>
                <li>Regulated financial institutions (banks, investment firms, insurance companies)</li>
                <li>Governments, central banks, and supranational organizations</li>
                <li>Qualifying corporate entities with balance sheet ≥ $10M USD</li>
                <li>Collective investment schemes and pension funds</li>
              </ul>
              <div className="mt-4 text-xs text-muted-foreground">
                Reference: DFSA Conduct of Business Module (COB) Rules 2.3.5 and GEN 2.13
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={createOrUpdateMutation.isPending}
            data-testid="button-save-classification"
          >
            <Save className="mr-2 h-4 w-4" />
            {createOrUpdateMutation.isPending ? "Saving..." : "Save Classification"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
