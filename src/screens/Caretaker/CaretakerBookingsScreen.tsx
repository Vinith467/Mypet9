import { useState } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  PawPrint, 
  ChevronLeft,
  Calendar,
  Moon,
  Home,
  ChevronRight,
  CalendarDays
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockBookings = [
  {
    id: '1',
    petName: 'Buddy',
    breed: 'Golden Retriever',
    startDate: '15 Sep',
    endDate: '18 Sep 2026',
    nights: 3,
    service: 'Home Stay',
    statusText: 'Starts in 2 days',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '2',
    petName: 'Luna',
    breed: 'Beagle',
    startDate: '20 Sep',
    endDate: '22 Sep 2026',
    nights: 2,
    service: 'Boarding',
    statusText: 'Starts in 7 days',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1537151608804-ea2f1d71fbdb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '3',
    petName: 'Milo',
    breed: 'Indian Cat',
    startDate: '25 Sep',
    endDate: '28 Sep 2026',
    nights: 3,
    service: 'Home Stay',
    statusText: 'Starts in 12 days',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200'
  }
];

export const CaretakerBookingsScreen = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');

  const firstName = userData?.name ? userData.name.split(' ')[0] : 'Partner';

  const filteredBookings = mockBookings.filter(b => b.status === activeTab);

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
              <div className="flex flex-col">
                 <h2 className="text-3xl font-extrabold text-[#3E2723] tracking-tight leading-none mb-1">Upcoming Services</h2>
                 <p className="text-[#5C3A21]/70 text-sm font-medium">Manage your upcoming pet care services.</p>
              </div>
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

          {/* Mobile Page Title */}
          <div className="lg:hidden mt-2 mb-6">
            <h2 className="text-[28px] font-extrabold text-[#3E2723] tracking-tight leading-tight mb-1">
              Upcoming Services
            </h2>
            <p className="text-[#5C3A21]/70 text-[13px] font-medium leading-snug">
              Manage your upcoming pet care services.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#F5EFE6]/50 p-1.5 rounded-[20px] mb-8 overflow-x-auto scrollbar-hide shrink-0 shadow-inner">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'upcoming'
                  ? 'bg-[#5C3A21] text-white shadow-md'
                  : 'text-[#5C3A21] hover:bg-white/50'
              }`}
            >
              Upcoming (3)
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'ongoing'
                  ? 'bg-[#5C3A21] text-white shadow-md'
                  : 'text-[#5C3A21] hover:bg-white/50'
              }`}
            >
              Ongoing (0)
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'completed'
                  ? 'bg-[#5C3A21] text-white shadow-md'
                  : 'text-[#5C3A21] hover:bg-white/50'
              }`}
            >
              Completed (5)
            </button>
          </div>

          {/* Bookings List */}
          <div className="flex flex-col space-y-4 mb-10 w-full max-w-3xl mx-auto lg:max-w-none">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  onClick={() => navigate(`/caretaker/bookings/${booking.id}`)}
                  whileHover={{ scale: 1.01, backgroundColor: '#ffffff' }}
                  whileTap={{ scale: 0.99 }}
                  className="bg-white/80 lg:bg-white rounded-[28px] p-4 flex items-center cursor-pointer shadow-[0_4px_20px_rgba(92,58,33,0.03)] border border-white transition-all group"
                >
                  {/* Pet Image */}
                  <div className="w-[100px] h-[120px] lg:w-[120px] lg:h-[140px] shrink-0 rounded-2xl overflow-hidden relative mr-4 lg:mr-6 shadow-sm">
                    <img 
                      src={booking.image} 
                      alt={booking.petName} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between h-full py-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 pr-2">
                        <h3 className="text-xl lg:text-2xl font-extrabold text-[#3E2723] mb-0.5 truncate">
                          {booking.petName}
                        </h3>
                        <p className="text-[#5C3A21]/70 text-xs lg:text-sm font-medium truncate mb-2">
                          {booking.breed}
                        </p>
                      </div>
                      <ChevronRight size={20} className="text-[#5C3A21]/40 shrink-0 mt-1 group-hover:translate-x-1 group-hover:text-[#5C3A21] transition-all" />
                    </div>

                    <div className="space-y-1.5 lg:space-y-2 mb-3">
                      <div className="flex items-center text-[#5C3A21]/80 text-[11px] lg:text-[13px] font-semibold">
                        <Calendar size={14} className="mr-2 opacity-70" />
                        <span className="truncate">{booking.startDate} - {booking.endDate}</span>
                      </div>
                      <div className="flex items-center text-[#5C3A21]/80 text-[11px] lg:text-[13px] font-semibold">
                        <Moon size={14} className="mr-2 opacity-70" />
                        <span>{booking.nights} nights</span>
                      </div>
                      <div className="flex items-center text-[#5C3A21]/80 text-[11px] lg:text-[13px] font-semibold">
                        <Home size={14} className="mr-2 opacity-70" />
                        <span className="truncate">{booking.service}</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center self-start bg-[#FFF9F2] px-3 py-1.5 rounded-xl border border-[#8D5B3A]/10">
                      <CalendarDays size={12} className="text-[#A26D45] mr-1.5" />
                      <span className="text-[10px] lg:text-xs font-bold text-[#A26D45] uppercase tracking-wide">
                        {booking.statusText}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#FFF9F2] rounded-full flex items-center justify-center mb-4">
                  <CalendarDays size={28} className="text-[#A26D45]/50" />
                </div>
                <h3 className="text-lg font-bold text-[#3E2723] mb-1">No {activeTab} bookings</h3>
                <p className="text-[#5C3A21]/60 text-sm font-medium">You don't have any {activeTab} bookings at the moment.</p>
              </div>
            )}
          </div>

          {/* Bottom Illustration */}
          <div className="mt-auto mb-10 relative w-full h-[140px] lg:h-[200px] rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(92,58,33,0.06)] bg-[#FFF9F2] flex flex-row">
             
             {/* Content Side */}
             <div className="relative z-10 w-[60%] lg:w-[50%] h-full flex flex-col justify-center px-6 lg:px-10 shrink-0">
                <p className="text-[#8D5B3A] font-extrabold text-[10px] lg:text-xs uppercase tracking-[0.2em] mb-2 lg:mb-3 opacity-80">
                  Your Impact
                </p>
                <h3 className="text-[22px] lg:text-[34px] font-extrabold text-[#3E2723] leading-[1.15] tracking-tight">
                  Every stay is a<br/>
                  <span className="text-[#A26D45] font-caveat text-[32px] lg:text-[46px] font-bold leading-none inline-block mt-1">new story ♥</span>
                </h3>
             </div>

             {/* Image Side */}
             <div className="absolute inset-y-0 right-0 w-[60%] lg:w-[70%] z-0">
                 <img 
                   src="/assets/real_cute_pets.jpg" 
                   alt="Happy Pets" 
                   className="w-full h-full object-cover object-left-center lg:object-center"
                 />
                 <div className="absolute inset-y-0 left-0 w-16 lg:w-32 bg-gradient-to-r from-[#FFF9F2] via-[#FFF9F2]/80 to-transparent"></div>
             </div>
          </div>
          
        </div>
      </div>
    </CaretakerLayout>
  );
};
