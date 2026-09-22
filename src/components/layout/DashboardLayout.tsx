import { type ReactNode } from 'react';
import { Navigation } from './Navigation';

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen w-full bg-[#FBF6EE] text-[#1B2B48] overflow-hidden">
      
      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:flex w-64 h-full border-r border-[#1B2B48]/5 bg-[#FBF6EE]">
        <Navigation />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-24 lg:pb-8">
          <div className="max-w-4xl mx-auto w-full h-full lg:px-8">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
          <div className="absolute inset-0 bg-gradient-to-t from-[#FBF6EE] via-[#FBF6EE]/90 to-transparent -top-6 pointer-events-none" />
          <Navigation />
        </div>
      </div>
      
    </div>
  );
};
