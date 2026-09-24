import { useState } from 'react';
import { ArrowLeft, Heart, Share2, Star, MapPin, Play, Image as ImageIcon, ChevronRight, ShieldCheck, Home, CheckCircle, Clock, PawPrint, Thermometer, Dog, Cat, User, X, Car, Syringe, Scissors } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { useSavedCaretakers } from '../../hooks/useSavedCaretakers';

export const CaretakerProfileScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;
  const bookingData = location.state?.bookingData;
  const { isSaved, toggleSaved } = useSavedCaretakers();
  const isProviderSaved = provider ? isSaved(provider.id) : false;

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!provider) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full p-6 bg-white">
          <p className="text-gray-500 mb-4 font-medium">Provider details not found.</p>
          <Button onClick={() => navigate(-1)} className="px-6 py-2">Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  // Use real photo or first image
  const mainImage = provider.images?.[0] || provider.photo || 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?auto=format&fit=crop&q=80&w=800';
  const allImages = provider.images || [mainImage];
  const hasVideo = provider.videos && provider.videos.length > 0;

  const handleBookNow = () => {
    navigate('/booking-summary', { 
      state: { 
        provider,
        bookingData 
      } 
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-full bg-[#FAFAFA] pb-[100px] lg:pb-12 w-full relative">
        
        {/* DESKTOP BREADCRUMB (hidden on mobile) */}
        <div className="hidden lg:flex max-w-5xl mx-auto px-6 py-6 items-center space-x-3 sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-md z-30">
           <button 
             onClick={() => navigate(-1)}
             className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#1B2B48] hover:bg-gray-50 shadow-sm transition-colors"
           >
             <ArrowLeft size={20} />
           </button>
           <span className="text-[18px] font-extrabold text-[#1B2B48]">Caretaker Profile</span>
        </div>

        <div className="lg:max-w-5xl lg:mx-auto lg:bg-white lg:shadow-sm lg:border lg:border-gray-200 lg:rounded-[24px] lg:p-6">
          
          <div className="lg:grid lg:grid-cols-[1fr,360px] lg:gap-10">
            
            {/* LEFT COLUMN: Main Info */}
            <div className="flex flex-col">
              
              {/* TOP IMAGE HEADER */}
              <div className="relative w-full h-[280px] lg:h-[400px] bg-black lg:rounded-[20px] overflow-hidden">
                {isVideoPlaying && hasVideo ? (
                  <video 
                    src={provider.videos[0]} 
                    autoPlay 
                    controls 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img src={allImages[activeMediaIndex]} alt={provider.name} className="w-full h-full object-cover transition-opacity duration-300" />
                )}
                
                {/* Mobile Top Actions (Hidden on Desktop) */}
                <div className="lg:hidden absolute top-0 w-full p-4 flex justify-between items-center z-10 pt-safe-top">
                  <button 
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1B2B48] shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => toggleSaved(provider)}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1B2B48] shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Heart size={20} className={isProviderSaved ? "fill-red-500 text-red-500" : ""} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1B2B48] shadow-md hover:bg-gray-50 transition-colors">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Desktop Top Actions (Hidden on Mobile) */}
                <div className="hidden lg:flex absolute top-4 right-4 space-x-3 z-10">
                  <button 
                    onClick={() => toggleSaved(provider)}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1B2B48] shadow-sm hover:bg-white transition-colors"
                  >
                    <Heart size={20} className={isProviderSaved ? "fill-red-500 text-red-500" : ""} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1B2B48] shadow-sm hover:bg-white transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>

                {/* Bottom Pills */}
                {!isVideoPlaying && (
                  <div className="absolute bottom-6 lg:bottom-8 left-4 right-4 flex justify-between z-10">
                    {hasVideo ? (
                      <button 
                        onClick={() => setIsVideoPlaying(true)}
                        className="bg-black/80 backdrop-blur-md text-white px-3.5 lg:px-5 py-1.5 lg:py-2.5 rounded-full flex items-center space-x-2 text-[11px] lg:text-[14px] font-bold shadow-sm hover:bg-black transition border border-white/10"
                      >
                        <Play size={12} className="fill-white lg:w-4 lg:h-4" />
                        <span>Watch Video</span>
                      </button>
                    ) : (
                      <div />
                    )}
                    <button className="bg-black/80 backdrop-blur-md text-white px-3.5 lg:px-5 py-1.5 lg:py-2.5 rounded-full flex items-center space-x-2 text-[11px] lg:text-[14px] font-bold shadow-sm border border-white/10">
                      <ImageIcon size={12} className="lg:w-4 lg:h-4" />
                      <span>See Photos ({allImages.length})</span>
                    </button>
                  </div>
                )}
                {isVideoPlaying && (
                  <button 
                    onClick={() => setIsVideoPlaying(false)}
                    className="absolute bottom-6 left-4 bg-black/80 backdrop-blur-md text-white px-3.5 lg:px-5 py-1.5 lg:py-2.5 rounded-full flex items-center space-x-2 text-[11px] lg:text-[14px] font-bold shadow-sm"
                  >
                    <X size={12} />
                    <span>Close Video</span>
                  </button>
                )}
              </div>

              <div className="bg-white rounded-t-[24px] -mt-5 lg:mt-0 relative z-20 pt-6 lg:pt-8">
                {/* THUMBNAILS ROW */}
                <div className="flex gap-2 lg:gap-3 overflow-x-auto scrollbar-hide px-5 lg:px-0 pb-5">
                  {allImages.map((img: string, idx: number) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        setActiveMediaIndex(idx);
                        setIsVideoPlaying(false);
                      }}
                      className={`relative w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] rounded-[10px] lg:rounded-[16px] overflow-hidden shrink-0 cursor-pointer transition-all duration-200 ${idx === activeMediaIndex && !isVideoPlaying ? 'border-[2px] lg:border-[3px] border-[#FBBF24] scale-95 shadow-md' : 'opacity-90 hover:opacity-100 border border-gray-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {idx === Math.min(allImages.length - 1, 4) && allImages.length > 5 && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                          <span className="text-[14px] font-bold">+{allImages.length - 5}</span>
                          <span className="text-[9px] font-medium">More</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="px-5 lg:px-0">
                  {/* TITLE & VERIFIED */}
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h1 className="text-[24px] lg:text-[26px] font-extrabold text-[#1B2B48] leading-tight">
                      {provider.name}
                    </h1>
                    <div className="flex items-center space-x-1 bg-[#E8F5E9] px-2 py-0.5 rounded text-[10px] lg:text-[11px] font-bold text-[#2E7D32]">
                      <CheckCircle size={12} className="lg:w-3.5 lg:h-3.5" />
                      <span>Verified Partner</span>
                    </div>
                  </div>
                  
                  {/* RATING & LOCATION */}
                  <div className="flex items-center space-x-2 mb-5 lg:mb-6">
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="fill-[#FBBF24] text-[#FBBF24] lg:w-4 lg:h-4" />
                      <span className="text-[14px] lg:text-[15px] font-extrabold text-[#1B2B48]">{provider.rating}</span>
                      <span className="text-[13px] lg:text-[14px] font-medium text-blue-600">({provider.reviews} reviews)</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center space-x-1 text-[#465E87]">
                      <MapPin size={13} className="lg:w-3.5 lg:h-3.5" />
                      <span className="text-[13px] lg:text-[14px] font-medium text-blue-600">{provider.distanceStr} away</span>
                    </div>
                  </div>

                  {/* MOBILE PRICE & BOOK NOW ROW (Hidden on Desktop) */}
                  <div className="flex items-center justify-between mb-8 lg:hidden">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-[28px] font-extrabold text-[#1B2B48] leading-none">₹ {provider.price}</span>
                      <span className="text-[14px] font-medium text-[#465E87]">per night</span>
                    </div>
                    <Button 
                      onClick={handleBookNow}
                      className="px-6 py-2.5 text-[15px] font-extrabold rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] shadow-sm flex items-center space-x-1"
                    >
                      <span>Book Now</span>
                      <ChevronRight size={16} />
                    </Button>
                  </div>

                  {/* SERVICE FEATURES (Top Row) */}
                  <div className="flex justify-between items-start mb-6 lg:mb-8 px-2">
                    {[
                      { icon: Car, label: 'Pickup & Drop\nService' },
                      { icon: Syringe, label: 'Vaccination\nAssistance' },
                      { icon: Scissors, label: 'Grooming\nAvailable' },
                      { icon: User, label: provider.experience ? `${provider.experience}+ Yrs\nExperience` : '3+ Yrs\nExperience' }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-11 h-11 lg:w-12 lg:h-12 bg-[#FFF5D1] rounded-full flex items-center justify-center mb-2 shadow-sm border border-[#FBECCB]/50">
                          <feature.icon size={18} className="text-[#8B5A2B] lg:w-5 lg:h-5" />
                        </div>
                        <span className="text-[10px] lg:text-[11px] font-semibold text-[#1B2B48] leading-tight text-center whitespace-pre-line">
                          {feature.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* TRUST & SAFETY GRID (Unified Beige Box) */}
                  <div className="bg-[#FFF9EC] rounded-[16px] p-4 lg:p-6 mb-6 lg:mb-8 border border-[#FBECCB] flex flex-wrap justify-between gap-y-4">
                    {[
                      { icon: ShieldCheck, label: 'Verified\nPartner' },
                      { icon: Home, label: 'Home\nVerified' },
                      { icon: CheckCircle, label: 'Background\nChecked' },
                      { icon: Clock, label: '24/7\nSupervision' },
                      { icon: PawPrint, label: 'Pet Care\nUpdates' },
                    ].map((facility, idx) => (
                      <div key={idx} className="flex flex-col items-center w-1/5 shrink-0 px-1 relative">
                        <div className="w-9 h-9 lg:w-10 lg:h-10 bg-[#FFF5D1] rounded-full flex items-center justify-center mb-1.5 shadow-sm border border-[#FBECCB]/50">
                          <facility.icon size={16} className="text-[#8B5A2B]" />
                        </div>
                        <span className="text-[8px] lg:text-[10px] font-bold text-[#1B2B48]/80 leading-tight text-center whitespace-pre-line">
                          {facility.label}
                        </span>
                        {/* Divider for all except last */}
                        {idx !== 4 && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[50%] w-px bg-[#E6D5B8]/40" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* MOBILE ABOUT THIS STAY (Hidden on Desktop) */}
                  <div className="mb-6 border-b border-gray-100 pb-6 lg:hidden">
                    <h2 className="text-[18px] font-extrabold text-[#1B2B48] mb-2">About this stay</h2>
                    <p className="text-[14px] leading-relaxed text-[#465E87] font-medium">
                      {provider.bio || `A loving home away from home! Your pet will enjoy spacious indoor and outdoor spaces, daily walks, playtime and lots of cuddles.`}
                    </p>
                    <button className="text-[#FBBF24] text-[14px] font-extrabold mt-1 flex items-center hover:opacity-80">
                      Read more <ChevronRight size={14} className="ml-0.5 rotate-90" />
                    </button>
                  </div>

                  {/* WHAT YOUR PET WILL ENJOY */}
                  <div className="mb-6 lg:mb-8 border-b border-gray-100 pb-6 lg:pb-8">
                    <h2 className="text-[18px] lg:text-[20px] font-extrabold text-[#1B2B48] mb-4 lg:mb-5">What your pet will enjoy</h2>
                    <div className="grid grid-cols-4 lg:grid-cols-6 gap-y-5 lg:gap-y-6 gap-x-2 lg:gap-x-4">
                      {[
                        { icon: Home, label: 'Indoor\nSpace' },
                        { icon: PawPrint, label: 'Outdoor\nPlay Area' },
                        { icon: ShieldCheck, label: 'Meals\nIncluded' },
                        { icon: Clock, label: 'Daily\nWalks' },
                        { icon: ImageIcon, label: 'Photo\nUpdates' },
                        { icon: Thermometer, label: 'Medication\nSupport' },
                        { icon: Home, label: 'AC\nRoom' },
                      ].map((facility, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="w-11 h-11 lg:w-12 lg:h-12 bg-[#FFF2D1] rounded-full flex items-center justify-center mb-1.5 lg:mb-2 shadow-sm hover:scale-110 transition-transform">
                            <facility.icon size={18} className="text-[#8B5A2B] lg:w-5 lg:h-5" />
                          </div>
                          <span className="text-[10px] lg:text-[11px] font-semibold text-[#1B2B48]/80 leading-tight text-center whitespace-pre-line">
                            {facility.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SUITABLE FOR */}
                  <div className="mb-6 lg:mb-8 border-b border-gray-100 pb-6 lg:pb-8">
                    <h2 className="text-[18px] lg:text-[20px] font-extrabold text-[#1B2B48] mb-4 lg:mb-5">Suitable for</h2>
                    <div className="flex overflow-x-auto scrollbar-hide space-x-4">
                      {[
                        { img: '/src/assets/images/small_dog.jpg', label: 'Small Dogs' },
                        { img: '/src/assets/images/medium_dog.jpg', label: 'Medium Dogs' },
                        { img: '/src/assets/images/large_dog.jpg', label: 'Large Dogs' },
                        { img: '/src/assets/images/cat.jpg', label: 'Cats' },
                        { img: '/src/assets/images/multiple_pets.jpg', label: 'Multiple Pets' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center shrink-0">
                          <div className="w-14 h-14 bg-[#FFF9EC] rounded-full flex items-center justify-center mb-2 overflow-hidden border border-[#FBECCB]/50 shadow-sm">
                            {item.img ? (
                              <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                            ) : (
                              item.icon && <item.icon size={26} className="text-[#C95C25]" strokeWidth={1.5} />
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-[#465E87] leading-tight text-center">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* YOUR HOST */}
                  <div className="mb-4 lg:mb-0">
                    <h2 className="text-[18px] lg:text-[20px] font-extrabold text-[#1B2B48] mb-3 lg:mb-4">Your Host</h2>
                    <div className="flex items-center justify-between bg-white rounded-xl py-2 lg:p-4 lg:border lg:border-gray-100 lg:shadow-sm">
                      <div className="flex items-center space-x-3 lg:space-x-4">
                        <img src={mainImage} alt={provider.name} className="w-14 h-14 lg:w-14 lg:h-14 rounded-full object-cover border border-gray-100" />
                        <div>
                          <div className="flex items-center space-x-2 mb-0.5 lg:mb-1">
                            <h3 className="text-[15px] lg:text-[16px] font-extrabold text-[#1B2B48]">{provider.name}</h3>
                            <div className="flex items-center space-x-0.5">
                              <Star size={12} className="fill-[#FBBF24] text-[#FBBF24]" />
                              <span className="text-[12px] lg:text-[13px] font-extrabold text-[#1B2B48]">{provider.rating}</span>
                              <span className="text-[10px] lg:text-[12px] font-medium text-[#465E87]">({provider.reviews} reviews)</span>
                            </div>
                          </div>
                          <p className="text-[12px] lg:text-[13px] font-medium text-[#465E87]">Pet lover for {provider.experience || '5+'}+ years</p>
                          <p className="text-[11px] lg:text-[12px] font-medium text-blue-600 mt-0.5">Usually responds within 10 minutes</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-400 lg:w-5 lg:h-5" />
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Desktop Sticky Sidebar (Hidden on Mobile) */}
            <div className="hidden lg:block relative">
              <div className="sticky top-28 flex flex-col space-y-5">
                
                {/* Desktop About Me Card */}
                <div className="bg-white border border-gray-200 rounded-[16px] p-5 shadow-sm">
                  <h2 className="text-[16px] font-extrabold text-[#1B2B48] mb-2">About this stay</h2>
                  <p className="text-[13px] leading-relaxed text-[#465E87] font-medium">
                    {provider.bio || `A loving home away from home! Your pet will enjoy spacious indoor and outdoor spaces, daily walks, playtime and lots of cuddles.`}
                  </p>
                  <button className="text-[#FBBF24] text-[13px] font-extrabold mt-1.5 flex items-center hover:opacity-80">
                    Read more <ChevronRight size={14} className="ml-0.5 rotate-90" />
                  </button>
                </div>

                {/* Desktop Booking Card */}
                <div className="bg-white border border-gray-200 rounded-[16px] p-5 shadow-xl shadow-gray-200/50">
                  <div className="flex items-baseline space-x-1 mb-5 border-b border-gray-100 pb-5">
                    <span className="text-[32px] font-extrabold text-[#1B2B48] leading-none">₹{provider.price}</span>
                    <span className="text-[14px] font-medium text-[#465E87]">per night</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-[#465E87]">
                      <CheckCircle size={16} className="text-[#2E7D32] mr-2" />
                      <span className="font-medium text-[13px]">Free cancellation for 48 hours</span>
                    </div>
                    <div className="flex items-center text-[#465E87]">
                      <ShieldCheck size={16} className="text-[#2E7D32] mr-2" />
                      <span className="font-medium text-[13px]">Premium Pet Protection included</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleBookNow}
                    className="w-full py-3 text-[15px] font-extrabold rounded-[12px] shadow-lg shadow-petoo-primary/20 hover:scale-[1.02] transition-transform flex justify-center items-center space-x-2"
                  >
                    <span>Book Now</span>
                    <ChevronRight size={18} />
                  </Button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
