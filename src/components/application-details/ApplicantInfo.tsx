import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { VisaApplication, Document } from "@/types";

interface ApplicantInfoProps {
  application: VisaApplication;
  passportPhoto: Document;
}

export const ApplicantInfo: React.FC<ApplicantInfoProps> = ({
  application,
  passportPhoto
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applicant Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <AspectRatio ratio={1/1} className="border rounded-lg overflow-hidden bg-muted">
                <img 
                  src={passportPhoto?.filePath || ''}
                  alt={`${application.personalInfo?.firstName} ${application.personalInfo?.lastName}'s photo`} 
                  className="object-cover"
                />
              </AspectRatio>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Passport Number</p>
                <p className="font-medium">{application.personalInfo?.passportNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Passport Issue Date</p>
                <p>{formatDate(application.personalInfo?.passportIssueDate || '')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Passport Expiry Date</p>
                <p>{formatDate(application.personalInfo?.passportExpiryDate || '')}</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="font-medium">
                  {application.personalInfo?.firstName} {application.personalInfo?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                <p>{formatDate(application.personalInfo?.dateOfBirth || '')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p>{application.personalInfo?.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                <p>{application.personalInfo?.nationality}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Country of Residence</p>
                <p>{application.personalInfo?.country}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{application.personalInfo?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                <p>{application.personalInfo?.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                <p>{application.personalInfo?.occupation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Employer</p>
                <p>{application.personalInfo?.employerDetails || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p>{application.personalInfo?.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">City</p>
                <p>{application.personalInfo?.city}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Marital Status</p>
                <p className="capitalize">{application.personalInfo?.maritalStatus}</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Source of Funding</p>
                  <p className="capitalize">{application.fundingSource || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Income</p>
                  <p>${application.monthlyIncome || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 