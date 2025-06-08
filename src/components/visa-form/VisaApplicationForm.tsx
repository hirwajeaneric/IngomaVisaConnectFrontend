import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Steps } from "@/components/visa-form/Steps";
import PersonalInfoForm from "@/components/visa-form/PersonalInfoForm";
import TravelInfoForm, { normalizeVisaType } from "@/components/visa-form/TravelInfoForm";
import FinancialInfoForm from "@/components/visa-form/FinancialInfoForm";
import DocumentsForm from "@/components/visa-form/DocumentsForm";
import DeclarationForm from "@/components/visa-form/DeclarationForm";
import { 
  VisaFormValues, 
  PersonalInfoValues,
  TravelInfoValues,
  FinancialInfoValues,
  DocumentsValues,
  DeclarationValues
} from "@/lib/schemas/visaFormSchema";

interface VisaApplicationFormProps {
  onComplete: (data: VisaFormValues) => void;
  isLoading?: boolean;
  initialVisaType?: { type: string; id: string } | null;
}

// Initial form values with appropriate defaults
const defaultFormValues: VisaFormValues = {
  personalInfo: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male",
    nationality: "",
    maritalStatus: "single",
    passportNumber: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    placeOfPassportIssuance: "",
    email: "",
    phone: "",
    currentAddress: "",
    occupation: "",
    employerDetails: "",
  },
  travelInfo: {
    visaType: "tourist",
    purposeOfTravel: "Tourism and leisure activities",
    entryDate: "",
    exitDate: "",
    portOfEntry: "",
    previousVisits: false,
    previousVisitDetails: "",
    travelItinerary: "",
    accommodation: "",
    finalDestination: "",
    countriesVisited: "",
  },
  financialInfo: {
    fundingSource: "self",
    sponsorDetails: "",
    monthlyIncome: "",
  },
  documents: {
    passportCopy: false,
    photos: false,
    yellowFeverCertificate: false,
    travelInsurance: false,
    invitationLetter: false,
    employmentContract: false,
    workPermit: false,
    admissionLetter: false,
    academicTranscripts: false,
    criminalRecord: false,
    medicalCertificate: false,
    onwardTicket: false,
    finalDestinationVisa: false,
  },
  declaration: {
    agreeToTerms: false,
    dataConsent: false,
  },
};

const VisaApplicationForm = ({ onComplete, isLoading = false, initialVisaType }: VisaApplicationFormProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VisaFormValues>({
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "male",
      nationality: "",
      maritalStatus: "single",
      passportNumber: "",
      passportIssueDate: "",
      passportExpiryDate: "",
      placeOfPassportIssuance: "",
      email: "",
      phone: "",
      currentAddress: "",
    },
    travelInfo: {
      visaType: initialVisaType ? (normalizeVisaType(initialVisaType.type) || "tourist") : "tourist",
      purposeOfTravel: "",
      entryDate: "",
      exitDate: "",
      portOfEntry: "",
      previousVisits: false,
      previousVisitDetails: "",
      accommodation: "",
    },
    financialInfo: {
      fundingSource: "self",
      sponsorDetails: "",
      monthlyIncome: "",
    },
    documents: {
      passportCopy: false,
      photos: false,
      yellowFeverCertificate: false,
      travelInsurance: false,
      invitationLetter: false,
      employmentContract: false,
      workPermit: false,
      admissionLetter: false,
      academicTranscripts: false,
      criminalRecord: false,
      medicalCertificate: false,
      onwardTicket: false,
      finalDestinationVisa: false,
    },
    declaration: {
      agreeToTerms: false,
      dataConsent: false,
    },
  });

  // Load draft from localStorage if exists
  useEffect(() => {
    const savedDraft = localStorage.getItem("visaApplicationDraft");
    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft);
      // If we have an initialVisaType, make sure to use it
      if (initialVisaType) {
        parsedDraft.travelInfo.visaType = initialVisaType.type;
      }
      setFormData(parsedDraft);
    }
  }, [initialVisaType]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("visaApplicationData", JSON.stringify(formData));
  }, [formData]);

  const handlePersonalInfoSubmit = (data: PersonalInfoValues) => {
    setFormData(prev => ({ ...prev, personalInfo: data }));
    setCurrentStep(2);
  };

  const handleTravelInfoSubmit = (data: TravelInfoValues) => {
    setFormData(prev => ({ ...prev, travelInfo: data }));
    setCurrentStep(3);
  };

  const handleFinancialInfoSubmit = (data: FinancialInfoValues) => {
    setFormData(prev => ({ ...prev, financialInfo: data }));
    setCurrentStep(4);
  };

  const handleDocumentsSubmit = (data: DocumentsValues) => {
    setFormData(prev => ({ ...prev, documents: data }));
    setCurrentStep(5);
  };

  const handleDeclarationSubmit = (data: DeclarationValues) => {
    const finalFormData = {
      ...formData,
      declaration: data
    };
    setFormData(finalFormData);
    
    // Submit the complete form
    onComplete(finalFormData);
  };

  const getVisaFee = (visaType: string): number => {
    switch (visaType) {
      case "tourist": return 50;
      case "business": return 100;
      case "work": return 200;
      case "student": return 75;
      case "transit": return 30;
      default: return 50;
    }
  };

  const handleSaveDraft = () => {
    // Already saving to localStorage on each change
    toast({
      title: "Draft Saved",
      description: "Your application has been saved. You can continue later.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <Steps currentStep={currentStep} />
      
      {/* Form Cards */}
      <Card className="p-6">
        {currentStep === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            <PersonalInfoForm 
              defaultValues={formData.personalInfo}
              onSubmit={handlePersonalInfoSubmit}
              isLoading={isLoading}
            />
          </>
        )}
        
        {currentStep === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-6">Travel Information</h2>
            <TravelInfoForm 
              defaultValues={formData.travelInfo}
              onSubmit={handleTravelInfoSubmit}
              onBack={() => setCurrentStep(1)}
              isLoading={isLoading}
              initialVisaType={initialVisaType}
            />
          </>
        )}
        
        {currentStep === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-6">Financial Information</h2>
            <FinancialInfoForm 
              defaultValues={formData.financialInfo}
              visaType={formData.travelInfo.visaType}
              onSubmit={handleFinancialInfoSubmit}
              onBack={() => setCurrentStep(2)}
              isLoading={isLoading}
            />
          </>
        )}
        
        {currentStep === 4 && (
          <>
            <h2 className="text-xl font-semibold mb-6">Required Documents</h2>
            <DocumentsForm 
              defaultValues={formData.documents}
              visaType={formData.travelInfo.visaType}
              onSubmit={handleDocumentsSubmit}
              onBack={() => setCurrentStep(3)}
              isLoading={isLoading}
              initialVisaType={initialVisaType}
            />
          </>
        )}
        
        {currentStep === 5 && (
          <>
            <h2 className="text-xl font-semibold mb-6">Review & Submit</h2>
            <DeclarationForm 
              defaultValues={formData.declaration}
              visaType={formData.travelInfo.visaType}
              visaFee={getVisaFee(formData.travelInfo.visaType)}
              onSubmit={handleDeclarationSubmit}
              onBack={() => setCurrentStep(4)}
              isLoading={isLoading}
            />
          </>
        )}
      </Card>
      
      {/* Save Draft Button */}
      {currentStep < 5 && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            className="text-gray-600"
            disabled={isLoading}
          >
            Save as Draft
          </Button>
        </div>
      )}
    </div>
  );
};

export default VisaApplicationForm;
