import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportDownload } from "@/components/reports/ReportDownload";
import { FileText, FileSpreadsheet, Download, CreditCard, Users, Calendar, TrendingUp, UserCheck } from "lucide-react";

const AdminReports = () => {
  return (
    <AdminLayout 
      title="Reports" 
      subtitle="Generate and download system reports"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  { value: "pending", label: "Pending Applications" },
                  { value: "under_review", label: "Under Review Applications" }
                ]}
              />
              
              <ReportDownload 
                title="Financial Report"
                description="Generate reports on payments and revenue"
                reportTypes={[
                  { value: "revenue", label: "Revenue Summary" },
                  { value: "payments", label: "Payment Transactions" },
                  { value: "completed", label: "Completed Payments" },
                  { value: "failed", label: "Failed Payments" },
                  { value: "refunded", label: "Refunds" }
                ]}
              />

              <ReportDownload 
                title="Users Report"
                description="Generate reports on system users"
                reportTypes={[
                  { value: "users", label: "All Users" },
                  { value: "applicants", label: "Applicants" },
                  { value: "officers", label: "Officers" },
                  { value: "admins", label: "Administrators" }
                ]}
              />

              <ReportDownload 
                title="Interviews Report"
                description="Generate reports on interview scheduling and outcomes"
                reportTypes={[
                  { value: "interviews", label: "All Interviews" },
                  { value: "scheduled", label: "Scheduled Interviews" },
                  { value: "completed", label: "Completed Interviews" },
                  { value: "cancelled", label: "Cancelled Interviews" },
                  { value: "no_show", label: "No Show Interviews" }
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
