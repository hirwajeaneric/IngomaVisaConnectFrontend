import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { visaApplicationService } from "@/lib/api/services/visaapplication.service";
import { useQuery } from "@tanstack/react-query";
import { getStatusBadge } from "@/components/widgets";
import { formatDate } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface Application {
  id: string;
  applicationNumber: string;
  userId: string;
  visaTypeId: string;
  status: string;
  submissionDate: string;
  decisionDate: string | null;
  expiryDate: string | null;
  rejectionReason: string | null;
  personalInfoId: string;
  travelInfoId: string;
  paymentId: string;
  fundingSource: string;
  monthlyIncome: number;
  visaType: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    processingTime: string;
    duration: string;
    requirements: string[];
    eligibleCountries: string[];
    coverImage: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
  };
  user: {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    avatar: string;
    phone: string;
    isActive: boolean;
    createdAt: string;
    lastLoginAt: string | null;
    passwordResetToken: string | null;
    passwordResetExpires: string | null;
    twoFactorEnabled: boolean;
    twoFactorSecret: string | null;
    department: string | null;
    title: string | null;
    permissions: string[];
  };
}

const AdminApplications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [visaTypeFilter, setVisaTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: applicationsData, isLoading, error } = useQuery({
    queryKey: ["applications"],
    queryFn: () => visaApplicationService.getAllApplications(),
  });

  const applications = applicationsData || [];

  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: "applicationNumber",
      header: "Application ID",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.applicationNumber}
        </div>
      ),
    },
    {
      accessorKey: "user.name",
      header: "Applicant",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.user.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.user.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "visaType.name",
      header: "Visa Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-muted">
          {row.original.visaType.name}
        </Badge>
      ),
    },
    {
      accessorKey: "submissionDate",
      header: "Submission Date",
      cell: ({ row }) => (
        <div className="text-sm">
          {formatDate(row.original.submissionDate)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return value === row.original.status;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/application/${row.original.id}`);
          }}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout 
        title="Visa Applications" 
        subtitle="Manage and process all visa applications"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading applications...</span>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout 
        title="Visa Applications" 
        subtitle="Manage and process all visa applications"
      >
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Failed to load applications</p>
              <Button onClick={() => window.location.reload()} className="mt-2">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Visa Applications" 
      subtitle="Manage and process all visa applications"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Visa Applications</h2>
            <p className="text-gray-500">
              Showing {applications.length} applications
            </p>
          </div>
        </div>
        
        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Visa Applications</CardTitle>
            <CardDescription>
              Manage and process all visa applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={applications}
              searchKey="user.name"
              searchPlaceholder="Search applications by applicant name..."
              filterableColumns={[
                {
                  id: "status",
                  title: "Status",
                  options: [
                    { label: "All Status", value: "all" },
                    { label: "Pending", value: "PENDING" },
                    { label: "Submitted", value: "SUBMITTED" },
                    { label: "Under Review", value: "UNDER_REVIEW" },
                    { label: "Approved", value: "APPROVED" },
                    { label: "Rejected", value: "REJECTED" },
                  ],
                },
                {
                  id: "visaType.name",
                  title: "Visa Type",
                  options: [
                    { label: "All Types", value: "all" },
                    { label: "Tourist Visa", value: "Tourist Visa" },
                    { label: "Business Visa", value: "Business Visa" },
                    { label: "Work Visa", value: "Work Visa" },
                    { label: "Student Visa", value: "Student Visa" },
                    { label: "Transit Visa", value: "Transit Visa" },
                  ],
                },
              ]}
              onRowClick={(row) => navigate(`/dashboard/application/${row.id}`)}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminApplications;
