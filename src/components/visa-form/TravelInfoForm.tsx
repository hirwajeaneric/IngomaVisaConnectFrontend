import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { travelInfoSchema, TravelInfoValues } from "@/lib/schemas/visaFormSchema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface TravelInfoFormProps {
  defaultValues: TravelInfoValues;
  onSubmit: (data: TravelInfoValues) => void;
  onBack: () => void;
  isLoading?: boolean;
  initialVisaType?: { type: string; id: string } | null;
}

// Available visa types mapping
export const VISA_TYPES = {
  tourist: "Tourist Visa",
  business: "Business Visa",
  work: "Work Visa",
  student: "Student Visa",
  transit: "Transit Visa",
} as const;

// Function to normalize visa type strings
export const normalizeVisaType = (visaType: string): keyof typeof VISA_TYPES | undefined => {
  // Remove any special characters and convert to lowercase
  const normalized = visaType.toLowerCase().replace(/[^a-z]/g, '');
  
  // Check if the normalized string contains any of our known visa types
  return Object.keys(VISA_TYPES).find(type => 
    normalized.includes(type)
  ) as keyof typeof VISA_TYPES | undefined;
};

const TravelInfoForm = ({ defaultValues, onSubmit, onBack, isLoading = false, initialVisaType }: TravelInfoFormProps) => {
  const form = useForm<TravelInfoValues>({
    resolver: zodResolver(travelInfoSchema),
    defaultValues: {
      ...defaultValues,
      // If initialVisaType is provided, normalize it to match our visa types
      visaType: initialVisaType ? (normalizeVisaType(initialVisaType.type) || defaultValues.visaType) : defaultValues.visaType
    },
    mode: "onChange",
  });

  // Show/hide fields based on visa type
  const visaType = form.watch("visaType");
  const showPreviousVisits = form.watch("previousVisits");

  // Update purpose of travel based on visa type
  useEffect(() => {
    let purpose = "";
    
    switch (visaType) {
      case "tourist":
        purpose = "Tourism and leisure activities";
        break;
      case "business":
        purpose = "Business meetings and professional activities";
        break;
      case "work":
        purpose = "Employment in Burundi";
        break;
      case "student":
        purpose = "Educational purposes and studies";
        break;
      case "transit":
        purpose = "Transit through Burundi to another country";
        break;
    }
    
    if (purpose && !form.getValues("purposeOfTravel")) {
      form.setValue("purposeOfTravel", purpose);
    }
  }, [visaType, form]);

  const handleSubmit = (data: TravelInfoValues) => {
    // Transform the data to match backend expectations
    const transformedData = {
      ...data,
      intendedEntryDate: data.entryDate,
      intendedExitDate: data.exitDate,
    };
    onSubmit(transformedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="visaType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visa Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoading || !!initialVisaType}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visa type">
                        {field.value ? VISA_TYPES[field.value as keyof typeof VISA_TYPES] : "Select visa type"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(VISA_TYPES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {initialVisaType && (
                  <FormDescription>
                    Visa type is pre-selected based on your selection from the visa types page.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purposeOfTravel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose of Travel</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your purpose of travel"
                    className="min-h-[100px]"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="entryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Entry Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={isLoading}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exitDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Exit Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={isLoading}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="portOfEntry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port of Entry</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select port of entry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bujumbura-airport">Bujumbura International Airport</SelectItem>
                    <SelectItem value="gitega-airport">Gitega International Airport</SelectItem>
                    <SelectItem value="kobero-border">Kobero Land Border (Tanzania)</SelectItem>
                    <SelectItem value="gasenyi-border">Gasenyi Land Border (Rwanda)</SelectItem>
                    <SelectItem value="mugina-border">Mugina Land Border (DRC)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border p-4 rounded-md">
            <FormField
              control={form.control}
              name="previousVisits"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Have you previously visited Burundi?
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {showPreviousVisits && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="previousVisitDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Visit Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter details about your previous visits"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Conditional fields based on visa type */}
          {(visaType === "tourist" || visaType === "business") && (
            <FormField
              control={form.control}
              name="travelItinerary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Travel Itinerary {visaType === "tourist" ? "(Required)" : "(Optional)"}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your travel itinerary"
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

          {(visaType === "tourist" || visaType === "student" || visaType === "work") && (
            <FormField
              control={form.control}
              name="accommodationDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accommodation Details</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter your accommodation details"
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
            name="hostDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Host Details</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter your host details"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="countriesVisitedOfAfterBurundi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Countries to Visit After Burundi</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="List any countries you plan to visit after Burundi"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {visaType === "transit" && (
            <>
              <FormField
                control={form.control}
                name="finalDestination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Final Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="Country of final destination" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="countriesVisitedOfAfterBurundi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Countries Visited Before/After</FormLabel>
                    <FormControl>
                      <Input placeholder="List countries visited before or after Burundi" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
            Back
          </Button>
          <Button type="submit" className="bg-secondary hover:bg-secondary/90" disabled={isLoading}>
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

export default TravelInfoForm;
