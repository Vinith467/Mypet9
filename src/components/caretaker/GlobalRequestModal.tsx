import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  MapPin,
  FileText,
  X,
  Send,
  Info,
  Clock,
  PawPrint,
  User,
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Home,
  MessageSquare,
  IndianRupee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockRequest = {
  id: '1',
  petName: 'Buddy',
  breed: 'Golden Retriever',
  age: '3 years',
  size: 'Large Dog',
  startDate: '20 Sep 2026',
  endDate: '23 Sep 2026',
  nights: 3,
  service: 'Home Stay',
  status: 'new',
  location: 'Koramangala, Bangalore',
  notes: 'Very friendly, loves outdoor play. Fully vaccinated. Prefers home-cooked food.',
  image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200',
  timeRemaining: '28:45',
  petParent: {
    name: 'Rohan Mehta',
    rating: 4.8,
    reviews: 12,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  },
  tags: ['Large Dog', 'Vaccinated']
};

interface GlobalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request?: any;
}

export const GlobalRequestModal = ({ isOpen, onClose, request: propRequest }: GlobalRequestModalProps) => {
  const navigate = useNavigate();
  const [modalStep, setModalStep] = useState<'details' | 'quote' | 'success'>('details');
  const req = propRequest || mockRequest;
  const [quotePrice, setQuotePrice] = useState('1200');
  const [quoteMessage, setQuoteMessage] = useState("We'd love to host Buddy! He'll have a safe, comfortable and fun stay with us.");

  const formatCurrency = (value: number) => value.toLocaleString('en-IN');
  const quoteTotal = (parseInt(quotePrice.replace(/,/g, '')) || 0) * req.nights;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full overflow-y-auto overflow-x-hidden bg-white rounded-3xl z-[101] shadow-2xl p-4 sm:p-5 max-h-[95vh] ${modalStep === 'quote' ? 'max-w-[420px] lg:max-w-[580px]' : 'max-w-[480px] lg:max-w-[640px]'}`}
          >
            {modalStep !== 'success' && (
              <>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    {modalStep === 'quote' && (
                      <button 
                        onClick={() => setModalStep('details')}
                        className="mr-3 text-[#5C1C1D] hover:bg-[#F6EBE5] p-1.5 rounded-full transition-colors shrink-0"
                      >
                        <ChevronLeft size={24} />
                      </button>
                    )}
                    <div className="pr-4">
                      <h2 className="text-[20px] lg:text-[24px] font-extrabold text-[#381313] leading-tight mb-0.5">
                        {modalStep === 'quote' ? 'Send Quotation' : 'New Home Stay Request'}
                      </h2>
                      <p className="text-[#3A5D74] text-[13px] font-medium">
                        {modalStep === 'quote' ? 'Set your availability and pricing.' : 'A pet parent has requested a home stay.'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="text-[#5C1C1D] hover:bg-[#F6EBE5] p-1.5 -mr-2 -mt-1 rounded-full transition-colors shrink-0"
                  >
                    <X size={24} />
                  </button>
                </div>

                {modalStep === 'details' && (
                  <div className="flex justify-end mb-3">
                    <div className="inline-flex items-center bg-[#FFEAEA] text-[#FF4D4D] px-2.5 py-1 rounded-lg text-xs font-bold">
                      <Clock size={14} className="mr-1.5" />
                      {req.timeRemaining} remaining
                    </div>
                  </div>
                )}

                {/* Pet Card */}
                <div className={`bg-white flex items-start ${modalStep === 'quote' ? 'mb-4' : 'rounded-2xl p-2.5 shadow-[0_2px_15px_rgba(92,58,33,0.06)] border border-gray-50 mb-4'}`}>
                  <img 
                    src={req.image}
                    alt={req.petName} 
                    className={`rounded-xl object-cover shrink-0 mr-4 ${modalStep === 'quote' ? 'w-[70px] h-[70px]' : 'w-[80px] h-[80px] lg:w-[90px] lg:h-[90px]'}`}
                  />
                  <div className="flex flex-col justify-center">
                    <h3 className={`font-extrabold text-[#381313] leading-tight mb-0.5 ${modalStep === 'quote' ? 'text-[18px]' : 'text-[18px] lg:text-[20px]'}`}>{req.petName}</h3>
                    <p className="text-[#3A5D74] text-[12px] font-medium mb-1.5">{req.breed} • {req.age}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(req.tags || ['Large Dog', 'Vaccinated']).map((tag: string, idx: number) => (
                        <div key={idx} className="bg-[#F0F5FF] text-[#195FE6] px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {modalStep === 'details' ? (
              <>
                {/* Details List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-x-8 mb-5 px-1">
                  
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      <Calendar size={18} className="text-[#5C1C1D]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#5C1C1D] font-extrabold text-[14px] mb-0.5">Stay Dates</span>
                      <span className="text-[#3A5D74] text-[13px] font-medium leading-tight">{req.startDate} – {req.endDate}<br/>({req.nights} nights)</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      <PawPrint size={18} className="text-[#5C1C1D]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#5C1C1D] font-extrabold text-[14px] mb-0.5">Special Notes</span>
                      <span className="text-[#3A5D74] text-[13px] font-medium leading-tight pr-2">{req.notes}</span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        <MapPin size={18} className="text-[#5C1C1D]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#5C1C1D] font-extrabold text-[14px] mb-0.5">Location</span>
                        <span className="text-[#3A5D74] text-[13px] font-medium leading-tight">{req.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center ml-2 shrink-0 cursor-pointer group">
                      <div className="w-[80px] h-[45px] rounded-lg overflow-hidden bg-gray-100 relative mb-1.5 shadow-sm group-hover:shadow-md transition-shadow">
                        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=200" alt="Map" className="w-full h-full object-cover opacity-80" />
                        <MapPin size={16} className="text-[#5C1C1D] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-md" fill="currentColor" />
                      </div>
                      <span className="text-[#5C1C1D] text-[10px] font-bold bg-[#F6EBE5] px-1.5 py-0.5 rounded-md">View on Map</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1 cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <div className="mt-0.5">
                        <User size={18} className="text-[#5C1C1D]" />
                      </div>
                      <img src={req.petParent?.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"} alt="Parent" className="w-9 h-9 rounded-full object-cover ml-0.5 shadow-sm" />
                      <div className="flex flex-col ml-2">
                        <span className="text-[#5C1C1D] font-extrabold text-[14px] mb-0.5">Pet Parent<br/>{req.petParent?.name || 'Rohan Mehta'}</span>
                        <div className="flex items-center text-[#F59E0B] text-[11px] font-bold">
                          <Star size={10} fill="currentColor" className="mr-1" />
                          <span>{req.petParent?.rating || 4.8} <span className="text-[#3A5D74] font-medium">({req.petParent?.reviews || 12} reviews)</span></span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#5C1C1D] group-hover:translate-x-1 transition-transform" />
                  </div>

                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-1">
                  <button 
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl border border-[#FF4D4D] text-[#FF4D4D] font-extrabold text-[14px] hover:bg-[#FFEAEA] transition-colors"
                  >
                    Decline
                  </button>
                  <button 
                    onClick={() => setModalStep('quote')}
                    className="flex-1 py-3 rounded-xl bg-[#5C1C1D] text-white font-extrabold text-[14px] hover:bg-[#4A1617] transition-colors shadow-md"
                  >
                    Accept & Quote
                  </button>
                </div>
              </>
            ) : modalStep === 'quote' ? (
              <>
                {/* Quote Form Container */}
                <div className="flex flex-col w-full">
                  
                  <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 space-y-2 mb-4">
                    {/* Stay Details */}
                    <div className="flex items-start bg-white border border-[#F0F0F0] rounded-[14px] p-2.5 shadow-sm h-full">
                      <div className="mt-0.5 shrink-0 mr-3">
                        <Calendar size={20} className="text-[#381313]" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#1A1A1A] font-extrabold text-[14px] mb-0.5">Stay Details</span>
                        <span className="text-[#3A5D74] text-[13px] font-medium leading-tight mb-0.5">{req.startDate} – {req.endDate}</span>
                        <span className="text-[#3A5D74] text-[13px] font-medium leading-tight">{req.nights} nights</span>
                      </div>
                    </div>

                    {/* Your Availability */}
                    <div className="flex items-start bg-white border border-[#F0F0F0] rounded-[14px] p-2.5 shadow-sm h-full">
                      <div className="mt-0.5 shrink-0 mr-3">
                        <Home size={20} className="text-[#381313]" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col w-full">
                        <span className="text-[#1A1A1A] font-extrabold text-[15px] mb-2.5">Your Availability</span>
                        <div className="flex space-x-2 w-full">
                          
                          <div className="flex-1 relative">
                            <select className="w-full border border-[#E5D5C5] rounded-xl pl-3 pr-8 py-1.5 bg-white text-[#1A1A1A] text-[13px] font-medium appearance-none outline-none focus:border-[#5C1C1D]/50 transition-colors cursor-pointer">
                              <option value="homestay">Home Stay</option>
                              <option value="daycare">Day Care</option>
                            </select>
                            <ChevronDown size={16} className="text-[#1A1A1A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>

                          <div className="flex-1 relative">
                            <select className="w-full border border-[#E5D5C5] rounded-xl pl-3 pr-8 py-1.5 bg-white text-[#1A1A1A] text-[13px] font-medium appearance-none outline-none focus:border-[#5C1C1D]/50 transition-colors cursor-pointer">
                              <option value="2">2 available</option>
                              <option value="1">1 available</option>
                              <option value="0">0 available</option>
                            </select>
                            <ChevronDown size={16} className="text-[#1A1A1A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Your Price */}
                    <div className="flex items-start bg-white border border-[#F0F0F0] rounded-[14px] p-2.5 shadow-sm h-full">
                      <div className="mt-0.5 shrink-0 mr-3">
                        <IndianRupee size={20} className="text-[#381313]" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col w-full">
                        <span className="text-[#1A1A1A] font-extrabold text-[14px] mb-2">Your Price</span>
                        
                        <div className="flex flex-col space-y-1.5">
                          <div className="flex items-center justify-between border border-[#E5D5C5] rounded-xl px-3 py-1 bg-white focus-within:border-[#5C1C1D]/50 transition-colors">
                            <div className="flex items-center">
                              <span className="text-[#1A1A1A] font-extrabold text-[15px] mr-1.5">₹</span>
                              <input 
                                type="number" 
                                value={quotePrice}
                                onChange={(e) => setQuotePrice(e.target.value)}
                                className="bg-transparent text-[#1A1A1A] font-extrabold text-[15px] outline-none w-16"
                                min="0"
                              />
                            </div>
                            <span className="text-[#3A5D74] font-medium text-[13px]">per night</span>
                          </div>
                          <div className="flex items-center justify-between bg-[#FCF8F5] rounded-xl px-3 py-1.5 border border-transparent">
                            <span className="text-[#1A1A1A] font-extrabold text-[13px]">Total ({req.nights} nights)</span>
                            <span className="text-[#1A1A1A] font-extrabold text-[15px]">₹ {formatCurrency(quoteTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message to Customer */}
                    <div className="flex items-start bg-white border border-[#F0F0F0] rounded-[14px] p-2.5 shadow-sm h-full">
                      <div className="mt-0.5 shrink-0 mr-3">
                        <MessageSquare size={20} className="text-[#381313]" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col w-full">
                        <span className="text-[#1A1A1A] font-extrabold text-[14px] mb-2">Message to Customer (Optional)</span>
                        <div className="relative">
                          <textarea 
                            value={quoteMessage}
                            onChange={(e) => setQuoteMessage(e.target.value.substring(0, 200))}
                            className="w-full h-[60px] border border-[#E5D5C5] rounded-xl px-3 py-2 bg-white focus:border-[#5C1C1D]/50 transition-colors outline-none text-[#3A5D74] font-medium text-[13px] resize-none"
                          />
                          <div className="absolute bottom-1 right-2 bg-white px-1 text-[#3A5D74] text-[10px] font-medium pointer-events-none">
                            {quoteMessage.length}/200
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="flex justify-center w-full">
                    <button 
                      onClick={() => setModalStep('success')}
                      className="w-full max-w-[340px] py-2.5 rounded-xl bg-[#612117] text-white font-extrabold text-[15px] hover:bg-[#4A1617] transition-colors shadow-sm"
                    >
                      Send Quotation
                    </button>
                  </div>
                </div>
              </>
            ) : (
                <div className="flex flex-col w-full max-w-[400px] lg:max-w-none mx-auto pt-6 pb-2">
                  <button 
                    onClick={() => setModalStep('quote')}
                    className="absolute top-4 left-4 lg:top-5 lg:left-5 text-[#7B1C1D] hover:bg-[#F6EBE5] p-1.5 rounded-full transition-colors z-10"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 lg:top-5 lg:right-5 text-[#7B1C1D] hover:bg-[#F6EBE5] p-1.5 rounded-full transition-colors z-10"
                  >
                    <X size={24} />
                  </button>

                  {/* TOP SECTION: Centered Icon and Text */}
                  <div className="flex flex-col items-center justify-center w-full mb-8">
                    <div className="relative mb-5 mt-2">
                      <div className="relative">
                        {/* Left sparkles */}
                        <svg className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-12" viewBox="0 0 16 48" fill="none">
                          <path d="M12 8L4 12" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M16 24L6 24" stroke="#FCA5A5" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M12 40L4 36" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        {/* Right sparkles */}
                        <svg className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-12" viewBox="0 0 16 48" fill="none">
                          <path d="M4 8L12 12" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M0 24L10 24" stroke="#FCA5A5" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M4 40L12 36" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        <div className="w-[84px] h-[84px] bg-[#E8F8F0] rounded-full flex items-center justify-center relative z-10">
                          <Send className="text-[#22C55E] w-10 h-10 -ml-1 mt-1 transform -rotate-45" fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    <h2 className="text-[26px] font-extrabold text-[#381313] mb-1.5 text-center leading-none">Quotation Sent!</h2>
                    <p className="text-[#2B4B65] text-[14px] font-medium text-center max-w-[320px]">
                      Your quote has been sent to the pet parent for {req.petName}'s stay.
                    </p>
                  </div>

                  {/* BOTTOM SECTION: 2 Columns on Desktop */}
                  <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6 w-full">
                    {/* Left Column: Quote Details */}
                    <div className="w-full">
                      <div className="w-full bg-white border border-[#F0F0F0] rounded-2xl p-4 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.03)] h-full flex flex-col justify-center">
                        <div className="flex items-center space-x-2 mb-3">
                          <FileText className="text-[#381313] w-5 h-5" />
                          <span className="text-[#381313] font-extrabold text-[15px]">Quote Details</span>
                        </div>
                        
                        <div className="flex items-end mb-3 ml-7">
                          <span className="text-[#1B2B48] font-extrabold text-[18px] leading-none mr-2">₹ {quotePrice}</span>
                          <span className="text-[#64748B] font-medium text-[13px] mb-0.5">per night</span>
                        </div>
                        
                        <div className="flex items-center justify-between ml-7 mb-4">
                          <span className="text-[#64748B] font-medium text-[14px]">{req.nights} nights</span>
                          <span className="text-[#1B2B48] font-extrabold text-[16px]">₹ {formatCurrency(quoteTotal)}</span>
                        </div>
                        
                        <div className="w-full h-px bg-[#F0F0F0] mb-4"></div>
                        
                        <div className="flex items-start space-x-3">
                          <Info className="text-[#381313] w-5 h-5 shrink-0 mt-0.5" />
                          <p className="text-[#2B4B65] text-[13px] font-medium leading-snug">
                            Customer will be notified.<br/>
                            This request will remain active for 30 minutes.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Timer and Buttons */}
                    <div className="flex flex-col w-full mt-5 lg:mt-0 justify-between space-y-5 lg:space-y-0">
                      {/* Timer Box */}
                      <div className="w-full bg-[#FEF2F2] border border-[#FECACA] rounded-xl py-3.5 flex items-center justify-center space-x-2">
                        <Clock className="text-[#DC2626] w-5 h-5" strokeWidth={2.5} />
                        <span className="text-[#DC2626] font-medium text-[14px]">
                          <strong className="font-extrabold">28:12</strong> remaining
                        </span>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col space-y-3">
                        <button 
                          onClick={() => {
                            onClose();
                            navigate('/caretaker/requests?tab=quotation_sent');
                          }}
                          className="w-full py-3.5 rounded-xl bg-[#612117] text-white font-extrabold text-[15px] hover:bg-[#4A1617] transition-colors"
                        >
                          View in Requests
                        </button>
                        <button 
                          onClick={() => {
                            onClose();
                            navigate('/home');
                          }}
                          className="w-full py-3.5 rounded-xl border border-[#612117] text-[#612117] bg-white font-extrabold text-[15px] hover:bg-[#F6EBE5] transition-colors"
                        >
                          Go to Home
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
