import { ArrowLeft, Heart, Share2, Star, MapPin, CheckCircle, Clock, ShieldCheck, HeartPulse } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { useSavedCaretakers } from '../../hooks/useSavedCaretakers';

// Mock caretaker image resembling the user's mockup
const caretakerImage = 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?auto=format&fit=crop&q=80&w=800'; 

// Mock badges
const badges = [
  { icon: ShieldCheck, label: 'Verified Caretaker' },
  { icon: HeartPulse, label: 'Pet First Aid Certified' },
  { icon: CheckCircle, label: 'Home-like Environment' },
  { icon: Clock, label: 'Daily Photo & Video Updates' },
];

export const CaretakerProfileScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;
  const { isSaved, toggleSaved } = useSavedCaretakers();
  const isProviderSaved = provider ? isSaved(provider.id) : false;

  if (!provider) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full p-6">
          <p className="text-gray-500 mb-4 font-medium">Provider details not found.</p>
          <Button onClick={() => navigate(-1)} className="px-6 py-2">Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-full bg-[#F8F9FA] pb-[100px] lg:pb-12 relative overflow-hidden">
        
        {/* MOBILE HEADER (hidden on desktop) */}
        <div className="lg:hidden relative w-full h-[280px]">
          <img src={caretakerImage} alt="Caretaker" className="w-full h-full object-cover" />
          
          {/* Top Actions */}
          <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 pt-safe-top">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-[#1B2B48] shadow-sm hover:bg-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex space-x-3">
              <button 
                onClick={() => toggleSaved(provider)}
                className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-[#1B2B48] shadow-sm hover:bg-white transition-colors"
              >
                <Heart size={20} className={isProviderSaved ? "fill-red-500 text-red-500" : ""} />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-[#1B2B48] shadow-sm hover:bg-white transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* DESKTOP BREADCRUMB (hidden on mobile) */}
        <div className="hidden lg:flex max-w-5xl mx-auto px-6 py-6 items-center space-x-3 sticky top-0 bg-[#F8F9FA]/90 backdrop-blur-md z-30">
           <button 
             onClick={() => navigate(-1)}
             className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#1B2B48] hover:bg-gray-50 shadow-sm transition-colors"
           >
             <ArrowLeft size={20} />
           </button>
           <span className="text-[18px] font-extrabold text-[#1B2B48]">Caretaker Profile</span>
        </div>

        {/* MAIN CONTENT CONTAINER */}
        <div className="bg-white rounded-t-[32px] -mt-8 relative z-20 px-5 pt-8 pb-12 lg:mt-0 lg:rounded-[24px] lg:mx-auto lg:max-w-5xl lg:px-8 lg:py-8 lg:shadow-sm lg:border lg:border-gray-100 lg:min-h-[500px]">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* COLUMN 1: Images & Core Info */}
            <div className="flex flex-col space-y-6">
               
               {/* Desktop specific top image (since mobile header handles it above) */}
               <div className="hidden lg:block w-full h-[280px] rounded-[20px] overflow-hidden relative border border-gray-100 shadow-sm">
                 <img src={caretakerImage} alt="Caretaker" className="w-full h-full object-cover" />
                 <div className="absolute top-4 right-4 flex space-x-3">
                   <button 
                     onClick={() => toggleSaved(provider)}
                     className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1B2B48] hover:bg-white shadow-sm transition"
                   >
                     <Heart size={20} className={isProviderSaved ? "fill-red-500 text-red-500" : ""} />
                   </button>
                   <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1B2B48] hover:bg-white shadow-sm transition">
                     <Share2 size={20} />
                   </button>
                 </div>
               </div>

               {/* Title & Stats */}
               <div>
                 <div className="flex justify-between items-start mb-2">
                   <h1 className="text-[24px] lg:text-[28px] font-extrabold text-[#1B2B48] leading-tight pr-4">
                     {provider.name}
                   </h1>
                 </div>
                 
                 <div className="flex items-center space-x-2 mb-4">
                   <Star size={16} className="fill-amber-500 text-amber-500" />
                   <span className="text-[15px] font-extrabold text-[#1B2B48]">{provider.rating}</span>
                   <span className="text-[15px] font-medium text-[#465E87]">({provider.reviews} reviews)</span>
                 </div>

                 <div className="flex items-center text-[#465E87] space-x-2.5 mb-2.5">
                   <div className="w-[16px] flex justify-center shrink-0">
                     <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                   </div>
                   <span className="text-[15px] font-medium">{provider.services.join(' • ')}</span>
                 </div>

                 <div className="flex items-center text-[#465E87] space-x-2.5">
                   <div className="w-[16px] flex justify-center shrink-0">
                     <MapPin size={16} />
                   </div>
                   <span className="text-[15px] font-medium">
                     {provider.locationStr} <span className="font-bold text-petoo-primary ml-1">• {provider.distance}</span>
                   </span>
                 </div>
               </div>

               {/* 3 Images Gallery */}
               <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
                 {provider.images.map((img: string, idx: number) => (
                   <img key={idx} src={img} alt="" className="w-[90px] h-[90px] lg:w-[110px] lg:h-[110px] rounded-[16px] object-cover shrink-0 border border-gray-100 shadow-sm" />
                 ))}
                 {/* Pad out if less than 3 images */}
                 {provider.images.length < 3 && Array(3 - provider.images.length).fill(0).map((_, idx) => (
                    <div key={`empty-${idx}`} className="w-[90px] h-[90px] lg:w-[110px] lg:h-[110px] rounded-[16px] bg-gray-50 shrink-0 border border-gray-100 shadow-sm" />
                 ))}
               </div>

               {/* Desktop Only Price Block */}
               <div className="hidden lg:flex items-center mt-6 pt-6 border-t border-gray-100">
                  <div className="bg-gray-50 border border-gray-100 rounded-[20px] px-8 py-5 inline-flex items-end shadow-sm">
                    <span className="text-[28px] font-extrabold text-[#1B2B48] leading-none">₹{provider.price}</span>
                    <span className="text-[16px] font-medium text-[#465E87] ml-1 mb-[3px]">/ night</span>
                  </div>
               </div>

            </div>

            {/* COLUMN 2: About & Badges */}
            <div className="flex flex-col space-y-8 mt-2 lg:mt-0">
               
               {/* About Me */}
               <div>
                 <h2 className="text-[18px] lg:text-[20px] font-extrabold text-[#1B2B48] mb-3">About Me</h2>
                 <p className="text-[15px] lg:text-[16px] leading-relaxed text-[#465E87] font-medium">
                   Hi! I'm Priya, a lifelong animal lover with 5+ years of experience in pet care. My home has a large garden and a safe, friendly environment for your pet.
                 </p>
               </div>

               {/* Badges Grid (Mobile) / Vertical List (Desktop) */}
               <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-5">
                 {badges.map((badge, idx) => (
                   <div key={idx} className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 bg-[#174F38]/5 lg:bg-transparent rounded-[16px] p-4 lg:p-0">
                     <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#174F38]/10 flex items-center justify-center shrink-0">
                       <badge.icon size={20} className="text-petoo-primary lg:w-6 lg:h-6" />
                     </div>
                     <span className="text-[13px] lg:text-[15px] font-bold text-[#174F38] leading-tight pr-2 lg:pr-0">
                       {badge.label}
                     </span>
                   </div>
                 ))}
               </div>

               {/* Desktop Book Button */}
               <div className="hidden lg:block mt-auto pt-8">
                 <Button 
                   onClick={() => navigate('/booking-summary', { state: { provider } })}
                   className="w-full py-4 text-[16px] font-bold rounded-[16px] shadow-lg shadow-petoo-primary/20 hover:scale-[1.02] transition-transform"
                 >
                   Book Now
                 </Button>
               </div>

            </div>

          </div>
        </div>

        {/* MOBILE STICKY FOOTER */}
        <div className="lg:hidden fixed bottom-[72px] left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] z-40 flex justify-between items-center pb-safe-bottom">
           <div className="flex flex-col">
             <div className="flex items-end">
               <span className="text-[22px] font-extrabold text-[#1B2B48] leading-none">₹{provider.price}</span>
               <span className="text-[14px] font-medium text-[#465E87] ml-1 mb-0.5">/ night</span>
             </div>
           </div>
           <Button 
             onClick={() => navigate('/booking-summary', { state: { provider } })}
             className="px-8 py-3.5 text-[15px] font-bold rounded-[14px] shadow-lg shadow-petoo-primary/20"
           >
             Book Now
           </Button>
        </div>

      </div>
    </DashboardLayout>
  );
};
