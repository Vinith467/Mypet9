import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Wallet, CalendarClock, TrendingUp, Bell } from 'lucide-react';
import { useState } from 'react';

export const CaretakerDashboardScreen = () => {
  const { userData } = useAuth();
  const [isOnline, setIsOnline] = useState(false);

  return (
    <CaretakerLayout>
      <div className="w-full flex flex-col pt-6 lg:pt-10 space-y-8 px-4 lg:px-0 pb-20">
        
        {/* Header & Status Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1B2B48] tracking-tight">
              Dashboard
            </h1>
            <p className="text-[#465E87] text-sm lg:text-base font-medium mt-1">
              Welcome back, {userData?.name || 'Partner'}!
            </p>
          </div>
          
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
              isOnline 
                ? 'bg-[#174F38]/10 border-[#174F38] text-[#174F38]' 
                : 'bg-gray-100 border-gray-200 text-gray-500'
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-[#174F38]' : 'bg-gray-400'}`} />
            <span className="font-bold text-sm">{isOnline ? 'Accepting Requests' : 'Offline'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col"
          >
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <Wallet className="text-green-600" size={20} />
            </div>
            <span className="text-[#465E87] text-xs font-bold uppercase tracking-wider mb-1">This Month</span>
            <span className="text-2xl font-black text-[#1B2B48]">₹12,400</span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-col"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <CalendarClock className="text-blue-600" size={20} />
            </div>
            <span className="text-[#465E87] text-xs font-bold uppercase tracking-wider mb-1">Active Boardings</span>
            <span className="text-2xl font-black text-[#1B2B48]">2</span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="hidden md:flex bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex-col"
          >
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-4">
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <span className="text-[#465E87] text-xs font-bold uppercase tracking-wider mb-1">Profile Views</span>
            <span className="text-2xl font-black text-[#1B2B48]">48</span>
          </motion.div>
        </div>

        {/* Incoming Requests Placeholder */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#1B2B48]">Pending Requests</h2>
            <button className="text-[#174F38] text-sm font-bold hover:underline">View All</button>
          </div>

          <div className="bg-white border-2 border-dashed border-gray-200 rounded-[32px] p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="text-gray-400" size={28} />
            </div>
            <h3 className="text-lg font-bold text-[#1B2B48] mb-1">No new requests</h3>
            <p className="text-[#465E87] text-sm max-w-sm">
              When pet parents in your area request your services, they will appear here.
            </p>
          </div>
        </div>

      </div>
    </CaretakerLayout>
  );
};
