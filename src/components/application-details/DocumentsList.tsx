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

interface Document {
  id: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  filePath: string;
  uploadDate: string;
  verificationStatus: string;
}

interface DocumentsListProps {
  documents: Document[];
  onDocumentUpdate: (documents: Document[]) => void;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onDocumentUpdate
}) => {
  const [selectedDocument, setSelectedDocument] = useState<{name: string, type: string, size: string, verified: boolean} | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [requestDocumentName, setRequestDocumentName] = useState("");
  const [requestDocumentDetails, setRequestDocumentDetails] = useState("");

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDocumentVerify = () => {
    if (!selectedDocument) return;
    
    // Update the document status in the UI
    const updatedDocuments = documents.map(doc => 
      doc.documentType === selectedDocument.name ? {...doc, verificationStatus: 'VERIFIED'} : doc
    );
    
    onDocumentUpdate(updatedDocuments);
    
    toast({
      title: "Document Verified",
      description: `${selectedDocument.name} has been marked as verified.`,
    });
    
    setSelectedDocument(null);
  };
  
  const handleDocumentReject = () => {
    if (!selectedDocument || !rejectionReason.trim()) return;
    
    toast({
      title: "Document Rejected",
      description: `${selectedDocument.name} has been rejected.`,
      variant: "destructive",
    });
    
    setSelectedDocument(null);
    setRejectionReason("");
  };
  
  const handleRequestDocument = () => {
    if (!requestDocumentName.trim()) return;
    
    toast({
      title: "Document Requested",
      description: `${requestDocumentName} has been requested from the applicant.`,
    });
    
    setRequestDocumentName("");
    setRequestDocumentDetails("");
  };

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
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedDocument({
                          name: getDocumentTypeName(doc.documentType),
                          type: doc.fileName.split('.').pop() || 'unknown',
                          size: formatFileSize(doc.fileSize),
                          verified: doc.verificationStatus === 'VERIFIED'
                        })}
                      >
                        Verify
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
                          disabled={!rejectionReason.trim()}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button 
                          onClick={handleDocumentVerify}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
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
                  disabled={!requestDocumentName.trim()}
                >
                  Send Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}; 