import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { motion } from 'framer-motion';
import { 
  ChevronLeft,
  ChevronRight,
  Settings,
  IndianRupee,
  Building2,
  Camera,
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CaretakerSettingsScreen = () => {
  const navigate = useNavigate();

  const settingsItems = [
    {
      icon: <IndianRupee size={24} className="text-[#1B2B48]" />,
      title: 'Price Settings',
      subtitle: 'Set boarding prices and manage additional service charges.',
      onClick: () => navigate('/caretaker/service-settings'),
      gradient: 'from-amber-50 to-yellow-50',
      iconBg: 'bg-amber-100',
    },
    {
      icon: <Building2 size={24} className="text-[#1B2B48]" />,
      title: 'Facility Settings',
      subtitle: 'Manage basic and additional facilities at your homestay.',
      onClick: () => navigate('/caretaker/facility-settings'),
      gradient: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-100',
    },
    {
      icon: <Camera size={24} className="text-[#1B2B48]" />,
      title: 'Photos & Videos',
      subtitle: 'Upload photos and videos of your homestay for pet parents.',
      onClick: () => navigate('/caretaker/photos-videos'),
      gradient: 'from-rose-50 to-pink-50',
      iconBg: 'bg-rose-100',
    },
    {
      icon: <MapPin size={24} className="text-[#1B2B48]" />,
      title: 'Pet Boarding Facility Address',
      subtitle: 'Set the address of your boarding facility so pet parents can find your location accurately.',
      onClick: () => navigate('/caretaker/address-location'),
      gradient: 'from-emerald-50 to-green-50',
      iconBg: 'bg-emerald-100',
    },
  ];

  return (
    <CaretakerLayout>
      <div className="w-full flex flex-col bg-[#FAFAFA] min-h-screen font-quicksand pb-40 lg:pb-12 text-[#1B2B48]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-[#FAFAFA]/95 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center -ml-2 text-[#1B2B48] hover:bg-black/5 rounded-full transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-xl font-extrabold tracking-tight">Settings</h1>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-5 lg:px-8 pt-6 w-full flex flex-col max-w-3xl mx-auto">
          
          {/* Hero Icon */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200/50 mb-4">
              <Settings size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#1B2B48] tracking-tight">Settings</h2>
            <p className="text-[#1B2B48]/60 text-sm font-medium mt-1">Configure your homestay preferences</p>
          </div>

          {/* Settings Menu */}
          <div className="flex flex-col space-y-3">
            {settingsItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={item.onClick}
                className={`bg-gradient-to-r ${item.gradient} rounded-[24px] p-5 flex items-center justify-between cursor-pointer shadow-[0_4px_20px_rgba(92,58,33,0.04)] border border-white/80 transition-all group hover:shadow-[0_8px_30px_rgba(92,58,33,0.08)]`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center border border-white shadow-inner group-hover:scale-105 transition-transform`}>
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[17px] lg:text-[19px] font-extrabold text-[#1B2B48] mb-0.5">
                      {item.title}
                    </h3>
                    <p className="text-[#1B2B48]/60 text-[11px] lg:text-[13px] font-medium leading-snug max-w-[220px] lg:max-w-none">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#1B2B48]/30 group-hover:text-[#1B2B48] group-hover:translate-x-1 transition-all">
                  <ChevronRight size={20} />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </CaretakerLayout>
  );
};
