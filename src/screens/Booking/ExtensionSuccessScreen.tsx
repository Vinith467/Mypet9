import { X, Calendar, Check, MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDayTime = (dateStr: string, timeStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' });
  const dateFormatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${dateFormatted}\n${dayName}${timeStr ? `, ${timeStr}` : ''}`;
};

export const ExtensionSuccessScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    booking, 
    newCheckoutDate, 
    additionalNights, 
    totalAdditionalAmount, 
    finalTotalAmount,
    additionalPlatformFee,
    additionalGst,
    additionalBaseTotal
  } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!booking) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAFAFA]">
      
      {/* Top Banner (Icon & Confetti) */}
      <div className="relative pt-12 pb-6 px-5 text-center flex flex-col items-center overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={() => navigate('/bookings')} 
          className="absolute right-5 top-5 p-1 rounded-full hover:bg-gray-200/50 transition-colors z-20"
        >
          <X size={24} className="text-[#111111]" />
        </button>

        {/* Confetti Particles (Background) */}
        <div className="absolute inset-0 pointer-events-none opacity-80 z-0">
          <div className="absolute top-[20%] left-[25%] w-[3px] h-[10px] bg-green-400 rotate-45"></div>
          <div className="absolute top-[15%] left-[35%] w-[12px] h-[3px] bg-yellow-400 -rotate-45"></div>
          <div className="absolute top-[25%] right-[35%] w-[3px] h-[12px] bg-green-500 rotate-12"></div>
          <div className="absolute top-[40%] right-[30%] w-[10px] h-[3px] bg-yellow-400 -rotate-12"></div>
        </div>

        {/* Main Icon */}
        <div className="relative z-10 w-24 h-24 flex items-center justify-center mb-5 mt-2 mx-auto">
          {/* Green circle with a check, and a small yellow calendar with a check */}
          <div className="w-[72px] h-[72px] rounded-full bg-[#10B981] flex items-center justify-center relative shadow-sm">
            <Check size={40} className="text-white stroke-[4]" />
            <div className="absolute -bottom-1 -right-4 w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center shadow-sm">
               <div className="w-[34px] h-[34px] rounded-full bg-[#FFF9EC] border border-[#FDD835]/30 flex items-center justify-center relative">
                 <Calendar size={18} className="text-[#111111]" strokeWidth={2.5} />
                 <div className="absolute -bottom-1 -right-1 w-[14px] h-[14px] rounded-full bg-[#FDD835] flex items-center justify-center">
                   <Check size={10} className="text-[#111111] stroke-[4]" />
                 </div>
               </div>
            </div>
          </div>
        </div>

        <h1 className="text-[26px] font-extrabold text-[#111111] tracking-tight z-10" style={{ fontFamily: 'serif' }}>
          Stay Extended!
        </h1>
        <p className="text-[14px] font-medium text-[#666666] mt-1.5 max-w-[280px] mx-auto leading-relaxed z-10">
          Your booking has been successfully extended.
        </p>
      </div>

      {/* Content Container */}
      <div className="py-2 space-y-4 max-w-2xl mx-auto w-full px-4 pb-40">
        
        {/* Combined Details Card */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col overflow-hidden">
          
          {/* Host Details Section */}
          <div className="p-4 sm:p-5">
            <div className="flex gap-4">
              <img 
                src={booking.caretakerImage || `https://ui-avatars.com/api/?name=${booking.caretakerName}&background=E8F5E9&color=174F38`}
                alt={booking.caretakerName}
                className="w-[70px] h-[80px] rounded-[16px] object-cover shrink-0 bg-gray-100"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                <div className="flex items-center gap-1.5 min-w-0 mb-1.5">
                  <h3 className="text-[16px] font-extrabold text-[#111111] truncate">{booking.caretakerName}</h3>
                  <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-[#E8F5E9] rounded-full shrink-0">
                    <svg className="w-2.5 h-2.5 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <span className="text-[9px] font-bold text-[#10B981]">Verified Host</span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 min-w-0">
                    <MapPin size={12} className="text-[#666666] shrink-0" />
                    <span className="text-[11px] font-medium text-[#666666] truncate">{booking.caretakerLocation || ''}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 min-w-0">
                    <Calendar size={12} className="text-[#666666] shrink-0" />
                    <span className="text-[11px] font-medium text-[#666666] truncate">
                      {formatDate(booking.dropoffDate)} - <span className="px-1 py-0.5 bg-[#E8F5E9] text-[#10B981] rounded text-[10px] font-bold">{formatDate(newCheckoutDate)}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 min-w-0">
                    <svg className="w-3 h-3 text-[#666666] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 14c0 4.418 7.163 8 16 8s16-3.582 16-8-7.163-8-16-8-16 3.582-16 8z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path></svg>
                    <span className="text-[11px] font-medium text-[#666666] truncate">{booking.nights} nights (extended)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 mt-4 pt-3 border-t border-gray-50">
               <div className="flex items-center space-x-1.5 px-2 py-1 bg-[#E8F5E9] rounded-full">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                 <span className="text-[10px] font-extrabold text-[#10B981]">Ongoing</span>
               </div>
               <span className="text-[10px] font-medium text-[#10B981]">{booking.nights} days left! <span className="text-[#666666] font-normal">(Check-out: {formatDate(newCheckoutDate)})</span></span>
            </div>
          </div>

          <div className="h-px bg-gray-50 mx-4"></div>

          {/* Updated Stay Details Section */}
          <div className="p-4 sm:p-5 border-b border-gray-50 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFF9EC] flex items-center justify-center shrink-0 border border-[#F3E8CC]">
              <Calendar size={16} className="text-[#111111]" />
            </div>
            <h3 className="text-[16px] font-extrabold text-[#111111]" style={{ fontFamily: 'serif' }}>Updated Stay Details</h3>
          </div>
          
          <div className="flex items-start justify-between p-4 sm:p-5 pt-0">
            <div className="flex flex-col flex-1">
              <span className="text-[11px] font-medium text-[#666666] mb-1">Check-in</span>
              <span className="text-[13px] font-extrabold text-[#111111] mb-0.5 whitespace-pre-line">{formatDayTime(booking.dropoffDate, booking.dropoffTime)}</span>
            </div>
            <div className="flex flex-col flex-1 px-3 border-l border-gray-100">
              <span className="text-[11px] font-medium text-[#666666] mb-1">Check-out</span>
              <span className="text-[13px] font-extrabold text-[#111111] mb-0.5 whitespace-pre-line">{formatDayTime(newCheckoutDate, booking.pickupTime)}</span>
            </div>
            <div className="flex flex-col items-center justify-center pl-3 border-l border-gray-100">
              <span className="text-[10px] font-medium text-[#666666] mb-1">Total duration</span>
              <div className="flex items-center space-x-1 mt-0.5">
                <svg className="w-3.5 h-3.5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                <span className="text-[13px] font-extrabold text-[#111111]">{booking.nights} nights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Updated Price Details Card */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-50 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFF9EC] flex items-center justify-center shrink-0 border border-[#F3E8CC]">
              <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </div>
            <h3 className="text-[16px] font-extrabold text-[#111111]" style={{ fontFamily: 'serif' }}>Updated Price Details</h3>
          </div>
          
          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-[#666666]">Previous amount</span>
              <span className="text-[14px] font-bold text-[#666666]">₹{(finalTotalAmount - totalAdditionalAmount).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-[#666666]">Additional amount ({additionalNights} nights)</span>
              <span className="text-[14px] font-bold text-[#666666]">₹{additionalBaseTotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="h-px bg-gray-50 my-1"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-[#666666]">Platform fee (additional)</span>
              <span className="text-[14px] font-bold text-[#666666]">₹{additionalPlatformFee}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium text-[#666666]">GST (18%)</span>
              <span className="text-[14px] font-bold text-[#666666]">₹{additionalGst}</span>
            </div>
          </div>
          
          <div className="bg-[#FFF9EC] p-4 sm:p-5 flex justify-between items-center border-t border-[#F3E8CC]/50">
            <span className="text-[16px] font-extrabold text-[#111111]">Total Amount</span>
            <span className="text-[18px] font-extrabold text-[#111111]">₹{finalTotalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-4 pb-safe-bottom shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-3">
          <button 
            onClick={() => navigate(`/booking-progress/${booking.id}`)}
            className="w-full h-[54px] bg-[#FDD835] hover:bg-[#FBBF24] text-[#111111] text-[16px] font-extrabold rounded-[16px] flex items-center justify-center transition-colors"
          >
            <span>View Booking</span>
          </button>
          <button 
            onClick={() => navigate('/bookings')}
            className="w-full h-[54px] bg-white border border-gray-200 hover:bg-gray-50 text-[#111111] text-[16px] font-extrabold rounded-[16px] flex items-center justify-center transition-colors shadow-sm"
          >
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
