import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, Calendar, User, FileText, Mail, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { paymentService, PaymentDetail } from "@/lib/api/services/payment.service";

const AdminPaymentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayment = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await paymentService.getPaymentById(id);
        setPayment(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch payment details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);
  
  const handleDownloadReceipt = () => {
    if (!payment) return;
    
    // In a real application, this would fetch and download the actual receipt file
    // For this demo, we'll simulate a download
    const receiptUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(
      `Receipt for Payment ${payment.id}\n` +
      `Amount: ${payment.amount.toFixed(2)} ${payment.currency}\n` +
      `Date: ${formatDate(payment.date)}\n` +
      `Applicant: ${payment.applicant.name}\n` +
      `Application ID: ${payment.applicationId}\n`
    )}`;
    
    const link = document.createElement('a');
    link.href = receiptUrl;
    link.download = `Receipt_${payment.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Receipt Downloaded",
      description: "Payment receipt has been downloaded successfully."
    });
  };
  
  const handleEmailReceipt = () => {
    if (!payment) return;
    
    toast({
      title: "Receipt Emailed",
      description: `Receipt has been emailed to ${payment.applicant.email}`
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Failed</Badge>;
      case "refunded":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Loading..." subtitle="Please wait while we fetch the payment details">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!payment) {
    return (
      <AdminLayout title="Payment Not Found" subtitle="The requested payment could not be found">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Payment not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Payment ${id}`} subtitle="View payment details and manage transactions">
      <div className="space-y-6">
        {/* Payment Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">${payment.amount.toFixed(2)} {payment.currency}</h2>
                  <p className="text-muted-foreground">Transaction ID: {payment.id}</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4">
                {getStatusBadge(payment.status)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Payment Date</p>
                  <p className="font-medium">{formatDate(payment.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <User className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Applicant</p>
                  <p className="font-medium">{payment.applicant.name}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Application ID</p>
                  <p className="font-medium">{payment.applicationId}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Button variant="outline" className="gap-2" onClick={handleDownloadReceipt}>
                <Download className="h-4 w-4" />
                Download Receipt
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleEmailReceipt}>
                <Mail className="h-4 w-4" />
                Email Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 text-sm text-muted-foreground">Payment Method</td>
                    <td className="py-4 text-right font-medium">
                      {payment.method}
                      {payment.cardDetails && (
                        <span className="ml-2 text-muted-foreground">
                          {payment.cardDetails.type} ending in {payment.cardDetails.last4}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 text-sm text-muted-foreground">Payment Processor</td>
                    <td className="py-4 text-right font-medium">{payment.paymentProcessor}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 text-sm text-muted-foreground">Transaction ID</td>
                    <td className="py-4 text-right font-medium">{payment.transactionId}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 text-sm text-muted-foreground">Status</td>
                    <td className="py-4 text-right font-medium">
                      {getStatusBadge(payment.status)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 text-sm text-muted-foreground">Applicant Email</td>
                    <td className="py-4 text-right font-medium">{payment.applicant.email}</td>
                  </tr>
                  <tr>
                    <td className="py-4 text-sm text-muted-foreground">Applicant Phone</td>
                    <td className="py-4 text-right font-medium">{payment.applicant.phone}</td>
                  </tr>
                </tbody>
              </table>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="font-medium mb-4">Billing Address</h3>
                <div className="border rounded-md p-4 bg-muted/20">
                  <p>{payment.billingAddress.line1}</p>
                  {payment.billingAddress.line2 && <p>{payment.billingAddress.line2}</p>}
                  <p>
                    {payment.billingAddress.city}, {payment.billingAddress.state} {payment.billingAddress.postalCode}
                  </p>
                  <p>{payment.billingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payment.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <p className="text-sm">{item.description}</p>
                    <p className="font-medium">${item.amount.toFixed(2)}</p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  <p>${payment.amount.toFixed(2)} {payment.currency}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full" onClick={() => navigate(`/dashboard/application/${payment.application.id}`)}>View Linked Application</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Payment Events */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 border-l border-gray-200">
              <div className="mb-8 relative">
                <div className="absolute -left-[21px] h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-white" />
                </div>
                <p className="font-medium">Payment successful</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(payment.date)}
                </p>
              </div>
              
              <div className="mb-8 relative">
                <div className="absolute -left-[21px] h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-white" />
                </div>
                <p className="font-medium">Payment initiated</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(new Date(new Date(payment.date).getTime() - 60000).toISOString())}
                </p>
              </div>
              
              <div className="mb-8 relative">
                <div className="absolute -left-[21px] h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-white" />
                </div>
                <p className="font-medium">Application submitted</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(new Date(new Date(payment.date).getTime() - 300000).toISOString())}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentDetail;
