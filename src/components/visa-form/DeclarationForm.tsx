import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCountryName } from "@/lib/utils";
import { 
  declarationSchema, 
  DeclarationValues, 
  VisaFormValues 
} from "@/lib/schemas/visaFormSchema";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";

interface DeclarationFormProps {
  defaultValues: DeclarationValues;
  visaType: string;
  visaFee: number;
  onSubmit: (values: DeclarationValues) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const DeclarationForm = ({ 
  defaultValues, 
  visaType, 
  visaFee, 
  onSubmit, 
  onBack,
  isLoading = false
}: DeclarationFormProps) => {
  const form = useForm<DeclarationValues>({
    resolver: zodResolver(declarationSchema),
    defaultValues,
  });
  
  // Get all form data from localStorage to display in review
  const [completeFormData, setCompleteFormData] = useState<VisaFormValues | null>(() => {
    try {
      const savedData = localStorage.getItem("visaApplicationData");
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (e) {
      console.error("Error parsing application data:", e);
    }
    return null;
  });
  
  // Get uploaded document info
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{ name: string; size: number }>>(() => {
    try {
      const savedDocs = localStorage.getItem("uploadedDocuments");
      if (savedDocs) {
        return JSON.parse(savedDocs);
      }
    } catch (e) {
      console.error("Error parsing uploaded documents:", e);
    }
    return [];
  });

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };
  
  const getVisaTypeName = (type: string) => {
    const visaTypes: Record<string, string> = {
      tourist: "Tourist Visa",
      business: "Business Visa",
      work: "Work Visa",
      student: "Student Visa",
      transit: "Transit Visa"
    };
    return visaTypes[type] || type;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-md border-l-4 border-secondary">
            <h3 className="text-base font-medium">Application Review</h3>
            <p className="text-sm text-gray-600 mt-1">
              Please review your application details and confirm that all information is correct before submitting.
            </p>
          </div>

          {/* Application Summary */}
          <Card className="bg-white border shadow-sm">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-xl">Application Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Visa Type</p>
                  <p className="font-medium">{getVisaTypeName(visaType)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Fee</p>
                  <p className="font-medium">${visaFee} USD</p>
                </div>
              </div>
              
              <Accordion type="multiple" className="w-full">
                {/* Personal Information Section */}
                <AccordionItem value="personal-info">
                  <AccordionTrigger className="hover:bg-muted/20 px-4 -mx-4 hover:no-underline">
                    Personal Information
                  </AccordionTrigger>
                  <AccordionContent className="px-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">
                          {completeFormData?.personalInfo.firstName} {completeFormData?.personalInfo.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">
                          {formatDate(completeFormData?.personalInfo.dateOfBirth)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="font-medium capitalize">
                          {completeFormData?.personalInfo.gender || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nationality</p>
                        <p className="font-medium">
                          {getCountryName(completeFormData?.personalInfo.nationality || "") || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Country</p>
                        <p className="font-medium">
                          {getCountryName(completeFormData?.personalInfo.country || "") || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">City</p>
                        <p className="font-medium">
                          {completeFormData?.personalInfo.city || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Passport Number</p>
                        <p className="font-medium">
                          {completeFormData?.personalInfo.passportNumber || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Passport Expiry</p>
                        <p className="font-medium">
                          {formatDate(completeFormData?.personalInfo.passportExpiryDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">
                          {completeFormData?.personalInfo.email || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">
                          {completeFormData?.personalInfo.phone || "Not provided"}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">
                          {completeFormData?.personalInfo.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Travel Information Section */}
                <AccordionItem value="travel-info">
                  <AccordionTrigger className="hover:bg-muted/20 px-4 -mx-4 hover:no-underline">
                    Travel Information
                  </AccordionTrigger>
                  <AccordionContent className="px-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Purpose of Travel</p>
                        <p className="font-medium">
                          {completeFormData?.travelInfo.purposeOfTravel || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Entry Date</p>
                        <p className="font-medium">
                          {formatDate(completeFormData?.travelInfo.entryDate?.toString())}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Exit Date</p>
                        <p className="font-medium">
                          {formatDate(completeFormData?.travelInfo.exitDate?.toString())}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Port of Entry</p>
                        <p className="font-medium">
                          {completeFormData?.travelInfo.portOfEntry || "Not provided"}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Accommodation</p>
                        <p className="font-medium">
                          {completeFormData?.travelInfo.accommodationDetails || "Not provided"}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Travel Itinerary</p>
                        <p className="font-medium">
                          {completeFormData?.travelInfo.travelItinerary || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Financial Information Section */}
                <AccordionItem value="financial-info">
                  <AccordionTrigger className="hover:bg-muted/20 px-4 -mx-4 hover:no-underline">
                    Financial Information
                  </AccordionTrigger>
                  <AccordionContent className="px-1">
                    <div className="grid grid-cols-1 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Funding Source</p>
                        <p className="font-medium capitalize">
                          {completeFormData?.financialInfo.fundingSource || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Income</p>
                        <p className="font-medium">
                          {completeFormData?.financialInfo.monthlyIncome || "Not provided"}
                        </p>
                      </div>
                      {completeFormData?.financialInfo.fundingSource === "sponsor" && (
                        <div>
                          <p className="text-sm text-muted-foreground">Sponsor Details</p>
                          <p className="font-medium">
                            {completeFormData?.financialInfo.sponsorDetails || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Documents Section */}
                <AccordionItem value="documents">
                  <AccordionTrigger className="hover:bg-muted/20 px-4 -mx-4 hover:no-underline">
                    Uploaded Documents
                  </AccordionTrigger>
                  <AccordionContent className="px-1">
                    {uploadedDocuments.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {uploadedDocuments.map((doc, idx) => (
                          <li key={idx} className="text-sm">
                            <span className="font-medium">{doc.name}</span> 
                            <span className="text-muted-foreground ml-2">
                              ({Math.round(doc.size / 1024)} KB)
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">
                        No documents have been uploaded yet.
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Declaration Section */}
          <Card className="bg-white border shadow-sm">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-xl">Declaration</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Declaration of Truthfulness
                      </FormLabel>
                      <FormDescription>
                        I declare that the information provided in this application is true, correct, and complete. 
                        I understand that any false statements or deliberate omissions may result in the refusal 
                        of my visa application or subsequent cancellation of my visa.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Data Processing Consent
                      </FormLabel>
                      <FormDescription>
                        I consent to the collection, use, disclosure, and processing of my personal information 
                        for the purposes of processing my visa application and for record-keeping by the 
                        relevant authorities in accordance with applicable privacy laws.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
            Back
          </Button>
          <Button 
            type="submit" 
            className="bg-secondary hover:bg-secondary/90"
            disabled={!form.formState.isValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DeclarationForm;
