import { useState } from 'react';
import { ArrowLeft, Home, TreePine, PawPrint, Camera, MapPin, Calendar, Moon, Wallet, Info, ShieldCheck, Heart, Edit2, BadgeCheck, Star, Pencil, Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { DateTimePickerModal } from '../../components/ui/DateTimePickerModal';
import type { Pet } from '../Pets/MyPetsScreen';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '12 Oct 2026';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDayTime = (dateStr: string, timeStr: string) => {
  if (!dateStr) return 'Monday, 10:00 AM';
  const d = new Date(dateStr);
  const day = d.toLocaleDateString('en-GB', { weekday: 'long' });
  return `${day}, ${timeStr || '10:00 AM'}`;
};

const calculateNights = (dropoff: string, pickup: string): number => {
  if (!dropoff || !pickup) return 4;
  const d1 = new Date(dropoff);
  const d2 = new Date(pickup);
  const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
};

export const BookingSummaryScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;
  const bookingData = location.state?.bookingData;
  const selectedPets: Pet[] = location.state?.selectedPets || [];

  const [activePicker, setActivePicker] = useState<'dropoff' | 'pickup' | null>(null);
  const [tempDropoff, setTempDropoff] = useState<{date: string, time: string} | null>(null);

  const dropoffDate = bookingData?.dropoffDate || '';
  const dropoffTime = bookingData?.dropoffTime || '';
  const pickupDate = bookingData?.pickupDate || '';
  const pickupTime = bookingData?.pickupTime || '';

  const basePricePerNight = provider?.price || 800;
  const nights = calculateNights(dropoffDate, pickupDate);
  const numPets = Math.max(selectedPets.length, 1);
  const baseTotal = basePricePerNight * nights * numPets;
  const platformFee = 160;
  const gst = Math.round((baseTotal + platformFee) * 0.18);
  const finalTotal = baseTotal + platformFee + gst;

  return (
    <>
      <div className="w-full flex flex-col min-h-screen bg-[#FAFAFA] pb-48">
        
        {/* Header */}
        <div className="bg-[#FAFAFA]/90 backdrop-blur-md sticky top-0 z-30 pt-4 pb-2 px-5 text-center">
          <button 
            onClick={() => navigate(-1)} 
            className="absolute left-5 top-5 p-1 rounded-full hover:bg-gray-200/50 transition-colors"
          >
            <ArrowLeft size={24} className="text-[#1B2B48]" />
          </button>
          <h1 className="text-[26px] font-extrabold text-[#1B2B48] mt-1 tracking-tight" style={{ fontFamily: 'serif' }}>
            Review & Pay
          </h1>
          <p className="text-[12px] font-medium text-[#465E87] mt-1 max-w-[280px] mx-auto leading-relaxed">
            Please review your homestay, pet details and stay information before making the payment.
          </p>
        </div>

        {/* Content Container */}
        <div className="py-2 space-y-2 max-w-2xl mx-auto w-full pb-32">
          
          {/* Host Card */}
          <div className="bg-white rounded-none sm:rounded-[20px] px-3 py-4 sm:p-4 border-y sm:border border-[#F3E8CC]">
            <div className="flex gap-3 sm:gap-4">
              <div className="w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] rounded-[16px] overflow-hidden shrink-0 mt-1">
                <img 
                  src={provider?.images?.[0] || provider?.photo || 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?auto=format&fit=crop&q=80&w=200'} 
                  alt="Host" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-start justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-1">
                    <h3 className="text-[16px] sm:text-[18px] font-extrabold text-[#111111] leading-tight truncate">
                      {provider?.name || 'Priya S.'}
                    </h3>
                    <div className="flex items-center space-x-0.5 sm:space-x-1 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 rounded-full shrink-0">
                      <ShieldCheck size={10} className="text-[#10B981]" />
                      <span className="whitespace-nowrap">Verified Partner</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/search-boarding', { state: { ...bookingData, bookingData, selectedPets } })}
                    className="flex shrink-0 items-center space-x-1.5 px-3 py-1.5 border border-[#FBECCB] rounded-full text-[#1B2B48] bg-[#FFF9EC] hover:bg-[#FBECCB]/50 transition-colors shadow-sm"
                  >
                    <Edit2 size={12} />
                    <span className="text-[11px] font-bold">Edit</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-1.5 mb-3">
                  <Star size={12} className="fill-[#FBBF24] text-[#FBBF24]" />
                  <span className="text-[13px] font-extrabold text-[#111111]">{Number(provider?.rating || 4.9).toFixed(1)}</span>
                  <span className="text-[12px] font-medium text-[#666666]">({provider?.reviews || 96} reviews)</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[10px] font-medium text-[#666666]">
                  <div className="flex items-center space-x-1.5">
                    <Home size={10} className="text-[#111111]" />
                    <span className="truncate">Independent house</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <TreePine size={10} className="text-[#10B981] fill-[#10B981]" />
                    <span className="truncate">Has a garden</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <PawPrint size={10} className="text-[#FBBF24] fill-[#FBBF24]" />
                    <span className="truncate">Only 2 pets at a time</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Camera size={10} className="text-[#111111]" />
                    <span className="truncate">Daily photo updates</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 mt-2.5 text-[11px] font-medium text-[#666666]">
                  <MapPin size={12} className="text-[#111111]" />
                  <span>{provider?.distanceStr || '2.3 km away'} • {provider?.locationStr?.split(',')[0] || 'HSR Layout, Bengaluru'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="bg-white rounded-none sm:rounded-[20px] px-3 py-4 sm:p-4 border-y sm:border border-[#F3E8CC]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-[36px] h-[36px] rounded-full bg-[#FFF9EC] flex items-center justify-center shrink-0">
                  <Calendar size={18} className="text-[#111111]" />
                </div>
                <h3 className="text-[18px] font-extrabold text-[#111111]">Stay Details</h3>
              </div>
              <button 
                onClick={() => setActivePicker('dropoff')}
                className="flex shrink-0 items-center space-x-1.5 px-3 py-1.5 border border-[#FBECCB] rounded-full text-[#1B2B48] bg-[#FFF9EC] hover:bg-[#FBECCB]/50 transition-colors shadow-sm"
              >
                <Edit2 size={12} />
                <span className="text-[11px] font-bold">Edit</span>
              </button>
            </div>

            <div className="flex justify-between items-stretch bg-white rounded-[16px] px-1 sm:px-2 pt-2">
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <span className="text-[10px] font-semibold text-[#666666] mb-1">Check-in</span>
                <span className="text-[13px] sm:text-[15px] font-extrabold text-[#111111] leading-tight mb-0.5 truncate">{formatDate(dropoffDate)}</span>
                <span className="text-[9px] sm:text-[10px] font-medium text-[#666666] truncate">{formatDayTime(dropoffDate, dropoffTime)}</span>
              </div>
              
              <div className="w-[1px] h-10 my-auto bg-gray-200 mx-1.5 sm:mx-2 shrink-0"></div>
              
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <span className="text-[10px] font-semibold text-[#666666] mb-1">Check-out</span>
                <span className="text-[13px] sm:text-[15px] font-extrabold text-[#111111] leading-tight mb-0.5 truncate">{formatDate(pickupDate)}</span>
                <span className="text-[9px] sm:text-[10px] font-medium text-[#666666] truncate">{formatDayTime(pickupDate, pickupTime)}</span>
              </div>
              
              <div className="w-[1px] h-10 my-auto bg-gray-200 mx-1.5 sm:mx-2 shrink-0"></div>
              
              <div className="flex-[0.9] flex flex-col justify-start min-w-0">
                <span className="text-[10px] font-semibold text-[#666666] mb-1.5">Total duration</span>
                <div className="flex items-center space-x-1 sm:space-x-1.5 mt-0.5 min-w-0">
                  <Moon size={12} className="text-[#111111] shrink-0" />
                  <span className="text-[13px] sm:text-[15px] font-extrabold text-[#111111] truncate">{nights} nights</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pet Details */}
          <div className="bg-white rounded-none sm:rounded-[20px] px-3 py-4 sm:p-4 border-y sm:border border-[#F3E8CC]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-[36px] h-[36px] rounded-full bg-[#FFF9EC] flex items-center justify-center shrink-0">
                  <PawPrint size={18} className="text-[#111111]" />
                </div>
                <h3 className="text-[18px] font-extrabold text-[#111111]">Pet Details ({numPets})</h3>
              </div>
              <button onClick={() => navigate('/select-pet', { state: { provider, bookingData: location.state?.bookingData, selectedPets } })} className="flex shrink-0 items-center space-x-1.5 px-3 py-1.5 border border-[#FBECCB] rounded-full text-[#1B2B48] bg-[#FFF9EC] hover:bg-[#FBECCB]/50 transition-colors shadow-sm">
                <Edit2 size={12} />
                <span className="text-[11px] font-bold">Edit</span>
              </button>
            </div>

            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 lg:mx-0 lg:px-0">
              {selectedPets.map((pet, idx) => (
                <div key={idx} className="flex-none w-[210px] sm:w-[230px] border border-[#F3E8CC] rounded-[16px] p-3 bg-white">
                  <div className="flex space-x-3 mb-3">
                    <div className="w-[50px] h-[50px] sm:w-[56px] sm:h-[56px] rounded-[12px] overflow-hidden shrink-0 mt-0.5">
                      {pet.image ? (
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold">{pet.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                      <h4 className="text-[14px] font-extrabold text-[#111111] truncate">{pet.name}</h4>
                      <p className="text-[11px] font-medium text-[#666666] truncate">{pet.breed || pet.type || 'Breed'}</p>
                      <p className="text-[10px] font-semibold text-[#666666]/70 mt-0.5 truncate">
                        {pet.age || '3 years'} • {pet.gender || 'Male'} • {pet.weight || '25 kg'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 pt-2 text-[10px] font-medium text-[#666666]">
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center">
                        <Check size={10} className="text-white stroke-[3]" />
                      </div>
                      <span>Vaccinated</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart size={14} className="text-[#111111]" />
                      <span>No medical conditions</span>
                    </div>
                  </div>
                </div>
              ))}
              {selectedPets.length === 0 && (
                <div className="flex-none w-[260px] border border-[#F3E8CC] rounded-[16px] p-3">
                  <p className="text-sm text-gray-400">No pets selected</p>
                </div>
              )}
            </div>
          </div>

          {/* Price Details */}
          <div className="bg-white rounded-none sm:rounded-[20px] px-3 py-4 sm:p-5 border-y sm:border border-[#F3E8CC] mb-4">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-[36px] h-[36px] rounded-full bg-[#FFF9EC] flex items-center justify-center shrink-0">
                <Wallet size={18} className="text-[#111111]" />
              </div>
              <h3 className="text-[18px] font-extrabold text-[#111111]">Price Details</h3>
            </div>

            <div className="space-y-3.5">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#666666]">₹{basePricePerNight} × {nights} night{nights !== 1 ? 's' : ''} × {numPets} pet{numPets !== 1 ? 's' : ''}</span>
                  <span className="text-[11px] font-medium text-[#666666] mt-0.5">(₹{basePricePerNight} per pet per night)</span>
                </div>
                <span className="text-[14px] font-extrabold text-[#666666]">₹{baseTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[13px] font-semibold text-[#666666]">Platform fee</span>
                  <Info size={14} className="text-[#666666]" />
                </div>
                <span className="text-[14px] font-extrabold text-[#666666]">₹{platformFee}</span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-200">
                <span className="text-[13px] font-semibold text-[#666666]">GST (18%)</span>
                <span className="text-[14px] font-extrabold text-[#666666]">₹{gst.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[16px] font-extrabold text-[#111111]">Total Amount</span>
                <span className="text-[22px] font-extrabold text-[#111111]">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Secure Payment */}
          <div className="bg-[#E8F5E9] rounded-[16px] p-4 flex items-start space-x-3 mx-1 mb-8">
            <div className="bg-[#2E7D32] rounded-full p-1.5 shrink-0 mt-0.5">
              <ShieldCheck size={14} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#2E7D32] mb-0.5">Secure Payment</span>
              <span className="text-[11px] font-medium text-[#2E7D32]/80 leading-tight">Your payment is safe and only released after the stay is completed.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Banner & Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAFAFA] pt-2 pb-safe-bottom">
        <div className="max-w-2xl mx-auto w-full px-4 pb-4">
          <Button 
            className="w-full h-[60px] bg-[#FDD835] hover:bg-[#FBBF24] text-[#111111] text-[18px] font-extrabold rounded-full flex items-center justify-center space-x-2 shadow-[0_4px_14px_rgba(253,216,53,0.4)]"
          >
            <span>Pay ₹{finalTotal.toLocaleString('en-IN')}</span>
            <ArrowLeft size={20} className="rotate-180" />
          </Button>
        </div>
      </div>

      {/* Date Time Picker Modal for Editing Dates inline */}
      <DateTimePickerModal 
        isOpen={activePicker !== null}
        onClose={() => setActivePicker(null)}
        title={activePicker === 'dropoff' ? 'Select New Drop-off' : 'Select New Pick-up'}
        initialDate={activePicker === 'dropoff' ? dropoffDate : pickupDate}
        initialTime={activePicker === 'dropoff' ? dropoffTime : pickupTime}
        onConfirm={(dateStr, timeStr) => {
          if (activePicker === 'dropoff') {
            setTempDropoff({ date: dateStr, time: timeStr });
            // The modal automatically calls onClose() which sets activePicker to null.
            // We wait for the close animation to finish, then open the pickup modal!
            setTimeout(() => {
              setActivePicker('pickup');
            }, 300);
          } else {
            // Apply both changes
            const newDropoff = tempDropoff || { date: dropoffDate, time: dropoffTime };
            const newBookingData = {
              ...bookingData,
              dropoffDate: newDropoff.date,
              dropoffTime: newDropoff.time,
              pickupDate: dateStr,
              pickupTime: timeStr
            };
            setTempDropoff(null);
            
            // Update location state so it persists and UI refreshes immediately
            navigate(location.pathname, {
              state: { ...location.state, bookingData: newBookingData },
              replace: true
            });
          }
        }}
      />
    </>
  );
};
