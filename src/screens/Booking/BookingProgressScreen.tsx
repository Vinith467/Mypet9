import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Phone, MessageSquare, MapPin, Star, Check } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';

export const BookingProgressScreen = () => {
  const navigate = useNavigate();
  // 0: Confirmed, 1: Scheduled, 2: On the Way, 3: Picked Up, 4: At Caretaker, 5: Drop, 6: Completed
  const [currentStep, setCurrentStep] = useState(2); 

  const timelineSteps = [
    {
      id: 0,
      title: 'Booking Confirmed',
      desc: '10 Sep 2025 • 04:30 PM',
    },
    {
      id: 1,
      title: 'Pickup Scheduled',
      desc: '12 Sep 2025 • 09:00 AM',
    },
    {
      id: 2,
      title: 'On the Way',
      desc: 'Our team is on the way to pick up Bruno.',
    },
    {
      id: 3,
      title: 'Picked Up',
      desc: 'Bruno is on the way to The Happy Tails Home.',
      time: '12 Sep 2025 • 09:05 AM',
    },
    {
      id: 4,
      title: "At Caretaker's Home",
      desc: "We'll keep you updated.",
    },
    {
      id: 5,
      title: 'Drop in Progress',
      desc: 'Our team is on the way to drop Bruno.',
    },
    {
      id: 6,
      title: 'Completed',
      desc: '',
    },
  ];

  const renderWidget = () => {
    if (currentStep === 2) {
      return (
        <div className="w-full bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          {/* Map Placeholder */}
          <div className="h-[200px] lg:h-[300px] w-full bg-[#E8F1EC] relative flex items-center justify-center">
            {/* Fake Map Elements */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#174F38 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="bg-[#174F38] text-white p-3 rounded-xl shadow-lg relative z-10 flex items-center">
              <MapPin size={24} className="animate-bounce" />
            </div>
          </div>
          {/* Executive Details */}
          <div className="p-4 lg:p-6 flex items-center justify-between bg-white">
            <div className="flex items-center">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" 
                alt="Executive" 
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div className="flex flex-col">
                <span className="text-[15px] font-extrabold text-[#174F38]">Our team is 5 mins away</span>
                <span className="text-[13px] font-medium text-[#465E87]">Ravi (Pet Care Executive)</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#174F38] hover:bg-gray-50 transition-colors">
                <Phone size={18} />
              </button>
              <button 
                onClick={() => navigate('/chat/1')}
                className="w-10 h-10 rounded-full bg-[#174F38] flex items-center justify-center text-white hover:bg-[#174F38]/90 transition-colors"
              >
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (currentStep === 3 || currentStep === 4) {
      return (
        <div className="w-full bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <img 
            src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800" 
            alt="Dog in car" 
            className="w-full h-[200px] lg:h-[300px] object-cover"
          />
          <div className="p-4 lg:p-6 flex items-center bg-white">
            <img 
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200" 
              alt="Bruno" 
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div className="flex flex-col">
              <span className="text-[15px] font-extrabold text-[#1B2B48]">Bruno has been picked up!</span>
              <span className="text-[13px] font-medium text-[#465E87]">You'll receive updates throughout his stay.</span>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 5) {
      return (
        <div className="w-full bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <div className="h-[200px] lg:h-[300px] w-full bg-[#F0EBE1] relative flex items-center justify-center">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#1B2B48 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="bg-[#174F38] text-white p-3 rounded-xl shadow-lg relative z-10">
              <MapPin size={24} className="animate-bounce" />
            </div>
          </div>
          <div className="p-4 lg:p-6 flex items-center justify-between bg-white">
            <div className="flex items-center">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100" 
                alt="Executive" 
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div className="flex flex-col">
                <span className="text-[15px] font-extrabold text-[#174F38]">Our team is 10 mins away</span>
                <span className="text-[13px] font-medium text-[#465E87]">Neha (Pet Care Executive)</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#174F38] hover:bg-gray-50 transition-colors">
                <Phone size={18} />
              </button>
              <button 
                onClick={() => navigate('/chat/1')}
                className="w-10 h-10 rounded-full bg-[#174F38] flex items-center justify-center text-white hover:bg-[#174F38]/90 transition-colors"
              >
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#F8F9FA] pb-24 lg:pb-12 pt-8 lg:pt-12 px-5">
        
        <div className="max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors mr-3"
            >
              <ArrowLeft className="text-[#1B2B48]" size={24} />
            </button>
            <h1 className="text-[22px] font-extrabold text-[#1B2B48]">Booking Progress</h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {currentStep === 6 ? (
              /* Completed View */
              <div className="w-full max-w-2xl mx-auto">
                <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                  
                  {/* Confetti simulation */}
                  <div className="absolute inset-0 pointer-events-none opacity-60">
                    <div className="absolute top-[10%] left-[20%] w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="absolute top-[20%] right-[30%] w-2.5 h-2.5 rounded-sm bg-blue-400 rotate-45"></div>
                    <div className="absolute top-[30%] left-[10%] w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <div className="absolute top-[15%] right-[15%] w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="absolute top-[40%] right-[10%] w-2 h-2 rounded-sm bg-green-500 rotate-12"></div>
                    <div className="absolute top-[45%] left-[25%] w-2.5 h-2.5 rounded-full bg-orange-400"></div>
                  </div>

                  {/* Checkmark */}
                  <div className="w-20 h-20 rounded-full bg-[#174F38] flex items-center justify-center mb-6 relative z-10 shadow-[0_8px_16px_rgba(23,79,56,0.2)]">
                    <Check size={40} className="text-white stroke-[3]" />
                  </div>

                  <h2 className="text-[22px] font-extrabold text-[#1B2B48] mb-2 relative z-10">
                    Stay Completed!
                  </h2>
                  <p className="text-[14px] font-medium text-[#465E87] mb-8 relative z-10 max-w-[250px]">
                    Bruno had a wonderful stay at The Happy Tails Home.
                  </p>

                  {/* Pet Photos Row */}
                  <div className="flex justify-center gap-3 mb-10 relative z-10">
                    <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150" alt="Bruno" className="w-[60px] h-[60px] rounded-[16px] object-cover border border-gray-100 shadow-sm" />
                    <img src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=150" alt="Bruno playing" className="w-[60px] h-[60px] rounded-[16px] object-cover border border-gray-100 shadow-sm" />
                    <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150" alt="Bruno relaxing" className="w-[60px] h-[60px] rounded-[16px] object-cover border border-gray-100 shadow-sm" />
                  </div>

                  {/* Summary List */}
                  <div className="w-full flex flex-col gap-4 mb-10 relative z-10 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[#1B2B48]">
                        <CheckCircle2 size={20} className="text-[#174F38] fill-[#174F38]/10" />
                        <span className="text-[14px] font-bold">Picked Up</span>
                      </div>
                      <span className="text-[13px] font-medium text-[#465E87]">12 Sep • 09:05 AM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[#1B2B48]">
                        <CheckCircle2 size={20} className="text-[#174F38] fill-[#174F38]/10" />
                        <span className="text-[14px] font-bold">Stayed with Caretaker</span>
                      </div>
                      <span className="text-[13px] font-medium text-[#465E87]">12 Sep - 18 Sep</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[#1B2B48]">
                        <CheckCircle2 size={20} className="text-[#174F38] fill-[#174F38]/10" />
                        <span className="text-[14px] font-bold">Dropped Off</span>
                      </div>
                      <span className="text-[13px] font-medium text-[#465E87]">18 Sep • 06:10 PM</span>
                    </div>
                  </div>

                  {/* Review Section */}
                  <div className="w-full border-t border-gray-100 pt-6 pb-2 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4">
                    <span className="text-[15px] font-bold text-[#1B2B48]">How was the pickup & drop service?</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={24} className="text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110 transition-transform" />
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-6 py-4 text-[16px] font-extrabold rounded-[16px] relative z-10">
                    Submit Review
                  </Button>

                </div>
              </div>
            ) : (
              <>
                {/* Timeline */}
                <div className="flex-1 lg:max-w-[400px]">
                  <div className="relative pl-4">
                    {/* Connecting Line */}
                    <div className="absolute top-[20px] bottom-[20px] left-[27px] w-[2px] bg-gray-200"></div>
                    <div 
                      className="absolute top-[20px] left-[27px] w-[2px] bg-[#174F38] transition-all duration-500"
                      style={{ height: `${(currentStep / (timelineSteps.length - 1)) * 100}%` }}
                    ></div>

                    {timelineSteps.map((step, index) => {
                      const isCompleted = index < currentStep;
                      const isActive = index === currentStep;
                      
                      return (
                        <div key={step.id} className="relative flex items-start mb-8 last:mb-0 group cursor-pointer" onClick={() => setCurrentStep(index)}>
                          <div className="relative z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center mr-4 shrink-0">
                            {isCompleted || isActive ? (
                              <CheckCircle2 size={28} className="fill-[#174F38] text-white" />
                            ) : (
                              <div className="w-[26px] h-[26px] rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
                                <CheckCircle2 size={18} className="text-gray-300 opacity-50" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col pt-1">
                            <span className={`text-[16px] font-extrabold transition-colors ${isCompleted || isActive ? 'text-[#1B2B48]' : 'text-[#465E87]/60'}`}>
                              {step.title}
                            </span>
                            {(isActive || isCompleted) && step.time && (
                              <span className="text-[12px] font-medium text-[#465E87] mt-0.5">{step.time}</span>
                            )}
                            <span className={`text-[13px] mt-1 ${isActive ? 'text-[#465E87] font-medium' : 'text-[#465E87]/60'}`}>
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic Widget */}
                <div className="flex-1 lg:max-w-[500px]">
                  {renderWidget()}
                </div>
              </>
            )}
          </div>

          {/* Demo Controls (Hidden in Prod) */}
          <div className="mt-12 p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-center max-w-2xl mx-auto">
            <p className="text-xs text-yellow-800 mb-2 font-bold uppercase tracking-wider">Demo Controls</p>
            <p className="text-[13px] text-yellow-900 mb-3">
              Click on any step in the timeline, or use the buttons below to advance the progress state.
              Advance to the <strong>Completed</strong> state to see the final screen design.
            </p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} className="px-4 py-2 bg-white border rounded-[8px] text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50">Prev State</button>
              <button onClick={() => setCurrentStep(Math.min(6, currentStep + 1))} className="px-4 py-2 bg-white border rounded-[8px] text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50">Next State</button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};
