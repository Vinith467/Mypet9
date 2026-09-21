import { useState } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { GlobalRequestModal } from '../../components/caretaker/GlobalRequestModal';
import { useAuth } from '../../contexts/AuthContext';
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
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockRequests = [
  {
    id: '1',
    petName: 'Buddy',
    breed: 'Golden Retriever',
    age: '2 years',
    size: 'Large Dog',
    startDate: '20 Sep 2026',
    endDate: '23 Sep 2026',
    nights: 3,
    service: 'Home Stay',
    status: 'new',
    location: 'Koramangala, Bangalore',
    notes: 'Very friendly, loves outdoor play. Fully vaccinated.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200',
    timeRemaining: '28:45'
  },
  {
    id: '2',
    petName: 'Max',
    breed: 'German Shepherd',
    age: '4 years',
    size: 'Large Dog',
    startDate: '22 Sep 2026',
    endDate: '25 Sep 2026',
    nights: 3,
    service: 'Home Stay',
    status: 'new',
    location: 'Indiranagar, Bangalore',
    notes: 'Needs regular walks.',
    image: 'https://images.unsplash.com/photo-1589965716319-4a041b58fa8a?auto=format&fit=crop&q=80&w=200'
  }
];

export const CaretakerRequestsScreen = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'new' | 'quotation_sent' | 'confirmed' | 'missed' | 'declined'>('new');
  const firstName = userData?.name ? userData.name.split(' ')[0] : 'Partner';

  const filteredRequests = mockRequests.filter(r => r.status === activeTab);

  const getTabHeader = () => {
    switch(activeTab) {
      case 'new': return { title: 'New Requests', subtitle: 'Latest home stay requests from pet parents.' };
      case 'quotation_sent': return { title: 'Quotation Sent', subtitle: 'You have sent quotes to these requests.' };
      case 'confirmed': return { title: 'Confirmed', subtitle: 'Bookings confirmed by pet parents.' };
      case 'missed': return { title: 'Missed', subtitle: "Requests you didn't respond to." };
      case 'declined': return { title: 'Declined', subtitle: 'Requests that were not booked.' };
      default: return { title: '', subtitle: '' };
    }
  };

  const getPillStyle = (status: string) => {
    switch(status) {
      case 'new': return { bg: 'bg-[#FFEAEA]', text: 'text-[#FF4D4D]', label: 'New' };
      case 'quotation_sent': return { bg: 'bg-[#EBF3FF]', text: 'text-[#195FE6]', label: 'Quote Sent' };
      case 'confirmed': return { bg: 'bg-[#E0F5E9]', text: 'text-[#0B7C41]', label: 'Confirmed' };
      case 'missed': return { bg: 'bg-[#FFEAEA]', text: 'text-[#FF4D4D]', label: 'Missed' };
      case 'declined': return { bg: 'bg-[#F4EBFF]', text: 'text-[#6B21A8]', label: 'Declined' };
      default: return null;
    }
  };
  
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <CaretakerLayout>
      <div className="w-full flex flex-col bg-[#FDF8F3] min-h-screen font-quicksand pb-40 lg:pb-12 text-[#3E2723]">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-[#FDF8F3]/95 backdrop-blur-md z-40">
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
                PetWali
              </h1>
            </div>
            <span className="text-[10px] font-bold text-[#A26D45] uppercase tracking-wider -mt-1 ml-[25px]">Partner</span>
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
                 <h2 className="text-3xl font-extrabold text-[#3E2723] tracking-tight leading-none mb-1">Home Stay Requests</h2>
                 <p className="text-[#5C3A21]/70 text-sm font-medium">Manage your incoming pet care requests.</p>
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
              Home Stay Requests
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#F5EFE6]/50 p-1.5 rounded-[20px] mb-8 overflow-x-auto scrollbar-hide shrink-0 shadow-inner space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('new')}
              className={`shrink-0 whitespace-nowrap py-2.5 px-4 lg:px-6 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
                activeTab === 'new'
                  ? 'bg-[#C79133] text-white shadow-md'
                  : 'text-[#5C3A21] hover:bg-white/50'
              }`}
            >
              New (2)
            </button>
            <button
              onClick={() => setActiveTab('quotation_sent')}
              className={`shrink-0 whitespace-nowrap py-2.5 px-4 lg:px-6 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
                activeTab === 'quotation_sent'
                  ? 'bg-[#C79133] text-white shadow-md'
                  : 'text-[#5C3A21] hover:bg-white/50'
              }`}
            >
              Quotation Sent (3)
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`shrink-0 whitespace-nowrap py-2.5 px-4 lg:px-6 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
                activeTab === 'confirmed'
                  ? 'bg-[#C79133] text-white shadow-md'
                  : 'text-[#5C3A21] hover:bg-white/50'
              }`}
            >
              Confirmed (1)
            </button>
            <button
              onClick={() => setActiveTab('missed')}
              className={`shrink-0 whitespace-nowrap py-2.5 px-4 lg:px-6 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
                activeTab === 'missed'
                  ? 'bg-[#C79133] text-white shadow-md'
                  : 'text-[#5C3A21] hover:bg-white/50'
              }`}
            >
              Missed (0)
            </button>
            <button
              onClick={() => setActiveTab('declined')}
              className={`shrink-0 whitespace-nowrap py-2.5 px-4 lg:px-6 rounded-2xl text-[13px] font-bold transition-all duration-300 ${
                activeTab === 'declined'
                  ? 'bg-[#C79133] text-white shadow-md'
                  : 'text-[#5C3A21] hover:bg-white/50'
              }`}
            >
              Declined (0)
            </button>
          </div>

          {/* Requests List */}
          <div className="flex flex-col space-y-4 mb-10 w-full max-w-3xl mx-auto lg:max-w-none">
            
            <div className="mb-2 px-1">
              <h2 className="text-[#5C1C1D] text-[20px] font-extrabold mb-1 tracking-tight">{getTabHeader().title} ({filteredRequests.length})</h2>
              <p className="text-[#5C3A21]/70 text-[13px] font-medium">{getTabHeader().subtitle}</p>
            </div>

            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <motion.div
                  key={request.id}
                  whileHover={{ scale: 1.01, backgroundColor: '#ffffff' }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setSelectedRequest(request);
                    setIsModalOpen(true);
                  }}
                  className="bg-white rounded-3xl p-3 flex items-center cursor-pointer shadow-[0_2px_15px_rgba(92,58,33,0.04)] border border-white transition-all group relative"
                >
                  {/* Pet Image */}
                  <div className="w-[110px] h-[110px] shrink-0 rounded-[20px] overflow-hidden relative mr-4">
                    <img 
                      src={request.image} 
                      alt={request.petName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 flex flex-col py-1 min-w-0 pr-8">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-[17px] font-extrabold text-[#5C1C1D] truncate mr-2">
                        {request.petName}
                      </h3>
                      {getPillStyle(request.status) && (
                        <span className={`${getPillStyle(request.status)?.bg} ${getPillStyle(request.status)?.text} px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide shrink-0`}>
                          {getPillStyle(request.status)?.label}
                        </span>
                      )}
                    </div>
                    <p className="text-[#5C3A21]/70 text-[12px] font-medium truncate mb-2.5">
                      {request.breed}
                    </p>

                    <div className="space-y-1">
                      <div className="flex items-center text-[#5C3A21]/80 text-[12px] font-semibold">
                        <Calendar size={13} className="mr-2 text-[#5C1C1D] shrink-0" />
                        <span className="truncate">{request.startDate.replace(' 2026', '')} – {request.endDate}</span>
                      </div>
                      <div className="flex items-center text-[#5C3A21]/80 text-[12px] font-semibold">
                        <Moon size={13} className="mr-2 text-[#5C1C1D] shrink-0" />
                        <span className="truncate">{request.nights} nights</span>
                      </div>
                      <div className="flex items-center text-[#5C3A21]/80 text-[12px] font-semibold">
                        <Home size={13} className="mr-2 text-[#5C1C1D] shrink-0" />
                        <span className="truncate">{request.service || 'Home Stay'}</span>
                      </div>
                      <div className="flex items-center text-[#5C3A21]/80 text-[12px] font-semibold">
                        <MapPin size={13} className="mr-2 text-[#5C1C1D] shrink-0" />
                        <span className="truncate">{request.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Chevron right */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <ChevronRight size={22} className="text-[#5C1C1D]/60 group-hover:translate-x-1 group-hover:text-[#5C1C1D] transition-all" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#FFF9F2] rounded-full flex items-center justify-center mb-4">
                  <FileText size={28} className="text-[#A26D45]/50" />
                </div>
                <h3 className="text-lg font-bold text-[#3E2723] mb-1">No {activeTab} requests</h3>
                <p className="text-[#5C3A21]/60 text-sm font-medium">You don't have any {activeTab} requests at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <GlobalRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        request={selectedRequest} 
      />
    </CaretakerLayout>
  );
};
