
import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportDownload } from "@/components/reports/ReportDownload";
import { FileText, FileSpreadsheet, Download, CreditCard, Users, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const AdminReports = () => {
  // Mock report data
  const recentReports = [
    {
      id: "rep-001",
      name: "Monthly Visa Applications - April 2025",
      type: "pdf",
      category: "applications",
      createdAt: "2025-05-01 14:30",
      size: "1.2 MB"
    },
    {
      id: "rep-002",
      name: "Q1 Revenue Report 2025",
      type: "excel",
      category: "payments",
      createdAt: "2025-04-15 09:45",
      size: "3.7 MB"
    },
    {
      id: "rep-003",
      name: "User Activity March 2025",
      type: "pdf",
      category: "users",
      createdAt: "2025-04-02 16:15",
      size: "0.9 MB"
    },
    {
      id: "rep-004",
      name: "Interview Statistics Q1 2025",
      type: "excel",
      category: "interviews",
      createdAt: "2025-03-31 11:20",
      size: "2.3 MB"
    }
  ];

  // Get icon for report type
  const getReportIcon = (type: string, category: string) => {
    switch(type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      default:
        return <FileText className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Get icon for report category
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'applications':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'payments':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'users':
        return <Users className="h-5 w-5 text-purple-500" />;
      case 'interviews':
        return <Calendar className="h-5 w-5 text-amber-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <AdminLayout 
      title="Reports" 
      subtitle="Generate and download system reports"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Download className="mr-2 h-5 w-5 text-primary" />
                Generate Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReportDownload 
                title="Visa Applications Report"
                description="Generate detailed reports on visa applications"
                reportTypes={[
                  { value: "all_applications", label: "All Applications" },
                  { value: "approved", label: "Approved Applications" },
                  { value: "rejected", label: "Rejected Applications" },
                  { value: "pending", label: "Pending Applications" }
                ]}
              />
              
              <ReportDownload 
                title="Financial Report"
                description="Generate reports on payments and revenue"
                reportTypes={[
                  { value: "revenue", label: "Revenue Summary" },
                  { value: "payments", label: "Payment Transactions" },
                  { value: "refunds", label: "Refunds" }
                ]}
              />
              
              <ReportDownload 
                title="User Activity Report"
                description="Generate reports on user and staff activity"
                reportTypes={[
                  { value: "applicants", label: "Applicant Activity" },
                  { value: "officers", label: "Officer Activity" },
                  { value: "admins", label: "Admin Activity" }
                ]}
              />
              
              <ReportDownload 
                title="System Performance Report"
                description="Generate reports on system performance"
                reportTypes={[
                  { value: "processing_times", label: "Processing Times" },
                  { value: "system_usage", label: "System Usage" },
                  { value: "errors", label: "Error Logs" }
                ]}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Reports */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-start">
                          <div className="mr-2 mt-0.5">
                            {getReportIcon(report.type, report.category)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{report.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {report.createdAt} • {report.size}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Download</span>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Button variant="outline" className="w-full">
                View All Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
