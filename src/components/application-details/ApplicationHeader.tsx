import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle, 
  User
} from "lucide-react";
import { getStatusBadge } from "@/components/widgets";
import { formatDateTime } from "@/lib/utils";
import { VisaApplication } from "@/types";

interface ApplicationHeaderProps {
  application: VisaApplication;
  onExportPDF: () => void;
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  application,
  onExportPDF
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold">
                {application.personalInfo?.firstName} {application.personalInfo?.lastName}
              </h2>
              {getStatusBadge(application.status)}
            </div>
            <p className="text-gray-500 mt-1">
              {application.visaType.name} Visa Application • {application.applicationNumber}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button variant="outline" className="gap-2" onClick={onExportPDF}>
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <p className="text-sm text-muted-foreground">Submitted on</p>
              <p className="font-medium">{formatDateTime(application.submissionDate || '')}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <p className="text-sm text-muted-foreground">Processing time</p>
              <p className="font-medium">{application.visaType.processingTime}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <User className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <p className="text-sm text-muted-foreground">Visa duration</p>
              <p className="font-medium">{application.visaType.duration}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 