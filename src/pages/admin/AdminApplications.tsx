
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Filter, Search, ArrowUpDown } from "lucide-react";

const AdminApplications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [visaTypeFilter, setVisaTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for applications
  const applications = [
    {
      id: "APP-2354",
      name: "John Smith",
      nationality: "United States",
      visaType: "Tourist",
      submissionDate: "2025-05-14",
      status: "pending",
    },
    {
      id: "APP-2353",
      name: "Maria Garcia",
      nationality: "Spain",
      visaType: "Work",
      submissionDate: "2025-05-13",
      status: "under-review",
    },
    {
      id: "APP-2352",
      name: "Liu Wei",
      nationality: "China",
      visaType: "Business",
      submissionDate: "2025-05-12",
      status: "document-requested",
    },
    {
      id: "APP-2351",
      name: "Ahmed Hassan",
      nationality: "Egypt",
      visaType: "Student",
      submissionDate: "2025-05-11",
      status: "interview-scheduled",
    },
    {
      id: "APP-2350",
      name: "Tanaka Ito",
      nationality: "Japan",
      visaType: "Business",
      submissionDate: "2025-05-10",
      status: "approved",
    },
    {
      id: "APP-2349",
      name: "Sarah Johnson",
      nationality: "Canada",
      visaType: "Tourist",
      submissionDate: "2025-05-09",
      status: "rejected",
    },
    {
      id: "APP-2348",
      name: "David Kim",
      nationality: "South Korea",
      visaType: "Work",
      submissionDate: "2025-05-08",
      status: "approved",
    },
    {
      id: "APP-2347",
      name: "Elena Petrova",
      nationality: "Russia",
      visaType: "Transit",
      submissionDate: "2025-05-07",
      status: "approved",
    },
    {
      id: "APP-2346",
      name: "Carlos Mendoza",
      nationality: "Mexico",
      visaType: "Student",
      submissionDate: "2025-05-06",
      status: "pending",
    },
    {
      id: "APP-2345",
      name: "Sofia Rossi",
      nationality: "Italy",
      visaType: "Tourist",
      submissionDate: "2025-05-05",
      status: "under-review",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; label: string } } = {
      "pending": { color: "bg-blue-100 text-blue-800", label: "Pending" },
      "under-review": { color: "bg-amber-100 text-amber-800", label: "Under Review" },
      "document-requested": { color: "bg-purple-100 text-purple-800", label: "Documents Requested" },
      "interview-scheduled": { color: "bg-indigo-100 text-indigo-800", label: "Interview Scheduled" },
      "approved": { color: "bg-green-100 text-green-800", label: "Approved" },
      "rejected": { color: "bg-red-100 text-red-800", label: "Rejected" },
    };

    const { color, label } = statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  // Filter applications based on search term and filters
  const filteredApplications = applications.filter((application) => {
    const matchesSearch = 
      application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVisaType = visaTypeFilter === "all" || application.visaType.toLowerCase() === visaTypeFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || application.status === statusFilter;
    
    return matchesSearch && matchesVisaType && matchesStatus;
  });

  return (
    <AdminLayout 
      title="Visa Applications" 
      subtitle="Manage and process all visa applications"
    >
      <Card>
        <CardContent className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search applications..."
                  className="pl-9 w-full sm:w-auto min-w-[240px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:items-center">
              <Select
                value={visaTypeFilter}
                onValueChange={setVisaTypeFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Visa Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Tourist">Tourist</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Transit">Transit</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="document-requested">Docs Requested</SelectItem>
                  <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Applications Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">
                    <div className="flex items-center">
                      ID 
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Applicant 
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead>Visa Type</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Date 
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {application.id}
                    </TableCell>
                    <TableCell>
                      {application.name}
                    </TableCell>
                    <TableCell>
                      {application.nationality}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted">
                        {application.visaType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(application.submissionDate)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(application.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => navigate(`/dashboard/application/${application.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing <strong>10</strong> of <strong>235</strong> applications
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary/5">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminApplications;
