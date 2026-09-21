import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  PawPrint, 
  ChevronLeft,
  CalendarDays,
  Clock,
  Settings,
  Image as ImageIcon,
  ChevronRight,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomeStayDashboardScreen = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const firstName = userData?.name ? userData.name.split(' ')[0] : 'Partner';

  const menuItems = [
    {
      icon: <CalendarDays size={24} className="text-[#5C3A21]" />,
      title: 'Bookings',
      subtitle: 'View and manage your upcoming, ongoing and completed bookings.',
      onClick: () => navigate('/caretaker/bookings')
    },
    {
      icon: <Clock size={24} className="text-[#5C3A21]" />,
      title: 'Availability',
      subtitle: 'Set your availability and block dates.',
      onClick: () => navigate('/caretaker/availability')
    },
    {
      icon: <Settings size={24} className="text-[#5C3A21]" />,
      title: 'Service Settings',
      subtitle: 'Manage pricing, service details and preferences.',
      onClick: () => navigate('/caretaker/service-settings')
    },
    {
      icon: <ImageIcon size={24} className="text-[#5C3A21]" />,
      title: 'Photos & Facility',
      subtitle: 'Update your home photos and facilities.',
      onClick: () => navigate('/caretaker/facility')
    }
  ];

  return (
    <CaretakerLayout>
      <div className="w-full flex flex-col bg-[#FDF8F3] min-h-screen font-quicksand pb-40 lg:pb-12 text-[#3E2723]">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-[#FDF8F3]/95 backdrop-blur-md z-50">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center -ml-2 text-[#5C3A21]"
          >
            <ChevronLeft size={28} />
          </button>
          
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center space-x-1.5">
              <PawPrint size={22} className="text-[#A26D45]" fill="currentColor" />
              <h1 className="text-xl font-extrabold tracking-tight text-[#3E2723]">
                Mypet<span className="text-[#A26D45]">9</span>
              </h1>
            </div>
            <span className="text-[10px] font-bold text-[#A26D45] uppercase tracking-wider -mt-1 ml-[30px]">Partner</span>
          </div>

          <div className="relative">
            <img 
              src={user?.photoURL || "https://ui-avatars.com/api/?name=" + firstName + "&background=E5E7EB&color=3E2723"} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-5 lg:px-12 lg:pt-10 w-full flex flex-col max-w-5xl mx-auto">
          
          {/* Desktop Top Nav */}
          <div className="hidden lg:flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-[#FFF9F2] transition-colors"
              >
                <ChevronLeft size={24} className="text-[#5C3A21]" />
              </button>
              <h2 className="text-3xl font-extrabold text-[#3E2723] tracking-tight">Home Stay</h2>
            </div>
             
             <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-white">
                <div className="text-right">
                  <p className="font-bold text-[14px] text-[#3E2723]">{userData?.name || 'Partner'}</p>
                  <p className="text-[10px] text-green-600 font-bold flex items-center justify-end uppercase tracking-wider">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                    Online
                  </p>
                </div>
                <img 
                  src={user?.photoURL || "https://ui-avatars.com/api/?name=" + firstName + "&background=E5E7EB&color=3E2723"} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
              </div>
          </div>

          {/* Hero Banner */}
          <div className="relative w-full h-[180px] lg:h-[240px] rounded-[32px] overflow-hidden shadow-[0_10px_40px_rgba(92,58,33,0.08)] mb-8 lg:mb-12 bg-[#FFF9F2] flex flex-row">
            
            {/* Content Side */}
            <div className="relative z-10 p-5 lg:p-10 flex flex-col justify-center w-[55%] lg:w-[45%] h-full shrink-0">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-[#4A2E1B] rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 lg:mb-4 shadow-[0_8px_20px_rgba(74,46,27,0.2)] shrink-0">
                <Home size={20} className="text-white lg:w-6 lg:h-6" />
              </div>
              <h2 className="text-[20px] lg:text-[32px] font-extrabold text-[#3E2723] leading-[1.1] mb-2 tracking-tight">
                Home Stay /<br/>Boarding
              </h2>
              <p className="text-[#5C3A21]/80 text-[10px] lg:text-sm font-medium leading-snug">
                Provide a safe, loving home for pets while their parents are away.
              </p>
            </div>

            {/* Image Side */}
            <div className="absolute inset-y-0 right-0 w-[55%] lg:w-[65%] z-0">
                <img 
                  src="/assets/homestay_banner.jpg" 
                  alt="Pets" 
                  className="w-full h-full object-cover object-left lg:object-right"
                />
                {/* Gradient to smoothly blend the image left edge into the background */}
                <div className="absolute inset-y-0 left-0 w-12 lg:w-32 bg-gradient-to-r from-[#FFF9F2] via-[#FFF9F2]/80 to-transparent"></div>
            </div>
          </div>

          {/* Menu List */}
          <div className="flex flex-col space-y-3 lg:space-y-4 mb-10">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01, backgroundColor: '#ffffff' }}
                whileTap={{ scale: 0.99 }}
                onClick={item.onClick}
                className="bg-white/80 lg:bg-white rounded-[24px] lg:rounded-[32px] p-4 lg:p-6 flex items-center justify-between cursor-pointer shadow-[0_4px_20px_rgba(92,58,33,0.03)] border border-white transition-all group"
              >
                <div className="flex items-center space-x-4 lg:space-x-6">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-[#FFF9F2] flex items-center justify-center border border-[#8D5B3A]/10 shadow-inner group-hover:bg-[#8D5B3A]/5 transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex flex-col max-w-[200px] lg:max-w-none">
                    <h3 className="text-[17px] lg:text-xl font-extrabold text-[#3E2723] mb-0.5 lg:mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[#5C3A21]/70 text-[11px] lg:text-[13px] font-medium leading-snug">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#5C3A21]/40 group-hover:text-[#5C3A21] group-hover:translate-x-1 transition-all">
                  <ChevronRight size={20} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Illustration Space */}
          <div className="mt-auto mb-10 relative h-[120px] lg:h-[180px] rounded-[32px] bg-transparent flex items-end justify-center">
             <div className="absolute inset-0 flex flex-col items-center justify-center opacity-60">
                <span className="font-caveat text-2xl lg:text-3xl font-bold text-[#8D5B3A] rotate-[-5deg]">
                  Happy Pets
                </span>
                <span className="font-caveat text-xl lg:text-2xl font-bold text-[#8D5B3A] rotate-[-5deg] ml-8">
                  Happier Business ♥
                </span>
             </div>
          </div>
          
        </div>
      </div>
    </CaretakerLayout>
  );
};
