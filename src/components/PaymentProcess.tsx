import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard } from 'lucide-react';
import { VisaType } from '@/lib/api/services/visatype.service';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentService } from '@/lib/api/services/payment.service';

interface PaymentProcessProps {
  visaType: VisaType;
  applicationId: string;
  onComplete?: () => void;
}

const PaymentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        onSuccess();
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <PaymentElement />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isProcessing || !stripe || !elements}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </Button>
      </div>
    </form>
  );
};

const PaymentProcess = ({ 
  visaType,
  applicationId,
  onComplete 
}: PaymentProcessProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string>();

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const result = await paymentService.createPaymentIntent(applicationId, visaType.price);
        console.log(result);
        if (result.success) {
          setClientSecret(result.data.clientSecret);
          localStorage.setItem('current_payment_id', result.data.paymentId);
        } else {
          toast({
            title: "Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error in PaymentProcess:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializePayment();
  }, [applicationId, toast, visaType.price]);

  const handleSuccess = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate('/payment-success', { 
        state: { applicationId }
      });
    }
  };

  if (!clientSecret) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Process payment for your {visaType.name} application (ID: {applicationId})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Payment Summary</h3>
              <span className="text-lg font-bold">${visaType.price.toFixed(2)}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <div className="flex justify-between mb-2">
                <span>{visaType.name} Fee</span>
                <span>${(visaType.price - 5).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Processing Fee</span>
                <span>$5.00</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${visaType.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-base flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Credit/Debit Card Payment
            </Label>
          </div>

          <Elements stripe={paymentService.getStripe()} options={{ clientSecret }}>
            <PaymentForm onSuccess={handleSuccess} />
          </Elements>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentProcess;
