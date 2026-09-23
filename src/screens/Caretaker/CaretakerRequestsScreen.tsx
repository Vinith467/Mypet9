import { useState, useEffect } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { GlobalRequestModal } from '../../components/caretaker/GlobalRequestModal';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  PawPrint, 
  ChevronLeft,
  Calendar,
  Moon,
  Home,
  ChevronRight,
  Clock,
  MapPin,
  FileText,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingRequest {
  id: string;
  petName: string;
  petBreed: string;
  petAge: string;
  petImage: string;
  petType: string;
  petParentName: string;
  petParentPhoto: string;
  service: string;
  dropoffDate: string;
  pickupDate: string;
  nights: number;
  totalAmount: number;
  status: string;
  specialRequirements: string;
  caretakerLocation: string;
  createdAt: any;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const CaretakerRequestsScreen = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const firstName = userData?.name ? userData.name.split(' ')[0] : 'Partner';

  useEffect(() => {
    const fetchRequests = async () => {
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
        const data: BookingRequest[] = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as BookingRequest));
        
        data.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });
        
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user]);

  const handleStatusUpdate = async (bookingId: string, newStatus: 'accepted' | 'declined') => {
    setUpdatingId(bookingId);
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      // Update local state
      setRequests(prev => prev.map(r => 
        r.id === bookingId ? { ...r, status: newStatus } : r
      ));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'pending') return r.status === 'pending';
    if (activeTab === 'accepted') return r.status === 'accepted' || r.status === 'ongoing';
    return r.status === 'declined';
  });

  const tabCounts = {
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted' || r.status === 'ongoing').length,
    declined: requests.filter(r => r.status === 'declined').length,
  };

  const getPillStyle = (status: string) => {
    switch(status) {
      case 'pending': return { bg: 'bg-[#FFEAEA]', text: 'text-[#FF4D4D]', label: 'New' };
      case 'accepted': return { bg: 'bg-[#E0F5E9]', text: 'text-[#0B7C41]', label: 'Accepted' };
      case 'ongoing': return { bg: 'bg-[#EBF3FF]', text: 'text-[#195FE6]', label: 'Ongoing' };
      case 'declined': return { bg: 'bg-[#F4EBFF]', text: 'text-[#6B21A8]', label: 'Declined' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
    }
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
              <div className="flex flex-col">
                 <h2 className="text-3xl font-extrabold text-[#1B2B48] tracking-tight leading-none mb-1">Booking Requests</h2>
                 <p className="text-[#1B2B48]/70 text-sm font-medium">Manage incoming pet care requests.</p>
              </div>
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
              Booking Requests
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#F5EFE6]/50 p-1.5 rounded-[20px] mb-8 overflow-x-auto scrollbar-hide shrink-0 shadow-inner space-x-1 lg:space-x-2">
            {([
              { key: 'pending', label: 'New' },
              { key: 'accepted', label: 'Accepted' },
              { key: 'declined', label: 'Declined' },
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

          {/* Requests List */}
          <div className="flex flex-col space-y-4 mb-10 w-full max-w-3xl mx-auto lg:max-w-none">
            
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={32} className="animate-spin text-[#FBBF24]" />
              </div>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((request) => {
                const pill = getPillStyle(request.status);
                return (
                  <motion.div
                    key={request.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="bg-white rounded-3xl p-4 shadow-[0_2px_15px_rgba(92,58,33,0.04)] border border-white transition-all"
                  >
                    <div className="flex items-start">
                      <div className="w-[80px] h-[100px] shrink-0 rounded-2xl overflow-hidden relative mr-4 shadow-sm">
                        <img 
                          src={request.petImage || `https://ui-avatars.com/api/?name=${request.petName}&background=FBBF24&color=1B2B48`} 
                          alt={request.petName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-extrabold text-[#1B2B48] truncate pr-2">
                            {request.petName}
                          </h3>
                          <span className={`${pill.bg} ${pill.text} px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0`}>
                            {pill.label}
                          </span>
                        </div>
                        <p className="text-[#1B2B48]/70 text-[12px] font-medium mb-2">
                          {request.petBreed} • {request.petAge} • by {request.petParentName}
                        </p>

                        <div className="space-y-1">
                          <div className="flex items-center text-[#1B2B48]/80 text-[12px] font-semibold">
                            <Calendar size={13} className="mr-2 text-[#5C1C1D] shrink-0" />
                            <span>{formatDate(request.dropoffDate)} – {formatDate(request.pickupDate)}</span>
                          </div>
                          <div className="flex items-center text-[#1B2B48]/80 text-[12px] font-semibold">
                            <Moon size={13} className="mr-2 text-[#5C1C1D] shrink-0" />
                            <span>{request.nights} night{request.nights > 1 ? 's' : ''} • ₹{request.totalAmount?.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex items-center text-[#1B2B48]/80 text-[12px] font-semibold">
                            <Home size={13} className="mr-2 text-[#5C1C1D] shrink-0" />
                            <span>{request.service}</span>
                          </div>
                        </div>

                        {/* Action Buttons for pending requests */}
                        {request.status === 'pending' && (
                          <div className="flex space-x-3 mt-4">
                            <button
                              onClick={() => handleStatusUpdate(request.id, 'accepted')}
                              disabled={updatingId === request.id}
                              className="flex-1 bg-[#174F38] text-white py-2.5 rounded-xl text-[13px] font-bold hover:bg-[#113a29] transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                              {updatingId === request.id ? <Loader2 size={16} className="animate-spin" /> : 'Accept'}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request.id, 'declined')}
                              disabled={updatingId === request.id}
                              className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl text-[13px] font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {request.specialRequirements && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-[11px] text-gray-500 font-medium">
                          <span className="font-bold text-gray-600">Note: </span>{request.specialRequirements}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#FFFFFF] rounded-full flex items-center justify-center mb-4">
                  <FileText size={28} className="text-[#FBBF24]/50" />
                </div>
                <h3 className="text-lg font-bold text-[#1B2B48] mb-1">No {activeTab} requests</h3>
                <p className="text-[#1B2B48]/60 text-sm font-medium">You don't have any {activeTab} requests at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CaretakerLayout>
  );
};
