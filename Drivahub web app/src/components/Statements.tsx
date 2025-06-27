
import { useState } from 'react';
import { ArrowLeft, Plus, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { UploadStatementDialog } from './UploadStatementDialog';

export function Statements() {
  const navigate = useNavigate();
  const { statements, loading } = useApp();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <span className="text-xl font-semibold">Statements</span>
          </div>
        </div>
        
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading statements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-muted rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <span className="text-xl font-semibold">Statements</span>
        </div>
        <UploadStatementDialog>
          <button className="p-2 hover:bg-muted rounded-lg">
            <Plus size={20} />
          </button>
        </UploadStatementDialog>
      </div>

      {/* Statements List */}
      <div className="space-y-3">
        {statements.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No statements uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Upload your first statement to start tracking your income
            </p>
          </div>
        ) : (
          statements.map((statement) => (
            <div key={statement.id} className="bg-card p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">$</span>
                  </div>
                  <div>
                    <p className="font-semibold">{formatDate(statement.date)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(statement.amount)} · {statement.miles.toLocaleString()} Miles
                      {statement.deadheadMiles && ` · ${statement.deadheadMiles.toLocaleString()} Deadhead`}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-muted rounded-lg">
                  <Copy size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload New Statement Button */}
      <UploadStatementDialog>
        <button className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Upload New Statement
        </button>
      </UploadStatementDialog>
    </div>
  );
}
