import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { OfflineBookingSection } from '../../components/landing/OfflineBookingSection';

export const DirectlyReachUsScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-100 bg-white sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[18px] font-extrabold text-[#1B2B48] ml-4">
          Directly Reach Us
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 w-full bg-[#FAF9F5] pb-8 md:py-8">
        <div className="max-w-3xl mx-auto px-0 md:px-6">
          <img 
            src="/mobile ui/9.png" 
            alt="Directly Reach Us" 
            className="w-full h-auto mb-6 md:hidden"
          />
          
          {/* Offline Booking Form */}
          <div className="bg-white md:rounded-[24px] md:shadow-xl overflow-hidden border-t md:border border-gray-100">
            <OfflineBookingSection />
          </div>
        </div>
      </div>
    </div>
  );
};
