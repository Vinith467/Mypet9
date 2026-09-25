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
  caretakerImage?: string;
  service: string;
  dropoffDate: string;
  pickupDate: string;
  nights: number;
  totalAmount: number;
  status: string;
  selectedPets?: any[];
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
  const [activeTab, setActiveTab] = useState<'ongoing' | 'past' | 'cancelled'>('ongoing');
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

  const ongoingBookings = bookings.filter(b => {
    return b.status === 'ongoing' || b.status === 'pending' || b.status === 'accepted';
  });
  
  const pastBookings = bookings.filter(b => {
    return b.status === 'completed';
  });

  const cancelledBookings = bookings.filter(b => {
    return b.status === 'cancelled' || b.status === 'declined';
  });

  const displayedBookings = activeTab === 'ongoing' ? ongoingBookings : activeTab === 'past' ? pastBookings : cancelledBookings;

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
          <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-100 mb-6">
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`flex-1 py-2.5 rounded-full text-[13px] sm:text-[14px] font-bold transition-colors ${
                activeTab === 'ongoing' 
                  ? 'bg-[#FDD835] text-[#111111] shadow-sm' 
                  : 'text-[#465E87] hover:bg-gray-50'
              }`}
            >
              Ongoing ({ongoingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2.5 rounded-full text-[13px] sm:text-[14px] font-bold transition-colors ${
                activeTab === 'past' 
                  ? 'bg-[#FDD835] text-[#111111] shadow-sm' 
                  : 'text-[#465E87] hover:bg-gray-50'
              }`}
            >
              Past ({pastBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`flex-1 py-2.5 rounded-full text-[13px] sm:text-[14px] font-bold transition-colors ${
                activeTab === 'cancelled' 
                  ? 'bg-[#FDD835] text-[#111111] shadow-sm' 
                  : 'text-[#465E87] hover:bg-gray-50'
              }`}
            >
              Cancelled ({cancelledBookings.length})
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
              {activeTab === 'ongoing' && (
                <button 
                  onClick={() => navigate('/')}
                  className="mt-6 bg-[#FDD835] text-[#111111] px-6 py-3 rounded-full font-bold text-[15px] shadow-sm hover:bg-[#FBBF24] transition-colors"
                >
                  Book a Stay
                </button>
              )}
            </div>
          ) : (
            /* Booking Cards */
            <div className="space-y-4">
              {displayedBookings.map((booking, index) => {
                const petNames = booking.selectedPets ? booking.selectedPets.map((p: any) => p.name).join(', ') : booking.petName;
                const petCount = booking.selectedPets ? booking.selectedPets.length : 1;
                
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="bg-white rounded-[24px] p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col"
                  >
                    <div className="flex gap-4">
                      {/* Host Image */}
                      <img 
                        src={booking.caretakerImage || `https://ui-avatars.com/api/?name=${booking.caretakerName}&background=E8F5E9&color=174F38`}
                        alt={booking.caretakerName}
                        className="w-[90px] h-[100px] rounded-[16px] object-cover shrink-0 bg-gray-100"
                      />
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div className="flex items-start justify-between w-full mb-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h3 className="text-[17px] font-extrabold text-[#111111] truncate">{booking.caretakerName}</h3>
                            <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-[#E8F5E9] rounded-full shrink-0">
                              <svg className="w-2.5 h-2.5 text-[#174F38]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              <span className="text-[9px] font-bold text-[#174F38]">Verified Host</span>
                            </div>
                          </div>
                          {activeTab === 'ongoing' && (
                            <button onClick={() => navigate(`/booking-progress/${booking.id}`, { state: { booking } })}>
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-1.5 mb-2.5">
                          <div className="flex items-center space-x-2 min-w-0">
                            <MapPin size={14} className="text-[#666666] shrink-0" />
                            <span className="text-[12px] font-medium text-[#666666] truncate">{booking.caretakerLocation || ''}</span>
                          </div>
                          <div className="flex items-center space-x-2 min-w-0">
                            <Calendar size={14} className="text-[#666666] shrink-0" />
                            <span className="text-[12px] font-medium text-[#666666] truncate">{formatDate(booking.dropoffDate)} - {formatDate(booking.pickupDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2 min-w-0">
                            <svg className="w-3.5 h-3.5 text-[#666666] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 14c0 4.418 7.163 8 16 8s16-3.582 16-8-7.163-8-16-8-16 3.582-16 8z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path></svg>
                            <span className="text-[12px] font-medium text-[#666666] truncate">{petNames} ({petCount} pet{petCount > 1 ? 's' : ''})</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {booking.status === 'completed' ? (
                            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#F1F5F9] rounded-full">
                              <svg className="w-3.5 h-3.5 text-[#475569]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              <span className="text-[11px] font-extrabold text-[#475569] capitalize">Completed</span>
                            </div>
                          ) : booking.status === 'cancelled' || booking.status === 'declined' ? (
                            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#FEF2F2] rounded-full">
                              <svg className="w-3.5 h-3.5 text-[#EF4444]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                              <span className="text-[11px] font-extrabold text-[#EF4444] capitalize">{booking.status}</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#E8F5E9] rounded-full">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                              <span className="text-[11px] font-extrabold text-[#10B981] capitalize">{booking.status}</span>
                            </div>
                          )}
                          
                          {activeTab === 'ongoing' && (
                            <span className="text-[12px] font-medium text-[#666666]">{booking.nights} days left</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    {activeTab === 'ongoing' && (
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => navigate(`/extend-stay/${booking.id}`, { state: { booking } })}
                          className="flex-1 h-[42px] bg-white border border-[#FDD835] text-[#111111] hover:bg-gray-50 text-[14px] font-extrabold rounded-full flex items-center justify-center space-x-2 transition-colors"
                        >
                          <Calendar size={16} />
                          <span>Extend Stay</span>
                        </button>
                        <button 
                          onClick={() => navigate(`/booking-progress/${booking.id}`, { state: { booking } })}
                          className="flex-1 h-[42px] bg-[#FDD835] hover:bg-[#FBBF24] text-[#111111] text-[14px] font-extrabold rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <span>View Details</span>
                        </button>
                      </div>
                    )}
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
