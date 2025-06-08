import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentsSchema, DocumentsValues } from "@/lib/schemas/visaFormSchema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { useVisaApplication } from "@/hooks/useVisaApplication";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ALLOWED_DOCUMENT_TYPES, DocumentType } from "@/lib/api/services/visaapplication.service";

interface DocumentsFormProps {
  defaultValues: DocumentsValues;
  visaType: string;
  onSubmit: (values: DocumentsValues) => void;
  onBack: () => void;
  isLoading?: boolean;
  initialVisaType?: { type: string; id: string } | null;
}

interface UploadState {
  file: File | null;
  progress: number;
  uploading: boolean;
  url?: string;
}

// Map of document field names to their display labels and descriptions
const documentInfo: Record<DocumentType, { label: string, description: string }> = {
  passportCopy: { 
    label: "Passport Copy (Bio Page)", 
    description: "Clear color scan of your passport's bio page" 
  },
  photos: { 
    label: "Passport-sized Photos", 
    description: "Recent photos (35mm x 45mm) with white background" 
  },
  yellowFeverCertificate: { 
    label: "Yellow Fever Vaccination Certificate", 
    description: "Required for all travelers to Burundi" 
  },
  travelInsurance: { 
    label: "Travel Insurance Certificate", 
    description: "Must cover medical emergencies during your stay" 
  },
  invitationLetter: { 
    label: "Invitation Letter", 
    description: "From a Burundian company or organization" 
  },
  employmentContract: { 
    label: "Employment Contract/Job Offer", 
    description: "From a Burundian employer" 
  },
  workPermit: { 
    label: "Work Permit Approval", 
    description: "If already obtained" 
  },
  admissionLetter: { 
    label: "Admission Letter", 
    description: "From a recognized Burundian educational institution" 
  },
  academicTranscripts: { 
    label: "Academic Transcripts", 
    description: "Previous educational qualifications" 
  },
  criminalRecord: { 
    label: "Criminal Record Certificate", 
    description: "From your home country (not older than 6 months)" 
  },
  medicalCertificate: { 
    label: "Medical Certificate", 
    description: "Confirming good health" 
  },
  onwardTicket: { 
    label: "Onward Travel Ticket", 
    description: "Showing your departure from Burundi" 
  },
  finalDestinationVisa: { 
    label: "Visa for Final Destination", 
    description: "If required for your onward journey" 
  }
};

