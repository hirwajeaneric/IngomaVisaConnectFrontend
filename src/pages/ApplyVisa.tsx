import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentProcess from '@/components/PaymentProcess';
import VisaApplicationForm from '@/components/visa-form/VisaApplicationForm';
import { useVisaApplication } from '@/hooks/useVisaApplication';
import { VisaFormValues } from '@/lib/schemas/visaFormSchema';
import { useToast } from '@/hooks/use-toast';
import { visaTypeService } from '@/lib/api/services/visatype.service';
import { Loader2 } from 'lucide-react';

const ApplyVisa = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedVisaType, setSelectedVisaType] = useState<string>('');
  const [initialVisaType, setInitialVisaType] = useState<{ type: string; id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    loading: applicationLoading, 
    applicationId,
    applicationSubmitted,
    submitApplication,
    calculateVisaFee 
  } = useVisaApplication();

  // Get visa type from URL parameters
  useEffect(() => {
    const loadVisaType = async () => {
      try {
        const type = searchParams.get('type');
        const typeId = searchParams.get('typeId');

        if (type && typeId) {
          // Verify the visa type exists
          const response = await visaTypeService.getVisaTypeById(typeId);
          if (response.data) {
            setInitialVisaType({ type, id: typeId });
            // Store the visa type ID for later use
            localStorage.setItem('selected_visa_type_id', typeId);
          } else {
            toast({
              title: "Error",
              description: "Invalid visa type selected. Please try again.",
              variant: "destructive",
            });
            navigate('/visa-types');
          }
        }
      } catch (error) {
        console.error('Error loading visa type:', error);
        toast({
          title: "Error",
          description: "Failed to load visa type. Please try again.",
          variant: "destructive",
        });
        navigate('/visa-types');
      } finally {
        setIsLoading(false);
      }
    };

    loadVisaType();
  }, [searchParams, navigate, toast]);

  const handleApplicationComplete = async (formData: VisaFormValues) => {
    try {
      if (!initialVisaType) {
        throw new Error("No visa type selected");
      }

      // Submit the complete application
      await submitApplication(formData);
      
      // Set the selected visa type for payment
      setSelectedVisaType(formData.travelInfo.visaType);
      setShowPayment(true);

      // Clear form data from localStorage after successful submission
      localStorage.removeItem("visaApplicationData");
      localStorage.removeItem("uploadedDocuments");
      // Keep current_application_id for payment reference
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to process your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getVisaTypeName = (visaType: string) => {
    switch(visaType) {
      case 'tourist': return 'Tourist Visa';
      case 'business': return 'Business Visa';
      case 'work': return 'Work Visa';
      case 'student': return 'Student Visa';
      case 'transit': return 'Transit Visa';
      default: return 'Tourist Visa';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading visa information...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showPayment && applicationSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-primary">Complete Your Payment</h1>
                <p className="text-gray-600 mt-2">
                  Please complete payment to process your visa application.
                </p>
              </div>
              
              <PaymentProcess 
                visaType={getVisaTypeName(selectedVisaType)}
                amount={calculateVisaFee(selectedVisaType)}
                applicationId={applicationId || ''}
              />
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-primary">Visa Application</h1>
              <p className="text-gray-600 mt-2">
                Complete the form below to apply for a Burundi visa.
              </p>
            </div>
            
            <VisaApplicationForm 
              onComplete={handleApplicationComplete}
              isLoading={applicationLoading}
              initialVisaType={initialVisaType}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ApplyVisa;
