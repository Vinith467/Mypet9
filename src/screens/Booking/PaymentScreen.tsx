import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Smartphone, CreditCard, Building2, Wallet, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';

export const PaymentScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate gateway delay
    setTimeout(() => {
      navigate('/booking-confirmed');
    }, 1500);
  };

  // We could extract these from location.state if passed, else use defaults
  const bookingAmount = location.state?.bookingAmount || 10800;
  const pickupFee = location.state?.pickupFee || 300;
  const totalAmount = bookingAmount + pickupFee;

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
              <span className="text-[15px] font-medium text-[#465E87]">Booking Amount</span>
              <span className="text-[15px] font-extrabold text-[#1B2B48]">₹{bookingAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[15px] font-medium text-[#465E87]">Pickup & Drop Fee</span>
              <span className="text-[15px] font-extrabold text-[#1B2B48]">₹{pickupFee.toLocaleString('en-IN')}</span>
            </div>
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
                    {/* Hidden radio input for accessibility */}
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="hidden"
                    />
                  </label>
                  {/* Separator line */}
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
