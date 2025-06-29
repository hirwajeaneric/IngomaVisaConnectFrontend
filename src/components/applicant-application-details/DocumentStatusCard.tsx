import React from "react";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DocumentStatusCardProps {
  document: {
    id: string;
    documentType: string;
    fileName: string;
    uploadDate: string;
    verificationStatus: string;
    rejectionReason?: string;
  };
}

const DocumentStatusCard: React.FC<DocumentStatusCardProps> = ({ document }) => {
  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-gray-100">Pending</Badge>;
      case "VERIFIED":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case "passportCopy":
        return "Passport Copy";
      case "photos":
        return "Passport Photos";
      case "yellowFeverCertificate":
        return "Yellow Fever Certificate";
      case "travelInsurance":
        return "Travel Insurance";
      case "bankStatement":
        return "Bank Statement";
      case "employmentLetter":
        return "Employment Letter";
      case "invitationLetter":
        return "Invitation Letter";
      default:
        return type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30">
      <div className="flex items-center">
        <div
          className={`h-10 w-10 rounded-lg flex items-center justify-center mr-4 ${
            document.verificationStatus === 'VERIFIED' ? 'bg-green-100' :
            document.verificationStatus === 'REJECTED' ? 'bg-red-100' : 'bg-gray-100'
          }`}
        >
          <FileText className={`h-5 w-5 ${
            document.verificationStatus === 'VERIFIED' ? 'text-green-600' :
            document.verificationStatus === 'REJECTED' ? 'text-red-600' : 'text-gray-600'
          }`} />
        </div>
        <div>
          <p className="font-medium">{getDocumentTypeName(document.documentType)}</p>
          <p className="text-sm text-muted-foreground">
            Uploaded: {formatDate(document.uploadDate)}
          </p>
          <p className="text-sm text-muted-foreground">
            File: {document.fileName}
          </p>
        </div>
      </div>
      <div>
        {getDocumentStatusBadge(document.verificationStatus)}
        {document.verificationStatus === 'REJECTED' && document.rejectionReason && (
          <p className="text-sm text-red-600 mt-1">{document.rejectionReason}</p>
        )}
      </div>
    </div>
  );
};

export default DocumentStatusCard; 