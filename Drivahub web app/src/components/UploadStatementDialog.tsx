import { useState } from 'react';
import { Upload, Loader, Camera, Image, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface UploadStatementDialogProps {
  children: React.ReactNode;
}

export function UploadStatementDialog({ children }: UploadStatementDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { addStatement, addLoad } = useApp();
  const isMobile = useIsMobile();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const triggerFileInput = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    console.log("Starting file upload process...");

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log("Sending file to webhook:", file.name);
      
      const response = await fetch('https://hook.us2.make.com/vn9tbd814uu91txpff3k1q2gujfrhv9g', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received response from webhook:", data);

      // Parse the webhook response format
      let parsedData = null;
      
      if (Array.isArray(data) && data.length > 0) {
        // Handle the array format with result property
        const resultString = data[0].result || data[0].choices?.[0]?.message?.content;
        if (resultString) {
          try {
            parsedData = JSON.parse(resultString);
          } catch (parseError) {
            console.error("Error parsing result string:", parseError);
            throw new Error("Failed to parse webhook response");
          }
        }
      } else if (data.weeklyPerformance || data.loads) {
        // Direct format
        parsedData = data;
      }

      if (!parsedData) {
        throw new Error("No valid data found in webhook response");
      }

      console.log("Parsed data:", parsedData);

      // Add statement from weeklyPerformance data
      if (parsedData.weeklyPerformance) {
        const performance = parsedData.weeklyPerformance;
        addStatement({
          date: performance.date || new Date().toISOString().split('T')[0],
          amount: performance.totalEarnings || 0,
          miles: performance.totalMilesDriven || 0,
          deadheadMiles: performance.deadheadMiles || 0,
          type: 'regular',
        });
      }

      // Add loads from loads array
      if (parsedData.loads && Array.isArray(parsedData.loads)) {
        parsedData.loads.forEach((load: any) => {
          addLoad({
            pickup: load.pickupLocation || 'Unknown',
            dropoff: load.dropoffLocation || 'Unknown',
            amount: load.price || 0,
            date: parsedData.weeklyPerformance?.date || new Date().toISOString().split('T')[0],
            miles: 0, // Miles per load not provided in the response format
          });
        });
      }

      toast({
        title: "Success",
        description: "Statement uploaded and processed successfully!",
      });

      // Reset form
      setFile(null);
      setIsOpen(false);
      
      // Reset file inputs
      const fileInputs = ['camera-input', 'gallery-input', 'file-input'];
      fileInputs.forEach(inputId => {
        const fileInput = document.getElementById(inputId) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      });

    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error",
        description: "Failed to process the statement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Statement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {isMobile ? (
              // Mobile: Show three distinct options
              <div className="space-y-3">
                <p className="text-sm font-medium text-center mb-4">Choose how to upload your statement:</p>
                
                {/* Take Photo */}
                <button
                  type="button"
                  onClick={() => triggerFileInput('camera-input')}
                  disabled={isProcessing}
                  className="w-full p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors flex items-center space-x-3"
                >
                  <Camera className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Take Photo</p>
                    <p className="text-sm text-muted-foreground">Use camera to capture statement</p>
                  </div>
                </button>
                
                {/* Choose from Gallery */}
                <button
                  type="button"
                  onClick={() => triggerFileInput('gallery-input')}
                  disabled={isProcessing}
                  className="w-full p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors flex items-center space-x-3"
                >
                  <Image className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Choose from Gallery</p>
                    <p className="text-sm text-muted-foreground">Select from photo gallery</p>
                  </div>
                </button>
                
                {/* Browse Files */}
                <button
                  type="button"
                  onClick={() => triggerFileInput('file-input')}
                  disabled={isProcessing}
                  className="w-full p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors flex items-center space-x-3"
                >
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Browse Files</p>
                    <p className="text-sm text-muted-foreground">Select PDF or image file</p>
                  </div>
                </button>

                {/* Hidden file inputs */}
                <input
                  id="camera-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isProcessing}
                />
                <input
                  id="gallery-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isProcessing}
                />
                <input
                  id="file-input"
                  type="file"
                  accept="*/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isProcessing}
                />
              </div>
            ) : (
              // Desktop: Show traditional upload area
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Upload your statement file</p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, PNG, JPG, JPEG
                  </p>
                </div>
                <input
                  id="desktop-file-upload"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,image/*,application/pdf"
                  onChange={handleFileChange}
                  className="mt-4 text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  disabled={isProcessing}
                />
              </div>
            )}
            
            {file && (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium">Selected file:</p>
                <p className="text-sm text-muted-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!file || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
