import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentProcess from '@/components/PaymentProcess';
import { useToast } from '@/hooks/use-toast';
import { visaTypeService, VisaType } from '@/lib/api/services/visatype.service';
import { Loader2 } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedVisaType, setSelectedVisaType] = useState<VisaType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applicationId = searchParams.get('applicationId');
  const visaTypeId = searchParams.get('visaTypeId');

  useEffect(() => {
    const loadVisaType = async () => {
      try {
        if (!visaTypeId || !applicationId) {
          toast({
            title: "Error",
            description: "Missing required information. Please try again.",
            variant: "destructive",
          });
          navigate('/visa-types');
          return;
        }

        const response = await visaTypeService.getVisaTypeById(visaTypeId);
        if (response.data) {
          setSelectedVisaType(response.data);
        } else {
          toast({
            title: "Error",
            description: "Invalid visa type selected. Please try again.",
            variant: "destructive",
          });
          navigate('/visa-types');
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
  }, [visaTypeId, applicationId, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading payment information...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedVisaType || !applicationId) {
    return null;
  }

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
              visaType={selectedVisaType}
              applicationId={applicationId}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment; 