import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard } from 'lucide-react';
import { VisaType } from '@/lib/api/services/visatype.service';

interface PaymentProcessProps {
  visaType: VisaType;
  applicationId: string;
  onComplete?: () => void;
}

const PaymentProcess = ({ 
  visaType,
  applicationId,
  onComplete 
}: PaymentProcessProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful",
        description: `Your payment of $${visaType.price.toFixed(2)} for ${visaType.name} has been processed.`,
      });
      
      if (onComplete) {
        onComplete();
      } else {
        navigate('/dashboard');
      }
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Process payment for your {visaType.name} application (ID: {applicationId})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
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

            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input 
                  id="cardholderName"
                  name="cardholderName"
                  placeholder="John Smith"
                  value={cardDetails.cardholderName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input 
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv"
                    name="cvv"
                    type="password"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <CardFooter className="px-0 pt-6">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentProcess;
