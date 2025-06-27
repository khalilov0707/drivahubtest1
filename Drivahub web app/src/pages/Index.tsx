
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Dashboard } from '@/components/Dashboard';
import { Loads } from '@/components/Loads';
import { Statements } from '@/components/Statements';
import { Profile } from '@/components/Profile';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-md mx-auto bg-background min-h-screen">
          <div className="pb-20">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/loads" element={<Loads />} />
              <Route path="/statements" element={<Statements />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
          <BottomNavigation />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
