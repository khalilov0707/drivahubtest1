
import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

export function Loads() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { loads, loading } = useApp();

  const filteredLoads = loads.filter(load =>
    load.id.includes(searchQuery) ||
    load.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
    load.dropoff.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-muted rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <span className="text-xl font-semibold">Loads</span>
          </div>
        </div>
        
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading loads...</p>
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
          <span className="text-xl font-semibold">Loads</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search by load number, location, or date"
          className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border-0 focus:ring-2 focus:ring-primary focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loads List */}
      <div className="space-y-3">
        {filteredLoads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchQuery ? 'No loads found matching your search' : 'No loads available'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {!searchQuery && 'Loads will appear here when you add them'}
            </p>
          </div>
        ) : (
          filteredLoads.map((load) => (
            <div key={load.id} className="bg-card p-4 rounded-lg border">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold">Load #{load.id.slice(0, 8)}</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>Pickup: {load.pickup}</p>
                    <p>Dropoff: {load.dropoff}</p>
                    <p>Miles: {load.miles.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{formatCurrency(load.amount)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
