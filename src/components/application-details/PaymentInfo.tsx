import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface PaymentInfoProps {
  payment: any;
}

export const PaymentInfo: React.FC<PaymentInfoProps> = ({ payment }) => {
  const handleDownloadReceipt = () => {
    toast({
      title: "Receipt Downloaded",
      description: "The payment receipt has been downloaded successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-6 rounded-lg border border-border mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Payment ID: {payment.id}</p>
                <p className="text-sm text-muted-foreground">{formatDateTime(payment.createdAt)}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {payment.paymentStatus}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Amount</p>
            <p className="font-medium text-xl mt-1">${payment.amount} {payment.currency}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Stripe Payment ID</p>
            <p className="mt-1 text-sm font-mono">{payment.stripePaymentId}</p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Payment Details</h3>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-muted">
              <tr>
                <td className="py-3 text-muted-foreground">Visa Application Fee</td>
                <td className="py-3 text-right">${payment.amount} {payment.currency}</td>
              </tr>
              <tr>
                <td className="py-3 text-muted-foreground">Processing Fee</td>
                <td className="py-3 text-right">$0.00</td>
              </tr>
              <tr>
                <td className="py-3 text-muted-foreground">Tax</td>
                <td className="py-3 text-right">$0.00</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Total</td>
                <td className="py-3 text-right font-medium">${payment.amount} {payment.currency}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleDownloadReceipt}
          >
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 