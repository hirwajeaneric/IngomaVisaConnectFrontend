import { useState } from 'react';
import { visaApplicationService } from '@/lib/api/services/visaapplication.service';

// ... other imports ...

export const DocumentsForm = ({ applicationId }: { applicationId: string }) => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File, documentType: string) => {
    try {
      console.log(`[DocumentsForm] Starting upload for ${documentType}`);
      setLoading(true);

      const response = await visaApplicationService.uploadDocument(
        applicationId,
        documentType,
        file,
        (progress) => {
          console.log(`[DocumentsForm] Upload progress for ${documentType}: ${progress}`);
        }
      );

      console.log(`[DocumentsForm] Upload completed for ${documentType}:`, response);
    } catch (error) {
      console.error(`[DocumentsForm] Upload failed for ${documentType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component code ...
}; 