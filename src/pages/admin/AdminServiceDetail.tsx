import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, ArrowLeft, Trash, CheckCircle, Loader2 } from "lucide-react";
import { visaTypeService, VisaType } from "@/lib/api/services/visatype.service";
import { getCountryName } from "@/lib/utils";

const AdminServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visaType, setVisaType] = useState<VisaType | null>(null);

  useEffect(() => {
    if (id) {
      fetchVisaType(id);
    }
  }, [id]);

  const fetchVisaType = async (visaTypeId: string) => {
    try {
      const response = await visaTypeService.getVisaTypeById(visaTypeId);
      setVisaType(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch visa type details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/dashboard/services/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await visaTypeService.deleteVisaType(id);
      toast({
        title: "Success",
        description: "Visa service deleted successfully",
      });
      navigate("/dashboard/services");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete visa service",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <AdminLayout title="Loading..." subtitle="Please wait while we fetch the visa service details">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!visaType) {
    return (
      <AdminLayout title="Not Found" subtitle="The requested visa service could not be found">
        <div className="text-center py-12">
          <p className="text-gray-500">The visa service you're looking for doesn't exist or has been removed.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/dashboard/services")}
          >
            Back to Services
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Visa Service Details" 
      subtitle={`View information about ${visaType.name}`}
    >
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => navigate("/dashboard/services")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1 text-red-500 hover:text-red-600"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4" />
            Delete
          </Button>
          <Button 
            onClick={handleEdit}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{visaType.name}</CardTitle>
                  <CardDescription>Visa Service Details</CardDescription>
                </div>
                {visaType.isActive ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Inactive
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {visaType.coverImage && (
                <div className="mb-6">
                  <img
                    src={visaType.coverImage}
                    alt={`${visaType.name} cover`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{visaType.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Price</h3>
                    <p className="mt-1 text-lg font-semibold">{formatCurrency(visaType.price)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                    <p className="mt-1">{visaType.duration}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Processing Time</h3>
                    <p className="mt-1">{visaType.processingTime}</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1">{formatDate(visaType.updatedAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created On</h3>
                  <p className="mt-1">{formatDate(visaType.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Eligibility criteria for this visa</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {visaType.requirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eligible Countries</CardTitle>
              <CardDescription>Countries that can apply for this visa</CardDescription>
            </CardHeader>
            <CardContent>
              {visaType.eligibleCountries && visaType.eligibleCountries.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {visaType.eligibleCountries.map((country, index) => (
                    <Badge key={index} variant="secondary">
                      {getCountryName(country)}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">All countries are eligible</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              {' '}{visaType.name}{' '}service and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminServiceDetail;
