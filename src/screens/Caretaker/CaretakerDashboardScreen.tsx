import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Menu, 
  PawPrint, 
  Home, 
  Scissors, 
  ArrowRight, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const CaretakerDashboardScreen = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<{ homeStay?: boolean; boarding?: boolean; grooming?: boolean } | null>(null);

  useEffect(() => {
    if (user?.uid) {
      getDoc(doc(db, 'caretaker_applications', user.uid)).then(docSnap => {
        if (docSnap.exists()) {
          setServices(docSnap.data().services || {});
        }
      });
    }
  }, [user]);

  const firstName = userData?.name ? userData.name.split(' ')[0] : 'Partner';

  return (
    <CaretakerLayout>
      <div className="w-full flex flex-col bg-[#FDF8F3] min-h-screen font-quicksand pb-24 lg:pb-12 text-[#3E2723]">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-5 pt-6 pb-4">
          <div className="flex flex-col items-start justify-center">
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

        {/* Main Content Container */}
        <div className="flex-1 px-5 lg:px-12 lg:pt-10 w-full flex flex-col">
          
          {/* Desktop Top Nav */}
          <div className="hidden lg:flex justify-between items-center mb-8">
             <h2 className="text-3xl font-extrabold text-[#3E2723] tracking-tight">Overview</h2>
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

          {/* Hero Section */}
          <div className="relative w-full mb-6 lg:mb-10 bg-[#FFF9F2] rounded-[24px] lg:rounded-[32px] p-4 lg:p-12 flex flex-col lg:flex-row items-center justify-between shadow-[0_8px_30px_rgba(92,58,33,0.04)] border border-white relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#F5EFE6] rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            
            {/* Text Side */}
            <div className="flex-1 z-10 max-w-2xl">
              <h2 className="text-xl lg:text-4xl font-semibold text-[#5C3A21] tracking-tight mb-1">
                Good morning,
              </h2>
              <h1 className="text-2xl lg:text-[64px] font-black text-[#3E2723] leading-[1.1] mb-2 lg:mb-6 tracking-tighter">
                {firstName}!
              </h1>
              <div className="w-10 lg:w-12 h-1 lg:h-1.5 bg-[#8D5B3A] rounded-full mb-3 lg:mb-6"></div>
              <p className="text-[#5C3A21] text-sm lg:text-xl font-semibold mb-1">
                Happy pets. Happier tomorrows.
              </p>
              <p className="text-[#5C3A21]/80 text-[11px] lg:text-base font-medium leading-relaxed">
                Manage your services, availability, and bookings to grow your pet care business.
              </p>
            </div>
            
            {/* Image Side */}
            <div className="w-full lg:w-[480px] h-[120px] lg:h-[280px] relative rounded-[16px] lg:rounded-[32px] overflow-hidden shadow-[0_10px_40px_rgba(92,58,33,0.12)] group mt-4 lg:mt-0 z-10 shrink-0">
               <img 
                  src="/assets/hero_pets.jpg" 
                  alt="Golden Retriever and Cat" 
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Speech Bubble Badge */}
                <div className="absolute top-2 right-2 lg:top-6 lg:right-6 bg-white px-2 py-1.5 lg:px-4 lg:py-3 rounded-xl lg:rounded-2xl shadow-lg flex flex-col items-center animate-bounce-slow">
                  <Heart size={14} className="text-[#8D5B3A] mb-0.5 lg:mb-1" fill="currentColor"/>
                  <span className="font-bold text-[#5C3A21] text-[9px] lg:text-[12px] text-center leading-tight">
                    Better Care<br/>Brighter Days
                  </span>
                  <div className="absolute -bottom-1.5 lg:-bottom-2.5 left-4 lg:left-8 w-3 h-3 lg:w-5 lg:h-5 bg-white transform rotate-45 rounded-sm"></div>
                </div>
            </div>
          </div>

          {/* Service Cards Container */}
          <div className={`flex flex-col lg:flex-row gap-4 lg:gap-8 mb-4 lg:mb-10 ${(!services || (services.grooming && (services.homeStay || services.boarding))) ? '' : 'lg:max-w-2xl lg:mx-auto'}`}>
            
            {/* Home Stay / Boarding Card */}
            {(!services || services.homeStay || services.boarding) && (
              <motion.div 
                whileHover={{ y: -6 }}
                onClick={() => navigate('/caretaker/homestay')}
                className="relative flex-1 rounded-[24px] lg:rounded-[32px] overflow-hidden cursor-pointer shadow-[0_10px_40px_rgba(92,58,33,0.06)] bg-[#FFF9F2] group flex flex-row h-[140px] lg:h-[280px]"
              >
                {/* Text Side */}
                <div className="flex-1 min-w-0 relative z-10 p-4 lg:p-8 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-9 h-9 lg:w-14 lg:h-14 bg-[#4A2E1B] rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 lg:mb-6 shadow-[0_8px_20px_rgba(74,46,27,0.2)] group-hover:scale-105 transition-transform duration-300 shrink-0">
                      <Home size={18} className="text-white lg:w-6 lg:h-6" />
                    </div>
                    <h3 className="text-[16px] lg:text-[28px] font-extrabold text-[#3E2723] leading-tight mb-1 lg:mb-2 tracking-tight">
                      Home Stay<br/>& Boarding
                    </h3>
                    <p className="text-[#5C3A21]/70 text-[10px] lg:text-sm font-medium leading-snug break-words line-clamp-2">
                      Manage requests, availability, and bookings.
                    </p>
                  </div>

                  {/* Feature Tags (Hidden on mobile) */}
                  <div className="hidden lg:flex items-center space-x-4">
                    <div className="flex items-center space-x-2 shrink-0">
                      <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Home size={10} className="text-[#8D5B3A] lg:w-3 lg:h-3" />
                      </div>
                      <span className="text-[10px] font-extrabold text-[#5C3A21] uppercase tracking-widest leading-none">Safe</span>
                    </div>
                    <div className="w-[1px] h-6 bg-[#8D5B3A]/10 shrink-0"></div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Heart size={10} className="text-[#8D5B3A] lg:w-3 lg:h-3" />
                      </div>
                      <span className="text-[10px] font-extrabold text-[#5C3A21] uppercase tracking-widest leading-none">Happy</span>
                    </div>
                  </div>
                </div>

                {/* Image Side */}
                <div className="w-2/5 lg:w-[45%] shrink-0 relative z-0 overflow-hidden">
                  <img 
                    src="/assets/boarding_dog.jpg" 
                    alt="Boarding Dog" 
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                  />
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-[#5C3A21]/5"></div>
                  
                  <div className="absolute bottom-3 right-3 lg:bottom-8 lg:right-8 w-8 h-8 lg:w-12 lg:h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.12)] group-hover:bg-[#5C3A21] transition-colors duration-300">
                    <ArrowRight size={14} className="text-[#5C3A21] group-hover:text-white transition-colors lg:w-5 lg:h-5" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grooming Card */}
            {(!services || services.grooming) && (
              <motion.div 
                whileHover={{ y: -6 }}
                onClick={() => navigate('/caretaker/requests')}
                className="relative flex-1 rounded-[24px] lg:rounded-[32px] overflow-hidden cursor-pointer shadow-[0_10px_40px_rgba(92,58,33,0.06)] bg-[#FFF9F2] group flex flex-row h-[140px] lg:h-[280px]"
              >
                {/* Text Side */}
                <div className="flex-1 min-w-0 relative z-10 p-4 lg:p-8 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-9 h-9 lg:w-14 lg:h-14 bg-[#4A2E1B] rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 lg:mb-6 shadow-[0_8px_20px_rgba(74,46,27,0.2)] group-hover:scale-105 transition-transform duration-300 shrink-0">
                      <Scissors size={18} className="text-white lg:w-6 lg:h-6" />
                    </div>
                    <h3 className="text-[16px] lg:text-[28px] font-extrabold text-[#3E2723] leading-tight mb-1 lg:mb-2 tracking-tight">
                      Grooming<br/>Services
                    </h3>
                    <p className="text-[#5C3A21]/70 text-[10px] lg:text-sm font-medium leading-snug break-words line-clamp-2">
                      Manage grooming appointments and schedule.
                    </p>
                  </div>

                  {/* Feature Tags (Hidden on mobile) */}
                  <div className="hidden lg:flex items-center space-x-4">
                    <div className="flex items-center space-x-2 shrink-0">
                      <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Sparkles size={10} className="text-[#8D5B3A] lg:w-3 lg:h-3" />
                      </div>
                      <span className="text-[10px] font-extrabold text-[#5C3A21] uppercase tracking-widest leading-none">Pro</span>
                    </div>
                    <div className="w-[1px] h-6 bg-[#8D5B3A]/10 shrink-0"></div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <PawPrint size={10} className="text-[#8D5B3A] lg:w-3 lg:h-3" />
                      </div>
                      <span className="text-[10px] font-extrabold text-[#5C3A21] uppercase tracking-widest leading-none">Fresh</span>
                    </div>
                  </div>
                </div>

                {/* Image Side */}
                <div className="w-2/5 lg:w-[45%] shrink-0 relative z-0 overflow-hidden">
                  <img 
                    src="/assets/grooming_dog.jpg" 
                    alt="Grooming Dog" 
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                  />
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-[#5C3A21]/5"></div>
                  
                  <div className="absolute bottom-3 right-3 lg:bottom-8 lg:right-8 w-8 h-8 lg:w-12 lg:h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.12)] group-hover:bg-[#5C3A21] transition-colors duration-300">
                    <ArrowRight size={14} className="text-[#5C3A21] group-hover:text-white transition-colors lg:w-5 lg:h-5" />
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Trust Banner (Hidden on mobile) */}
          <div className="hidden lg:flex w-full bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(92,58,33,0.03)] border border-[#5C3A21]/5 flex-row justify-between items-center relative overflow-hidden">
            
            <div className="flex items-center gap-1.5 lg:space-x-3">
              <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-[#FFF9F2] flex items-center justify-center border border-[#8D5B3A]/10 shrink-0">
                <ShieldCheck size={14} className="text-[#8D5B3A] lg:w-[18px] lg:h-[18px]" />
              </div>
              <span className="text-[9px] lg:text-[13px] font-bold text-[#3E2723] leading-tight">Verified<br/>Partners</span>
            </div>
            
            <div className="w-[1px] h-6 lg:h-8 bg-[#5C3A21]/10 shrink-0 mx-1"></div>
            
            <div className="flex items-center gap-1.5 lg:space-x-3">
              <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-[#FFF9F2] flex items-center justify-center border border-[#8D5B3A]/10 shrink-0">
                <PawPrint size={14} className="text-[#8D5B3A] lg:w-[18px] lg:h-[18px]" fill="currentColor" />
              </div>
              <span className="text-[9px] lg:text-[13px] font-bold text-[#3E2723] leading-tight">₹50k<br/>Cover</span>
            </div>
            
            <div className="w-[1px] h-6 lg:h-8 bg-[#5C3A21]/10 shrink-0 mx-1"></div>

            <div className="flex items-center gap-1.5 lg:space-x-3">
              <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-[#FFF9F2] flex items-center justify-center border border-[#8D5B3A]/10 shrink-0">
                <Users size={14} className="text-[#8D5B3A] lg:w-[18px] lg:h-[18px]" />
              </div>
              <span className="text-[9px] lg:text-[13px] font-bold text-[#3E2723] leading-tight">Growing<br/>Community</span>
            </div>
          </div>
          
        </div>
      </div>
    </CaretakerLayout>
  );
};