const DocumentsForm = ({ defaultValues, visaType, onSubmit, onBack, isLoading = false, initialVisaType }: DocumentsFormProps) => {
  const { toast } = useToast();
  const { uploadDocument, createApplication, applicationId } = useVisaApplication();
  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>({});
  const [initializingApplication, setInitializingApplication] = useState(false);
  
  const form = useForm<DocumentsValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues,
    mode: "onChange",
  });

  // Initialize application when component mounts
  useEffect(() => {
    const initializeApplication = async () => {
      // Check if we already have an application ID in localStorage
      const savedApplicationId = localStorage.getItem('current_application_id');
      
      if (savedApplicationId) {
        console.log('[DocumentsForm] Using existing application:', savedApplicationId);
        return;
      }

      // Only create a new application if we don't have one in localStorage AND no applicationId is provided
      if (!savedApplicationId && !applicationId) {
        try {
          setInitializingApplication(true);
          console.log('[DocumentsForm] Creating new application:', {
            visaType,
            initialVisaType
          });

          if (!initialVisaType?.id) {
            console.error('[DocumentsForm] No visa type ID provided');
            toast({
              title: "Error",
              description: "Could not initialize application: Missing visa type ID",
              variant: "destructive",
            });
            return;
          }

          const newApplication = await createApplication(visaType, initialVisaType.id);
          
          // Save the new application ID to localStorage
          if (newApplication?.id) {
            localStorage.setItem('current_application_id', newApplication.id);
          }

          toast({
            title: "Application initialized",
            description: "Your visa application has been created successfully.",
          });
        } catch (error) {
          console.error('[DocumentsForm] Failed to create application:', error);
          toast({
            title: "Error",
            description: "Failed to initialize application. Please try again.",
            variant: "destructive",
          });
        } finally {
          setInitializingApplication(false);
        }
      }
    };

    initializeApplication();
  }, [visaType, applicationId, createApplication, initialVisaType, toast]);

  // Load previously uploaded documents when component mounts
  useEffect(() => {
    const loadSavedDocuments = () => {
      try {
        const savedDocs = localStorage.getItem("uploadedDocuments");
        if (savedDocs) {
          const documents = JSON.parse(savedDocs);
          // Update form values based on saved documents
          documents.forEach((doc: { type: DocumentType; filePath: string }) => {
            if (Object.values(ALLOWED_DOCUMENT_TYPES).includes(doc.type)) {
              form.setValue(doc.type, true);
              setUploadStates(prev => ({
                ...prev,
                [doc.type]: {
                  file: null, // We don't have the actual file
                  progress: 100,
                  uploading: false,
                  url: doc.filePath
                }
              }));
            }
          });
        }
      } catch (error) {
        console.error("Error loading saved documents:", error);
      }
    };

    loadSavedDocuments();
  }, [form]);

  // Documents required based on visa type
  const requiredDocuments: Record<string, DocumentType[]> = {
    tourist: ["passportCopy", "photos", "yellowFeverCertificate", "travelInsurance"] as DocumentType[],
    business: ["passportCopy", "photos", "yellowFeverCertificate", "invitationLetter"] as DocumentType[],
    work: [
      "passportCopy", 
      "photos", 
      "yellowFeverCertificate", 
      "employmentContract", 
      "workPermit", 
      "criminalRecord", 
      "medicalCertificate"
    ] as DocumentType[],
    student: [
      "passportCopy", 
      "photos", 
      "yellowFeverCertificate", 
      "admissionLetter", 
      "academicTranscripts"
    ] as DocumentType[],
    transit: [
      "passportCopy", 
      "photos", 
      "yellowFeverCertificate", 
      "onwardTicket", 
      "finalDestinationVisa"
    ] as DocumentType[]
  };

  // Get list of required documents for the selected visa type
  const visaRequiredDocs = requiredDocuments[visaType] || [];
  
  // Store uploaded documents in localStorage for review
  const saveUploadedDocuments = (docField: DocumentType, file: File, filePath: string) => {
    try {
      const savedDocs = localStorage.getItem("uploadedDocuments") || "[]";
      const documents = JSON.parse(savedDocs);
      documents.push({
        type: docField,
        name: file.name,
        size: file.size,
        filePath: filePath,
        uploadedAt: new Date().toISOString()
      });
      localStorage.setItem("uploadedDocuments", JSON.stringify(documents));
    } catch (error) {
      console.error("Error saving document to localStorage:", error);
    }
  };

  const handleFileUpload = async (docField: DocumentType, files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      
      console.log(`[DocumentsForm] Starting upload for ${docField}:`, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      // Update upload state
      setUploadStates(prev => ({
        ...prev,
        [docField]: {
          file,
          progress: 0,
          uploading: true
        }
      }));

      try {
        // Upload document and track progress
        const response = await uploadDocument(docField, file, (progress: number) => {
          console.log(`[DocumentsForm] Upload progress for ${docField}:`, progress);
          setUploadStates(prev => ({
            ...prev,
            [docField]: {
              ...prev[docField],
              progress
            }
          }));
        });
        
        console.log(`[DocumentsForm] Upload successful for ${docField}:`, response);
        
        // Update state with success
        setUploadStates(prev => ({
          ...prev,
          [docField]: {
            file,
            progress: 100,
            uploading: false,
            url: response.filePath
          }
        }));

        // Mark checkbox as checked
        form.setValue(docField, true);
        
        // Save to localStorage for review
        saveUploadedDocuments(docField, file, response.filePath);
        
        toast({
          title: "File uploaded",
          description: `${documentInfo[docField]?.label || docField} has been uploaded successfully.`,
        });
      } catch (error) {
        console.error(`[DocumentsForm] Upload failed for ${docField}:`, error);
        // Update state with error
        setUploadStates(prev => ({
          ...prev,
          [docField]: {
            file: null,
            progress: 0,
            uploading: false
          }
        }));

        // Mark checkbox as unchecked
        form.setValue(docField, false);
        
        toast({
          title: "Upload failed",
          description: "Failed to upload document. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = (data: DocumentsValues) => {
    // Check that required documents are marked as uploaded
    const requiredDocs = requiredDocuments[visaType] || [];
    
    // Ensure all required documents are checked
    const missingDocs = requiredDocs.filter(doc => !data[doc as keyof DocumentsValues]);
    
    if (missingDocs.length > 0) {
      toast({
        title: "Missing documents",
        description: "Please make sure all required documents are uploaded.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-6">
          {visaRequiredDocs.map((docField: DocumentType) => (
            <FormField
              key={docField}
              control={form.control}
              name={docField}
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!uploadStates[docField]?.url}
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel>{documentInfo[docField]?.label || docField}</FormLabel>
                      <FormDescription>
                        {documentInfo[docField]?.description}
                      </FormDescription>
                    </div>
                  </div>
                  <FileUpload
                    label={`Upload ${documentInfo[docField]?.label || docField}`}
                    description="Drop your file here or click to browse"
                    onFilesSelected={(files) => handleFileUpload(docField, files)}
                    className="mt-2"
                    value={uploadStates[docField]?.file || null}
                    loading={uploadStates[docField]?.uploading}
                    disabled={uploadStates[docField]?.uploading}
                  />
                  {uploadStates[docField]?.uploading && (
                    <Progress value={uploadStates[docField]?.progress} className="mt-2" />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
            Back
          </Button>
          <Button type="submit" disabled={isLoading || initializingApplication}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Submitting..." : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DocumentsForm;
