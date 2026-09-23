import { useState, useEffect } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  PawPrint, 
  ChevronLeft,
  Calendar,
  Moon,
  Home,
  ChevronRight,
  CalendarDays,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Booking {
  id: string;
  petName: string;
  petBreed: string;
  petImage: string;
  petParentName: string;
  service: string;
  dropoffDate: string;
  pickupDate: string;
  nights: number;
  totalAmount: number;
  status: string;
  createdAt: any;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

const getStatusInfo = (status: string, dropoffDate: string) => {
  const now = new Date();
  const dropoff = new Date(dropoffDate);
  const daysUntil = Math.ceil((dropoff.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  switch (status) {
    case 'accepted':
      return {
        text: daysUntil > 0 ? `Starts in ${daysUntil} day${daysUntil > 1 ? 's' : ''}` : 'Starting today',
        color: 'text-blue-600'
      };
    case 'ongoing':
      return { text: 'Currently staying', color: 'text-green-600' };
    case 'completed':
      return { text: 'Completed', color: 'text-gray-500' };
    default:
      return { text: status, color: 'text-gray-500' };
  }
};

export const CaretakerBookingsScreen = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const firstName = userData?.name ? userData.name.split(' ')[0] : 'Partner';

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'bookings'),
          where('caretakerId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const data: Booking[] = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as Booking));
        
        data.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });
        
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'upcoming') return b.status === 'accepted';
    if (activeTab === 'ongoing') return b.status === 'ongoing';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return b.status === 'completed';
  });

  const tabCounts = {
    upcoming: bookings.filter(b => b.status === 'accepted').length,
    ongoing: bookings.filter(b => b.status === 'ongoing').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <CaretakerLayout>
      <div className="w-full flex flex-col bg-[#FAFAFA] min-h-screen font-quicksand pb-40 lg:pb-12 text-[#1B2B48]">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-[#FAFAFA]/95 backdrop-blur-md z-40">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center -ml-2 text-[#1B2B48]"
          >
            <ChevronLeft size={28} />
          </button>
          
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center space-x-1.5">
              <PawPrint size={22} className="text-[#FBBF24]" fill="currentColor" />
              <h1 className="text-xl font-extrabold tracking-tight text-[#1B2B48]">
                Mypet<span className="text-[#FBBF24]">9</span>
              </h1>
            </div>
            <span className="text-[10px] font-bold text-[#FBBF24] uppercase tracking-wider -mt-1 ml-[30px]">Partner</span>
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
        <div className="flex-1 px-5 lg:px-8 lg:pt-8 w-full flex flex-col max-w-7xl mx-auto">
          
          {/* Desktop Top Nav */}
          <div className="hidden lg:flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-[#FFFFFF] transition-colors"
              >
                <ChevronLeft size={24} className="text-[#1B2B48]" />
              </button>
              <h2 className="text-3xl font-extrabold text-[#1B2B48] tracking-tight">Bookings</h2>
            </div>
             
             <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-white">
                <div className="text-right">
                  <p className="font-bold text-[14px] text-[#1B2B48]">{userData?.name || 'Partner'}</p>
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
            <h2 className="text-[28px] font-extrabold text-[#1B2B48] tracking-tight leading-tight mb-1">
              Bookings
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#F5EFE6]/50 p-1.5 rounded-[20px] mb-8 overflow-x-auto scrollbar-hide shrink-0 shadow-inner space-x-1 lg:space-x-2">
            {([
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'ongoing', label: 'Ongoing' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 whitespace-nowrap py-2.5 px-4 lg:px-6 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-[#C79133] text-white shadow-md'
                    : 'text-[#1B2B48] hover:bg-white/50'
                }`}
              >
                {tab.label} ({tabCounts[tab.key]})
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="flex flex-col space-y-4 mb-10 w-full max-w-3xl mx-auto lg:max-w-none">
            
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={32} className="animate-spin text-[#FBBF24]" />
              </div>
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => {
                const statusInfo = getStatusInfo(booking.status, booking.dropoffDate);
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate(`/caretaker/bookings/${booking.id}`, { state: { booking } })}
                    className="bg-white rounded-3xl p-3 flex items-center cursor-pointer shadow-[0_2px_15px_rgba(92,58,33,0.04)] border border-white transition-all group relative"
                  >
                    <div className="w-[100px] h-[120px] lg:w-[90px] lg:h-[110px] shrink-0 rounded-2xl overflow-hidden relative mr-4 lg:mr-6 shadow-sm">
                      <img 
                        src={booking.petImage || `https://ui-avatars.com/api/?name=${booking.petName}&background=FBBF24&color=1B2B48`} 
                        alt={booking.petName} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col py-1 min-w-0 pr-8">
                      <h3 className="text-xl lg:text-[22px] font-extrabold text-[#1B2B48] mb-0.5 truncate">
                        {booking.petName}
                      </h3>
                      <p className="text-[#1B2B48]/70 text-[12px] font-medium truncate mb-2.5">
                        {booking.petBreed} • by {booking.petParentName}
                      </p>

                      <div className="space-y-1">
                        <div className="flex items-center text-[#1B2B48]/80 text-[12px] font-semibold">
                          <Calendar size={13} className="mr-2 text-[#5C1C1D] shrink-0" />
                          <span className="truncate">{formatDate(booking.dropoffDate)} – {formatDate(booking.pickupDate)}</span>
                        </div>
                        <div className="flex items-center text-[#1B2B48]/80 text-[12px] font-semibold">
                          <Moon size={13} className="mr-2 text-[#5C1C1D] shrink-0" />
                          <span>{booking.nights} night{booking.nights > 1 ? 's' : ''} • ₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center text-[12px] font-bold">
                          <Home size={13} className="mr-2 text-[#5C1C1D] shrink-0" />
                          <span className={statusInfo.color}>{statusInfo.text}</span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <ChevronRight size={22} className="text-[#5C1C1D]/60 group-hover:translate-x-1 group-hover:text-[#5C1C1D] transition-all" />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#FFFFFF] rounded-full flex items-center justify-center mb-4">
                  <CalendarDays size={28} className="text-[#FBBF24]/50" />
                </div>
                <h3 className="text-lg font-bold text-[#1B2B48] mb-1">No {activeTab} bookings</h3>
                <p className="text-[#1B2B48]/60 text-sm font-medium">
                  {activeTab === 'upcoming' 
                    ? "When you accept a request, it will appear here."
                    : `No ${activeTab} bookings to display.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CaretakerLayout>
  );
};
