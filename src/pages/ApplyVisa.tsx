import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VisaApplicationForm from '@/components/visa-form/VisaApplicationForm';
import { useVisaApplication } from '@/hooks/useVisaApplication';
import { VisaFormValues } from '@/lib/schemas/visaFormSchema';
import { useToast } from '@/hooks/use-toast';
import { visaTypeService, VisaType } from '@/lib/api/services/visatype.service';
import { Loader2 } from 'lucide-react';

const ApplyVisa = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedVisaType, setSelectedVisaType] = useState<VisaType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    loading: applicationLoading, 
    applicationId,
    submitApplication,
  } = useVisaApplication();

  // Get visa type from URL parameters
  useEffect(() => {
    const loadVisaType = async () => {
      try {
        const typeId = searchParams.get('typeId');

        if (typeId) {
          // Fetch the complete visa type information
          const response = await visaTypeService.getVisaTypeById(typeId);
          if (response.data) {
            setSelectedVisaType(response.data);
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
      if (!selectedVisaType) {
        throw new Error("No visa type selected");
      }

      // Submit the complete application
      const response = await submitApplication(formData);
      console.log(response);

      // Clear form data from localStorage after successful submission
      localStorage.removeItem("visaApplicationData");
      localStorage.removeItem("uploadedDocuments");
      console.log(`/payment?applicationId=${response?.applicationId}&visaTypeId=${response?.visaTypeId}`);
      // Redirect to payment page with necessary parameters
      // navigate(`/payment?applicationId=${response?.applicationId}&visaTypeId=${response?.visaTypeId}`);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to process your application. Please try again.",
        variant: "destructive",
      });
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
              initialVisaType={selectedVisaType ? { type: selectedVisaType.slug, id: selectedVisaType.id } : null}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ApplyVisa;
