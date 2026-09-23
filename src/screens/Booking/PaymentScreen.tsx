import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Smartphone, CreditCard, Building2, Wallet, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userData } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract all data from navigation state
  const provider = location.state?.provider;
  const bookingData = location.state?.bookingData;
  const bookingAmount = location.state?.bookingAmount || 0;
  const pickupFee = location.state?.pickupFee || 0;
  const pickupAddress = location.state?.pickupAddress || '';
  const nights = location.state?.nights || 1;
  const totalAmount = location.state?.totalAmount || bookingAmount + pickupFee;

  const pet = bookingData?.pet;

  const handlePayment = async () => {
    if (!user?.uid) return;
    setIsProcessing(true);
    
    try {
      // Create booking in Firestore
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        // Pet parent info
        petParentId: user.uid,
        petParentName: userData?.name || user.displayName || 'Pet Parent',
        petParentPhoto: user.photoURL || '',
        petParentEmail: user.email || '',
        
        // Caretaker info
        caretakerId: provider?.id || '',
        caretakerName: provider?.name || 'Caretaker',
        caretakerPhoto: provider?.photo || provider?.images?.[0] || '',
        caretakerLocation: provider?.locationStr || '',
        
        // Pet info
        petId: pet?.id || '',
        petName: pet?.name || 'Pet',
        petBreed: pet?.breed || '',
        petAge: pet?.age || '',
        petImage: pet?.image || '',
        petType: pet?.type || 'dog',
        
        // Booking details
        service: bookingData?.service || 'Home Stay',
        dropoffDate: bookingData?.dropoffDate || '',
        dropoffTime: bookingData?.dropoffTime || '',
        pickupDate: bookingData?.pickupDate || '',
        pickupTime: bookingData?.pickupTime || '',
        nights,
        
        // Pricing
        pricePerNight: provider?.price || 800,
        bookingAmount,
        pickupFee,
        totalAmount,
        
        // Add-ons
        addons: {
          pickupDrop: pickupFee > 0,
          pickupFee,
          pickupAddress,
        },
        
        // Extra
        specialRequirements: bookingData?.specialRequirements || '',
        paymentMethod: selectedMethod,
        
        // Status
        status: 'pending',
        
        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Navigate to confirmed screen with booking data
      navigate('/booking-confirmed', { 
        state: { 
          bookingId: bookingRef.id,
          petName: pet?.name || 'Pet',
          petImage: pet?.image || '',
          caretakerName: provider?.name || 'Caretaker',
          dropoffDate: bookingData?.dropoffDate,
          pickupDate: bookingData?.pickupDate,
          totalAmount,
          pickupDrop: pickupFee > 0,
        } 
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'upi', name: 'UPI', desc: '(Google Pay, PhonePe, etc.)', icon: Smartphone },
    { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
    { id: 'netbanking', name: 'Net Banking', icon: Building2 },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
  ];

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#F8F9FA] pb-24 lg:pb-12">
        {/* Header */}
        <div className="bg-[#F8F9FA] sticky top-0 z-10 px-5 pt-8 pb-4 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors mr-3"
          >
            <ArrowLeft className="text-[#1B2B48]" size={24} />
          </button>
          <h1 className="text-[22px] font-extrabold text-[#1B2B48]">Payment</h1>
        </div>

        <div className="px-5 mt-2 flex-1">
          {/* Amount Summary Box */}
          <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[15px] font-medium text-[#465E87]">Booking Amount ({nights} night{nights > 1 ? 's' : ''})</span>
              <span className="text-[15px] font-extrabold text-[#1B2B48]">₹{bookingAmount.toLocaleString('en-IN')}</span>
            </div>
            {pickupFee > 0 && (
              <div className="flex justify-between items-center mb-4">
                <span className="text-[15px] font-medium text-[#465E87]">Pickup & Drop Fee</span>
                <span className="text-[15px] font-extrabold text-[#1B2B48]">₹{pickupFee.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="border-t border-gray-100 my-4"></div>
            <div className="flex justify-between items-center">
              <span className="text-[16px] font-extrabold text-[#1B2B48]">Total Amount</span>
              <span className="text-[18px] font-extrabold text-[#1B2B48]">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-6 bg-white rounded-[20px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
            <h2 className="text-[16px] font-extrabold text-[#1B2B48] mb-4">Payment Method</h2>
            
            <div className="space-y-0">
              {paymentMethods.map((method, index) => (
                <div key={method.id}>
                  <label className="flex items-center justify-between py-4 cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#465E87] group-hover:text-petoo-primary transition-colors">
                        <method.icon size={22} strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[15px] font-bold text-[#1B2B48]">{method.name}</span>
                          {method.desc && (
                            <span className="text-[13px] font-medium text-[#465E87]">{method.desc}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 ml-4 text-petoo-primary">
                      {selectedMethod === method.id ? (
                        <CheckCircle2 size={24} className="fill-petoo-primary text-white" />
                      ) : (
                        <Circle size={24} className="text-gray-300 stroke-[1.5]" />
                      )}
                    </div>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="hidden"
                    />
                  </label>
                  {index < paymentMethods.length - 1 && (
                    <div className="border-t border-gray-100"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Promo Code Box */}
          <div className="mt-6 bg-white rounded-[16px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex justify-between items-center">
            <span className="text-[14px] font-medium text-petoo-primary">Have a promo code?</span>
            <button className="text-[14px] font-bold text-[#1B2B48] hover:text-petoo-primary transition-colors">
              Apply
            </button>
          </div>

          {/* Bottom Fixed Area */}
          <div className="mt-8 pt-4 pb-8">
            <div className="flex justify-between items-end mb-5 px-1">
              <span className="text-[18px] font-extrabold text-[#1B2B48]">Total</span>
              <span className="text-[24px] font-extrabold text-[#1B2B48] leading-none">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 text-[17px] font-extrabold rounded-[16px] shadow-lg shadow-petoo-primary/20 hover:scale-[1.01] transition-transform flex items-center justify-center disabled:opacity-80"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                'Pay Now'
              )}
            </Button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};
