
import { useState } from 'react';
import { Home, FileText, Truck, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingTourProps {
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingTour({ onNext, onSkip }: OnboardingTourProps) {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <Home className="h-8 w-8" />,
      title: "Dashboard",
      description: "Your income overview with key metrics like total earnings, revenue per mile, and performance trends at a glance.",
      highlights: ["Weekly/Monthly/Yearly views", "Revenue per mile calculation", "Net income tracking"]
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Statements",
      description: "Upload and manage your income statements. Our AI automatically extracts data and organizes it for easy tracking.",
      highlights: ["AI-powered data extraction", "Photo or file upload", "Statement history"]
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Loads",
      description: "Keep track of all your loads with pickup and delivery details, helping you analyze your most profitable routes.",
      highlights: ["Load details tracking", "Route analysis", "Search and filter"]
    },
    {
      icon: <User className="h-8 w-8" />,
      title: "Profile",
      description: "Manage your account settings, view your profile information, and access support when you need it.",
      highlights: ["Account management", "Contact support", "App settings"]
    }
  ];

  const nextFeature = () => {
    if (currentFeature < features.length - 1) {
      setCurrentFeature(currentFeature + 1);
    } else {
      onNext();
    }
  };

  const prevFeature = () => {
    if (currentFeature > 0) {
      setCurrentFeature(currentFeature - 1);
    }
  };

  const feature = features[currentFeature];

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">App Features</h1>
        <p className="text-muted-foreground">
          Let's take a quick tour of what you can do with TD Income.
        </p>
      </div>

      {/* Feature showcase */}
      <div className="bg-card rounded-lg border p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            {feature.icon}
          </div>
          <h2 className="text-xl font-semibold">{feature.title}</h2>
          <p className="text-muted-foreground text-sm">{feature.description}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm">Key Features:</h3>
          <ul className="space-y-1">
            {feature.highlights.map((highlight, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center space-x-2">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentFeature(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentFeature ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={prevFeature}
          disabled={currentFeature === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <button
          onClick={onSkip}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Skip tour
        </button>

        <Button
          size="sm"
          onClick={nextFeature}
        >
          {currentFeature === features.length - 1 ? 'Finish' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
