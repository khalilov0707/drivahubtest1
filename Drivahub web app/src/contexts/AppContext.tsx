
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Statement {
  id: string;
  date: string;
  amount: number;
  miles: number;
  deadheadMiles?: number;
  type: 'regular' | 'deadhead';
}

export interface Load {
  id: string;
  pickup: string;
  dropoff: string;
  amount: number;
  date: string;
  miles: number;
}

export interface DashboardStats {
  totalEarnings: number;
  netIncome: number;
  rpm: number;
  rpmChange: number;
  totalMiles: number;
  deadheadMiles: number;
}

interface AppContextType {
  statements: Statement[];
  loads: Load[];
  loading: boolean;
  addStatement: (statement: Omit<Statement, 'id'>) => Promise<void>;
  addLoad: (load: Omit<Load, 'id'>) => Promise<void>;
  getDashboardStats: (period: 'Weekly' | 'Monthly' | 'Yearly') => DashboardStats;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch statements from Supabase
  const fetchStatements = async () => {
    if (!user) {
      console.log('No user found, skipping statements fetch');
      return;
    }

    try {
      console.log('Fetching statements for user:', user.id);
      const { data, error } = await supabase
        .from('statements')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase error fetching statements:', error);
        throw error;
      }

      console.log('Fetched statements:', data);

      const mappedStatements: Statement[] = (data || []).map(stmt => ({
        id: stmt.id,
        date: stmt.date,
        amount: Number(stmt.amount),
        miles: stmt.miles,
        deadheadMiles: stmt.deadhead_miles || undefined,
        type: stmt.type as 'regular' | 'deadhead',
      }));

      setStatements(mappedStatements);
      console.log('Set statements in state:', mappedStatements);
    } catch (error) {
      console.error('Error fetching statements:', error);
      toast({
        title: "Error",
        description: "Failed to load statements",
        variant: "destructive",
      });
    }
  };

  // Fetch loads from Supabase
  const fetchLoads = async () => {
    if (!user) {
      console.log('No user found, skipping loads fetch');
      return;
    }

    try {
      console.log('Fetching loads for user:', user.id);
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase error fetching loads:', error);
        throw error;
      }

      console.log('Fetched loads:', data);

      const mappedLoads: Load[] = (data || []).map(load => ({
        id: load.id,
        pickup: load.pickup,
        dropoff: load.dropoff,
        amount: Number(load.amount),
        date: load.date,
        miles: load.miles,
      }));

      setLoads(mappedLoads);
      console.log('Set loads in state:', mappedLoads);
    } catch (error) {
      console.error('Error fetching loads:', error);
      toast({
        title: "Error",
        description: "Failed to load loads",
        variant: "destructive",
      });
    }
  };

  // Refresh all data
  const refreshData = async () => {
    if (!user) {
      console.log('No user, clearing data and stopping loading');
      setStatements([]);
      setLoads([]);
      setLoading(false);
      return;
    }
    
    console.log('Refreshing data for user:', user.id);
    setLoading(true);
    try {
      await Promise.all([fetchStatements(), fetchLoads()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    console.log('User changed in AppContext:', user?.id || 'No user');
    refreshData();
  }, [user]);

  const addStatement = async (statement: Omit<Statement, 'id'>) => {
    if (!user) {
      console.error('Cannot add statement: no user logged in');
      return;
    }

    try {
      console.log('Adding statement:', statement);
      const { data, error } = await supabase
        .from('statements')
        .insert({
          user_id: user.id,
          date: statement.date,
          amount: statement.amount,
          miles: statement.miles,
          deadhead_miles: statement.deadheadMiles || null,
          type: statement.type,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding statement:', error);
        throw error;
      }

      console.log('Statement added to database:', data);

      const newStatement: Statement = {
        id: data.id,
        date: data.date,
        amount: Number(data.amount),
        miles: data.miles,
        deadheadMiles: data.deadhead_miles || undefined,
        type: data.type as 'regular' | 'deadhead',
      };

      setStatements(prev => {
        const updated = [newStatement, ...prev];
        console.log('Updated statements state:', updated);
        return updated;
      });
      
      toast({
        title: "Success",
        description: "Statement added successfully",
      });
    } catch (error) {
      console.error('Error adding statement:', error);
      toast({
        title: "Error",
        description: "Failed to add statement",
        variant: "destructive",
      });
    }
  };

  const addLoad = async (load: Omit<Load, 'id'>) => {
    if (!user) {
      console.error('Cannot add load: no user logged in');
      return;
    }

    try {
      console.log('Adding load:', load);
      const { data, error } = await supabase
        .from('loads')
        .insert({
          user_id: user.id,
          pickup: load.pickup,
          dropoff: load.dropoff,
          amount: load.amount,
          date: load.date,
          miles: load.miles,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding load:', error);
        throw error;
      }

      console.log('Load added to database:', data);

      const newLoad: Load = {
        id: data.id,
        pickup: data.pickup,
        dropoff: data.dropoff,
        amount: Number(data.amount),
        date: data.date,
        miles: data.miles,
      };

      setLoads(prev => {
        const updated = [newLoad, ...prev];
        console.log('Updated loads state:', updated);
        return updated;
      });
      
      toast({
        title: "Success",
        description: "Load added successfully",
      });
    } catch (error) {
      console.error('Error adding load:', error);
      toast({
        title: "Error",
        description: "Failed to add load",
        variant: "destructive",
      });
    }
  };

  const getDashboardStats = (period: 'Weekly' | 'Monthly' | 'Yearly'): DashboardStats => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'Weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'Monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'Yearly':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    const filteredStatements = statements.filter(statement => {
      const statementDate = new Date(statement.date);
      return statementDate >= startDate;
    });

    const totalEarnings = filteredStatements.reduce((sum, statement) => sum + statement.amount, 0);
    const totalMiles = filteredStatements.reduce((sum, statement) => sum + statement.miles, 0);
    const deadheadMiles = filteredStatements.reduce((sum, statement) => sum + (statement.deadheadMiles || 0), 0);
    
    // Calculate net income (assuming 20% expenses)
    const netIncome = totalEarnings * 0.8;
    
    // Calculate RPM (Revenue Per Mile)
    const rpm = totalMiles > 0 ? totalEarnings / totalMiles : 0;
    
    // Calculate RPM change (simplified - comparing to previous period)
    const rpmChange = 10; // Placeholder for now

    return {
      totalEarnings,
      netIncome,
      rpm,
      rpmChange,
      totalMiles,
      deadheadMiles,
    };
  };

  const value = {
    statements,
    loads,
    loading,
    addStatement,
    addLoad,
    getDashboardStats,
    refreshData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
