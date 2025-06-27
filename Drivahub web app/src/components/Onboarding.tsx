
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingWelcome } from './onboarding/OnboardingWelcome';
import { OnboardingProfile } from './onboarding/OnboardingProfile';
import { OnboardingTour } from './onboarding/OnboardingTour';
import { OnboardingUpload } from './onboarding/OnboardingUpload';

export function Onboarding() {
  const { profile, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (profile?.onboarding_step) {
      setCurrentStep(profile.onboarding_step);
    }
  }, [profile]);

  const nextStep = async () => {
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    await updateProfile({ onboarding_step: newStep });
  };

  const completeOnboarding = async () => {
    await updateProfile({ 
      onboarding_completed: true, 
      onboarding_step: 4 
    });
  };

  const skipToEnd = async () => {
    await updateProfile({ 
      onboarding_completed: true, 
      onboarding_step: 4 
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingWelcome onNext={nextStep} onSkip={skipToEnd} />;
      case 2:
        return <OnboardingProfile onNext={nextStep} onSkip={skipToEnd} />;
      case 3:
        return <OnboardingTour onNext={nextStep} onSkip={skipToEnd} />;
      case 4:
        return <OnboardingUpload onComplete={completeOnboarding} onSkip={completeOnboarding} />;
      default:
        return <OnboardingWelcome onNext={nextStep} onSkip={skipToEnd} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Getting Started</span>
            <span className="text-sm text-muted-foreground">{currentStep}/4</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20">
        {renderStep()}
      </div>
    </div>
  );
}
