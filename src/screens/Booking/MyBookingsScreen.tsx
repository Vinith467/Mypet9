import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';

interface Booking {
  id: string;
  petName: string;
  petImage: string;
  petBreed: string;
  caretakerName: string;
  caretakerLocation: string;
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

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'pending': return { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending' };
    case 'accepted': return { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Confirmed' };
    case 'ongoing': return { bg: 'bg-green-50', text: 'text-green-700', label: 'Ongoing' };
    case 'completed': return { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Completed' };
    case 'declined': return { bg: 'bg-red-50', text: 'text-red-700', label: 'Declined' };
    case 'cancelled': return { bg: 'bg-red-50', text: 'text-red-600', label: 'Cancelled' };
    default: return { bg: 'bg-gray-50', text: 'text-gray-600', label: status };
  }
};

export const MyBookingsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'bookings'),
          where('petParentId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const data: Booking[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Booking));
        
        // Sort by createdAt descending
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

  const now = new Date();
  const upcomingBookings = bookings.filter(b => {
    if (b.status === 'completed' || b.status === 'cancelled' || b.status === 'declined') return false;
    return true;
  });
  const pastBookings = bookings.filter(b => {
    return b.status === 'completed' || b.status === 'cancelled' || b.status === 'declined';
  });

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

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
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2.5 rounded-[10px] text-[15px] font-bold transition-colors ${
                activeTab === 'past' 
                  ? 'bg-petoo-primary text-white shadow-md' 
                  : 'text-[#465E87] hover:bg-gray-50'
              }`}
            >
              Past ({pastBookings.length})
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-petoo-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : displayedBookings.length === 0 ? (
            /* Empty State */
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
          ) : (
            /* Booking Cards */
            <div className="space-y-4">
              {displayedBookings.map((booking, index) => {
                const statusStyle = getStatusStyle(booking.status);
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => navigate(`/booking-progress/${booking.id}`, { state: { booking } })}
                  >
                    <div className="flex items-start space-x-4">
                      <img 
                        src={booking.petImage || `https://ui-avatars.com/api/?name=${booking.petName}&background=FBBF24&color=1B2B48`}
                        alt={booking.petName}
                        className="w-14 h-14 rounded-[12px] object-cover shrink-0 bg-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-[15px] font-extrabold text-[#1B2B48] truncate pr-2">{booking.petName}</h3>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.label}
                          </span>
                        </div>
                        <p className="text-[12px] text-gray-500 font-medium mb-2">{booking.petBreed} • {booking.service}</p>
                        
                        <div className="flex items-center text-[12px] text-gray-500 space-x-3">
                          <div className="flex items-center space-x-1">
                            <Calendar size={12} />
                            <span className="font-medium">
                              {formatDate(booking.dropoffDate)} – {formatDate(booking.pickupDate)}
                            </span>
                          </div>
                          <span className="font-bold text-[#1B2B48]">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
                        </div>
                        
                        <p className="text-[11px] text-gray-400 font-medium mt-1">
                          with {booking.caretakerName}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
