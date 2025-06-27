
import { ArrowLeft, Edit, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';

export function Profile() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { profile, signOut } = useAuth();

  const profileData = {
    name: profile?.driver_name || 'Driver',
    phone: profile?.phone || 'No phone number',
    company: profile?.company_name || 'No company',
    avatar: profile?.driver_name?.charAt(0)?.toUpperCase() || 'D'
  };

  const menuItems = [
    { label: 'My Details', hasArrow: true },
    { label: 'Contact Support', hasArrow: true },
    { label: 'FAQ', hasArrow: true },
    { label: 'Terms & Privacy', hasArrow: true },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-muted rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <span className="text-xl font-semibold">Profile</span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex items-center justify-between bg-card p-4 rounded-lg border">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-lg">{profileData.avatar}</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">{profileData.name}</h2>
            <p className="text-sm text-muted-foreground">{profileData.phone}</p>
            {profileData.company !== 'No company' && (
              <p className="text-xs text-muted-foreground">{profileData.company}</p>
            )}
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-lg">
          <Edit size={18} />
        </button>
      </div>

      {/* Account Section */}
      <div className="space-y-4">
        <h3 className="font-semibold">Account</h3>
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-3 bg-card rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <span>{item.label}</span>
              {item.hasArrow && <ChevronRight size={18} className="text-muted-foreground" />}
            </button>
          ))}
        </div>
      </div>

      {/* App Settings */}
      <div className="space-y-4">
        <h3 className="font-semibold">App Settings</h3>
        <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
          <span>Dark Mode</span>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
          />
        </div>
      </div>

      {/* Logout */}
      <div className="space-y-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-3 bg-card rounded-lg border hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <span>Logout</span>
          <LogOut size={18} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
