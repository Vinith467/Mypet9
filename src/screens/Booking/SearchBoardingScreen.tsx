import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const BoardingSearchScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { location?: string; dropoffDate?: string; pickupDate?: string; hasSearched?: boolean } | null;
  
  const [searchLocation, setSearchLocation] = useState(state?.location || '');

  return (
    <DashboardLayout>
      <div className="w-full h-full flex flex-col bg-[#F8F9FA] relative">
        
        {/* Sticky Header with Search */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100 pt-6 lg:pt-10 pb-4 px-5">
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex items-center mb-4">
              <button 
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors mr-3"
              >
                <ArrowLeft className="text-[#1B2B48]" size={24} />
              </button>
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 flex items-center shadow-inner">
                <Search className="text-gray-400 mr-2 shrink-0" size={18} />
                <input 
                  type="text" 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Search location..."
                  className="bg-transparent border-none outline-none w-full text-[15px] font-medium text-[#1B2B48]"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide py-1">
              <button className="flex items-center space-x-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-[13px] font-bold text-[#1B2B48] shrink-0">
                <span>Filters</span>
                <ChevronDown size={14} />
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-[13px] font-bold text-[#465E87] shrink-0 hover:bg-gray-50">
                Top Rated
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-[13px] font-bold text-[#465E87] shrink-0 hover:bg-gray-50">
                Home Boarding
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-[13px] font-bold text-[#465E87] shrink-0 hover:bg-gray-50">
                Under ₹1000
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative max-w-2xl mx-auto w-full">
          
          <div className="px-5 pt-6 pb-32 flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Search className="text-blue-500" size={40} />
            </div>
            <h2 className="text-[22px] font-extrabold text-[#1B2B48] mb-3 text-center">
              No Caretakers Available
            </h2>
            <p className="text-[#465E87] text-[15px] font-medium text-center max-w-sm mb-8">
              We are currently expanding our network. There are no registered caretakers in your area yet. Please check back soon!
            </p>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};