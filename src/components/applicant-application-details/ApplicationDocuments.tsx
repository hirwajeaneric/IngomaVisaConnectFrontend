import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestForDocument } from "@/types";
import { DocumentRequestsList } from "@/components/application-details";
import DocumentStatusCard from "./DocumentStatusCard";
import { VisaApplication } from "@/types";

interface ApplicationDocumentsProps {
  application: VisaApplication;
  onDocumentRequestsUpdate: (updatedRequests: RequestForDocument[] | null) => void;
  onSubmitDocument: (requestId: string, documentType: string, file: File) => Promise<void>;
}

const ApplicationDocuments: React.FC<ApplicationDocumentsProps> = ({
  application,
  onDocumentRequestsUpdate,
  onSubmitDocument,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Documents</CardTitle>
          <CardDescription>
            Status of your submitted documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {application.documents.map((doc) => (
              <DocumentStatusCard key={doc.id} document={doc} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Requests Section */}
      {application.requestForDocuments && application.requestForDocuments.length > 0 && (
        <DocumentRequestsList
          applicationId={application.id}
          requests={application.requestForDocuments}
          onRequestsUpdate={onDocumentRequestsUpdate}
          userRole="APPLICANT"
          onSubmitDocument={onSubmitDocument}
        />
      )}
    </div>
  );
};

export default ApplicationDocuments; 