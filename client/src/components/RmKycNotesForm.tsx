import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
import { insertRmKycNoteSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Save } from "lucide-react";
import { z } from "zod";

const formSchema = insertRmKycNoteSchema.omit({ clientId: true, firmId: true, createdAt: true, updatedAt: true });
type FormValues = z.infer<typeof formSchema>;

interface RmKycNotesFormProps {
  clientId: number;
  onSuccess?: () => void;
}

export function RmKycNotesForm({ clientId, onSuccess }: RmKycNotesFormProps) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      relationshipManagerId: 1,
      noteType: "initial_kyc",
      noteDate: new Date().toISOString().split('T')[0],
      clientBackground: "",
      relationshipWithRM: "",
      relationshipWithFirm: "",
      contactInitiationDetails: "",
      sourceOfWealthNarrative: "",
      sourceOfFundsNarrative: "",
      investmentKnowledgeAssessment: "",
      currentProfessionalActivities: "",
      otherRelevantInformation: "",
      signature: "",
      signedAt: null,
      version: 1,
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return await apiRequest(`/api/clients/${clientId}/rm-notes`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}/rm-notes`] });
      toast({
        title: "RM Note Created",
        description: "KYC narrative assessment has been saved successfully",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create RM note",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createNoteMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>RM KYC Narrative Assessment</CardTitle>
            </div>
            <CardDescription>
              Comprehensive relationship manager assessment replacing Word-based templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="noteType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-note-type">
                          <SelectValue placeholder="Select note type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="initial_kyc">Initial KYC</SelectItem>
                        <SelectItem value="periodic_review">Periodic Review</SelectItem>
                        <SelectItem value="material_change">Material Change</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Type of assessment being performed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="noteDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        data-testid="input-note-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="clientBackground"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Background</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Provide comprehensive client background including history, experience, and profile..."
                      className="min-h-[120px]"
                      data-testid="textarea-client-background"
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed narrative of client's background and profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="relationshipWithRM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship with RM</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder="How did the relationship manager meet the client..."
                        className="min-h-[100px]"
                        data-testid="textarea-relationship-rm"
                      />
                    </FormControl>
                    <FormDescription>
                      Nature of RM-client relationship
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationshipWithFirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship with Firm</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder="How long has the client been associated with the firm..."
                        className="min-h-[100px]"
                        data-testid="textarea-relationship-firm"
                      />
                    </FormControl>
                    <FormDescription>
                      Client's history with firm
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contactInitiationDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Initiation Details</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="How was contact initiated? Referral details, introduction circumstances..."
                      className="min-h-[100px]"
                      data-testid="textarea-contact-details"
                    />
                  </FormControl>
                  <FormDescription>
                    Details of initial contact and referrals
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sourceOfWealthNarrative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source of Wealth Narrative</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder="Describe how the client accumulated overall wealth..."
                        className="min-h-[100px]"
                        data-testid="textarea-wealth-narrative"
                      />
                    </FormControl>
                    <FormDescription>
                      Origin of overall wealth accumulation
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
                    <FormLabel>Source of Funds Narrative</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder="Describe the origin of funds for this specific transaction..."
                        className="min-h-[100px]"
                        data-testid="textarea-funds-narrative"
                      />
                    </FormControl>
                    <FormDescription>
                      Origin of funds for investment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="investmentKnowledgeAssessment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Knowledge Assessment</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Assess client's investment knowledge, experience with different products, risk understanding..."
                      className="min-h-[120px]"
                      data-testid="textarea-investment-knowledge"
                    />
                  </FormControl>
                  <FormDescription>
                    Client's investment sophistication and knowledge
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentProfessionalActivities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Professional Activities</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Describe client's current professional role, business activities, industry sector..."
                      className="min-h-[100px]"
                      data-testid="textarea-professional-activities"
                    />
                  </FormControl>
                  <FormDescription>
                    Nature of business and professional activities
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherRelevantInformation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Relevant Information</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Any other relevant observations, red flags, or items requiring attention..."
                      className="min-h-[100px]"
                      data-testid="textarea-other-info"
                    />
                  </FormControl>
                  <FormDescription>
                    Additional notes and observations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">RM Signature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="signature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Type full name as signature"
                      data-testid="input-signature"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="signedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
                      data-testid="input-signed-at"
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
            disabled={createNoteMutation.isPending}
            data-testid="button-save-rm-note"
          >
            <Save className="mr-2 h-4 w-4" />
            {createNoteMutation.isPending ? "Saving..." : "Save RM Note"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
