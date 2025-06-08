import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { financialInfoSchema, FinancialInfoValues } from "@/lib/schemas/visaFormSchema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FinancialInfoFormProps {
  defaultValues: FinancialInfoValues;
  visaType: string;
  onSubmit: (values: FinancialInfoValues) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const FinancialInfoForm = ({ defaultValues, visaType, onSubmit, onBack, isLoading = false }: FinancialInfoFormProps) => {
  const form = useForm<FinancialInfoValues>({
    resolver: zodResolver(financialInfoSchema),
    defaultValues,
    mode: "onChange",
  });

  const showSponsorDetails = form.watch("fundingSource") === "sponsor";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="fundingSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funding Source</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your funding source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="self">Self-funded</SelectItem>
                    <SelectItem value="sponsor">Sponsor</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                    {visaType === "student" && (
                      <SelectItem value="scholarship">Scholarship</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  How will your trip be financed?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {showSponsorDetails && (
            <FormField
              control={form.control}
              name="sponsorDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sponsor Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide name, relationship, contact information, and financial support details of your sponsor"
                      className="min-h-[100px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="monthlyIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Income (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="USD" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>
                  This helps establish your financial capability for the visit
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Required Financial Documentation:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {visaType === "tourist" && (
                <>
                  <li>Bank statements (last 3-6 months)</li>
                  <li>Proof of travel funding (minimum USD 50/day recommended)</li>
                </>
              )}
              {visaType === "business" && (
                <>
                  <li>Bank statements or company financial documents</li>
                  <li>Sponsor letter (if a Burundian company is funding the trip)</li>
                </>
              )}
              {visaType === "work" && (
                <>
                  <li>Employment contract with salary details</li>
                  <li>Employer financial guarantee</li>
                </>
              )}
              {visaType === "student" && (
                <>
                  <li>Proof of tuition payment or scholarship award</li>
                  <li>Bank statements or sponsor letter</li>
                </>
              )}
              {visaType === "transit" && (
                <>
                  <li>Proof of funds for transit period</li>
                </>
              )}
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              Note: You will be required to upload these documents in the next step.
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FinancialInfoForm;
