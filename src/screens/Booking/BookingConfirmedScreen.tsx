import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';

export const BookingConfirmedScreen = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#F8F9FA] pb-24 lg:pb-12 pt-8 lg:pt-12 px-5">
        
        <div className="max-w-3xl mx-auto w-full flex flex-col lg:flex-row gap-6">
          
          {/* Main Success Section */}
          <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 flex-1 flex flex-col items-center text-center relative overflow-hidden">
            
            {/* Confetti simulation (using simple colored dots) */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
              <div className="absolute top-[10%] left-[20%] w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="absolute top-[20%] right-[30%] w-2.5 h-2.5 rounded-sm bg-blue-400 rotate-45"></div>
              <div className="absolute top-[30%] left-[10%] w-1.5 h-1.5 rounded-full bg-green-400"></div>
              <div className="absolute top-[15%] right-[15%] w-2 h-2 rounded-full bg-red-400"></div>
              <div className="absolute top-[40%] right-[10%] w-2 h-2 rounded-sm bg-green-500 rotate-12"></div>
              <div className="absolute top-[45%] left-[25%] w-2.5 h-2.5 rounded-full bg-orange-400"></div>
              <div className="absolute top-[5%] left-[50%] text-blue-300">♥</div>
            </div>

            {/* Checkmark Circle */}
            <div className="w-24 h-24 rounded-full bg-[#174F38] flex items-center justify-center mb-6 shadow-[0_8px_16px_rgba(23,79,56,0.2)] relative z-10">
              <Check size={48} className="text-white stroke-[3]" />
            </div>

            <h1 className="text-[24px] font-extrabold text-[#174F38] mb-3 relative z-10">
              Booking Successful!
            </h1>
            <p className="text-[15px] font-medium text-[#465E87] mb-8 relative z-10">
              Your booking has been confirmed with The Happy Tails Home. We're excited to host your pet!
            </p>

            {/* Booking Details Card */}
            <div className="w-full border border-gray-100 rounded-[16px] p-4 bg-gray-50/50 mb-6 flex items-center relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200" 
                alt="Bruno" 
                className="w-16 h-16 rounded-[12px] object-cover mr-4"
              />
              <div className="flex flex-col text-left flex-1">
                <span className="text-[16px] font-extrabold text-[#1B2B48] mb-1">Bruno</span>
                <span className="text-[13px] font-medium text-[#465E87]">12 Sep – 18 Sep • ₹11,100</span>
                <span className="text-[12px] font-bold text-petoo-primary mt-0.5">+ Pickup & Drop</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full py-3.5 text-[15px] font-bold rounded-[12px] text-[#174F38] border-[#174F38]/20 hover:bg-[#174F38]/5 relative z-10"
              onClick={() => navigate('/bookings')}
            >
              View Booking Details
            </Button>
          </div>

          {/* What's Next Section */}
          <div className="flex flex-col gap-6 lg:w-[320px]">
            <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-[18px] font-extrabold text-[#1B2B48] mb-5">What's next?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-[15px] font-extrabold text-[#1B2B48] w-6 shrink-0">1.</span>
                  <span className="text-[14px] font-medium text-[#465E87] leading-snug pt-0.5">
                    Caretaker is preparing for your pet's arrival
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-[15px] font-extrabold text-[#1B2B48] w-6 shrink-0">2.</span>
                  <span className="text-[14px] font-medium text-[#465E87] leading-snug pt-0.5">
                    You'll get a reminder notification 1 day before
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-[15px] font-extrabold text-[#1B2B48] w-6 shrink-0">3.</span>
                  <span className="text-[14px] font-medium text-[#465E87] leading-snug pt-0.5">
                    We'll share the driver tracking link for pickup
                  </span>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => navigate('/home')}
              className="w-full py-4 text-[16px] font-extrabold rounded-[16px] shadow-lg shadow-petoo-primary/20 hidden lg:flex"
            >
              Back to Home
            </Button>
          </div>

          {/* Mobile Back to Home Button */}
          <div className="lg:hidden mt-4">
            <Button 
              onClick={() => navigate('/home')}
              className="w-full py-4 text-[17px] font-extrabold rounded-[16px] shadow-lg shadow-petoo-primary/20"
            >
              Back to Home
            </Button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};
