import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavbar } from '../../components/layout/TopNavbar';
import { OfflineBookingSection } from '../../components/landing/OfflineBookingSection';

export const DirectlyReachUsScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden relative">
      <TopNavbar currentLocationStr="" showBackButton={true} />
      
      <main className="w-full relative">
        <OfflineBookingSection />
      </main>
    </div>
  );
};
