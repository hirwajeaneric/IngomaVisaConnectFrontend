import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, XCircle, Upload, Download } from "lucide-react";
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
import { requestForDocumentService } from "@/lib/api/services/requestForDocument.service";

interface DocumentRequest {
  id: string;
  applicationId: string;
  documentName: string;
  additionalDetails?: string;
  status: 'SENT' | 'SUBMITTED' | 'CANCELLED';
  officer: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  document?: {
    id: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    uploadDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface DocumentRequestsListProps {
  applicationId: string;
  requests: DocumentRequest[];
  onRequestsUpdate: (requests: DocumentRequest[] | null) => void;
  userRole?: string;
}

export const DocumentRequestsList: React.FC<DocumentRequestsListProps> = ({
  applicationId,
  requests,
  onRequestsUpdate,
  userRole
}) => {
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [isSubmittingDocument, setIsSubmittingDocument] = useState(false);
  const [isCancellingRequest, setIsCancellingRequest] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");

  const isOfficer = userRole === 'OFFICER' || userRole === 'ADMIN';
  const isApplicant = userRole === 'APPLICANT';

  const handleCancelRequest = async (requestId: string) => {
    setIsCancellingRequest(requestId);
    try {
      const response = await requestForDocumentService.cancelRequestForDocument(requestId);
      
      if (response.success) {
        toast({
          title: "Request Cancelled",
          description: "Document request has been cancelled successfully.",
        });
        // Trigger refresh of requests
        onRequestsUpdate(null);
      } else {
        toast({
          title: "Cancellation Failed",
          description: response.message || "Failed to cancel document request.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "An error occurred while cancelling the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancellingRequest(null);
    }
  };

  const handleSubmitDocument = async () => {
    if (!selectedRequest || !documentFile || !documentType.trim()) return;

    setIsSubmittingDocument(true);
    try {
      // In a real application, you would upload the file to a storage service first
      // For now, we'll simulate the upload with a mock file path
      const mockFilePath = `/uploads/${Date.now()}_${documentFile.name}`;
      
      const response = await requestForDocumentService.submitDocumentForRequest(selectedRequest.id, {
        documentType,
        fileName: documentFile.name,
        filePath: mockFilePath,
        fileSize: documentFile.size,
      });

      if (response.success) {
        toast({
          title: "Document Submitted",
          description: "Document has been submitted successfully.",
        });
        setSelectedRequest(null);
        setDocumentFile(null);
        setDocumentType("");
        // Trigger refresh of requests
        onRequestsUpdate(null);
      } else {
        toast({
          title: "Submission Failed",
          description: response.message || "Failed to submit document.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "An error occurred while submitting the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingDocument(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SENT':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Requested</Badge>;
      case 'SUBMITTED':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Submitted</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No document requests have been made for this application.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{request.documentName}</p>
                  <p className="text-xs text-muted-foreground">
                    Requested by {request.officer.name} • {formatDate(request.createdAt)}
                  </p>
                  {request.additionalDetails && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {request.additionalDetails}
                    </p>
                  )}
                  {request.document && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Submitted: {request.document.fileName} • {formatFileSize(request.document.fileSize)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(request.status)}
                
                {isOfficer && request.status === 'SENT' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelRequest(request.id)}
                    disabled={isCancellingRequest === request.id}
                  >
                    {isCancellingRequest === request.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    )}
                  </Button>
                )}

                {isApplicant && request.status === 'SENT' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Submit Document</DialogTitle>
                        <DialogDescription>
                          Upload the requested document: {request.documentName}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex flex-col space-y-4 py-4">
                        <div>
                          <label htmlFor="documentType" className="text-sm font-medium mb-1 block">
                            Document Type*
                          </label>
                          <Input
                            id="documentType"
                            placeholder="e.g., Bank Statement, Medical Certificate"
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                          />
                        </div>

                        <div>
                          <label htmlFor="documentFile" className="text-sm font-medium mb-1 block">
                            Document File*
                          </label>
                          <Input
                            id="documentFile"
                            type="file"
                            onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          onClick={handleSubmitDocument}
                          disabled={!documentFile || !documentType.trim() || isSubmittingDocument}
                        >
                          {isSubmittingDocument ? "Submitting..." : "Submit Document"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {request.document && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => window.open(request.document!.filePath, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 