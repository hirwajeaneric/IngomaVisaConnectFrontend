
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { FileText, FileSpreadsheet, Download, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format as formatDate } from "date-fns";
import { generatePDF, generateExcel } from "@/lib/report-generator";
import { reportsService } from "@/lib/api/services/reports.service";

interface ReportDownloadProps {
  title: string;
  description?: string;
  className?: string;
  reportTypes?: { value: string; label: string }[];
}

export const ReportDownload = ({
  title,
  description,
  className,
  reportTypes = [
    { value: "applications", label: "Visa Applications" },
    { value: "payments", label: "Payments" },
    { value: "users", label: "Users" },
  ]
}: ReportDownloadProps) => {
  const [reportType, setReportType] = useState(reportTypes[0]?.value || "");
  const [reportFormat, setReportFormat] = useState<"pdf" | "excel">("pdf");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [includeDetails, setIncludeDetails] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!dateRange.from) {
      toast({
        title: "Missing Information",
        description: "Please select a start date for the report.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Fetch real data from backend based on report type
      let reportData: any[] = [];
      
      if (reportType.includes('applications') || reportType === 'approved' || reportType === 'rejected' || reportType === 'pending' || reportType === 'under_review') {
        const response = await reportsService.getApplicationsReport(reportType, dateRange.from, dateRange.to);
        reportData = response.data;
      } else if (reportType.includes('payments') || reportType === 'revenue' || reportType === 'completed' || reportType === 'failed' || reportType === 'refunded') {
        const response = await reportsService.getPaymentsReport(reportType, dateRange.from, dateRange.to);
        reportData = response.data;
      } else if (reportType.includes('users') || reportType === 'applicants' || reportType === 'officers' || reportType === 'admins') {
        const response = await reportsService.getUsersReport(reportType, dateRange.from, dateRange.to);
        reportData = response.data;
      } else if (reportType.includes('interviews') || reportType === 'scheduled' || reportType === 'completed' || reportType === 'cancelled' || reportType === 'no_show') {
        const response = await reportsService.getInterviewsReport(reportType, dateRange.from, dateRange.to);
        reportData = response.data;
      }
      
      // Prepare report data
      const reportConfig = {
        title: `${reportTypes.find(t => t.value === reportType)?.label} Report`,
        dateRange: {
          from: dateRange.from ? formatDate(dateRange.from, 'MMM dd, yyyy') : 'Not specified',
          to: dateRange.to ? formatDate(dateRange.to, 'MMM dd, yyyy') : 'Present',
        },
        includeDetails,
        reportType,
        generatedAt: formatDate(new Date(), 'MMMM dd, yyyy HH:mm'),
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Coat_of_arms_of_Burundi.svg/250px-Coat_of_arms_of_Burundi.svg.png',
        reportData: reportData // Pass real data to report generator
      };
      
      // Generate and download the report in the selected format
      if (reportFormat === 'pdf') {
        await generatePDF(reportConfig);
      } else {
        await generateExcel(reportConfig);
      }
      
      toast({
        title: `${reportFormat === 'pdf' ? 'PDF' : 'Excel'} Report Downloaded`,
        description: `Your ${reportTypes.find(t => t.value === reportType)?.label || reportType} report has been generated and downloaded.`,
      });
    } catch (error: any) {
      toast({
        title: "Error Generating Report",
        description: error.message || "There was an error creating your report. Please try again.",
        variant: "destructive",
      });
      console.error("Report generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger id="report-type">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <DatePicker
                id="from-date"
                date={dateRange.from}
                setDate={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                placeholder="From date"
              />
            </div>
            <div className="flex-1">
              <DatePicker
                id="to-date"
                date={dateRange.to}
                setDate={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                placeholder="To date"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Format</Label>
          <div className="flex gap-4">
            <div 
              className={cn(
                "flex flex-1 flex-col items-center gap-2 rounded-lg border bg-card p-4 cursor-pointer transition-colors hover:bg-accent",
                reportFormat === "pdf" && "border-primary bg-primary/5"
              )}
              onClick={() => setReportFormat("pdf")}
            >
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">PDF</span>
            </div>
            
            <div 
              className={cn(
                "flex flex-1 flex-col items-center gap-2 rounded-lg border bg-card p-4 cursor-pointer transition-colors hover:bg-accent",
                reportFormat === "excel" && "border-primary bg-primary/5"
              )}
              onClick={() => setReportFormat("excel")}
            >
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <span className="text-sm font-medium">Excel</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="include-details" 
            checked={includeDetails}
            onCheckedChange={(checked) => setIncludeDetails(!!checked)}
          />
          <Label htmlFor="include-details">Include detailed information</Label>
        </div>
        
        <Button 
          onClick={handleDownload} 
          disabled={loading || !reportType || !dateRange.from}
          className="w-full"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
