import { useState } from 'react';
import { ArrowLeft, Home, TreePine, PawPrint, Camera, MapPin, Calendar, Moon, Wallet, Info, ShieldCheck, Heart, Edit2, BadgeCheck, Star, Pencil, Check, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { DateTimePickerModal } from '../../components/ui/DateTimePickerModal';
import type { Pet } from '../Pets/MyPetsScreen';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

export const BookingSummaryScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;
  const bookingData = location.state?.bookingData;
  const selectedPets: Pet[] = location.state?.selectedPets || [];

  const { user } = useAuth();
  const [activePicker, setActivePicker] = useState<'dropoff' | 'pickup' | null>(null);
  const [tempDropoff, setTempDropoff] = useState<{date: string, time: string} | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const dropoffDate = bookingData?.dropoffDate || '';
  const dropoffTime = bookingData?.dropoffTime || '';
  const pickupDate = bookingData?.pickupDate || '';
  const pickupTime = bookingData?.pickupTime || '';

  const basePricePerNight = provider?.price || 850;
  const nights = calculateNights(dropoffDate, pickupDate);
  const numPets = Math.max(selectedPets.length, 1);
  const baseTotal = basePricePerNight * nights * numPets;
  const platformFee = 160;
  const gst = Math.round((baseTotal + platformFee) * 0.18);
  const finalTotal = baseTotal + platformFee + gst;

  const handleConfirmBooking = async (paymentMethod: 'pay_now' | 'pay_later') => {
    if (!user) {
      alert("Please login first");
      return;
    }
    setIsBooking(true);
    try {
      const newBooking = {
        petParentId: user.uid,
        caretakerId: provider?.id || 'unknown',
        caretakerName: provider?.name || 'Priya Sharma',
        caretakerLocation: provider?.locationStr || '',
        caretakerImage: provider?.images?.[0] || provider?.photo || '',
        service: 'Boarding',
        dropoffDate,
        dropoffTime,
        pickupDate,
        pickupTime,
        nights,
        totalAmount: finalTotal,
        paymentMethod,
        status: 'ongoing',
        selectedPets: selectedPets,
        petName: selectedPets[0]?.name || 'Your Pet',
        petImage: selectedPets[0]?.image || '',
        petBreed: selectedPets[0]?.breed || '',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), newBooking);
      
      navigate('/booking-confirmed', { 
        state: { 
          provider, 
          bookingData, 
          selectedPets, 
          finalTotal, 
          paymentMethod,
          bookingId: docRef.id
        } 
      });
    } catch (error) {
      console.error("Error creating booking: ", error);
      alert("Failed to confirm booking. Please try again.");
      setIsBooking(false);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col min-h-screen bg-[#F5F7F9] pb-48">
        
        {/* Header with Hero Banner */}
        <div className="relative w-full">
          <img src="/review hero.png" alt="Header Banner" className="w-full h-auto block" />
          <div className="absolute inset-0 pt-6 pb-2 px-5 text-center flex flex-col justify-start z-10">
            <button 
              onClick={() => navigate(-1)} 
              className="absolute left-5 top-5 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={20} className="text-[#1B2B48]" />
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="px-4 lg:px-8 py-4 lg:max-w-7xl w-full mx-auto pb-32 lg:pb-8 -mt-2">
          <div className="flex flex-col lg:grid lg:grid-cols-[1.5fr,1fr] lg:gap-8 lg:items-start">
            
            {/* Left Column (Desktop) */}
            <div className="flex flex-col space-y-4 lg:space-y-6 w-full mb-6 lg:mb-0">
            
              {/* Host Card */}
              <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden px-4 py-5 sm:p-5">
                <div className="flex flex-col sm:flex-row gap-5">
                  
                  {/* Left Side: Host Image & Info */}
                  <div className="flex gap-4 sm:w-[50%]">
                    <div className="relative w-[130px] h-[130px] rounded-[16px] overflow-hidden shrink-0 shadow-sm border border-gray-100">
                      <img 
                        src={provider?.images?.[0] || provider?.photo || 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?auto=format&fit=crop&q=80&w=200'} 
                        alt="Host" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 flex items-center justify-center space-x-1 bg-white rounded-full shadow-md whitespace-nowrap z-10 border border-gray-50">
                        <ShieldCheck size={10} className="text-[#10B981]" />
                        <span className="text-[10px] font-bold text-[#10B981]">Verified Partner</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-start pt-1">
                      <div className="flex items-center space-x-2 w-full mb-1">
                        <h3 className="text-[18px] sm:text-[20px] font-extrabold text-[#111111] leading-tight truncate">
                          {provider?.name || 'Priya Sharma'}
                        </h3>
                        <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-[#E6FBF0] rounded-full shrink-0">
                          <ShieldCheck size={10} className="text-[#007672]" />
                          <span className="text-[10px] font-bold text-[#007672] whitespace-nowrap">Verified Partner</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1.5 mb-3.5">
                        <Star size={14} className="fill-[#007672] text-[#007672]" />
                        <span className="text-[13px] font-extrabold text-[#111111]">{Number(provider?.rating || 4.7).toFixed(1)}</span>
                        <span className="text-[12px] font-medium text-[#666666]">({provider?.reviews || 21} reviews)</span>
                      </div>

                      <div className="flex flex-col space-y-2 text-[12px] font-medium text-[#465E87]">
                        <div className="flex items-center space-x-2">
                          <Home size={14} className="text-[#465E87]" />
                          <span>Independent house</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <PawPrint size={14} className="text-[#007672] fill-[#007672]" />
                          <span>Only 2 pets at a time</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin size={14} className="text-[#465E87]" />
                          <span>{provider?.distanceStr || '10.6 km'} • {provider?.locationStr?.split(',')[0] || 'Kittaganahalli'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Photos & Amenities */}
                  <div className="flex flex-col sm:w-[50%] sm:items-end justify-center pt-2 sm:pt-0">
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                      <img src={provider?.images?.[1] || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop"} className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-[12px] object-cover shrink-0 shadow-sm" />
                      <img src={provider?.images?.[2] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100&h=100&fit=crop"} className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-[12px] object-cover shrink-0 shadow-sm" />
                      <img src={provider?.images?.[3] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop"} className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-[12px] object-cover shrink-0 shadow-sm" />
                      <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-[12px] bg-[#E5F6F5] flex flex-col items-center justify-center text-[#007672] shrink-0 cursor-pointer shadow-sm">
                        <span className="text-[14px] sm:text-[16px] font-extrabold leading-none">+5</span>
                        <span className="text-[10px] sm:text-[11px] font-bold leading-none mt-1">Photos</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap sm:justify-end mt-1">
                      <div className="flex items-center space-x-1.5 bg-[#F9F9F9] px-2.5 py-1.5 rounded-lg border border-gray-100">
                        <TreePine size={12} className="text-[#007672] fill-[#007672]" />
                        <span className="text-[11px] font-bold text-[#666666]">Has a garden</span>
                      </div>
                      <div className="flex items-center space-x-1.5 bg-[#F9F9F9] px-2.5 py-1.5 rounded-lg border border-gray-100">
                        <Camera size={12} className="text-[#007672]" />
                        <span className="text-[11px] font-bold text-[#666666]">Daily photo updates</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Stay Details */}
              <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden px-4 py-5 sm:p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#E5F6F5] flex items-center justify-center shrink-0">
                      <Calendar size={20} className="text-[#007672]" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-extrabold text-[#1B2B48]">Stay Details</h3>
                      <p className="text-[12px] font-medium text-[#465E87] mt-0.5">Your pet's homestay schedule</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActivePicker('dropoff')}
                    className="flex shrink-0 items-center space-x-1.5 px-4 py-1.5 border border-gray-200 rounded-full text-[#1B2B48] hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <Edit2 size={12} />
                    <span className="text-[12px] font-bold">Edit</span>
                  </button>
                </div>

                <div className="flex justify-between items-start pt-2 px-1">
                  <div className="flex-1 flex flex-col justify-start">
                    <span className="text-[11px] font-semibold text-[#666666] mb-1">Check-in</span>
                    <span className="text-[15px] font-extrabold text-[#111111] leading-tight mb-1">{formatDate(dropoffDate)}</span>
                    <span className="text-[11px] font-medium text-[#666666]">{formatDayTime(dropoffDate, dropoffTime)}</span>
                  </div>
                  
                  <div className="w-[1px] h-12 bg-gray-100 mx-2 sm:mx-6 shrink-0 mt-1"></div>
                  
                  <div className="flex-1 flex flex-col justify-start">
                    <span className="text-[11px] font-semibold text-[#666666] mb-1">Check-out</span>
                    <span className="text-[15px] font-extrabold text-[#111111] leading-tight mb-1">{formatDate(pickupDate)}</span>
                    <span className="text-[11px] font-medium text-[#666666]">{formatDayTime(pickupDate, pickupTime)}</span>
                  </div>
                  
                  <div className="w-[1px] h-12 bg-gray-100 mx-2 sm:mx-6 shrink-0 mt-1"></div>
                  
                  <div className="flex-1 flex flex-col justify-start">
                    <span className="text-[11px] font-semibold text-[#666666] mb-1">Total duration</span>
                    <span className="text-[15px] font-extrabold text-[#111111] leading-tight mb-1 flex items-center gap-1.5">
                      <Moon size={14} className="text-[#111111]" />
                      {nights} nights
                    </span>
                    <span className="text-[11px] font-medium text-[#666666]">({nights + 1} days)</span>
                  </div>
                </div>
              </div>

              {/* Pet Details */}
              <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden px-4 py-5 sm:p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#E5F6F5] flex items-center justify-center shrink-0">
                      <PawPrint size={20} className="text-[#007672]" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-extrabold text-[#1B2B48]">Pet Details ({numPets})</h3>
                      <p className="text-[12px] font-medium text-[#465E87] mt-0.5">Details of pet(s) for this booking</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/select-pet', { state: { provider, bookingData: location.state?.bookingData, selectedPets } })} className="flex shrink-0 items-center space-x-1.5 px-4 py-1.5 border border-gray-200 rounded-full text-[#1B2B48] hover:bg-gray-50 transition-colors shadow-sm">
                    <Edit2 size={12} />
                    <span className="text-[12px] font-bold">Edit</span>
                  </button>
                </div>

                <div className="flex flex-col space-y-4">
                  {selectedPets.map((pet, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 rounded-[16px] p-4 bg-white shadow-sm">
                      <div className="flex space-x-4 mb-3 sm:mb-0 w-full sm:w-auto">
                        <div className="w-[70px] h-[70px] rounded-[12px] overflow-hidden shrink-0 shadow-sm">
                          {pet.image ? (
                            <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold">{pet.name.charAt(0)}</div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-[16px] font-extrabold text-[#111111] truncate">{pet.name}</h4>
                            <span className="px-2 py-0.5 bg-[#E5F6F5] text-[#007672] text-[10px] font-bold rounded-full">Dog</span>
                          </div>
                          <p className="text-[12px] font-medium text-[#465E87] mb-1.5 truncate">{pet.breed || pet.type || 'Siberian Husky'}</p>
                          <div className="flex items-center space-x-3 text-[11px] font-semibold text-[#666666] truncate">
                            <span className="flex items-center space-x-1">
                              <span className="text-gray-400 font-normal">🎂</span>
                              <span>{pet.age || 'Young (1-3 yrs)'}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span className="text-gray-400 font-normal">♂</span>
                              <span>{pet.gender || 'Male'}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span className="text-gray-400 font-normal">⚖</span>
                              <span>{pet.weight || '18 kg'}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto">
                        <div className="flex items-center space-x-2">
                          <div className="w-[18px] h-[18px] rounded-full bg-[#10B981] flex items-center justify-center">
                            <Check size={12} className="text-white stroke-[3]" />
                          </div>
                          <span className="text-[12px] font-medium text-[#465E87]">Vaccinated</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-[18px] h-[18px] rounded-full bg-[#10B981] flex items-center justify-center">
                            <Check size={12} className="text-white stroke-[3]" />
                          </div>
                          <span className="text-[12px] font-medium text-[#465E87]">No medical conditions</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedPets.length === 0 && (
                    <div className="border border-gray-100 rounded-[16px] p-4">
                      <p className="text-sm text-gray-400">No pets selected</p>
                    </div>
                  )}
                </div>
              </div>

            </div> {/* End Left Column */}

            {/* Right Column (Desktop) */}
            <div className="flex flex-col space-y-4 lg:space-y-6 w-full">
              
              {/* Price Details */}
              <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden px-5 py-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-[42px] h-[42px] rounded-full bg-[#E5F6F5] flex items-center justify-center shrink-0">
                      <FileText size={20} className="text-[#007672]" />
                    </div>
                    <h3 className="text-[18px] font-extrabold text-[#1B2B48]">Price Details</h3>
                  </div>
                  <PawPrint size={40} className="text-[#E5F6F5] -mt-1 -mr-1" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-[#111111]">₹{basePricePerNight} × {nights} night{nights !== 1 ? 's' : ''} × {numPets} pet{numPets !== 1 ? 's' : ''}</span>
                      <span className="text-[11px] font-medium text-[#666666] mt-0.5">(₹{basePricePerNight} per pet per night)</span>
                    </div>
                    <span className="text-[14px] font-extrabold text-[#111111]">₹{baseTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[13px] font-semibold text-[#111111]">Platform fee</span>
                      <Info size={14} className="text-[#666666]" />
                    </div>
                    <span className="text-[14px] font-extrabold text-[#111111]">₹{platformFee}</span>
                  </div>

                  <div className="flex justify-between items-center pb-5 border-b border-dashed border-gray-200">
                    <span className="text-[13px] font-semibold text-[#111111]">GST (18%)</span>
                    <span className="text-[14px] font-extrabold text-[#111111]">₹{gst.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center bg-[#F5F8F8] p-4 -mx-5 -mb-6 mt-2">
                    <span className="text-[16px] font-extrabold text-[#1B2B48]">Total Amount</span>
                    <span className="text-[24px] font-extrabold text-[#1B2B48]">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Secure Payment */}
              <div className="bg-[#E8F5E9] rounded-[16px] p-4 flex items-start space-x-3 border border-[#C8E6C9]">
                <div className="bg-[#2E7D32] rounded-full p-1 shrink-0 mt-0.5">
                  <ShieldCheck size={16} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#2E7D32] mb-0.5">Secure Payment</span>
                  <span className="text-[11px] font-medium text-[#2E7D32]/90 leading-relaxed">Your payment is safe and only released after the stay is completed.</span>
                </div>
              </div>

              {/* Desktop Payment Buttons */}
              <div className="hidden lg:flex flex-col space-y-3 w-full mt-2">
                <Button 
                  onClick={() => handleConfirmBooking('pay_later')}
                  disabled={isBooking}
                  className="w-full h-[54px] bg-white border border-[#1B2B48] text-[#1B2B48] hover:bg-gray-50 text-[15px] font-extrabold rounded-[16px] flex items-center justify-center space-x-2 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Wallet size={18} className="text-[#1B2B48]" />
                  <span>{isBooking ? 'Processing...' : 'Pay After Service'}</span>
                </Button>
                <Button 
                  onClick={() => handleConfirmBooking('pay_now')}
                  disabled={isBooking}
                  className="w-full h-[54px] bg-[#007672] hover:bg-[#00605c] text-white text-[15px] font-extrabold rounded-[16px] flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
                >
                  <FileText size={18} className="text-white" />
                  <span>{isBooking ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString('en-IN')} Now`}</span>
                  <ArrowLeft size={18} className="rotate-180" />
                </Button>
              </div>

            </div> {/* End Right Column */}
          </div> {/* End Content Grid */}
        </div>
      </div>

      {/* Bottom Fixed Banner & Button (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-4 pb-safe-bottom lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-2xl mx-auto w-full flex flex-col space-y-3">
          <Button 
            onClick={() => handleConfirmBooking('pay_later')}
            disabled={isBooking}
            className="w-full h-[52px] bg-white border border-[#1B2B48] text-[#1B2B48] hover:bg-gray-50 text-[15px] font-extrabold rounded-[16px] flex items-center justify-center space-x-2 transition-colors shadow-sm disabled:opacity-50"
          >
            <Wallet size={18} className="text-[#1B2B48]" />
            <span>{isBooking ? 'Processing...' : 'Pay After Service'}</span>
          </Button>
          <Button 
            onClick={() => handleConfirmBooking('pay_now')}
            disabled={isBooking}
            className="w-full h-[52px] bg-[#007672] hover:bg-[#00605c] text-white text-[15px] font-extrabold rounded-[16px] flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
          >
            <FileText size={18} className="text-white" />
            <span>{isBooking ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString('en-IN')} Now`}</span>
            <ArrowLeft size={18} className="rotate-180" />
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
