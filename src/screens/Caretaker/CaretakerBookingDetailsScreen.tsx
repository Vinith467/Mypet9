import { useState, useRef, useEffect } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  PawPrint, 
  ChevronLeft,
  Calendar,
  Clock,
  Home,
  MessageCircle,
  Phone,
  User,
  IndianRupee,
  MapPin,
  CheckCircle2,
  Car,
  Camera,
  FileText,
  Check,
  Star,
  Paperclip,
  Send,
  CheckCheck
} from 'lucide-react';

export const CaretakerBookingDetailsScreen = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'messages'>('details');
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messagesList, setMessagesList] = useState([
    {
      id: 1,
      sender: 'Aditi Sharma',
      text: 'Hi! Is Buddy doing well?',
      time: '12 Sep, 3:15 PM',
      isCaretaker: false,
      avatar: 'https://ui-avatars.com/api/?name=Aditi+Sharma&background=EAE1DA&color=4A1D1A',
      date: '12 Sep 2026'
    },
    {
      id: 2,
      sender: 'Me',
      text: "Yes! Buddy is doing great. He's happy and settled in. 😊",
      time: '12 Sep, 3:10 PM',
      isCaretaker: true,
    },
    {
      id: 3,
      sender: 'Aditi Sharma',
      text: 'Thank you for the update! Looking forward to more photos. 😊',
      time: '15 Sep, 11:02 AM',
      isCaretaker: false,
      avatar: 'https://ui-avatars.com/api/?name=Aditi+Sharma&background=EAE1DA&color=4A1D1A',
      date: '15 Sep 2026'
    },
    {
      id: 4,
      sender: 'Me',
      text: 'Buddy had a great walk today!',
      time: '15 Sep, 12:10 PM',
      isCaretaker: true,
      image: '/assets/bandana_dog.jpg'
    }
  ]);

  useEffect(() => {
    if (activeTab === 'messages' && !isCompleted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesList, activeTab, isCompleted]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'Me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCaretaker: true
    };
    
    setMessagesList(prev => [...prev, newMsg]);
    setInputText('');
  };

  const firstName = userData?.name ? userData.name.split(' ')[0] : 'Partner';

  return (
    <CaretakerLayout>
      <div className={`w-full flex flex-col bg-[#FDF8F3] font-quicksand text-[#3E2723] ${
        activeTab === 'messages' && !isCompleted
          ? 'absolute inset-0 z-[40] pb-[72px] lg:pb-0' 
          : 'min-h-screen pb-32 lg:pb-12'
      }`}>
        
        {/* TOP SECTION */}
        <div className={`flex flex-col shrink-0 ${activeTab === 'messages' && !isCompleted ? 'bg-[#FDF8F3] z-10 shadow-sm' : ''}`}>
          
          {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-[#FDF8F3]/95 backdrop-blur-md z-50">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1 -ml-2 text-[#5C3A21] font-bold"
          >
            <ChevronLeft size={28} />
            <span className="text-sm">Back</span>
          </button>
          
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center space-x-1.5">
              <PawPrint size={22} className="text-[#A26D45]" fill="currentColor" />
              <h1 className="text-xl font-extrabold tracking-tight text-[#3E2723]">
                PetWali
              </h1>
            </div>
            <span className="text-[10px] font-bold text-[#A26D45] uppercase tracking-wider -mt-1 ml-[24px]">Partner</span>
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
        <div className="flex-1 px-5 lg:px-12 lg:pt-8 w-full flex flex-col max-w-5xl mx-auto">
          
          {/* Desktop Top Nav */}
          <div className="hidden lg:flex justify-between items-center mb-10">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-[#5C3A21] hover:text-[#3E2723] font-bold transition-colors"
              >
                <ChevronLeft size={24} />
                <span>Back</span>
              </button>
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

          {/* Page Title & Cute Graphic */}
          <div className="flex items-start justify-between mb-8 mt-2 lg:mt-0">
             <div>
                <h2 className="text-[26px] lg:text-[34px] font-extrabold text-[#4A1D1A] tracking-tight leading-tight mb-1">
                  {isCompleted ? 'Booking Details' : (activeTab === 'timeline' ? 'Booking Timeline' : 'Booking Details')}
                </h2>
                {!isCompleted && (
                  <p className="text-[#5C3A21] text-[13px] lg:text-sm font-medium leading-snug">
                    {activeTab === 'timeline' ? 'Track the progress of this booking.' : (activeTab === 'messages' ? 'View details, timeline or chat with the customer.' : 'Here are the complete details for this booking.')}
                  </p>
                )}
             </div>
             <div className="flex flex-col items-center opacity-80 pt-1 hidden lg:flex">
                <PawPrint size={24} className="text-[#E8D4C8] mb-1 -ml-8 rotate-[-10deg]" fill="currentColor" />
                <span className="font-caveat text-xl lg:text-2xl font-bold text-[#4A1D1A] leading-tight rotate-[-5deg]">
                  Happy Pets
                </span>
                <span className="font-caveat text-xl lg:text-2xl font-bold text-[#4A1D1A] leading-tight rotate-[-5deg] ml-4">
                  Happier People ♥
                </span>
             </div>
          </div>

          {/* Top Pet Card */}
          <div className="bg-white rounded-[24px] p-4 lg:p-6 shadow-[0_4px_20px_rgba(92,58,33,0.03)] border border-white flex mb-6">
            <div className="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] rounded-[18px] overflow-hidden shrink-0 mr-4 lg:mr-6">
              <img 
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300" 
                alt="Buddy" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 flex justify-between relative min-w-0">
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl lg:text-3xl font-extrabold text-[#4A1D1A] leading-none mb-1.5">
                  Buddy
                </h3>
                <p className="text-[#5C3A21]/70 text-xs lg:text-sm font-medium mb-3">
                  Golden Retriever • 3 years
                </p>
                
                <div className="space-y-1.5">
                  <div className="flex items-center text-[#5C3A21]/80 text-[11px] lg:text-[13px] font-semibold">
                    <span className="mr-2 opacity-70">♂</span>
                    <span>Male</span>
                  </div>
                  <div className="flex items-center text-[#5C3A21]/80 text-[11px] lg:text-[13px] font-semibold">
                    <Calendar size={13} className="mr-2 opacity-70" />
                    <span>15 Sep – 18 Sep 2026 (3 nights)</span>
                  </div>
                  <div className="flex items-center text-[#5C3A21]/80 text-[11px] lg:text-[13px] font-semibold">
                    <MapPin size={13} className="mr-2 opacity-70" />
                    <span className="truncate">With Pickup & Drop Service</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-col items-end space-y-2 absolute top-0 right-0">
                {isCompleted ? (
                  <div className="bg-green-100 px-3 py-1.5 rounded-lg text-[12px] lg:text-sm font-bold text-green-700 flex items-center space-x-1.5 shadow-sm">
                    <CheckCircle2 size={16} className="text-green-600" />
                    <span>Completed</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-[#F6EBE5] px-3 py-1 rounded-lg text-[11px] lg:text-xs font-bold text-[#4A1D1A]">
                      Confirmed
                    </div>
                    <div className="bg-[#EAE1DA] px-3 py-1 rounded-lg text-[11px] lg:text-xs font-bold text-[#4A1D1A]">
                      #1845201
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          </div> {/* End TOP SECTION */}

          {isCompleted ? (
            <div className="flex flex-col items-center mt-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Large Checkmark */}
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-[#4A1D1A] rounded-full flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(74,29,26,0.25)]">
                <Check size={48} strokeWidth={4} className="text-white lg:scale-125" />
              </div>
              
              {/* Success Text */}
              <h3 className="text-3xl lg:text-4xl font-extrabold text-[#4A1D1A] mb-3">Service Completed!</h3>
              <p className="text-[#5C3A21] text-[15px] lg:text-[17px] font-medium text-center max-w-sm lg:max-w-md mb-10 leading-relaxed">
                The stay and all services for Buddy have been successfully completed.
              </p>

              {/* Customer Review Card */}
              <div className="w-full max-w-md bg-white border border-[#F3EBE1] rounded-[24px] p-5 lg:p-6 shadow-[0_8px_30px_rgba(92,58,33,0.04)] mb-10">
                <h4 className="text-[#4A1D1A] font-extrabold text-[15px] lg:text-[16px] mb-4">Customer Review</h4>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img src="https://ui-avatars.com/api/?name=Aditi+Sharma&background=F6EBE5&color=4A1D1A" alt="Aditi Sharma" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="text-[#4A1D1A] font-extrabold text-[14px]">Aditi Sharma</p>
                      <p className="text-[#5C3A21] text-[12px] opacity-80 font-medium">15 Sep 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} className="text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-[#4A1D1A] font-extrabold text-[14px] ml-1">5.0</span>
                  </div>
                </div>
                <p className="text-[#5C3A21] text-[13px] lg:text-[14px] italic font-medium leading-relaxed opacity-90">
                  "Buddy had a wonderful stay! Great care, regular updates and lots of outdoor play. Highly recommended!"
                </p>
              </div>

              {/* Buttons */}
              <div className="w-full max-w-md flex flex-col space-y-3">
                <button className="w-full py-4 rounded-2xl bg-transparent border-2 border-[#4A1D1A] text-[#4A1D1A] font-extrabold text-[15px] hover:bg-[#4A1D1A]/5 transition-colors">
                  View Booking Summary
                </button>
                <button 
                  onClick={() => navigate('/caretaker/bookings')}
                  className="w-full py-4 rounded-2xl bg-[#4A1D1A] text-white font-extrabold text-[15px] shadow-[0_8px_20px_rgba(74,29,26,0.25)] hover:bg-[#3E1614] transition-colors"
                >
                  Back to Bookings
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tabs */}
        <div className="flex bg-[#FBF6EE] rounded-[24px] mb-6 shadow-sm overflow-x-auto scrollbar-hide shrink-0">
          <button
            onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 px-4 rounded-[20px] text-sm font-extrabold transition-all duration-300 ${
                activeTab === 'details'
                  ? 'bg-[#4A1D1A] text-white shadow-md'
                  : 'text-[#4A1D1A] hover:bg-white/50 bg-white border border-[#F3EBE1]'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-3 px-4 rounded-[20px] text-sm font-extrabold transition-all duration-300 ${
                activeTab === 'timeline'
                  ? 'bg-[#4A1D1A] text-white shadow-md'
                  : 'text-[#4A1D1A] hover:bg-white/50 bg-white border border-[#F3EBE1]'
              } mx-2`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-3 px-4 rounded-[20px] text-sm font-extrabold transition-all duration-300 ${
                activeTab === 'messages'
                  ? 'bg-[#4A1D1A] text-white shadow-md'
                  : 'text-[#4A1D1A] hover:bg-white/50 bg-white border border-[#F3EBE1]'
              }`}
            >
              Messages
            </button>
          </div>

          {/* Details Content */}
          {activeTab === 'details' && (
            <div className="relative bg-white rounded-[32px] overflow-hidden flex flex-col mb-8 shadow-[0_8px_30px_rgba(92,58,33,0.04)] border border-white">
              
              {/* Content Container */}
              <div className="p-5 lg:p-8 flex flex-col space-y-4 z-10 relative w-full lg:w-[65%]">
                
                <div className="flex items-start space-x-3 lg:space-x-4">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#F6EBE5] flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-[#4A1D1A]" />
                  </div>
                  <div>
                    <h4 className="text-[#4A1D1A] font-extrabold text-[14px] lg:text-[15px] mb-0.5">Check-in</h4>
                    <p className="text-[#5C3A21] font-medium text-[12px] lg:text-[13px]">15 Sep 2026, 10:00 AM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 lg:space-x-4">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#F6EBE5] flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-[#4A1D1A] border-b-2 border-dashed border-[#4A1D1A]/30 pb-0.5" />
                  </div>
                  <div>
                    <h4 className="text-[#4A1D1A] font-extrabold text-[14px] lg:text-[15px] mb-0.5">Check-out</h4>
                    <p className="text-[#5C3A21] font-medium text-[12px] lg:text-[13px]">18 Sep 2026, 5:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 lg:space-x-4">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#F6EBE5] flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-[#4A1D1A]" />
                  </div>
                  <div>
                    <h4 className="text-[#4A1D1A] font-extrabold text-[14px] lg:text-[15px] mb-0.5">Duration</h4>
                    <p className="text-[#5C3A21] font-medium text-[12px] lg:text-[13px]">3 nights</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 lg:space-x-4">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#F6EBE5] flex items-center justify-center shrink-0">
                    <PawPrint size={18} className="text-[#4A1D1A]" />
                  </div>
                  <div>
                    <h4 className="text-[#4A1D1A] font-extrabold text-[14px] lg:text-[15px] mb-0.5">Pet Type & Size</h4>
                    <p className="text-[#5C3A21] font-medium text-[12px] lg:text-[13px]">Dog (Large)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 lg:space-x-4">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#F6EBE5] flex items-center justify-center shrink-0">
                    <Home size={18} className="text-[#4A1D1A]" />
                  </div>
                  <div>
                    <h4 className="text-[#4A1D1A] font-extrabold text-[14px] lg:text-[15px] mb-0.5">Space Type</h4>
                    <p className="text-[#5C3A21] font-medium text-[12px] lg:text-[13px]">Large Dog Space</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 lg:space-x-4">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#F6EBE5] flex items-center justify-center shrink-0">
                    <IndianRupee size={18} className="text-[#4A1D1A]" />
                  </div>
                  <div>
                    <h4 className="text-[#4A1D1A] font-extrabold text-[14px] lg:text-[15px] mb-0.5">Total Amount</h4>
                    <p className="text-[#5C3A21] font-medium text-[12px] lg:text-[13px]">
                      <span className="font-extrabold text-[14px] lg:text-[15px]">₹3,000</span> (₹1,000 / night)
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-[#FDF8F3] rounded-2xl p-3.5 border border-[#F3EBE1] shadow-sm mt-2 max-w-sm backdrop-blur-sm bg-opacity-90">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#EAE1DA] flex items-center justify-center shrink-0">
                      <User size={18} className="text-[#4A1D1A]" />
                    </div>
                    <div>
                      <h4 className="text-[#4A1D1A] font-extrabold text-[13px] lg:text-[14px] mb-0.5">Customer</h4>
                      <p className="text-[#5C3A21] font-medium text-[11px] lg:text-[12px]">Aditi Sharma</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="w-9 h-9 rounded-full bg-[#EAE1DA] flex items-center justify-center text-[#4A1D1A] hover:bg-[#D9CFC6] transition-colors">
                      <Phone size={16} />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-[#EAE1DA] flex items-center justify-center text-[#4A1D1A] hover:bg-[#D9CFC6] transition-colors">
                      <MessageCircle size={16} />
                    </button>
                  </div>
                </div>
                
              </div>

              {/* Decorative Blob Image - Absolute on both */}
              <div className="absolute right-[-40px] bottom-[20px] lg:right-[-20px] lg:bottom-0 w-[220px] h-[300px] lg:w-[380px] lg:h-[480px] pointer-events-none z-0">
                 <div 
                   className="w-full h-full overflow-hidden relative"
                   style={{ borderRadius: '43% 57% 70% 30% / 48% 63% 37% 52%' }}
                 >
                   <img 
                     src="/assets/bandana_dog.jpg" 
                     alt="Dog" 
                     className="absolute inset-0 w-full h-full object-cover scale-[1.1] translate-y-3 lg:translate-y-6"
                   />
                 </div>
              </div>

            </div>
          )}

          {/* Timeline Content */}
          {activeTab === 'timeline' && (
            <div className="relative mb-8 pt-4 pb-12 w-full lg:w-4/5">
              {/* Vertical Line */}
              <div className="absolute left-[39px] lg:left-[43px] top-[24px] bottom-[100px] lg:bottom-[110px] w-0.5 bg-gradient-to-b from-[#4A1D1A] from-50% to-[#EAE1DA] to-50%"></div>

              {/* Step 1 */}
              <div className="flex items-start mb-8 relative z-10 group">
                <div className="w-[38px] h-[38px] lg:w-[46px] lg:h-[46px] rounded-full bg-[#4A1D1A] flex items-center justify-center shrink-0 border-[4px] border-[#FDF8F3] mx-5 transition-transform group-hover:scale-110">
                  <Check size={20} className="text-white stroke-[3px]" />
                </div>
                <div className="flex-1 bg-[#F6EBE5]/60 rounded-2xl p-4 lg:p-5">
                  <h4 className="text-[#4A1D1A] font-extrabold text-[15px] lg:text-[16px] mb-0.5">Booking Confirmed</h4>
                  <p className="text-[#5C3A21] font-medium text-[12px] lg:text-[13px] opacity-70 mb-1">15 Sep 2026, 9:30 AM</p>
                  <p className="text-[#5C3A21] font-medium text-[13px] lg:text-[14px]">Customer selected your quotation.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start mb-8 relative z-10 group">
                <div className="w-[38px] h-[38px] lg:w-[46px] lg:h-[46px] rounded-full bg-[#4A1D1A] flex items-center justify-center shrink-0 border-[4px] border-[#FDF8F3] mx-5 transition-transform group-hover:scale-110">
                  <Car size={18} className="text-white" />
                </div>
                <div className="flex-1 bg-[#F6EBE5]/60 rounded-2xl p-4 lg:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-[#4A1D1A] font-extrabold text-[15px] lg:text-[16px] mb-0.5">Pickup (From Pet Parent)</h4>
                    <p className="text-[#5C3A21] font-medium text-[12px] lg:text-[13px] opacity-70 mb-1">15 Sep 2026, 10:00 AM</p>
                    <p className="text-[#5C3A21] font-medium text-[13px] lg:text-[14px]">You picked up Buddy from the pet parent's location.</p>
                  </div>
                  <button className="flex items-center space-x-1.5 px-4 py-2 bg-transparent border border-[#4A1D1A] rounded-[10px] text-[#4A1D1A] font-extrabold text-[13px] hover:bg-[#4A1D1A]/5 shrink-0 self-start lg:self-center transition-colors">
                    <MapPin size={14} />
                    <span>View Details</span>
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start mb-8 relative z-10 group">
                <div className="w-[38px] h-[38px] lg:w-[46px] lg:h-[46px] rounded-full bg-[#4A1D1A] flex items-center justify-center shrink-0 border-[4px] border-[#FDF8F3] mx-5 transition-transform group-hover:scale-110">
                  <Home size={18} className="text-white" />
                </div>
                <div className="flex-1 bg-[#F6EBE5]/60 rounded-2xl p-4 lg:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-[#4A1D1A] font-extrabold text-[15px] lg:text-[16px] mb-0.5">Pet Check-in (At Your Place)</h4>
                    <p className="text-[#5C3A21] font-medium text-[12px] lg:text-[13px] opacity-70 mb-1">15 Sep 2026, 10:30 AM</p>
                    <p className="text-[#5C3A21] font-medium text-[13px] lg:text-[14px]">Share arrival photos and check-in details.</p>
                  </div>
                  <button className="flex items-center space-x-1.5 px-4 py-2 bg-[#4A1D1A] rounded-[10px] text-white font-extrabold text-[13px] hover:bg-[#3E1614] shrink-0 self-start lg:self-center shadow-sm transition-colors">
                    <Camera size={14} />
                    <span>Send Update</span>
                  </button>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start mb-8 relative z-10 group">
                <div className="w-[38px] h-[38px] lg:w-[46px] lg:h-[46px] rounded-full bg-[#EAE1DA] flex items-center justify-center shrink-0 border-[4px] border-[#FDF8F3] mx-5 transition-transform group-hover:scale-110">
                  <PawPrint size={18} className="text-[#4A1D1A]" />
                </div>
                <div className="flex-1 bg-white/60 border border-[#F3EBE1] rounded-2xl p-4 lg:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
                  <div>
                    <h4 className="text-[#4A1D1A] font-extrabold text-[15px] lg:text-[16px] mb-0.5">During Stay</h4>
                    <p className="text-[#5C3A21] font-medium text-[12px] lg:text-[13px] opacity-70 mb-1">15 Sep – 17 Sep 2026</p>
                    <p className="text-[#5C3A21] font-medium text-[13px] lg:text-[14px]">Share updates, photos or videos.</p>
                  </div>
                  <button className="flex items-center space-x-1.5 px-4 py-2 bg-transparent border border-[#4A1D1A]/50 rounded-[10px] text-[#4A1D1A] font-extrabold text-[13px] hover:bg-[#4A1D1A]/5 shrink-0 self-start lg:self-center transition-colors">
                    <Camera size={14} />
                    <span>Send Update</span>
                  </button>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-start mb-8 relative z-10 group">
                <div className="w-[38px] h-[38px] lg:w-[46px] lg:h-[46px] rounded-full bg-[#EAE1DA] flex items-center justify-center shrink-0 border-[4px] border-[#FDF8F3] mx-5 transition-transform group-hover:scale-110">
                  <Car size={18} className="text-[#4A1D1A]" />
                </div>
                <div className="flex-1 bg-white/60 border border-[#F3EBE1] rounded-2xl p-4 lg:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
                  <div>
                    <h4 className="text-[#4A1D1A] font-extrabold text-[15px] lg:text-[16px] mb-0.5">Drop-off (To Pet Parent)</h4>
                    <p className="text-[#5C3A21] font-medium text-[12px] lg:text-[13px] opacity-70 mb-1">18 Sep 2026, 5:00 PM</p>
                    <p className="text-[#5C3A21] font-medium text-[13px] lg:text-[14px]">Our team will drop Buddy to the pet parent's location.</p>
                  </div>
                  <button className="flex items-center space-x-1.5 px-4 py-2 bg-transparent border border-[#4A1D1A]/50 rounded-[10px] text-[#4A1D1A] font-extrabold text-[13px] hover:bg-[#4A1D1A]/5 shrink-0 self-start lg:self-center transition-colors">
                    <MapPin size={14} />
                    <span>Mark as Dropped</span>
                  </button>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex items-start relative z-10 group">
                <div className="w-[38px] h-[38px] lg:w-[46px] lg:h-[46px] rounded-full bg-[#EAE1DA] flex items-center justify-center shrink-0 border-[4px] border-[#FDF8F3] mx-5 transition-transform group-hover:scale-110">
                  <FileText size={18} className="text-[#4A1D1A]" />
                </div>
                <div className="flex-1 bg-white/60 border border-[#F3EBE1] rounded-2xl p-4 lg:p-5 shadow-sm">
                  <h4 className="text-[#4A1D1A] font-extrabold text-[15px] lg:text-[16px] mb-0.5">Service Complete</h4>
                  <p className="text-[#5C3A21] font-medium text-[13px] lg:text-[14px]">This booking will be marked complete after drop-off.</p>
                </div>
              </div>

            </div>
          )}

          {/* Messages Tab Content */}
          {activeTab === 'messages' && !isCompleted && (
            <div className="flex-1 flex flex-col w-full lg:w-4/5 overflow-y-auto scrollbar-hide px-4 lg:px-0 mx-auto">
              {messagesList.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                  {/* Date Separator */}
                  {msg.date && (
                    <div className="flex justify-center mb-6 mt-4">
                      <div className="bg-[#F6EBE5] px-4 py-1.5 rounded-full text-[12px] font-bold text-[#5C3A21]/70">
                        {msg.date}
                      </div>
                    </div>
                  )}

                  {msg.isCaretaker ? (
                    <div className="flex flex-col items-end mb-6">
                      <div className={`bg-[#7B1C1D] rounded-2xl rounded-tr-sm ${msg.image ? 'p-1.5 flex items-center pr-4' : 'px-4 py-3'} max-w-[85%] lg:max-w-[70%] shadow-sm`}>
                        {msg.image ? (
                          <>
                            <img src={msg.image} alt="Buddy Update" className="w-14 h-14 rounded-xl object-cover mr-3" />
                            <p className="text-white font-medium text-[14px]">{msg.text}</p>
                          </>
                        ) : (
                          <p className="text-white font-medium text-[14px]">{msg.text}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mt-1.5 mr-1">
                        <span className="text-[#5C3A21]/60 font-bold text-[10px]">{msg.time}</span>
                        <CheckCheck size={12} className="text-[#5C3A21]/60" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3 mb-6">
                      <img src={msg.avatar} alt={msg.sender} className="w-10 h-10 rounded-full object-cover shrink-0 mt-1" />
                      <div className="flex flex-col">
                        <span className="text-[#7B1C1D] font-extrabold text-[12px] mb-1 ml-1">{msg.sender}</span>
                        <div className="bg-[#F6EBE5] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] lg:max-w-[70%]">
                          <p className="text-[#4A1D1A] font-medium text-[14px]">{msg.text}</p>
                        </div>
                        <span className="text-[#5C3A21]/60 font-bold text-[10px] mt-1.5 ml-1">{msg.time}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}

          {/* Action Buttons / Input Bar */}
          {activeTab === 'messages' && !isCompleted ? (
            <div className="shrink-0 bg-[#FDF8F3] border-t border-[#F3EBE1] flex justify-center py-4 px-4 lg:px-0 lg:mt-4 lg:mb-8 lg:bg-transparent lg:border-none pb-safe-bottom z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] lg:shadow-none">
              <form onSubmit={handleSendMessage} className="w-full flex items-center space-x-3 max-w-5xl lg:w-4/5 lg:mx-0">
                <button type="button" className="w-12 h-12 rounded-full flex items-center justify-center text-[#7B1C1D] hover:bg-[#F6EBE5] transition-colors shrink-0">
                  <Paperclip size={24} />
                </button>
                <div className="flex-1 bg-white border border-[#F3EBE1] rounded-full px-5 py-3.5 shadow-sm">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..." 
                    className="w-full bg-transparent outline-none text-[#4A1D1A] font-medium placeholder:text-[#5C3A21]/40 text-[15px]"
                  />
                </div>
                <button type="submit" disabled={!inputText.trim()} className="w-12 h-12 rounded-full bg-[#7B1C1D] flex items-center justify-center text-white hover:bg-[#5A1213] disabled:opacity-50 transition-colors shrink-0 shadow-sm">
                  <Send size={18} className="ml-1" />
                </button>
              </form>
            </div>
          ) : (
            <div className="w-full flex space-x-3 lg:space-x-4 lg:justify-end mb-8">
              {activeTab === 'timeline' ? (
                <button 
                  onClick={() => setIsCompleted(true)}
                  className="w-full lg:w-[320px] lg:flex-none flex items-center justify-center py-3.5 lg:py-4 rounded-2xl bg-[#4A1D1A] text-white font-extrabold text-[15px] lg:text-[16px] shadow-[0_8px_20px_rgba(74,29,26,0.25)] hover:bg-[#3E1614] transition-colors"
                >
                  <div className="bg-white text-[#4A1D1A] rounded-full p-1 mr-3">
                    <Check size={16} strokeWidth={4} />
                  </div>
                  Service Completed
                </button>
              ) : (
                <>
                  <button className="flex-1 lg:flex-none lg:w-56 py-3.5 rounded-2xl border-2 border-[#4A1D1A] text-[#4A1D1A] font-extrabold text-[14px] lg:text-[15px] hover:bg-[#4A1D1A]/5 transition-colors">
                    Contact Customer
                  </button>
                  <button 
                    onClick={() => setActiveTab('timeline')}
                    className="flex-1 lg:flex-none lg:w-56 py-3.5 rounded-2xl bg-[#4A1D1A] text-white font-extrabold text-[14px] lg:text-[15px] shadow-[0_8px_20px_rgba(74,29,26,0.25)] hover:bg-[#3E1614] transition-colors"
                  >
                    View Timeline
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}

        </div>

      </div>
    </CaretakerLayout>
  );
};
