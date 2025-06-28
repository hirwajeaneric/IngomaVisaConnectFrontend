import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Download, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { documentService } from "@/lib/api/services/document.service";
import { requestForDocumentService } from "@/lib/api/services/requestForDocument.service";
import { Document } from "./types";

interface DocumentsListProps {
  documents: Document[];
  onDocumentUpdate: (documents: Document[] | null) => void;
  applicationId?: string;
  onDocumentRequestCreated?: () => void;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onDocumentUpdate,
  applicationId,
  onDocumentRequestCreated
}) => {
  const [selectedDocument, setSelectedDocument] = useState<{ id: string, name: string, type: string, size: string, verified: boolean, rejectionReason?: string, verifiedBy?: string, verifiedAt?: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [requestDocumentName, setRequestDocumentName] = useState("");
  const [requestDocumentDetails, setRequestDocumentDetails] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [isVerifyingDocument, setIsVerifyingDocument] = useState(false);
  const [isRejectingDocument, setIsRejectingDocument] = useState(false);

  /**
   * Converts a document type code to a human-readable name
   * @param {string} type the document type code
   * @returns {string} the human-readable name
   */
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

  /**
   * Formats a file size to a human-readable string
   * @param {number} bytes the file size in bytes
   * @returns {string} the human-readable file size
   */
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Handles the document verification process
   */
  const handleDocumentVerify = async () => {
    if (!selectedDocument) return;
    
    setIsVerifyingDocument(true);
    try {
      // Update the document status in the database
      const response = await documentService.verifyDocument(selectedDocument.id, true, rejectionReason);

      if (response.success && response.data && response.data.verificationStatus) {
        // Update the document status in the UI with the returned data
        const updatedDocuments = documents.map(doc =>
          doc.id === selectedDocument.id ? {
            ...doc,
            verificationStatus: response.data.verificationStatus,
            verifiedBy: response.data.verifiedBy,
            verifiedAt: response.data.verifiedAt,
            rejectionReason: response.data.rejectionReason
          } : doc
        );
        onDocumentUpdate(updatedDocuments);
        
        toast({
          title: "Document Verified",
          description: `${selectedDocument.name} has been marked as verified.`,
        });
      } else {
        // Fallback: trigger a reload if the API response doesn't contain the expected data
        toast({
          title: "Document Verified",
          description: `${selectedDocument.name} has been marked as verified. Refreshing document list...`,
        });
        // Trigger a reload by calling onDocumentUpdate with null to indicate a refresh is needed
        onDocumentUpdate(null);
      }
    } catch (error) {
      toast({
        title: "Document Verification Failed",
        description: "An error occurred while verifying the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingDocument(false);
      setSelectedDocument(null);
      setRejectionReason("");
    }
  };

  /**
   * Handles the document rejection process
   */
  const handleDocumentReject = async () => {
    if (!selectedDocument || !rejectionReason.trim()) return;

    setIsRejectingDocument(true);
    try {
      // Update the document status in the database
      const response = await documentService.rejectDocument(selectedDocument.id, rejectionReason);

      if (response.success && response.data && response.data.verificationStatus) {
        // Update the document status in the UI with the returned data
        const updatedDocuments = documents.map(doc =>
          doc.id === selectedDocument.id ? {
            ...doc,
            verificationStatus: response.data.verificationStatus,
            verifiedBy: response.data.verifiedBy,
            verifiedAt: response.data.verifiedAt,
            rejectionReason: response.data.rejectionReason
          } : doc
        );
        onDocumentUpdate(updatedDocuments);
        
        toast({
          title: "Document Rejected",
          description: `${selectedDocument.name} has been rejected.`,
        });
      } else {
        // Fallback: trigger a reload if the API response doesn't contain the expected data
        toast({
          title: "Document Rejected",
          description: `${selectedDocument.name} has been rejected. Refreshing document list...`,
        });
        // Trigger a reload by calling onDocumentUpdate with null to indicate a refresh is needed
        onDocumentUpdate(null);
      }
    } catch (error) {
      toast({
        title: "Document Rejection Failed",
        description: "An error occurred while rejecting the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRejectingDocument(false);
      setSelectedDocument(null);
      setRejectionReason("");
    }
  };

  /**
   * Handles the document request process
   */
  const handleRequestDocument = async () => {
    if (!requestDocumentName.trim() || !applicationId) return;

    setIsSubmittingRequest(true);
    try {
      const response = await requestForDocumentService.createRequestForDocument(applicationId, {
        documentName: requestDocumentName,
        additionalDetails: requestDocumentDetails
      });

      if (response.success) {
        toast({
          title: "Document Requested",
          description: `${requestDocumentName} has been requested from the applicant.`,
        });
        setRequestDocumentName("");
        setRequestDocumentDetails("");
        
        // Trigger update of document requests list
        if (onDocumentRequestCreated) {
          onDocumentRequestCreated();
        }
      } else {
        toast({
          title: "Request Failed",
          description: response.message || "Failed to create document request.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "An error occurred while creating the document request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  /**
   * Renders the documents list
   * @returns {JSX.Element} the rendered documents list
   */
  return (
    <Card>
      <CardHeader>
        <CardTitle>Submitted Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{getDocumentTypeName(doc.documentType)}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.fileName} • {formatFileSize(doc.fileSize)} • {formatDate(doc.uploadDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {doc.verificationStatus === 'VERIFIED' ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Verified
                  </Badge>
                ) : doc.verificationStatus === 'REJECTED' ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    Rejected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    Pending Verification
                  </Badge>
                )}
                <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDocument({
                          id: doc.id,
                          name: getDocumentTypeName(doc.documentType),
                          type: doc.fileName.split('.').pop() || 'unknown',
                          size: formatFileSize(doc.fileSize),
                          verified: doc.verificationStatus === 'VERIFIED',
                          rejectionReason: doc.rejectionReason,
                          verifiedBy: doc.verifiedBy,
                          verifiedAt: doc.verifiedAt
                        })}
                      >
                        Check
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Verify Document</DialogTitle>
                        <DialogDescription>
                          Review and verify "{getDocumentTypeName(doc.documentType)}" or reject it with a reason.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex flex-col space-y-4 py-4">
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">{getDocumentTypeName(doc.documentType)}</p>
                            <p className="text-sm text-muted-foreground">{doc.fileName} • {formatFileSize(doc.fileSize)}</p>
                          </div>
                        </div>

                        <div className="border rounded-md p-4">
                          <p className="text-sm">Document preview would appear here in a real application.</p>
                          <p className="text-sm text-muted-foreground mt-2">File: {doc.fileName}</p>
                          <p className="text-sm text-muted-foreground">Size: {formatFileSize(doc.fileSize)}</p>
                        </div>

                        {selectedDocument?.rejectionReason && (
                          <div className="border rounded-md p-4 bg-red-500/10">
                            <p className="text-sm">Rejection Reason:</p>
                            <p className="text-sm text-muted-foreground">{selectedDocument?.rejectionReason}</p>
                          </div>
                        )}
                        <Textarea
                          placeholder="Reason for rejection (required if rejecting)"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>

                      <DialogFooter className="flex justify-between sm:justify-between">
                        <Button
                          variant="destructive"
                          onClick={handleDocumentReject}
                          disabled={!rejectionReason.trim() || isRejectingDocument || isVerifyingDocument}
                        >
                          {isRejectingDocument ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Rejecting...
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleDocumentVerify}
                          disabled={isVerifyingDocument || isRejectingDocument}
                        >
                          {isVerifyingDocument ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Verify
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                <Button variant="ghost" size="icon" onClick={() => window.open(doc.filePath, '_blank')}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Request Additional Documents</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Request Additional Document</DialogTitle>
                <DialogDescription>
                  Specify which document you need from the applicant.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col space-y-4 py-4">
                <div>
                  <label htmlFor="documentName" className="text-sm font-medium mb-1 block">
                    Document Name*
                  </label>
                  <Input
                    id="documentName"
                    placeholder="e.g., Bank Statement, Medical Certificate"
                    value={requestDocumentName}
                    onChange={(e) => setRequestDocumentName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="documentDetails" className="text-sm font-medium mb-1 block">
                    Additional Details (Optional)
                  </label>
                  <Textarea
                    id="documentDetails"
                    placeholder="Please provide any specific requirements for this document..."
                    value={requestDocumentDetails}
                    onChange={(e) => setRequestDocumentDetails(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleRequestDocument}
                  disabled={!requestDocumentName.trim() || !applicationId || isSubmittingRequest}
                >
                  {isSubmittingRequest ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Request...
                    </>
                  ) : (
                    "Send Request"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}; 