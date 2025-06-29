import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { paymentService } from '@/lib/api/services/payment.service';
import { useToast } from '@/hooks/use-toast';

interface LocationState {
  applicationId?: string;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentIntent, setPaymentIntent] = useState('');
  const [paymentId, setPaymentId] = useState('');
  
  // Get paymentId from localStorage and applicationId from state/params
  const applicationId = searchParams.get('applicationId') || (location.state as LocationState)?.applicationId;
  
  useEffect(() => {
    const paymentId = localStorage.getItem('current_payment_id');
    const paymentIntent = searchParams.get('payment_intent');
    setPaymentId(paymentId as string);
    setPaymentIntent(paymentIntent as string);
    
    const verifyPayment = async () => {
      try {
        // Update payment status
        const response = await paymentService.updatePaymentStatus(paymentId as string, paymentIntent as string);
        
        if (response.data.paymentStatus === 'COMPLETED') {
          // Clear the payment ID from localStorage after successful verification
          localStorage.removeItem('current_payment_id');
          localStorage.removeItem('current_application_id');
          localStorage.removeItem('selected_visa_type_id');
        } else {
          toast({
            title: "Payment Pending",
            description: "Your payment is still being processed. Please wait a moment and refresh the page.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        // toast({
        //   title: "Error",
        //   description: "Failed to verify payment status. Please contact support.",
        //   variant: "destructive",
        // });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();

    // Cleanup function to remove payment ID if component unmounts
    return () => {
      localStorage.removeItem('current_payment_id');
    };
  }, [paymentId, paymentIntent, searchParams, toast]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Verifying payment status...</span>
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
        <div className="container max-w-2xl mx-auto py-12">
          <Card className="border-2 border-green-100">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <CardDescription>
                Your visa application payment has been processed successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Thank you for your payment. Your application is now being processed.
              </p>
              {applicationId && (
                <p className="text-sm text-gray-500">
                  Application ID: {applicationId}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/account')}
              >
                Go to Dashboard
              </Button>
              {applicationId && (
                <Button
                  onClick={() => navigate(`/application/${applicationId}`)}
                >
                  View Application
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess; 