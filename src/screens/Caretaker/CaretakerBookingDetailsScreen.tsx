import { useState, useRef, useEffect } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { 
  PawPrint, 
  ChevronLeft,
  Calendar,
  Clock,
  Home,
  MessageCircle,
  Phone,
  User,
  MapPin,
  CheckCircle2,
  Car,
  Camera,
  FileText,
  Check,
  Star,
  Paperclip,
  Send,
  CheckCheck,
  Loader2
} from 'lucide-react';

export const CaretakerBookingDetailsScreen = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const initialBooking = location.state?.booking;
  
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'messages'>('details');
  const [booking, setBooking] = useState<any>(initialBooking || null);
  const [loading, setLoading] = useState(!initialBooking);
  const [updating, setUpdating] = useState(false);
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messagesList, setMessagesList] = useState<any[]>([]);

  const firstName = userData?.name ? userData.name.split(' ')[0] : 'Partner';

  // Fetch booking details if not in state
  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'bookings', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBooking({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!booking) {
      fetchBooking();
    }
  }, [id, booking]);

  // Real-time chat listener
  useEffect(() => {
    if (!id) return;
    
    const messagesRef = collection(db, 'bookings', id, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().createdAt ? new Date(doc.data().createdAt.toMillis()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      }));
      setMessagesList(msgs);
    });
    
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'messages') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesList, activeTab]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !user || !id) return;
    
    const msgText = inputText.trim();
    setInputText('');
    
    try {
      await addDoc(collection(db, 'bookings', id, 'messages'), {
        senderId: user.uid,
        sender: firstName,
        text: msgText,
        isCaretaker: true,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!id || !user) return;
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      setBooking(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <CaretakerLayout>
        <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
          <Loader2 size={40} className="animate-spin text-[#FBBF24]" />
        </div>
      </CaretakerLayout>
    );
  }

  if (!booking) {
    return (
      <CaretakerLayout>
        <div className="flex flex-col h-screen items-center justify-center bg-[#FAFAFA] text-center px-4">
          <FileText size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-[#1B2B48] mb-2">Booking Not Found</h2>
          <button onClick={() => navigate('/caretaker/bookings')} className="text-petoo-primary font-bold">Go Back</button>
        </div>
      </CaretakerLayout>
    );
  }

  const isCompleted = booking.status === 'completed';
  const isOngoing = booking.status === 'ongoing';
  
  const dropoffD = new Date(booking.dropoffDate);
  const pickupD = new Date(booking.pickupDate);
  const dateRangeStr = `${dropoffD.toLocaleDateString('en-GB', {day:'2-digit', month:'short'})} – ${pickupD.toLocaleDateString('en-GB', {day:'2-digit', month:'short'})} ${dropoffD.getFullYear()}`;

  return (
    <CaretakerLayout>
      <div className={`w-full flex flex-col bg-[#FAFAFA] font-quicksand text-[#1B2B48] ${
        activeTab === 'messages' && !isCompleted
          ? 'absolute inset-0 z-[40] pb-[72px] lg:pb-0' 
          : 'min-h-screen pb-32 lg:pb-12'
      }`}>
        
        {/* TOP SECTION */}
        <div className={`flex flex-col shrink-0 ${activeTab === 'messages' && !isCompleted ? 'bg-[#FAFAFA] z-10 shadow-sm' : ''}`}>
          
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-[#FAFAFA]/95 backdrop-blur-md z-50">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-1 -ml-2 text-[#1B2B48] font-bold"
            >
              <ChevronLeft size={28} />
              <span className="text-sm">Back</span>
            </button>
            
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center space-x-1.5">
                <PawPrint size={22} className="text-[#FBBF24]" fill="currentColor" />
                <h1 className="text-xl font-extrabold tracking-tight text-[#1B2B48]">
                  PetWali
                </h1>
              </div>
              <span className="text-[10px] font-bold text-[#FBBF24] uppercase tracking-wider -mt-1 ml-[24px]">Partner</span>
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
          <div className="flex-1 px-5 lg:px-8 lg:pt-8 w-full flex flex-col max-w-5xl mx-auto">
            
            {/* Desktop Top Nav */}
            <div className="hidden lg:flex justify-between items-center mb-10">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center space-x-2 text-[#1B2B48] hover:text-[#1B2B48] font-bold transition-colors"
                >
                  <ChevronLeft size={24} />
                  <span>Back</span>
                </button>
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

            {/* Page Title */}
            <div className="flex items-start justify-between mb-8 mt-2 lg:mt-0">
                <div>
                  <h2 className="text-[26px] lg:text-[30px] font-extrabold text-[#4A1D1A] tracking-tight leading-tight mb-1">
                    {isCompleted ? 'Booking Details' : (activeTab === 'timeline' ? 'Booking Timeline' : 'Booking Details')}
                  </h2>
                  {!isCompleted && (
                    <p className="text-[#1B2B48] text-[13px] lg:text-sm font-medium leading-snug">
                      {activeTab === 'timeline' ? 'Track the progress of this booking.' : (activeTab === 'messages' ? 'View details, timeline or chat with the customer.' : 'Here are the complete details for this booking.')}
                    </p>
                  )}
               </div>
            </div>

            {/* Top Pet Card */}
            <div className="bg-white rounded-[24px] p-4 lg:p-6 shadow-[0_4px_20px_rgba(92,58,33,0.03)] border border-white flex mb-6">
              <div className="w-[100px] h-[100px] shrink-0 rounded-[18px] overflow-hidden mr-4 lg:mr-6">
                <img 
                  src={booking.petImage || `https://ui-avatars.com/api/?name=${booking.petName}&background=FBBF24&color=1B2B48`} 
                  alt={booking.petName} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 flex justify-between relative min-w-0">
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl lg:text-[26px] font-extrabold text-[#4A1D1A] leading-none mb-1.5">
                    {booking.petName}
                  </h3>
                  <p className="text-[#1B2B48]/70 text-xs lg:text-sm font-medium mb-3">
                    {booking.petBreed} • {booking.petAge}
                  </p>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center text-[#1B2B48]/80 text-[11px] lg:text-[13px] font-semibold">
                      <Calendar size={13} className="mr-2 opacity-70" />
                      <span>{dateRangeStr} ({booking.nights} nights)</span>
                    </div>
                    <div className="flex items-center text-[#1B2B48]/80 text-[11px] lg:text-[13px] font-semibold">
                      <MapPin size={13} className="mr-2 opacity-70" />
                      <span className="truncate">{booking.addons?.pickupDrop ? 'With Pickup & Drop Service' : 'Drop-off by Parent'}</span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-col items-end space-y-2 absolute top-0 right-0">
                  {isCompleted ? (
                    <div className="bg-gray-100 px-3 py-1.5 rounded-lg text-[12px] lg:text-sm font-bold text-gray-700 flex items-center space-x-1.5 shadow-sm">
                      <CheckCircle2 size={16} className="text-gray-600" />
                      <span>Completed</span>
                    </div>
                  ) : isOngoing ? (
                    <div className="bg-green-100 px-3 py-1.5 rounded-lg text-[12px] lg:text-sm font-bold text-green-700 flex items-center space-x-1.5 shadow-sm">
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span>Ongoing</span>
                    </div>
                  ) : (
                    <div className="bg-blue-100 px-3 py-1 rounded-lg text-[11px] lg:text-xs font-bold text-blue-700">
                      Confirmed
                    </div>
                  )}
                  <div className="bg-[#EAE1DA] px-3 py-1 rounded-lg text-[11px] lg:text-xs font-bold text-[#4A1D1A]">
                    #{booking.id.slice(0,6).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

          </div> {/* End TOP SECTION */}

          {isCompleted ? (
            /* COMPLETED STATE VIEW */
            <div className="flex-1 px-5 lg:px-8 w-full max-w-5xl mx-auto flex flex-col items-center pt-8 lg:pt-16 pb-12">
               
               <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner border border-green-200">
                 <CheckCircle2 size={48} className="text-green-600" />
               </div>
               <h2 className="text-2xl font-extrabold text-[#4A1D1A] mb-2 text-center">Booking Completed Successfully</h2>
               <p className="text-[#1B2B48]/70 text-sm font-medium mb-12 text-center max-w-md">
                 You have successfully completed this booking. Your earnings have been added to your wallet.
               </p>

               <div className="w-full max-w-md space-y-4">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
                    <span className="text-[#1B2B48] font-bold">Total Earnings</span>
                    <span className="text-xl font-extrabold text-[#4A1D1A]">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
                    <span className="text-[#1B2B48] font-bold">Customer Review</span>
                    <div className="flex space-x-1 text-amber-400">
                      <Star size={18} fill="currentColor" />
                      <Star size={18} fill="currentColor" />
                      <Star size={18} fill="currentColor" />
                      <Star size={18} fill="currentColor" />
                      <Star size={18} fill="currentColor" />
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            /* ACTIVE BOOKING VIEW WITH TABS */
            <>
              {/* Tabs Container */}
              <div className="px-5 lg:px-8 w-full max-w-5xl mx-auto z-20">
                <div className="flex bg-[#F5EFE6]/50 p-1.5 rounded-[20px] mb-8 w-full shadow-inner border border-[#E8D4C8]/50">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-3 px-2 lg:px-6 rounded-2xl text-[13px] font-bold transition-all duration-300 flex items-center justify-center ${
                      activeTab === 'details'
                        ? 'bg-[#4A1D1A] text-white shadow-md'
                        : 'text-[#1B2B48] hover:bg-white/50'
                    }`}
                  >
                    <FileText size={16} className={`mr-2 hidden sm:block ${activeTab === 'details' ? 'text-[#FBBF24]' : ''}`} />
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`flex-1 py-3 px-2 lg:px-6 rounded-2xl text-[13px] font-bold transition-all duration-300 flex items-center justify-center ${
                      activeTab === 'timeline'
                        ? 'bg-[#4A1D1A] text-white shadow-md'
                        : 'text-[#1B2B48] hover:bg-white/50'
                    }`}
                  >
                    <Clock size={16} className={`mr-2 hidden sm:block ${activeTab === 'timeline' ? 'text-[#FBBF24]' : ''}`} />
                    Timeline
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`flex-1 py-3 px-2 lg:px-6 rounded-2xl text-[13px] font-bold transition-all duration-300 flex items-center justify-center relative ${
                      activeTab === 'messages'
                        ? 'bg-[#4A1D1A] text-white shadow-md'
                        : 'text-[#1B2B48] hover:bg-white/50'
                    }`}
                  >
                    <MessageCircle size={16} className={`mr-2 hidden sm:block ${activeTab === 'messages' ? 'text-[#FBBF24]' : ''}`} />
                    Messages
                    {/* Unread badge example */}
                    {activeTab !== 'messages' && (
                      <span className="absolute top-2.5 right-2 sm:right-4 w-2 h-2 rounded-full bg-red-500"></span>
                    )}
                  </button>
                </div>
              </div>

              {/* DETAILS TAB */}
              {activeTab === 'details' && (
                <div className="flex-1 px-5 lg:px-8 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 overflow-y-auto">
                  
                  {/* Left Column */}
                  <div className="space-y-6 lg:space-y-8">
                    
                    {/* Pet Parent Info */}
                    <div>
                      <h3 className="text-[18px] lg:text-xl font-extrabold text-[#4A1D1A] mb-4">Pet Parent</h3>
                      <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_rgba(92,58,33,0.04)] border border-white flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <img src={booking.petParentPhoto || `https://ui-avatars.com/api/?name=${booking.petParentName}&background=FBBF24&color=1B2B48`} alt={booking.petParentName} className="w-12 h-12 rounded-full object-cover shadow-sm mr-4" />
                            <div>
                              <p className="font-extrabold text-[#1B2B48] text-[16px]">{booking.petParentName}</p>
                              <p className="text-[13px] text-[#1B2B48]/60 font-medium">Customer</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="w-10 h-10 rounded-full bg-[#EAE1DA] flex items-center justify-center text-[#4A1D1A] hover:bg-[#DCD0C7] transition-colors">
                              <Phone size={18} />
                            </button>
                            <button 
                              onClick={() => setActiveTab('messages')}
                              className="w-10 h-10 rounded-full bg-[#EAE1DA] flex items-center justify-center text-[#4A1D1A] hover:bg-[#DCD0C7] transition-colors"
                            >
                              <MessageCircle size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Specifics */}
                    <div>
                      <h3 className="text-[18px] lg:text-xl font-extrabold text-[#4A1D1A] mb-4">Stay Details</h3>
                      <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_rgba(92,58,33,0.04)] border border-white space-y-5">
                        
                        <div className="flex">
                          <div className="w-10 h-10 rounded-full bg-[#F6EBE5] flex items-center justify-center mr-4 shrink-0">
                            <Calendar size={18} className="text-[#4A1D1A]" />
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-[#1B2B48]/60 uppercase tracking-wider mb-0.5">Drop-off</p>
                            <p className="font-extrabold text-[#1B2B48] text-[15px]">{new Date(booking.dropoffDate).toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'})}</p>
                            <p className="text-[13px] text-[#1B2B48]/70 font-medium">{booking.dropoffTime || 'Not specified'}</p>
                          </div>
                        </div>

                        <div className="w-px h-8 bg-gray-200 ml-5 -my-2"></div>

                        <div className="flex">
                          <div className="w-10 h-10 rounded-full bg-[#F6EBE5] flex items-center justify-center mr-4 shrink-0">
                            <Calendar size={18} className="text-[#4A1D1A]" />
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-[#1B2B48]/60 uppercase tracking-wider mb-0.5">Pick-up</p>
                            <p className="font-extrabold text-[#1B2B48] text-[15px]">{new Date(booking.pickupDate).toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'})}</p>
                            <p className="text-[13px] text-[#1B2B48]/70 font-medium">{booking.pickupTime || 'Not specified'}</p>
                          </div>
                        </div>
                        
                        <div className="h-px w-full bg-gray-100"></div>

                        <div className="flex">
                          <div className="w-10 h-10 rounded-full bg-[#F6EBE5] flex items-center justify-center mr-4 shrink-0">
                            <Home size={18} className="text-[#4A1D1A]" />
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-[#1B2B48]/60 uppercase tracking-wider mb-0.5">Service Type</p>
                            <p className="font-extrabold text-[#1B2B48] text-[15px]">{booking.service}</p>
                          </div>
                        </div>

                        {booking.addons?.pickupDrop && (
                          <div className="flex">
                            <div className="w-10 h-10 rounded-full bg-[#F6EBE5] flex items-center justify-center mr-4 shrink-0">
                              <Car size={18} className="text-[#4A1D1A]" />
                            </div>
                            <div>
                              <p className="text-[12px] font-bold text-[#1B2B48]/60 uppercase tracking-wider mb-0.5">Transportation</p>
                              <p className="font-extrabold text-[#1B2B48] text-[15px]">Pickup & Drop Service Included</p>
                              <p className="text-[13px] text-[#1B2B48]/70 font-medium mt-1 pr-2">{booking.addons.pickupAddress}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6 lg:space-y-8">
                    
                    {/* Special Needs */}
                    <div>
                      <h3 className="text-[18px] lg:text-xl font-extrabold text-[#4A1D1A] mb-4">Pet Needs & Notes</h3>
                      <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_rgba(92,58,33,0.04)] border border-white">
                        <p className="text-[#1B2B48]/80 text-[14px] font-medium leading-relaxed">
                          {booking.specialRequirements || "No special requirements provided by the parent."}
                        </p>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div>
                      <h3 className="text-[18px] lg:text-xl font-extrabold text-[#4A1D1A] mb-4">Earnings</h3>
                      <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_rgba(92,58,33,0.04)] border border-white flex flex-col space-y-4">
                         
                         <div className="flex justify-between items-center text-[14px]">
                           <span className="text-[#1B2B48]/70 font-bold">Stay ({booking.nights} nights)</span>
                           <span className="text-[#1B2B48] font-bold">₹{booking.bookingAmount}</span>
                         </div>
                         
                         {booking.addons?.pickupDrop && (
                           <div className="flex justify-between items-center text-[14px]">
                             <span className="text-[#1B2B48]/70 font-bold">Pickup & Drop</span>
                             <span className="text-[#1B2B48] font-bold">₹{booking.addons.pickupFee}</span>
                           </div>
                         )}

                         <div className="h-px w-full bg-gray-100"></div>

                         <div className="flex justify-between items-center">
                           <span className="text-[16px] text-[#1B2B48] font-extrabold">Total Earnings</span>
                           <span className="text-[20px] text-[#4A1D1A] font-extrabold">₹{booking.totalAmount}</span>
                         </div>

                         <div className="mt-2 bg-[#F5EFE6]/50 rounded-xl p-3 flex items-start">
                           <CheckCircle2 size={16} className="text-[#C79133] mr-2 shrink-0 mt-0.5" />
                           <p className="text-[12px] text-[#1B2B48]/70 font-medium">
                             Payment will be credited to your linked bank account after the stay is completed.
                           </p>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TIMELINE TAB */}
              {activeTab === 'timeline' && (
                <div className="flex-1 px-5 lg:px-8 w-full max-w-2xl mx-auto pb-10">
                  <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-[0_2px_15px_rgba(92,58,33,0.04)] border border-white">
                    <div className="relative pl-6 border-l-2 border-[#EAE1DA] space-y-10">
                      
                      {/* Step 1: Booking Confirmed */}
                      <div className="relative">
                        <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-[#4A1D1A] flex items-center justify-center border-4 border-white shadow-sm z-10">
                          <Check size={14} className="text-white stroke-[3]" />
                        </div>
                        <div>
                          <h4 className="text-[16px] font-extrabold text-[#1B2B48] mb-1">Booking Confirmed</h4>
                          <p className="text-[13px] text-[#1B2B48]/60 font-bold mb-2">
                            {new Date(booking.createdAt?.toMillis() || Date.now()).toLocaleDateString('en-GB', {day:'2-digit', month:'short'})}
                          </p>
                          <p className="text-[14px] text-[#1B2B48]/80 font-medium">
                            You accepted the booking request from {booking.petParentName}.
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Drop-off */}
                      <div className="relative">
                        <div className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-colors ${
                          isOngoing ? 'bg-[#4A1D1A]' : 'bg-[#EAE1DA]'
                        }`}>
                          {isOngoing ? <Check size={14} className="text-white stroke-[3]" /> : <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                        </div>
                        <div>
                          <h4 className={`text-[16px] font-extrabold mb-1 transition-colors ${isOngoing ? 'text-[#1B2B48]' : 'text-[#1B2B48]/60'}`}>Pet Drop-off</h4>
                          <p className="text-[13px] text-[#1B2B48]/60 font-bold mb-2">
                            Scheduled: {new Date(booking.dropoffDate).toLocaleDateString('en-GB', {day:'2-digit', month:'short'})}
                          </p>
                          <p className={`text-[14px] font-medium transition-colors ${isOngoing ? 'text-[#1B2B48]/80' : 'text-[#1B2B48]/50'}`}>
                            {isOngoing 
                              ? `${booking.petName} has arrived and is currently in your care.`
                              : `Mark as arrived when ${booking.petName} is dropped off.`}
                          </p>
                          {!isOngoing && booking.status === 'accepted' && (
                            <button 
                              onClick={() => updateStatus('ongoing')}
                              disabled={updating}
                              className="mt-4 bg-[#174F38] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-sm hover:bg-[#113a29] transition-colors flex items-center disabled:opacity-50"
                            >
                              {updating ? <Loader2 size={16} className="animate-spin mr-2" /> : <CheckCircle2 size={16} className="mr-2" />}
                              Mark as Arrived
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Step 3: Pick-up / Completion */}
                      <div className="relative">
                        <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-[#EAE1DA] flex items-center justify-center border-4 border-white shadow-sm z-10">
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        </div>
                        <div>
                          <h4 className="text-[16px] font-extrabold text-[#1B2B48]/60 mb-1">Stay Completed</h4>
                          <p className="text-[13px] text-[#1B2B48]/60 font-bold mb-2">
                            Scheduled: {new Date(booking.pickupDate).toLocaleDateString('en-GB', {day:'2-digit', month:'short'})}
                          </p>
                          <p className="text-[14px] text-[#1B2B48]/50 font-medium">
                            Mark as completed once the pet is picked up.
                          </p>
                          {isOngoing && (
                            <button 
                              onClick={() => updateStatus('completed')}
                              disabled={updating}
                              className="mt-4 bg-[#C79133] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-sm hover:bg-[#a67727] transition-colors flex items-center disabled:opacity-50"
                            >
                              {updating ? <Loader2 size={16} className="animate-spin mr-2" /> : <CheckCircle2 size={16} className="mr-2" />}
                              Mark as Completed
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* MESSAGES TAB */}
              {activeTab === 'messages' && (
                <div className="flex-1 w-full bg-[#FAFAFA] flex flex-col relative z-20 overflow-hidden">
                  
                  {/* Chat Area */}
                  <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6">
                    {messagesList.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-50">
                        <MessageCircle size={48} className="mb-4" />
                        <p className="font-bold">No messages yet.</p>
                      </div>
                    ) : (
                      messagesList.map((msg, idx) => {
                        const isMe = msg.isCaretaker;
                        return (
                          <div key={idx} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[85%] lg:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                               {!isMe && (
                                  <img 
                                    src={booking.petParentPhoto || `https://ui-avatars.com/api/?name=${booking.petParentName}&background=FBBF24&color=1B2B48`} 
                                    alt="Avatar" 
                                    className="w-8 h-8 rounded-full mt-auto mr-3 shrink-0 object-cover" 
                                  />
                               )}
                               
                               <div className="flex flex-col">
                                  <div className={`p-4 shadow-sm relative ${
                                    isMe 
                                      ? 'bg-[#1B2B48] text-white rounded-[20px] rounded-br-sm' 
                                      : 'bg-white text-[#1B2B48] rounded-[20px] rounded-bl-sm border border-gray-100'
                                  }`}>
                                    <p className={`text-[14px] lg:text-[15px] leading-relaxed font-medium ${isMe ? 'text-white' : 'text-[#1B2B48]'}`}>
                                      {msg.text}
                                    </p>
                                  </div>
                                  <div className={`flex items-center mt-1.5 space-x-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <span className="text-[10px] lg:text-[11px] font-bold text-[#1B2B48]/40">
                                      {msg.time}
                                    </span>
                                  </div>
                               </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input Container */}
                  <div className="bg-white border-t border-gray-100 p-4 lg:p-6 w-full shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                    <form 
                      onSubmit={handleSendMessage}
                      className="max-w-4xl mx-auto flex items-end space-x-2 lg:space-x-4 relative"
                    >
                      <div className="flex-1 bg-[#F8F9FA] border border-gray-200 rounded-[24px] flex items-end pl-4 pr-2 py-2 min-h-[52px]">
                         <textarea
                           value={inputText}
                           onChange={(e) => setInputText(e.target.value)}
                           placeholder="Type your message..."
                           className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-[14px] lg:text-[15px] font-medium text-[#1B2B48] py-2 max-h-[120px] outline-none placeholder:text-[#465E87]/50"
                           rows={1}
                           onKeyDown={(e) => {
                             if (e.key === 'Enter' && !e.shiftKey) {
                               e.preventDefault();
                               handleSendMessage();
                             }
                           }}
                         />
                         <button type="button" className="p-2 text-[#465E87] hover:text-[#1B2B48] hover:bg-white rounded-full transition-colors self-end mb-0.5">
                           <Camera size={20} />
                         </button>
                      </div>
                      <button 
                        type="submit"
                        disabled={!inputText.trim()}
                        className="w-[52px] h-[52px] shrink-0 bg-[#4A1D1A] rounded-full flex items-center justify-center text-white shadow-[0_4px_15px_rgba(74,29,26,0.3)] hover:bg-[#3d1815] transition-colors disabled:opacity-50 disabled:shadow-none"
                      >
                        <Send size={20} className="ml-1" />
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </CaretakerLayout>
  );
};
