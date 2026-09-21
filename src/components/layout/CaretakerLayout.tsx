import { type ReactNode, useState, useEffect } from 'react';
import { CaretakerNavigation } from './CaretakerNavigation';
import { GlobalRequestModal } from '../caretaker/GlobalRequestModal';

export const CaretakerLayout = ({ children }: { children: ReactNode }) => {
  const [showGlobalModal, setShowGlobalModal] = useState(false);

  // Simulate a new request popping up like Rapido Captain
  // This will happen on whatever page the caretaker is on
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGlobalModal(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex h-screen w-full bg-[#FBF6EE] text-[#1B2B48] overflow-hidden">
      
      {/* Desktop Sidebar Navigation */}
      <div className="hidden lg:flex w-64 h-full border-r border-[#1B2B48]/5 bg-[#FBF6EE]">
        <CaretakerNavigation />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-24 lg:pb-8">
          <div className="w-full h-full lg:px-8 mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
          <div className="absolute inset-0 bg-gradient-to-t from-[#FBF6EE] via-[#FBF6EE]/90 to-transparent -top-6 pointer-events-none" />
          <CaretakerNavigation />
        </div>
      </div>
      
      {/* Global Request Modal */}
      <GlobalRequestModal 
        isOpen={showGlobalModal} 
        onClose={() => setShowGlobalModal(false)} 
      />
    </div>
  );
};
