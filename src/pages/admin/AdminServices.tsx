import React, { useEffect, useState, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { visaTypeService, VisaType } from "@/lib/api/services/visatype.service";
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

const AdminServices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visaTypeToDelete, setVisaTypeToDelete] = useState<string | null>(null);

  const fetchVisaTypes = useCallback(async () => {
    try {
      const response = await visaTypeService.getAllVisaTypes();
      setVisaTypes(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch visa types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVisaTypes();
  }, [fetchVisaTypes]);

  const handleCreateNew = () => {
    navigate("/dashboard/services/new");
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/services/${id}/edit`);
  };

  const handleDeleteConfirm = (id: string) => {
    setVisaTypeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (visaTypeToDelete) {
      try {
        await visaTypeService.deleteVisaType(visaTypeToDelete);
        setVisaTypes(visaTypes.filter(visaType => visaType.id !== visaTypeToDelete));
        
        toast({
          title: "Success",
          description: "Visa service deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete visa service",
          variant: "destructive",
        });
      }
      
      setDeleteDialogOpen(false);
      setVisaTypeToDelete(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const columns: ColumnDef<VisaType>[] = [
    {
      accessorKey: "name",
      header: "Visa Name",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => formatCurrency(row.original.price),
    },
    {
      accessorKey: "duration",
      header: "Duration",
    },
    {
      accessorKey: "processingTime",
      header: "Processing Time",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.original.isActive
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-gray-50 text-gray-700 border-gray-200"
          }
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        const status = row.original.isActive ? "active" : "inactive";
        return value === status;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original.id)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteConfirm(row.original.id)}
            className="text-red-500 hover:text-red-600"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <AdminLayout title="Loading..." subtitle="Please wait while we fetch the visa services">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Visa Services"
      subtitle="Manage visa types and their requirements"
    >
      <SEO
        title="Manage Visa Services"
        description="Admin panel for managing visa services, types and requirements for the Burundi eVisa system."
        keywords="visa services management, admin panel, visa types, visa requirements"
      />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">All Visa Services</h2>
          <p className="text-gray-500">
            Showing {visaTypes.length} visa services
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Create New Service
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={visaTypes}
        searchKey="name"
        searchPlaceholder="Search visa services..."
        filterableColumns={[
          {
            id: "isActive",
            title: "Status",
            options: [
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
        ]}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the visa
              service and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminServices;
