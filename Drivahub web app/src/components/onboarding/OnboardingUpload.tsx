
import { Upload, FileText, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadStatementDialog } from '../UploadStatementDialog';

interface OnboardingUploadProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingUpload({ onComplete, onSkip }: OnboardingUploadProps) {
  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Upload Your First Statement</h1>
        <p className="text-muted-foreground">
          Get started by uploading a statement. Our AI will automatically extract the data and add it to your dashboard.
        </p>
      </div>

      {/* Upload options */}
      <div className="space-y-4">
        <div className="bg-card rounded-lg border p-4 space-y-4">
          <h3 className="font-semibold">How it works:</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <div>
                <p className="text-sm font-medium">Upload your statement</p>
                <p className="text-xs text-muted-foreground">Take a photo or select a file</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div>
                <p className="text-sm font-medium">AI processes your data</p>
                <p className="text-xs text-muted-foreground">Automatically extracts earnings and load information</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <div>
                <p className="text-sm font-medium">View your dashboard</p>
                <p className="text-xs text-muted-foreground">See your income metrics and performance</p>
              </div>
            </div>
          </div>
        </div>

        <UploadStatementDialog>
          <Button className="w-full h-12">
            <Camera className="mr-2 h-5 w-5" />
            Upload Your First Statement
          </Button>
        </UploadStatementDialog>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button onClick={onComplete} variant="outline" className="w-full">
          I'll upload later
        </Button>
        <button
          onClick={onSkip}
          className="w-full text-sm text-muted-foreground hover:text-foreground"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
