import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, CreditCard, AlertCircle, Phone, CheckCircle2, MoreVertical, MessageSquare } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { db } from '../../config/firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

export const BookingProgressScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const [booking, setBooking] = useState<any>(location.state?.booking || null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    // Subscribe to realtime updates for this specific booking
    const unsubscribe = onSnapshot(doc(db, 'bookings', id), (docSnap) => {
      if (docSnap.exists()) {
        setBooking({ id: docSnap.id, ...docSnap.data() });
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">Loading...</div>
      </DashboardLayout>
    );
  }

  const handleCompletePayment = async () => {
    if (!id || isProcessing) return;
    setIsProcessing(true);
    try {
      await updateDoc(doc(db, 'bookings', id), {
        paymentMethod: 'pay_now'
      });
      alert('Payment completed successfully!');
    } catch (error) {
      console.error('Error completing payment:', error);
      alert('Failed to complete payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtendNight = async () => {
    if (!id || isProcessing) return;
    const confirmExtend = window.confirm("Do you want to extend your stay by 1 night?");
    if (!confirmExtend) return;

    setIsProcessing(true);
    try {
      const currentNights = booking.nights || 1;
      const currentTotal = booking.totalAmount || 0;
      
      const newNights = currentNights + 1;
      const newTotal = Math.round((currentTotal / currentNights) * newNights);
      
      // Calculate new pickup date
      const pickupDateObj = new Date(booking.pickupDate);
      if (!isNaN(pickupDateObj.getTime())) {
        pickupDateObj.setDate(pickupDateObj.getDate() + 1);
        const newPickupDate = pickupDateObj.toISOString().split('T')[0]; // YYYY-MM-DD
        
        await updateDoc(doc(db, 'bookings', id), {
          nights: newNights,
          totalAmount: newTotal,
          pickupDate: newPickupDate
        });
        alert(`Successfully extended! New total nights: ${newNights}. New Amount: ₹${newTotal.toLocaleString('en-IN')}`);
      } else {
        alert("Error parsing dates.");
      }
    } catch (error) {
      console.error('Error extending night:', error);
      alert('Failed to extend night.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isPayLater = booking.paymentMethod === 'pay_later';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAFAFA] pb-32">
      
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 pt-4 pb-3 px-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
        <button 
          onClick={() => navigate('/bookings')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -ml-2"
        >
          <ArrowLeft className="text-[#111111]" size={24} />
        </button>
        <h1 className="text-[20px] font-extrabold text-[#111111]">Booking Details</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -mr-2">
          <MoreVertical className="text-[#111111]" size={24} />
        </button>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto w-full">
        
        {/* Combined Details Card */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col overflow-hidden">
          
          {/* Host Details Section */}
          <div className="p-4 sm:p-5">
            <div className="flex gap-4">
              <img 
                src={booking.caretakerImage || `https://ui-avatars.com/api/?name=${booking.caretakerName}&background=E8F5E9&color=174F38`}
                alt={booking.caretakerName}
                className="w-[90px] h-[100px] rounded-[16px] object-cover shrink-0 bg-gray-100"
              />
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div className="flex items-center gap-1.5 min-w-0 mb-1.5">
                <h3 className="text-[17px] font-extrabold text-[#111111] truncate">{booking.caretakerName}</h3>
                <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-[#E8F5E9] rounded-full shrink-0">
                  <svg className="w-2.5 h-2.5 text-[#174F38]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span className="text-[9px] font-bold text-[#174F38]">Verified Host</span>
                </div>
              </div>
              
              <div className="space-y-1.5 mb-2.5">
                <div className="flex items-center space-x-2 min-w-0">
                  <MapPin size={14} className="text-[#666666] shrink-0" />
                  <span className="text-[12px] font-medium text-[#666666] truncate">{booking.caretakerLocation || ''}</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <Calendar size={14} className="text-[#666666] shrink-0" />
                  <span className="text-[12px] font-medium text-[#666666] truncate">{formatDate(booking.dropoffDate)} - {formatDate(booking.pickupDate)}</span>
                </div>
                <div className="flex items-center space-x-2 min-w-0">
                  <svg className="w-3.5 h-3.5 text-[#666666] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 14c0 4.418 7.163 8 16 8s16-3.582 16-8-7.163-8-16-8-16 3.582-16 8z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path></svg>
                  <span className="text-[12px] font-medium text-[#666666] truncate">
                    {booking.isExtended ? (
                      <>{booking.originalNights} nights + {booking.nights - (booking.originalNights || 0)} extended nights ({booking.nights} nights)</>
                    ) : (
                      <>{booking.nights} nights</>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#E8F5E9] rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                  <span className="text-[11px] font-extrabold text-[#10B981] capitalize">{booking.status}</span>
                </div>
                {booking.status === 'ongoing' && (
                  <span className="text-[11px] font-medium text-[#10B981]">{booking.nights} days left <span className="text-[#666666] font-normal">(Check-out: {formatDate(booking.pickupDate)})</span></span>
                )}
              </div>
            </div>
          </div>
          
          {/* Primary Action */}
          <div className="mt-5 px-4 pb-2">
            <button 
              onClick={() => navigate(`/chat/${id}`)}
              className="w-full flex items-center justify-center gap-2.5 bg-[#FFF9EC] hover:bg-[#F3E8CC] text-[#111111] py-3.5 rounded-[12px] font-extrabold text-[15px] transition-colors border border-[#F3E8CC]"
            >
              <MessageSquare size={20} className="text-[#111111]" />
              Message Caretaker
            </button>
          </div>
          </div>

          <div className="h-px bg-gray-50 mx-4"></div>

          {booking.isExtended && (
            <>
              {/* Stay Timeline Section */}
              <div className="p-4 sm:p-5 bg-[#FFF9EC]">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-full border border-[#FDD835] bg-white flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 className="text-[16px] font-extrabold text-[#111111]">Stay Timeline</h3>
                </div>
                
                <div className="space-y-4 px-1">
                  {/* Original Booking */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center z-10 shrink-0">
                        <CheckCircle2 size={16} className="text-white fill-[#10B981]" />
                      </div>
                      <div className="w-0.5 h-[60px] border-l-2 border-dashed border-[#10B981]/50 my-1"></div>
                    </div>
                    <div className="bg-white rounded-[16px] p-3.5 flex-1 flex items-start gap-3 shadow-sm border border-gray-100 pb-4">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                        <Calendar size={16} className="text-[#111111]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-[14px] font-extrabold text-[#111111]">Original Booking</h4>
                            <p className="text-[12px] font-medium text-[#666666] mt-0.5">{formatDate(booking.dropoffDate)} - {formatDate(booking.originalPickupDate || booking.pickupDate)}</p>
                            <p className="text-[11px] font-medium text-[#8A9BAE] mt-0.5">{booking.originalNights || booking.nights} nights × {booking.selectedPets?.length || 1} pets</p>
                          </div>
                          <span className="text-[14px] font-extrabold text-[#111111]">₹{(booking.originalTotalAmount || booking.totalAmount)?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Extended Stay */}
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center z-10 shrink-0 mt-1">
                      <CheckCircle2 size={16} className="text-white fill-[#10B981]" />
                    </div>
                    <div className="bg-white rounded-[16px] p-3.5 flex-1 flex items-start gap-3 shadow-sm border border-gray-100 pb-4">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 relative">
                        <Calendar size={16} className="text-[#111111]" />
                        <div className="absolute -bottom-1 -right-1 bg-[#FDD835] rounded-full p-0.5 border border-white">
                          <svg className="w-2.5 h-2.5 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-[14px] font-extrabold text-[#111111]">Extended Stay</h4>
                            <p className="text-[12px] font-medium text-[#666666] mt-0.5">{formatDate(booking.originalPickupDate || booking.pickupDate)} - {formatDate(booking.pickupDate)}</p>
                            <p className="text-[11px] font-medium text-[#8A9BAE] mt-0.5">{booking.nights - (booking.originalNights || 0)} nights × {booking.selectedPets?.length || 1} pets</p>
                          </div>
                          <span className="text-[14px] font-extrabold text-[#111111]">₹{booking.totalAdditionalAmount?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-px bg-gray-50 mx-4"></div>
            </>
          )}

          {/* Stay Details Section */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FFF9EC] flex items-center justify-center shrink-0 border border-[#F3E8CC]">
                <Calendar size={16} className="text-[#111111]" />
              </div>
              <h3 className="text-[16px] font-extrabold text-[#111111]">
                {booking.isExtended ? 'Updated Stay Details' : 'Stay Details'}
              </h3>
            </div>
          </div>
          <div className="flex items-start justify-between bg-[#FAFAFA] rounded-[16px] p-3 sm:p-4 border border-gray-100/50">
            <div className="flex flex-col flex-1">
              <span className="text-[11px] font-medium text-[#666666] mb-1">Check-in</span>
              <span className="text-[14px] font-extrabold text-[#111111] mb-0.5">{formatDate(booking.dropoffDate)}</span>
              <span className="text-[11px] font-medium text-[#666666]">{booking.dropoffTime || ''}</span>
            </div>
            <div className="flex flex-col flex-1 px-3 border-l border-gray-200">
              <span className="text-[11px] font-medium text-[#666666] mb-1">Check-out</span>
              <span className="text-[14px] font-extrabold text-[#111111] mb-0.5">{formatDate(booking.pickupDate)}</span>
              <span className="text-[11px] font-medium text-[#666666]">{booking.pickupTime || ''}</span>
            </div>
            <div className="flex flex-col items-center justify-center pl-3 border-l border-gray-200">
              <span className="text-[10px] font-medium text-[#666666] mb-1">Total duration</span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                <span className="text-[14px] font-extrabold text-[#111111]">{booking.nights} nights</span>
              </div>
            </div>
          </div>
          </div>

          <div className="h-px bg-gray-50 mx-4"></div>

          {/* Pet Details Section */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FFF9EC] flex items-center justify-center shrink-0 border border-[#F3E8CC]">
                <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 14c0 4.418 7.163 8 16 8s16-3.582 16-8-7.163-8-16-8-16 3.582-16 8z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path></svg>
              </div>
              <h3 className="text-[16px] font-extrabold text-[#111111]">Pet Details ({booking.selectedPets?.length || 1})</h3>
            </div>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-hide">
            {(booking.selectedPets || [booking]).map((pet: any, i: number) => (
              <div key={pet.id || i} className="min-w-[240px] max-w-[260px] snap-center bg-white border border-gray-100 rounded-[16px] p-3 flex flex-col shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <img src={pet.image || pet.petImage || "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200"} alt={pet.name || pet.petName} className="w-[48px] h-[48px] rounded-[12px] object-cover" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-extrabold text-[#111111] truncate">{pet.name || pet.petName}</span>
                    <span className="text-[11px] font-medium text-[#666666] truncate">{pet.breed || pet.petBreed}</span>
                    <span className="text-[10px] font-medium text-[#8A9BAE] truncate mt-0.5">
                      {pet.age ? `${pet.age} yrs • ` : ''}{pet.gender ? `${pet.gender} • ` : ''}{pet.weight ? `${pet.weight} kg` : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 pt-2.5 border-t border-gray-50">
                  <div className="flex items-center space-x-1 shrink-0">
                    <CheckCircle2 size={12} className="text-[#10B981] fill-[#10B981]" />
                    <span className="text-[10px] font-medium text-[#666666]">Vaccinated</span>
                  </div>
                  <div className="flex items-center space-x-1 min-w-0">
                    <svg className="w-3 h-3 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    <span className="text-[10px] font-medium text-[#666666] truncate">No medical conditions</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* Price Details Card */}
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#FFF9EC] flex items-center justify-center shrink-0 border border-[#F3E8CC]">
                <svg className="w-4 h-4 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              </div>
              <h3 className="text-[16px] font-extrabold text-[#111111]">
                {booking.isExtended ? 'Updated Price Details' : 'Price Details'}
              </h3>
            </div>
            
            <div className="space-y-3 mb-4">
              {(() => {
                const numPets = booking.selectedPets ? booking.selectedPets.length : 1;
                const originalTotal = booking.originalTotalAmount || booking.totalAmount || 0;
                const originalNights = booking.originalNights || booking.nights || 1;
                const baseTotalApprox = (originalTotal / 1.18) - 160;
                const basePricePerNight = Math.max(0, Math.round(baseTotalApprox / (originalNights * numPets)));
                const originalBaseTotal = basePricePerNight * originalNights * numPets;
                
                if (booking.isExtended) {
                  const extendedNights = booking.nights - originalNights;
                  const additionalBaseTotal = basePricePerNight * extendedNights * numPets;
                  const additionalPlatformFee = Math.round(additionalBaseTotal * 0.05);
                  const additionalGst = Math.round((additionalBaseTotal + additionalPlatformFee) * 0.18);
                  
                  const totalPlatformFee = 160 + additionalPlatformFee;
                  const originalGst = Math.round((originalBaseTotal + 160) * 0.18);
                  const totalGst = originalGst + additionalGst;

                  return (
                    <>
                      <div className="flex justify-between items-start">
                        <span className="text-[13px] font-medium text-[#666666]">Base amount ({originalNights} nights × {numPets} pet{numPets > 1 ? 's' : ''})</span>
                        <span className="text-[14px] font-bold text-[#111111]">₹{originalBaseTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-[13px] font-medium text-[#666666]">Additional amount ({extendedNights} nights × {numPets} pet{numPets > 1 ? 's' : ''})</span>
                        <span className="text-[14px] font-bold text-[#111111]">₹{additionalBaseTotal.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[13px] font-medium text-[#666666]">Platform fee</span>
                          <AlertCircle size={12} className="text-[#8A9BAE]" />
                        </div>
                        <span className="text-[14px] font-bold text-[#111111]">₹{totalPlatformFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] font-medium text-[#666666]">GST (18%)</span>
                        <span className="text-[14px] font-bold text-[#111111]">₹{totalGst.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  );
                }

                // Normal Booking (Not Extended)
                const gst = Math.round((originalBaseTotal + 160) * 0.18);
                return (
                  <>
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-[#666666]">
                          ₹{basePricePerNight} × {booking.nights} nights × {numPets} pet{numPets > 1 ? 's' : ''}
                        </span>
                        <span className="text-[11px] font-medium text-[#8A9BAE]">(₹{basePricePerNight} per pet per night)</span>
                      </div>
                      <span className="text-[14px] font-bold text-[#111111]">₹{originalBaseTotal.toLocaleString('en-IN')}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[13px] font-medium text-[#666666]">Platform fee</span>
                        <AlertCircle size={12} className="text-[#8A9BAE]" />
                      </div>
                      <span className="text-[14px] font-bold text-[#111111]">₹160</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-medium text-[#666666]">GST (18%)</span>
                      <span className="text-[14px] font-bold text-[#111111]">₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
          <div className="bg-[#FFF9EC] p-4 sm:p-5 flex justify-between items-center border-t border-[#F3E8CC]/50">
            <span className="text-[16px] font-extrabold text-[#111111]">Total Amount</span>
            <span className="text-[18px] font-extrabold text-[#111111]">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-4 pb-safe-bottom shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto w-full flex flex-row gap-3">
          <button 
            onClick={() => navigate(`/extend-stay/${booking.id}`, { state: { booking } })}
            disabled={isProcessing || booking.status === 'cancelled' || booking.status === 'completed'}
            className="flex-1 h-[54px] bg-[#FDD835] hover:bg-[#FBBF24] text-[#111111] text-[16px] font-extrabold rounded-[16px] flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Calendar size={20} />
            <span>Extend Stay</span>
          </button>
          {isPayLater && (
            <button 
              onClick={() => navigate('/payment', { state: { bookingId: booking.id, amount: booking.totalAmount } })}
              disabled={isProcessing || booking.status === 'cancelled' || booking.status === 'completed'}
              className="flex-1 h-[54px] bg-[#111111] hover:bg-gray-800 text-white text-[16px] font-extrabold rounded-[16px] flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              <CreditCard size={20} />
              <span>Pay Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
