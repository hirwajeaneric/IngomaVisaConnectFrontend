import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, FileText, UserRoundCheck } from "lucide-react";
import { getStatusBadge } from "@/components/widgets";
import { formatDateTime } from "@/lib/utils";
import { VisaApplication } from "@/types";

interface ApplicationHeaderProps {
  application: VisaApplication;
  onDownloadPDF: () => void;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  application,
  onDownloadPDF,
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Application Details</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your visa application
          </p>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0" onClick={onDownloadPDF}>
          <FileText className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{application.visaType.name}</h2>
                {getStatusBadge(application.status)}
              </div>
              <p className="text-muted-foreground">Application ID: {application.applicationNumber}</p>
            </div>

            <div className="flex flex-col mt-4 md:mt-0 md:text-right">
              <p className="text-sm text-muted-foreground">Submitted on</p>
              <p className="font-medium">{formatDateTime(application.submissionDate || '')}</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-primary rounded-full"
                style={{ 
                  width: application.status === 'APPROVED' ? '100%' : 
                         application.status === 'UNDER_REVIEW' ? '60%' : '30%' 
                }}
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Submitted</span>
              <span>Under Review</span>
              <span>Decision</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Processing time</p>
                <p className="font-medium">
                  {application.visaType.processingTime}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Visa duration</p>
                <p className="font-medium">{application.visaType.duration}</p>
              </div>
            </div>

            <div className="flex items-center">
              <UserRoundCheck className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Assigned Officer</p>
                <p className="font-medium">
                  {application.officer?.name}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ApplicationHeader; 