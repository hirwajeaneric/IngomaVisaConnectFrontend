import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { VisaApplication } from "@/lib/api/services/visaapplication.service";

interface ApplicationSummaryProps {
  application: VisaApplication;
}

export const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  application
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Applicant</dt>
            <dd className="mt-1 text-sm">
              {application.personalInfo?.firstName} {application.personalInfo?.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Nationality</dt>
            <dd className="mt-1 text-sm">{application.personalInfo?.nationality || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Passport</dt>
            <dd className="mt-1 text-sm">{application.personalInfo?.passportNumber || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Visit Purpose</dt>
            <dd className="mt-1 text-sm">{application.travelInfo?.purposeOfTravel || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Travel Dates</dt>
            <dd className="mt-1 text-sm">
              {application.travelInfo?.entryDate ? formatDate(application.travelInfo.entryDate) : 'N/A'} - {application.travelInfo?.exitDate ? formatDate(application.travelInfo.exitDate) : 'N/A'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Payment</dt>
            <dd className="mt-1 text-sm">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {application.payment?.status || 'N/A'}
              </Badge> ${application.payment?.amount || 0} {application.payment?.currency || 'USD'}
            </dd>
          </div>
        </dl>
        
        <div className="mt-6 flex space-x-4">
          <Button className="flex-1" variant="destructive">
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 