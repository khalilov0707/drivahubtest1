
import { useState } from 'react';
import { TrendingUp, Upload } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { UploadStatementDialog } from './UploadStatementDialog';

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly');
  const { getDashboardStats, loading } = useApp();

  const periods: ('Weekly' | 'Monthly' | 'Yearly')[] = ['Weekly', 'Monthly', 'Yearly'];

  const stats = getDashboardStats(selectedPeriod);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRPM = (rpm: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rpm);
  };

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold">TD</span>
            </div>
            <span className="text-xl font-semibold">TD incom</span>
          </div>
        </div>
        
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-semibold">TD</span>
          </div>
          <span className="text-xl font-semibold">TD incom</span>
        </div>
      </div>

      {/* Period Selection */}
      <div className="flex space-x-2 bg-muted p-1 rounded-lg">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedPeriod === period
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Performance Header */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{selectedPeriod} Performance</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Total Earnings</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Net Income</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.netIncome)}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">RPM</p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold">{formatRPM(stats.rpm)}</p>
              <div className="flex items-center">
                <TrendingUp size={16} className="text-green-500" />
              </div>
            </div>
            <p className="text-sm text-green-500 font-medium">+{stats.rpmChange}%</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Total Miles Driven</p>
            <p className="text-2xl font-bold">{stats.totalMiles.toLocaleString()}</p>
          </div>
        </div>

        {/* Deadhead Miles */}
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">Deadhead Miles</p>
          <p className="text-3xl font-bold">{stats.deadheadMiles.toLocaleString()}</p>
        </div>

        {/* Upload Statement Button */}
        <UploadStatementDialog>
          <button className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors">
            <Upload size={20} />
            <span>Upload Statement</span>
          </button>
        </UploadStatementDialog>
      </div>
    </div>
  );
}
