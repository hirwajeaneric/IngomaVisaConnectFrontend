
import { format } from 'date-fns';
import { getCountryName } from './utils';

interface ReportData {
  title: string;
  dateRange: {
    from: string;
    to: string;
  };
  includeDetails: boolean;
  reportType: string;
  generatedAt: string;
  logoUrl: string;
  applicationData?: any; // Real application data for detailed reports
  reportData?: any[]; // Real report data from backend
}

// Sample data for reports based on report type
const getSampleData = (reportType: string, applicationData?: any, reportData?: any[]) => {
  switch (reportType) {
    case 'applications':
    case 'all_applications':
    case 'approved':
    case 'rejected':
    case 'pending':
    case 'under_review':
      if (reportData && reportData.length > 0) {
        // Use real data from backend
        return {
          headers: ['Application ID', 'Applicant Name', 'Visa Type', 'Status', 'Submission Date', 'Nationality', 'Purpose of Travel'],
          rows: reportData.map(item => [
            item.applicationId || 'N/A',
            item.applicantName || 'N/A',
            item.visaType || 'N/A',
            item.status?.replace('_', ' ').toUpperCase() || 'N/A',
            item.submissionDate ? format(new Date(item.submissionDate), 'MMM dd, yyyy') : 'N/A',
            item.nationality || 'N/A',
            item.purposeOfTravel || 'N/A'
          ])
        };
      } else {
        // Fallback to sample data
        return {
          headers: ['Application ID', 'Applicant Name', 'Visa Type', 'Status', 'Submission Date'],
          rows: Array(25).fill(0).map((_, i) => [
            `APP-${1000 + i}`,
            `${['John', 'Jane', 'Michael', 'Sarah'][i % 4]} ${['Smith', 'Johnson', 'Williams', 'Brown'][i % 4]}`,
            ['Tourist', 'Business', 'Work', 'Student', 'Transit'][i % 5],
            ['Approved', 'Pending', 'Rejected', 'Under Review'][i % 4],
            format(new Date(2025, i % 12, (i % 28) + 1), 'MMM dd, yyyy')
          ])
        };
      }
    case 'payments':
    case 'revenue':
    case 'refunds':
    case 'completed':
    case 'failed':
      if (reportData && reportData.length > 0) {
        // Use real data from backend
        return {
          headers: ['Transaction ID', 'Amount', 'Currency', 'Status', 'Customer Name', 'Application Number', 'Payment Date'],
          rows: reportData.map(item => [
            item.transactionId || 'N/A',
            `$${item.amount?.toFixed(2) || '0.00'}`,
            item.currency || 'USD',
            item.status || 'N/A',
            item.customerName || 'N/A',
            item.applicationNumber || 'N/A',
            item.paymentDate ? format(new Date(item.paymentDate), 'MMM dd, yyyy') : 'N/A'
          ])
        };
      } else {
        // Fallback to sample data
        return {
          headers: ['Transaction ID', 'Amount', 'Payment Method', 'Status', 'Date'],
          rows: Array(25).fill(0).map((_, i) => [
            `TXN-${2000 + i}`,
            `$${(50 + i * 15).toFixed(2)}`,
            ['Credit Card', 'Bank Transfer', 'PayPal', 'Mobile Money'][i % 4],
            ['Completed', 'Pending', 'Failed', 'Refunded'][i % 4],
            format(new Date(2025, i % 12, (i % 28) + 1), 'MMM dd, yyyy')
          ])
        };
      }
    case 'users':
    case 'applicants':
    case 'officers':
    case 'admins':
      if (reportData && reportData.length > 0) {
        // Use real data from backend
        return {
          headers: ['User ID', 'Name', 'Email', 'Role', 'Applications Count', 'Registration Date'],
          rows: reportData.map(item => [
            item.userId || 'N/A',
            item.name || 'N/A',
            item.email || 'N/A',
            item.role || 'N/A',
            item.applicationsCount?.toString() || '0',
            item.registrationDate ? format(new Date(item.registrationDate), 'MMM dd, yyyy') : 'N/A'
          ])
        };
      } else {
        // Fallback to sample data
        return {
          headers: ['User ID', 'Name', 'Email', 'Role', 'Registration Date'],
          rows: Array(25).fill(0).map((_, i) => [
            `USER-${3000 + i}`,
            `${['John', 'Jane', 'Michael', 'Sarah'][i % 4]} ${['Smith', 'Johnson', 'Williams', 'Brown'][i % 4]}`,
            `user${i}@example.com`,
            ['Applicant', 'Officer', 'Admin'][i % 3],
            format(new Date(2025, i % 12, (i % 28) + 1), 'MMM dd, yyyy')
          ])
        };
      }
    case 'application_detail':
      if (applicationData) {
        // Use real application data
        const app = applicationData;
        const personalInfo = app.personalInfo || {};
        const travelInfo = app.travelInfo || {};
        
        return {
          headers: ['Field', 'Value'],
          rows: [
            ['Application ID', app.applicationNumber || 'N/A'],
            ['Applicant Name', `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() || 'N/A'],
            ['Visa Type', app.visaType?.name || 'N/A'],
            ['Status', app.status?.replace('_', ' ').toUpperCase() || 'N/A'],
            ['Submission Date', app.submissionDate ? format(new Date(app.submissionDate), 'MMM dd, yyyy') : 'N/A'],
            ['Passport Number', personalInfo.passportNumber || 'N/A'],
            ['Nationality', getCountryName(personalInfo.nationality || '') || 'N/A'],
            ['Date of Birth', personalInfo.dateOfBirth ? format(new Date(personalInfo.dateOfBirth), 'MMM dd, yyyy') : 'N/A'],
            ['Gender', personalInfo.gender || 'N/A'],
            ['Email', personalInfo.email || 'N/A'],
            ['Phone', personalInfo.phone || 'N/A'],
            ['Address', personalInfo.address || 'N/A'],
            ['City', personalInfo.city || 'N/A'],
            ['Country', getCountryName(personalInfo.country || '') || 'N/A'],
            ['Purpose of Travel', travelInfo.purposeOfTravel || 'N/A'],
            ['Entry Date', travelInfo.entryDate ? format(new Date(travelInfo.entryDate), 'MMM dd, yyyy') : 'N/A'],
            ['Exit Date', travelInfo.exitDate ? format(new Date(travelInfo.exitDate), 'MMM dd, yyyy') : 'N/A'],
            ['Port of Entry', travelInfo.portOfEntry || 'N/A'],
            ['Previous Visits', travelInfo.previousVisits ? 'Yes' : 'No'],
            ['Accommodation Details', travelInfo.accommodationDetails || 'N/A'],
            ['Travel Itinerary', travelInfo.travelItinerary || 'N/A'],
            ['Payment Status', app.payment?.status || 'N/A'],
            ['Payment Amount', app.payment ? `$${app.payment.amount}` : 'N/A'],
            ['Documents Submitted', app.documents?.length || 0],
          ]
        };
      } else {
        // Fallback to sample data
        return {
          headers: ['Field', 'Value'],
          rows: [
            ['Application ID', 'APP-2354'],
            ['Applicant Name', 'John Smith'],
            ['Visa Type', 'Tourist'],
            ['Status', 'Under Review'],
            ['Submission Date', format(new Date(), 'MMM dd, yyyy')],
            ['Passport Number', 'US12345678'],
            ['Nationality', 'United States'],
            ['Entry Date', format(new Date(2025, 5, 20), 'MMM dd, yyyy')],
            ['Exit Date', format(new Date(2025, 6, 5), 'MMM dd, yyyy')],
            ['Purpose of Visit', 'Tourism and wildlife photography'],
            ['Accommodation', 'Kiriri Garden Hotel, Bujumbura'],
          ]
        };
      }
    default:
      return {
        headers: ['Item ID', 'Description', 'Value', 'Category', 'Date'],
        rows: Array(25).fill(0).map((_, i) => [
          `ITEM-${4000 + i}`,
          `Sample item ${i}`,
          `${i * 10}`,
          ['Category A', 'Category B', 'Category C'][i % 3],
          format(new Date(2025, i % 12, (i % 28) + 1), 'MMM dd, yyyy')
        ])
      };
  }
};

// Generate and download a PDF report
export const generatePDF = async (data: ReportData) => {
  const { title, dateRange, includeDetails, reportType, generatedAt, logoUrl, applicationData, reportData } = data;
  
  // Get sample data for the report type
  const sampleData = getSampleData(reportType, applicationData, reportData);
  
  // Create a new window/tab for the PDF (in a real app, we'd use a PDF library like jsPDF)
  const reportWindow = window.open('', '_blank');
  if (!reportWindow) {
    throw new Error('Failed to open report window. Please allow popups for this site.');
  }
  
  // Build HTML content for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #CE1126; padding-bottom: 20px; }
        .logo { width: 80px; height: auto; }
        .title { font-size: 24px; font-weight: bold; color: #222; }
        .subtitle { font-size: 14px; color: #666; margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f9f9f9; font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        .print-btn { padding: 10px 20px; background-color: #CE1126; color: white; border: none; border-radius: 4px; cursor: pointer; }
        @media print {
          .print-btn { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">${title}</h1>
          <p class="subtitle">Date Range: ${dateRange.from} to ${dateRange.to}</p>
          <p class="subtitle">Generated: ${generatedAt}</p>
        </div>
        <img src="${logoUrl}" alt="Burundi Coat of Arms" class="logo">
      </div>
      
      <div class="content">
        <table>
          <thead>
            <tr>
              ${sampleData.headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${sampleData.rows.slice(0, includeDetails ? 25 : 10).map(row => `
              <tr>
                ${row.map(cell => `<td>${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="footer">
        <p>This is an official report generated by Ingoma Visa Connect.</p>
      </div>
      
      <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
      
      <script>
        // Auto-trigger print dialog after a short delay
        setTimeout(() => {
          window.print();
        }, 1000);
      </script>
    </body>
    </html>
  `;
  
  reportWindow.document.write(htmlContent);
  reportWindow.document.close();
  
  return new Promise((resolve) => {
    reportWindow.onafterprint = resolve;
    // If print dialog is canceled, resolve after a timeout
    setTimeout(resolve, 5000);
  });
};

// Generate and download an Excel report
export const generateExcel = async (data: ReportData) => {
  const { title, dateRange, includeDetails, reportType, generatedAt } = data;
  
  // Get sample data for the report type
  const sampleData = getSampleData(reportType);
  
  try {
    // In a real app, we'd use libraries like SheetJS/xlsx or exceljs
    // For this demo, we'll create a CSV file and download it
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add report metadata
    csvContent += `"${title}"\r\n`;
    csvContent += `"Date Range: ${dateRange.from} to ${dateRange.to}"\r\n`;
    csvContent += `"Generated: ${generatedAt}"\r\n\r\n`;
    
    // Add headers
    csvContent += sampleData.headers.join(",") + "\r\n";
    
    // Add rows
    sampleData.rows.slice(0, includeDetails ? 25 : 10).forEach(row => {
      // Escape any fields that contain commas
      const escapedRow = row.map(field => `"${field}"`);
      csvContent += escapedRow.join(",") + "\r\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};
