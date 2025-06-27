
import { useState } from 'react';
import { User, Building, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface OnboardingProfileProps {
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingProfile({ onNext, onSkip }: OnboardingProfileProps) {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    driver_name: profile?.driver_name || '',
    company_name: profile?.company_name || '',
    phone: profile?.phone || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      onNext();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Set Up Your Profile</h1>
        <p className="text-muted-foreground">
          Tell us a bit about yourself to personalize your experience.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Your name"
              value={formData.driver_name}
              onChange={(e) => setFormData(prev => ({ ...prev, driver_name: e.target.value }))}
              className="pl-10"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Company name (optional)"
              value={formData.company_name}
              onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              className="pl-10"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="Phone number (optional)"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Button type="submit" className="w-full" disabled={loading || !formData.driver_name}>
            {loading ? 'Saving...' : 'Continue'}
          </Button>
          <button
            type="button"
            onClick={onSkip}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
            disabled={loading}
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  );
}
