import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const MyBookingsScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#F8F9FA] pb-24 lg:pb-12 pt-8 lg:pt-12 px-5">
        
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors mr-3 lg:hidden"
            >
              <ArrowLeft className="text-[#1B2B48]" size={24} />
            </button>
            <h1 className="text-[22px] font-extrabold text-[#1B2B48]">My Bookings</h1>
          </div>

          {/* Tabs */}
          <div className="flex bg-white rounded-[12px] p-1 shadow-sm border border-gray-100 mb-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2.5 rounded-[10px] text-[15px] font-bold transition-colors ${
                activeTab === 'upcoming' 
                  ? 'bg-petoo-primary text-white shadow-md' 
                  : 'text-[#465E87] hover:bg-gray-50'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2.5 rounded-[10px] text-[15px] font-bold transition-colors ${
                activeTab === 'past' 
                  ? 'bg-petoo-primary text-white shadow-md' 
                  : 'text-[#465E87] hover:bg-gray-50'
              }`}
            >
              Past
            </button>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar size={32} className="text-gray-300" />
            </div>
            <h3 className="text-[18px] font-extrabold text-[#1B2B48] mb-2">
              No {activeTab} bookings
            </h3>
            <p className="text-[#465E87] text-[14px] font-medium max-w-[280px]">
              When you book a stay for your pet, it will appear here.
            </p>
            {activeTab === 'upcoming' && (
              <button 
                onClick={() => navigate('/select-pet')}
                className="mt-6 bg-petoo-primary text-white px-6 py-3 rounded-full font-bold text-[15px] shadow-lg shadow-petoo-primary/20 hover:bg-[#113a29] transition-colors"
              >
                Book a Stay
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
