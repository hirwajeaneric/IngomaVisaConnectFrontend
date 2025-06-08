import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface FileUploadProps {
  label: string;
  description: string;
  onFilesSelected: (files: File[]) => void;
  className?: string;
  value?: File | null;
  loading?: boolean;
  disabled?: boolean;
}

export function FileUpload({ 
  label, 
  description, 
  onFilesSelected, 
  className,
  value,
  loading = false,
  disabled = false
}: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || loading,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300",
          (disabled || loading) && "opacity-50 cursor-not-allowed",
          "hover:border-primary hover:bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : value ? (
          <div className="space-y-1">
            <p className="text-sm font-medium">{value.name}</p>
            <p className="text-xs text-gray-500">
              {Math.round(value.size / 1024)} KB
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
