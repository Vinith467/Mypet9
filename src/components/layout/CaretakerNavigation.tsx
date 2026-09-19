import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Calendar, User, PawPrint } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const CaretakerNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/caretaker/dashboard', icon: Home },
    { label: 'Requests', path: '/caretaker/requests', icon: ClipboardList },
    { label: 'Schedule', path: '/caretaker/schedule', icon: Calendar },
    { label: 'Profile', path: '/caretaker/profile', icon: User },
  ];

  return (
    <nav className="fixed lg:sticky lg:top-0 bottom-0 left-0 right-0 lg:right-auto w-full lg:w-[280px] lg:h-screen bg-[#FBF6EE] lg:bg-transparent z-50 flex lg:flex-col lg:px-6 lg:py-10 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.08)] lg:shadow-none border-t lg:border-t-0 border-[#1B2B48]/5">
      
      {/* Desktop Logo */}
      <div className="hidden lg:flex items-center space-x-3 mb-12 px-6 cursor-pointer group" onClick={() => navigate('/caretaker/dashboard')}>
        <div className="bg-[#174F38] rounded-2xl p-2.5 shadow-lg shadow-[#174F38]/20 group-hover:scale-105 transition-transform">
          <PawPrint size={24} className="text-white" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-extrabold text-[#1B2B48] tracking-tight leading-none" style={{ fontFamily: 'serif' }}>
            Mypet9
          </h2>
          <span className="text-xs font-bold text-[#174F38] tracking-widest uppercase mt-0.5">Partner</span>
        </div>
      </div>

      <div className="flex lg:flex-col w-full justify-around lg:justify-start lg:space-y-2 px-2 lg:px-4 py-3 lg:py-0 pb-safe relative">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex flex-col lg:flex-row items-center lg:justify-start lg:space-x-4 py-1.5 lg:py-4 px-3 lg:px-5 rounded-[20px] transition-all outline-none group w-full",
                isActive 
                  ? "text-[#174F38]" 
                  : "text-gray-400 hover:text-gray-900"
              )}
            >
              {/* Desktop Active Background Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="caretakerNav"
                  className="hidden lg:block absolute inset-0 bg-white shadow-sm border border-gray-100/50 rounded-[20px] z-0"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              <Icon 
                size={24} 
                className={cn(
                  "mb-1 lg:mb-0 transition-all z-10", 
                  isActive && "scale-110 lg:scale-100",
                  isActive ? "stroke-[2.5px]" : "stroke-[2px] group-hover:scale-110 lg:group-hover:scale-100"
                )} 
              />
              <span className={cn(
                "text-[10px] lg:text-[15px] font-bold z-10 transition-colors",
                isActive ? "text-[#174F38]" : "text-gray-500 group-hover:text-gray-900"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
