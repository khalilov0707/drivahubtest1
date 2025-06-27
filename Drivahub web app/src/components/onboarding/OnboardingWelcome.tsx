
import { Truck, DollarSign, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingWelcomeProps {
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingWelcome({ onNext, onSkip }: OnboardingWelcomeProps) {
  const features = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Track Your Earnings",
      description: "Automatically calculate revenue per mile and net income"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Upload Statements",
      description: "Easy statement processing with AI-powered data extraction"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Manage Loads",
      description: "Keep track of all your loads and delivery details"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analyze Performance",
      description: "Get insights into your weekly, monthly, and yearly performance"
    }
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
          <Truck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Welcome to TD Income</h1>
        <p className="text-muted-foreground">
          The complete solution for tracking your trucking income and managing your business finances.
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-card rounded-lg border">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button onClick={onNext} className="w-full">
          Get Started
        </Button>
        <button
          onClick={onSkip}
          className="w-full text-sm text-muted-foreground hover:text-foreground"
        >
          Skip setup
        </button>
      </div>
    </div>
  );
}
