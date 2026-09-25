import { X, ArrowRight, Home, TreePine, PawPrint, Camera, MapPin, Calendar, CheckCircle2, ShieldCheck, Heart, BadgeCheck, Star, Clock, Check } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import type { Pet } from '../Pets/MyPetsScreen';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '12 Oct 2026';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDayTime = (dateStr: string, timeStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.toLocaleDateString('en-GB', { weekday: 'long' });
  return `${day}${timeStr ? `, ${timeStr}` : ''}`;
};

const calculateNights = (dropoff: string, pickup: string): number => {
  if (!dropoff || !pickup) return 4;
  const d1 = new Date(dropoff);
  const d2 = new Date(pickup);
  const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
};

export const BookingConfirmedScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider || {};
  const bookingData = location.state?.bookingData || {};
  const selectedPets: Pet[] = location.state?.selectedPets || [];
  const finalTotal = location.state?.finalTotal || 0;
  const paymentMethod = location.state?.paymentMethod || 'pay_later'; // 'pay_now' or 'pay_later'

  const dropoffDate = bookingData?.dropoffDate || '';
  const dropoffTime = bookingData?.dropoffTime || '';
  const pickupDate = bookingData?.pickupDate || '';
  const pickupTime = bookingData?.pickupTime || '';

  const nights = calculateNights(dropoffDate, pickupDate);
  const isPayNow = paymentMethod === 'pay_now';

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAFAFA] pb-40">
      
      {/* Top Banner (Icon & Confetti) */}
      <div className="relative pt-12 pb-6 px-5 text-center flex flex-col items-center overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={() => navigate('/home')} 
          className="absolute right-5 top-5 p-1 rounded-full hover:bg-gray-200/50 transition-colors z-20"
        >
          <X size={24} className="text-[#1B2B48]" />
        </button>

        {/* Confetti Particles (Background) */}
        <div className="absolute inset-0 pointer-events-none opacity-80 z-0">
          <div className="absolute top-[20%] left-[25%] w-[3px] h-[10px] bg-green-400 rotate-45"></div>
          <div className="absolute top-[15%] left-[35%] w-[12px] h-[3px] bg-yellow-400 -rotate-45"></div>
          <div className="absolute top-[35%] left-[30%] text-[#174F38] opacity-70"><PawPrint size={14}/></div>
          <div className="absolute top-[25%] right-[35%] w-[3px] h-[12px] bg-green-500 rotate-12"></div>
          <div className="absolute top-[40%] right-[30%] w-[10px] h-[3px] bg-yellow-400 -rotate-12"></div>
          <div className="absolute top-[18%] right-[25%] text-yellow-500 opacity-80"><PawPrint size={14}/></div>
        </div>

        {/* Main Icon */}
        <div className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center mb-5 mt-2 mx-auto">
          {isPayNow ? (
            <div className="w-20 h-20 rounded-full bg-[#174F38] flex items-center justify-center shadow-[0_8px_16px_rgba(23,79,56,0.2)]">
              <Check size={44} className="text-white stroke-[4]" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#FFF9EC] border-2 border-[#FDD835]/30 flex items-center justify-center relative">
              <Calendar size={40} className="text-[#111111]" strokeWidth={2} />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#FDD835] flex items-center justify-center border-2 border-white shadow-sm">
                <Check size={18} className="text-[#111111] stroke-[4]" />
              </div>
            </div>
          )}
        </div>

        <h1 className="text-[26px] font-extrabold text-[#1B2B48] tracking-tight z-10" style={{ fontFamily: 'serif' }}>
          Booking Confirmed!
        </h1>
        <p className="text-[14px] font-medium text-[#465E87] mt-1.5 max-w-[280px] mx-auto leading-relaxed z-10">
          Your homestay has been successfully booked{isPayNow ? ' and payment has been completed.' : '. You have chosen to pay after the service.'}
        </p>
      </div>

      {/* Content Container */}
      <div className="py-2 space-y-3 max-w-2xl mx-auto w-full pb-32 px-4">
        
        {/* Pay Later Warning Banner */}
        {!isPayNow && (
          <div className="bg-[#FFF9EC] rounded-[12px] p-4 flex items-center gap-3 border border-[#FDD835]/20 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#FDD835] flex items-center justify-center shrink-0">
              <Clock size={20} className="text-[#111111]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-extrabold text-[#111111]">
                You will pay ₹{finalTotal.toLocaleString('en-IN')} after the stay is completed.
              </p>
              <p className="text-[13px] font-medium text-[#465E87] mt-0.5">
                No payment has been taken now.
              </p>
            </div>
          </div>
        )}

        {/* Combined Details Card */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col">
          {/* Host Card */}
          <div className="p-4 sm:p-5">
          <div className="flex gap-4">
            <div className="w-[100px] h-[100px] rounded-[16px] overflow-hidden shrink-0 mt-1">
              <img 
                src={provider?.images?.[0] || provider?.photo || 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?auto=format&fit=crop&q=80&w=200'} 
                alt="Host" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-start justify-between w-full mb-1">
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <h3 className="text-[18px] font-extrabold text-[#111111] leading-tight truncate">
                    {provider?.name || 'Priya S.'}
                  </h3>
                  <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-[#E8F5E9] rounded-full shrink-0">
                    <BadgeCheck size={12} className="text-[#174F38]" />
                    <span className="text-[10px] font-bold text-[#174F38]">Verified Host</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 mb-2.5">
                <Star size={14} className="text-[#FDD835] fill-[#FDD835]" />
                <span className="text-[13px] font-extrabold text-[#1B2B48]">{provider?.rating || '4.9'}</span>
                <span className="text-[13px] font-medium text-[#465E87]">({provider?.reviews || 96} reviews)</span>
              </div>
              
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 w-full mt-1">
                <div className="flex items-center space-x-1.5 min-w-0">
                  <Home size={12} className="text-[#465E87] shrink-0" />
                  <span className="text-[11px] font-medium text-[#465E87] truncate">Independent house</span>
                </div>
                <div className="flex items-center space-x-1.5 min-w-0">
                  <TreePine size={12} className="text-[#174F38] shrink-0" />
                  <span className="text-[11px] font-medium text-[#465E87] truncate">Has a garden</span>
                </div>
                <div className="flex items-center space-x-1.5 min-w-0">
                  <PawPrint size={12} className="text-[#F2994A] shrink-0" />
                  <span className="text-[11px] font-medium text-[#465E87] truncate">Only 2 pets at a time</span>
                </div>
                <div className="flex items-center space-x-1.5 min-w-0">
                  <Camera size={12} className="text-[#465E87] shrink-0" />
                  <span className="text-[11px] font-medium text-[#465E87] truncate">Daily photo updates</span>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 mt-3 pt-2 border-t border-gray-50 min-w-0">
                <MapPin size={12} className="text-[#465E87] shrink-0" />
                <span className="text-[11px] font-medium text-[#465E87] truncate">
                  {provider?.distanceStr || ''}{provider?.distanceStr && provider?.locationStr ? ' • ' : ''}{provider?.locationStr?.split(',')[0] || ''}
                </span>
              </div>
            </div>
          </div>
          </div>

          {/* Stay Details */}
          <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FFF9EC] flex items-center justify-center shrink-0">
                <Calendar size={16} className="text-[#111111]" />
              </div>
              <h3 className="text-[18px] font-extrabold text-[#111111]">Stay Details</h3>
            </div>
          </div>

          <div className="flex items-start justify-between bg-[#FAFAFA] rounded-[12px] p-3 border border-gray-100/50">
            <div className="flex flex-col flex-1 pr-2">
              <span className="text-[11px] font-medium text-[#465E87] mb-1 uppercase tracking-wider">Check-in</span>
              <span className="text-[14px] font-extrabold text-[#111111] mb-0.5">{formatDate(dropoffDate)}</span>
              <span className="text-[11px] font-medium text-[#465E87]">{formatDayTime(dropoffDate, dropoffTime)}</span>
            </div>
            
            <div className="flex flex-col flex-1 px-3 border-l border-gray-200">
              <span className="text-[11px] font-medium text-[#465E87] mb-1 uppercase tracking-wider">Check-out</span>
              <span className="text-[14px] font-extrabold text-[#111111] mb-0.5">{formatDate(pickupDate)}</span>
              <span className="text-[11px] font-medium text-[#465E87]">{formatDayTime(pickupDate, pickupTime)}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center pl-3 border-l border-gray-200">
              <span className="text-[10px] font-medium text-[#465E87] mb-1 uppercase tracking-wider text-center w-full">Total duration</span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <div className="bg-white rounded-full p-1 shadow-sm border border-gray-100">
                  <Calendar size={12} className="text-[#111111]" />
                </div>
                <span className="text-[14px] font-extrabold text-[#111111]">{nights} nights</span>
              </div>
            </div>
          </div>
          </div>

          {/* Pet Details */}
          <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FFF9EC] flex items-center justify-center shrink-0">
                <PawPrint size={16} className="text-[#111111]" />
              </div>
              <h3 className="text-[18px] font-extrabold text-[#111111]">Pet Details ({selectedPets.length})</h3>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-hide">
            {selectedPets.map((pet) => (
              <div key={pet.id} className="min-w-[260px] max-w-[280px] snap-center bg-white border border-[#F3E8CC] rounded-[16px] p-3 flex flex-col shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <img src={pet.image} alt={pet.name} className="w-[52px] h-[52px] rounded-[12px] object-cover border border-gray-100 shadow-sm" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15px] font-extrabold text-[#111111] truncate">{pet.name}</span>
                    <span className="text-[12px] font-medium text-[#465E87] truncate">{pet.breed}</span>
                    <span className="text-[11px] font-medium text-[#8A9BAE] truncate mt-0.5">
                      {pet.age} yrs • {pet.gender} • {pet.weight} kg
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 pt-2.5 border-t border-gray-50">
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-500/10" />
                    <span className="text-[11px] font-medium text-[#465E87]">Vaccinated</span>
                  </div>
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <Heart size={14} className="text-[#465E87]" />
                    <span className="text-[11px] font-medium text-[#465E87] truncate leading-tight">No medical conditions</span>
                  </div>
                </div>
              </div>
            ))}
            {selectedPets.length === 0 && (
              <p className="text-sm text-gray-500 italic">No pets selected</p>
            )}
            </div>
          </div>
        </div>

        {/* Payment Details (Only for Pay Now) */}
        {isPayNow && (
          <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#FFF9EC] flex items-center justify-center shrink-0">
                <div className="w-4 h-3 bg-[#111111] rounded-[3px] border border-[#111111] flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-[#FFF9EC] rounded-full border border-[#111111]"></div>
                </div>
              </div>
              <h3 className="text-[18px] font-extrabold text-[#111111]">Payment Details</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[14px] font-extrabold text-[#1B2B48]">Total Amount</span>
                <span className="text-[16px] font-extrabold text-[#111111]">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-[#465E87]">Payment Method</span>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    <div className="w-3 h-3 rounded-full bg-[#EB001B] opacity-90"></div>
                    <div className="w-3 h-3 rounded-full bg-[#F79E1B] opacity-90"></div>
                  </div>
                  <span className="text-[13px] font-medium text-[#465E87]">•••• 4587</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-[#465E87]">Payment Status</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle2 size={14} className="text-[#174F38]" />
                  <span className="text-[13px] font-extrabold text-[#174F38]">Paid Successfully</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#EAEAEA] to-[#FAFAFA]/5 pt-4 pb-safe-bottom backdrop-blur-[2px]">
        <div className="max-w-2xl mx-auto w-full px-4 pb-4 flex flex-col space-y-3">
          <Button 
            onClick={() => navigate('/bookings')}
            className="w-full h-[54px] bg-[#FDD835] hover:bg-[#FBBF24] text-[#111111] text-[16px] font-extrabold rounded-[16px] flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>View Booking Details</span>
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
