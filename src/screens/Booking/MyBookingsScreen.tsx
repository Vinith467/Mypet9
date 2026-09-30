import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, PawPrint, FileText, XCircle, Heart, Home, ChevronRight, Check, X, Star } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, orderBy, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
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
  caretakerId?: string;
  isReviewed?: boolean;
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

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleSubmitReview = async () => {
    if (!selectedBookingForReview || rating === 0 || !user?.uid) return;
    
    // Check if caretakerId is available, otherwise we can't update their profile
    // Note: older bookings might not have caretakerId saved directly on them, 
    // but going forward they should. For safety we check.
    const caretakerId = selectedBookingForReview.caretakerId;
    if (!caretakerId) {
      alert("Cannot submit review: missing caretaker information.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      // 1. Save the review to a top-level 'reviews' collection
      const reviewData = {
        bookingId: selectedBookingForReview.id,
        caretakerId: caretakerId,
        userId: user.uid,
        userName: user.displayName || 'Pet Parent',
        rating,
        reviewText,
        createdAt: new Date(),
      };
      
      await addDoc(collection(db, 'reviews'), reviewData);
      
      // 2. Update the caretaker's document with new average rating
      const caretakerRef = doc(db, 'caretakers', caretakerId);
      const caretakerSnap = await getDoc(caretakerRef);
      
      if (caretakerSnap.exists()) {
        const caretakerData = caretakerSnap.data();
        const currentReviewCount = caretakerData.reviewCount || 0;
        const currentRating = caretakerData.rating || 0;
        
        const newReviewCount = currentReviewCount + 1;
        const newRating = ((currentRating * currentReviewCount) + rating) / newReviewCount;
        
        await updateDoc(caretakerRef, {
          reviewCount: newReviewCount,
          rating: newRating
        });
      }
      
      // 3. Mark the booking as reviewed
      const bookingRef = doc(db, 'bookings', selectedBookingForReview.id);
      await updateDoc(bookingRef, {
        isReviewed: true
      });
      
      // Update local state to reflect the change
      setBookings(prevBookings => prevBookings.map(b => 
        b.id === selectedBookingForReview.id ? { ...b, isReviewed: true } : b
      ));

      // Close modal and reset
      setIsReviewModalOpen(false);
      setRating(0);
      setReviewText('');
      
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

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
      <div className="w-full flex flex-col min-h-full bg-[#F8F9FA] pb-24 lg:pb-12">
        
        {/* Full-width Hero Banner */}
        <div className="w-full bg-[#F2FAFD] relative overflow-hidden border-b border-[#E8F3F3] h-[140px] md:h-[160px]">
          {/* Banner Image - Placed here so it hits the absolute right edge of the window */}
          <img 
            src="/pet-application.png" 
            alt="Pets" 
            className="absolute right-0 bottom-0 h-full object-contain object-right pointer-events-none z-0"
          />

          <div className="max-w-5xl mx-auto relative h-full flex items-center px-5 lg:px-0 z-10">
            {/* Paw Prints Background Vectors */}
            <div className="absolute top-4 left-[30%] opacity-20">
              <PawPrint size={32} className="text-[#71b6af]" fill="currentColor" />
            </div>
            <div className="absolute bottom-6 left-[45%] opacity-20 transform -rotate-12">
              <PawPrint size={24} className="text-[#71b6af]" fill="currentColor" />
            </div>
            <div className="absolute top-8 right-[20%] lg:right-[40%] opacity-20 transform rotate-12">
              <PawPrint size={40} className="text-[#71b6af]" fill="currentColor" />
            </div>
            
            {/* Banner Text */}
            <div className="z-10 relative pt-2">
              <div className="flex items-center mb-1 lg:hidden">
                <button 
                  onClick={() => navigate(-1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E8F3F3] transition-colors mr-2 -ml-2"
                >
                  <ArrowLeft className="text-[#003B39]" size={20} />
                </button>
              </div>
              <h1 className="text-[28px] md:text-[36px] font-extrabold text-[#003B39] mb-1 font-serif tracking-tight">My Bookings</h1>
              <p className="hidden md:block text-[15px] font-medium text-[#465E87] max-w-[400px]">
                Stay updated on all your pet care bookings.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl lg:max-w-[1150px] mx-auto w-full px-5 lg:px-0 -mt-4 md:-mt-5 relative z-20">

          {/* Tabs */}
          <div className="flex bg-white rounded-full p-1 shadow-[0_4px_12px_rgb(0,0,0,0.05)] border border-gray-100 mb-6 max-w-[800px] -ml-1">
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`flex-1 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'ongoing' 
                  ? 'bg-[#31A29B] text-white shadow-sm' 
                  : 'text-[#1B2B48] hover:bg-gray-50'
              }`}
            >
              <Calendar size={14} />
              <span>Ongoing ({ongoingBookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'past' 
                  ? 'bg-[#31A29B] text-white shadow-sm' 
                  : 'text-[#1B2B48] hover:bg-gray-50'
              }`}
            >
              <FileText size={14} />
              <span>Past ({pastBookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`flex-1 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'cancelled' 
                  ? 'bg-[#31A29B] text-white shadow-sm' 
                  : 'text-[#1B2B48] hover:bg-gray-50'
              }`}
            >
              <XCircle size={14} />
              <span>Cancelled ({cancelledBookings.length})</span>
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
                  className="mt-6 bg-[#71b6af] text-[#111111] px-6 py-3 rounded-full font-bold text-[15px] shadow-sm hover:bg-[#007672] transition-colors"
                >
                  Book a Stay
                </button>
              )}
            </div>
          ) : (
            /* Booking Cards */
            <div className="space-y-5 w-full">
              {displayedBookings.map((booking, index) => {
                const petNames = booking.selectedPets ? booking.selectedPets.map((p: any) => p.name).join(', ') : booking.petName;
                const petCount = booking.selectedPets ? booking.selectedPets.length : 1;
                const petBreed = booking.petBreed || 'Breed';
                
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="bg-white rounded-[16px] p-4 lg:p-4 shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative"
                  >
                    {/* Left Side: Image & Details */}
                    <div className="flex gap-4 lg:w-[40%] xl:w-[35%] shrink-0">
                      {/* Host Image */}
                      <div className="relative shrink-0 w-[120px] sm:w-[145px] flex flex-col">
                        <img 
                          src={booking.caretakerImage || `https://ui-avatars.com/api/?name=${booking.caretakerName}&background=E8F5E9&color=174F38`}
                          alt={booking.caretakerName}
                          className="w-full h-full min-h-[120px] rounded-[12px] object-cover bg-gray-100"
                        />
                        <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:scale-110 transition-transform">
                          <Heart size={14} className="text-[#007672]" />
                        </button>
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-[15px] sm:text-[16px] font-extrabold text-[#111111] truncate">{booking.caretakerName}</h3>
                          <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-[#E8F5E9] rounded-full shrink-0">
                            <Check size={10} className="text-[#007672]" />
                            <span className="text-[9px] font-bold text-[#007672]">Verified Host</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1.5 mb-1.5">
                          <Home size={12} className="text-[#666666] shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-medium text-[#666666]">Home Stay</span>
                        </div>
                        
                        <div className="flex items-center space-x-1.5 mb-1.5">
                          <MapPin size={12} className="text-[#666666] shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-medium text-[#666666] truncate">{booking.caretakerLocation || ''}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1.5 mb-1.5">
                          <Calendar size={12} className="text-[#666666] shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-medium text-[#666666] truncate">{formatDate(booking.dropoffDate)} - {formatDate(booking.pickupDate)} ({booking.nights} nights)</span>
                        </div>
                        
                        <div className="flex items-center space-x-1.5 mb-2.5">
                          <PawPrint size={12} className="text-[#666666] shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-medium text-[#666666] truncate">{petNames} ({petCount} pet{petCount > 1 ? 's' : ''}) • {petBreed}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-[#E8F5E9] rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                            <span className="text-[11px] font-extrabold text-[#10B981] capitalize">{booking.status}</span>
                          </div>
                          {activeTab === 'ongoing' && (
                            <span className="text-[11px] font-medium text-[#666666]">| {booking.nights} days left</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Middle: Progress Bar (Shown for all tabs) */}
                    <div className="flex flex-1 items-center justify-center w-full mt-2 lg:mt-0 lg:px-4">
                      <div className="flex flex-col items-center w-full max-w-[420px] relative pt-2">
                        {/* Lines container */}
                        <div className="absolute top-[21px] left-[12%] right-[12%] h-[2px] bg-gray-200 z-0">
                          <div className={`h-full bg-[#007672] transition-all duration-500 ${
                            booking.status === 'cancelled' || booking.status === 'declined' ? 'w-0' : 
                            booking.status === 'completed' ? 'w-full' : 'w-1/3'
                          }`}></div>
                        </div>
                        
                        {/* Nodes container */}
                        <div className="flex justify-between w-full relative z-10">
                          {/* Node 1 */}
                          <div className="flex flex-col items-center w-1/4">
                            {(booking.status === 'cancelled' || booking.status === 'declined') ? (
                              <>
                                <div className="w-6 h-6 rounded-full bg-[#EF4444] flex items-center justify-center text-white mb-1.5 shadow-sm">
                                  <X size={12} strokeWidth={3} />
                                </div>
                                <span className="text-[10px] font-bold text-[#EF4444] text-center leading-tight">Cancelled</span>
                              </>
                            ) : (
                              <>
                                <div className="w-6 h-6 rounded-full bg-[#007672] flex items-center justify-center text-white mb-1.5 shadow-sm">
                                  <Check size={12} strokeWidth={3} />
                                </div>
                                <span className="text-[10px] font-bold text-[#111111] text-center leading-tight">Booking<br/>Confirmed</span>
                              </>
                            )}
                            <span className="text-[9px] text-[#666666] mt-0.5">{formatDate(booking.createdAt?.toDate?.() || booking.createdAt)}</span>
                          </div>
                          
                          {/* Node 2 */}
                          <div className={`flex flex-col items-center w-1/4 ${booking.status === 'cancelled' || booking.status === 'declined' ? 'opacity-50' : ''}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1.5 shadow-sm ${
                              booking.status === 'completed' || activeTab === 'ongoing' ? 'bg-[#007672] text-white' : 'bg-white border-[2px] border-gray-300'
                            }`}>
                              {booking.status === 'completed' ? <Check size={12} strokeWidth={3} /> : (activeTab === 'ongoing' ? <span className="text-[10px] font-bold">2</span> : <div className="w-2 h-2 rounded-full bg-gray-300"></div>)}
                            </div>
                            <span className={`text-[10px] font-bold text-center leading-tight ${booking.status === 'completed' || activeTab === 'ongoing' ? 'text-[#111111]' : 'text-[#666666]'}`}>Stay in<br/>Progress</span>
                            <span className="text-[9px] text-[#666666] mt-0.5">{formatDate(booking.dropoffDate)} - {formatDate(booking.pickupDate)}</span>
                          </div>
                          
                          {/* Node 3 */}
                          <div className={`flex flex-col items-center w-1/4 ${booking.status !== 'completed' ? 'opacity-50' : ''}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1.5 shadow-sm ${
                              booking.status === 'completed' ? 'bg-[#007672] text-white' : 'bg-white border-[2px] border-gray-300'
                            }`}>
                              {booking.status === 'completed' ? <Check size={12} strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-gray-300"></div>}
                            </div>
                            <span className={`text-[10px] font-bold text-center leading-tight ${booking.status === 'completed' ? 'text-[#111111]' : 'text-[#666666]'}`}>Complete<br/>Service</span>
                          </div>
                          
                          {/* Node 4 */}
                          <div className={`flex flex-col items-center w-1/4 ${booking.status !== 'completed' ? 'opacity-50' : ''}`}>
                            <button 
                              onClick={() => {
                                if (booking.status === 'completed' && !booking.isReviewed) {
                                  setSelectedBookingForReview(booking);
                                  setIsReviewModalOpen(true);
                                }
                              }}
                              className={`w-6 h-6 rounded-full flex items-center justify-center mb-1.5 shadow-sm transition-transform ${booking.status === 'completed' && !booking.isReviewed ? 'hover:scale-110' : ''} ${
                              booking.isReviewed ? 'bg-gray-100 text-[#10B981]' : (booking.status === 'completed' ? 'bg-[#10B981] text-white' : 'bg-white border-[2px] border-gray-300 cursor-default')
                            }`}>
                              {booking.isReviewed ? <Check size={12} className="text-[#10B981]" /> : (booking.status === 'completed' ? <Star size={12} className="fill-white" /> : <div className="w-2 h-2 rounded-full bg-gray-300"></div>)}
                            </button>
                            <span className={`text-[10px] font-bold text-center leading-tight ${booking.isReviewed || booking.status === 'completed' ? 'text-[#10B981]' : 'text-[#666666]'}`}>
                              {booking.isReviewed ? 'Reviewed' : 'Add\nReview'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side: Action Buttons */}
                    <div className="flex flex-col lg:items-end justify-center h-full lg:w-[150px] shrink-0 gap-3 lg:gap-0">
                      
                      <div className="flex lg:flex-col items-center gap-2 lg:gap-2.5 w-full mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                        {activeTab === 'ongoing' && (
                          <button 
                            onClick={() => navigate(`/extend-stay/${booking.id}`, { state: { booking } })}
                            className="flex-1 lg:flex-none lg:w-full h-[36px] bg-white border border-[#007672] text-[#007672] hover:bg-gray-50 text-[12px] font-bold rounded-full flex items-center justify-center space-x-1.5 transition-colors"
                          >
                            <Calendar size={14} />
                            <span>Extend Stay</span>
                          </button>
                        )}
                        {booking.status === 'completed' && !booking.isReviewed && (
                          <button 
                            onClick={() => {
                              setSelectedBookingForReview(booking);
                              setIsReviewModalOpen(true);
                            }}
                            className="flex-1 lg:flex-none lg:w-full h-[36px] bg-white border border-[#10B981] text-[#10B981] hover:bg-[#F0FDF4] text-[12px] font-bold rounded-full flex items-center justify-center space-x-1.5 transition-colors"
                          >
                            <Star size={14} className="fill-[#10B981]" />
                            <span>Add Review</span>
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/booking-progress/${booking.id}`, { state: { booking } })}
                          className="flex-1 lg:flex-none lg:w-full h-[36px] bg-[#007672] hover:bg-[#00605c] text-white text-[12px] font-bold rounded-full flex items-center justify-center transition-colors shadow-sm"
                        >
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Review Modal */}
      {isReviewModalOpen && selectedBookingForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[24px] w-full max-w-2xl overflow-hidden shadow-2xl relative"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[20px] font-extrabold text-[#111111]">Add Review</h3>
                <button onClick={() => { setIsReviewModalOpen(false); setRating(0); setReviewText(''); }} className="text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full p-1.5">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 rounded-[16px] border border-gray-100">
                    <img src={selectedBookingForReview.caretakerImage || `https://ui-avatars.com/api/?name=${selectedBookingForReview.caretakerName}&background=E8F5E9&color=174F38`} alt="" className="w-12 h-12 rounded-[12px] object-cover" />
                    <div>
                      <p className="font-bold text-[#111111]">{selectedBookingForReview.caretakerName}</p>
                      <p className="text-[12px] font-medium text-gray-500">{selectedBookingForReview.service || 'Home Stay'}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6 flex flex-col items-center">
                    <p className="text-[14px] font-bold text-[#111111] mb-3">Rate your experience</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                          <Star size={36} className={star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6 md:mb-0">
                    <p className="text-[14px] font-bold text-[#111111] mb-2">Add Photos (Optional)</p>
                    <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-[16px] flex flex-col items-center justify-center text-[#666666] hover:bg-gray-50 hover:border-[#007672] transition-colors">
                      <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <span className="text-[13px] font-bold">Click to upload photos</span>
                    </button>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col mb-6 md:mb-0">
                    <p className="text-[14px] font-bold text-[#111111] mb-2">Write a review</p>
                    <textarea 
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="How was the stay? Did your pet enjoy it?"
                      className="w-full flex-1 min-h-[150px] px-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#007672] focus:border-transparent resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleSubmitReview} 
                className="w-full mt-6 py-3.5 bg-[#007672] hover:bg-[#00605c] text-white font-extrabold rounded-full transition-colors shadow-md disabled:opacity-50 flex justify-center items-center gap-2" 
                disabled={rating === 0 || isSubmittingReview}
              >
                {isSubmittingReview ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};
