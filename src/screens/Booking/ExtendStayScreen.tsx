import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CreditCard, ArrowRight, Minus, Plus } from 'lucide-react';
import { db } from '../../config/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

export const ExtendStayScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const [booking, setBooking] = useState<any>(location.state?.booking || null);
  const [additionalNights, setAdditionalNights] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'bookings', id), (docSnap) => {
      if (docSnap.exists()) {
        setBooking({ id: docSnap.id, ...docSnap.data() });
      }
    });
    return () => unsubscribe();
  }, [id]);

  if (!booking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  const formatDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' });
    const dateFormatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    return `${dateFormatted} (${dayName}${timeStr ? `, ${timeStr}` : ''})`;
  };

  // Base math based on existing booking
  const currentNights = booking.nights || 1;
  const numPets = booking.selectedPets ? booking.selectedPets.length : 1;
  const currentTotal = booking.totalAmount || 0;
  
  // Reverse engineer base price
  const baseTotalApprox = (currentTotal / 1.18) - 160;
  const basePricePerNight = Math.max(0, Math.round(baseTotalApprox / (currentNights * numPets)));
  
  const additionalBaseTotal = basePricePerNight * additionalNights * numPets;
  const additionalPlatformFee = additionalNights * 40; // 40 per night approx, making it up to match 120 for 3 nights
  
  const additionalGst = Math.round((additionalBaseTotal + additionalPlatformFee) * 0.18);
  const totalAdditionalAmount = additionalBaseTotal + additionalPlatformFee + additionalGst;
  const finalTotalAmount = currentTotal + totalAdditionalAmount;

  // New check-out date calculation
  const newCheckoutDate = new Date(booking.pickupDate);
  newCheckoutDate.setDate(newCheckoutDate.getDate() + additionalNights);
  const newCheckoutFormatted = formatDateTime(newCheckoutDate.toISOString(), booking.pickupTime);

  const handleConfirmExtension = async () => {
    if (!id || isProcessing || additionalNights <= 0) return;
    setIsProcessing(true);
    try {
      const newCheckoutDateString = newCheckoutDate.toISOString().split('T')[0];
      await updateDoc(doc(db, 'bookings', id), {
        nights: currentNights + additionalNights,
        pickupDate: newCheckoutDateString,
        totalAmount: finalTotalAmount,
        isExtended: true,
        originalNights: booking.originalNights || currentNights,
        originalPickupDate: booking.originalPickupDate || booking.pickupDate,
        originalTotalAmount: booking.originalTotalAmount || currentTotal,
        totalAdditionalAmount: (booking.totalAdditionalAmount || 0) + totalAdditionalAmount
      });
      navigate('/extension-success', { 
        state: { 
          booking: { ...booking, nights: currentNights + additionalNights, pickupDate: newCheckoutDateString, totalAmount: finalTotalAmount },
          newCheckoutDate: newCheckoutDateString,
          additionalNights,
          totalAdditionalAmount,
          finalTotalAmount,
          additionalPlatformFee,
          additionalGst,
          additionalBaseTotal
        }
      });
    } catch (error) {
      console.error('Error extending stay:', error);
      alert('Failed to extend stay.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAFAFA] pb-32">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 pt-4 pb-3 px-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -ml-2"
        >
          <ArrowLeft className="text-[#111111]" size={24} />
        </button>
        <h1 className="text-[20px] font-extrabold text-[#111111]">Extend Stay</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto w-full">
        
        {/* Host Details Card */}
        <div className="bg-white rounded-[24px] p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col">
          <div className="flex gap-4">
            <img 
              src={booking.caretakerImage || 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?auto=format&fit=crop&q=80&w=200'}
              alt={booking.caretakerName}
              className="w-[90px] h-[100px] rounded-[16px] object-cover shrink-0 bg-gray-100"
            />
            <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
              <div className="flex items-center gap-1.5 min-w-0 mb-1.5">
                <h3 className="text-[17px] font-extrabold text-[#111111] truncate">{booking.caretakerName}</h3>
                <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-[#E8F5E9] rounded-full shrink-0">
                  <svg className="w-2.5 h-2.5 text-[#174F38]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span className="text-[9px] font-bold text-[#174F38]">Verified Host</span>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 min-w-0">
                  <MapPin size={14} className="text-[#666666] shrink-0" />
                  <span className="text-[12px] font-medium text-[#666666] truncate">{booking.caretakerLocation || ''}</span>
                </div>
                
                <p className="text-[11px] font-medium text-[#8A9BAE] mt-2 mb-1">Current booking</p>
                <div className="flex items-center space-x-2 min-w-0">
                  <Calendar size={14} className="text-[#666666] shrink-0" />
                  <span className="text-[12px] font-medium text-[#666666] truncate">{formatDate(booking.dropoffDate)} – {formatDate(booking.pickupDate)}</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <svg className="w-3.5 h-3.5 text-[#666666] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 14c0 4.418 7.163 8 16 8s16-3.582 16-8-7.163-8-16-8-16 3.582-16 8z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path></svg>
                  <span className="text-[12px] font-medium text-[#666666] truncate">{booking.nights} nights (2 days left)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection Card */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col overflow-hidden">
          <div className="bg-[#FFF9EC] p-4 flex items-center gap-2.5 border-b border-[#F3E8CC]/50">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
              <Calendar size={16} className="text-[#111111]" />
            </div>
            <h3 className="text-[16px] font-extrabold text-[#111111]">Select New Check-out Date</h3>
          </div>
          
          <div className="p-4 sm:p-5 space-y-5">
            <div>
              <span className="text-[12px] font-medium text-[#666666] mb-1.5 block">Current check-out date</span>
              <span className="text-[14px] font-medium text-[#465E87]">{formatDateTime(booking.pickupDate, booking.pickupTime)}</span>
            </div>
            
            <div>
              <span className="text-[12px] font-medium text-[#666666] mb-1.5 block">New check-out date</span>
              <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-[12px] bg-white">
                <Calendar size={18} className="text-[#111111]" />
                <span className="text-[15px] font-extrabold text-[#111111]">{newCheckoutFormatted.split(' (')[0]} <span className="font-medium text-[#666666]">({newCheckoutFormatted.split('(')[1]}</span></span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-[13px] font-medium text-[#666666]">Additional Nights</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setAdditionalNights(Math.max(1, additionalNights - 1))}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#111111] hover:bg-gray-50 disabled:opacity-50"
                  disabled={additionalNights <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="text-[16px] font-extrabold text-[#111111] w-4 text-center">{additionalNights}</span>
                <button 
                  onClick={() => setAdditionalNights(additionalNights + 1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[#111111] hover:bg-gray-50"
                >
                  <Plus size={16} />
                </button>
                <span className="text-[12px] font-medium text-[#666666] ml-1">Extra {additionalNights} night{additionalNights > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Calculation Card */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col overflow-hidden">
          <div className="bg-[#FFF9EC] p-4 flex items-center gap-2.5 border-b border-[#F3E8CC]/50">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
              <CreditCard size={16} className="text-[#111111]" />
            </div>
            <h3 className="text-[16px] font-extrabold text-[#111111]">Price Calculation</h3>
          </div>
          
          <div className="p-4 sm:p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-[#465E87] mb-0.5">Previous amount</span>
                <span className="text-[12px] font-medium text-[#8A9BAE]">(₹{basePricePerNight} × {currentNights} nights × {numPets} pet{numPets > 1 ? 's' : ''})</span>
              </div>
              <span className="text-[14px] font-medium text-[#465E87]">₹{currentTotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-[#465E87] mb-0.5">Additional amount</span>
                <span className="text-[12px] font-medium text-[#8A9BAE]">(₹{basePricePerNight} × {additionalNights} nights × {numPets} pet{numPets > 1 ? 's' : ''})</span>
              </div>
              <span className="text-[14px] font-medium text-[#465E87]">₹{additionalBaseTotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="pt-2"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-[#666666]">Platform fee (for additional nights)</span>
              <span className="text-[14px] font-medium text-[#465E87]">₹{additionalPlatformFee}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-[#666666]">GST (18%)</span>
              <span className="text-[14px] font-medium text-[#465E87]">₹{additionalGst.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <div className="bg-[#FFF9EC] p-4 sm:p-5 flex justify-between items-center border-t border-[#F3E8CC]/50">
            <div className="flex flex-col">
              <span className="text-[16px] font-extrabold text-[#111111] mb-0.5">Total Amount</span>
              <span className="text-[10px] font-medium text-[#666666]">Previous amount + Additional amount</span>
            </div>
            <span className="text-[18px] font-extrabold text-[#111111]">₹{finalTotalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-[#FAFAFA]/0 pt-8 pb-safe-bottom backdrop-blur-[2px]">
        <div className="max-w-2xl mx-auto w-full px-4 pb-4">
          <button 
            onClick={handleConfirmExtension}
            disabled={isProcessing}
            className="w-full h-[54px] bg-[#FDD835] hover:bg-[#FBBF24] text-[#111111] text-[16px] font-extrabold rounded-[16px] flex items-center justify-center space-x-2 shadow-sm transition-colors disabled:opacity-50"
          >
            <span>Confirm Extension</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
