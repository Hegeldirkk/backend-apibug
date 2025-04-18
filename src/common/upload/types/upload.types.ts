export interface FileValidationResult {
    isValid: boolean;
    error?: string;
  }
  
  export interface FileUploadResult {
    success: boolean;
    filePath?: string;
    error?: string;
  }
  