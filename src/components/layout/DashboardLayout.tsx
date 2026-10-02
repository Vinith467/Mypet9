import { type ReactNode } from 'react';
import { Navigation } from './Navigation';
import { TopNavbar } from './TopNavbar';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8F9FA] text-[#1B2B48] overflow-hidden">
      
      {/* Universal Top Navbar */}
      <TopNavbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <main className={`flex-1 overflow-y-auto scrollbar-hide ${user ? 'pb-24 md:pb-0' : ''}`}>
          <div className="w-full h-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        {user && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
            <Navigation />
          </div>
        )}
      </div>
      
    </div>
  );
};
