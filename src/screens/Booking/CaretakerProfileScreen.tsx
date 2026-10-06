import { useState } from 'react';
import { ArrowLeft, Heart, Share2, Star, MapPin, Play, Image as ImageIcon, ChevronRight, ChevronDown, ShieldCheck, Home, CheckCircle, Clock, PawPrint, Thermometer, Dog, Cat, User, X, Car, Syringe, Scissors, Search, MessageCircle, Phone } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { useSavedCaretakers } from '../../hooks/useSavedCaretakers';

import smallDogImg from '../../assets/images/small_dog.jpg';
import mediumDogImg from '../../assets/images/medium_dog.jpg';
import largeDogImg from '../../assets/images/large_dog.jpg';
import catImg from '../../assets/images/cat.jpg';
import multiplePetsImg from '../../assets/images/multiple_pets.jpg';

export const CaretakerProfileScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;
  const bookingData = location.state?.bookingData;
  const { isSaved, toggleSaved } = useSavedCaretakers();
  const isProviderSaved = provider ? isSaved(provider.id) : false;

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

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
    navigate('/select-pet', { 
      state: { 
        provider,
        bookingData,
        selectedPets: location.state?.selectedPets
      } 
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-full bg-[#FAFAFA] pb-[100px] lg:pb-0 w-full relative">
        
        <div className="lg:max-w-7xl lg:mx-auto lg:bg-white lg:shadow-sm lg:border lg:border-gray-200 lg:rounded-[24px] lg:p-6 lg:mb-0 lg:min-h-full">
          
          <div className="lg:grid lg:grid-cols-[320px,1fr,300px] xl:grid-cols-[360px,1fr,320px] lg:gap-6 xl:gap-8">
            
            {/* COLUMN 1: Images */}
            <div className="flex flex-col">
              
              {/* TOP IMAGE HEADER */}
              <div className="relative w-full h-[280px] lg:h-[300px] xl:h-[320px] bg-black lg:rounded-[20px] overflow-hidden">
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
                
                {/* Image Top Actions (Visible on Mobile & Desktop) */}
                <div className="fixed lg:absolute top-[60px] lg:top-0 left-0 right-0 p-4 flex justify-between items-center z-40 pointer-events-none">
                  <button 
                    onClick={() => navigate(-1)}
                    className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1B2B48] shadow-sm hover:bg-white transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="flex space-x-3 pointer-events-auto">
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
                </div>

                {/* Bottom Pills */}
                {!isVideoPlaying && (
                  <div className="absolute bottom-6 lg:bottom-4 left-4 flex space-x-2 z-10">
                    {hasVideo ? (
                      <button 
                        onClick={() => setIsVideoPlaying(true)}
                        className="bg-black/80 backdrop-blur-md text-white px-3.5 lg:px-4 py-1.5 lg:py-2 rounded-full flex items-center space-x-2 text-[11px] lg:text-[13px] font-bold shadow-sm hover:bg-black transition border border-white/10"
                      >
                        <Play size={12} className="fill-white" />
                        <span>Watch Video</span>
                      </button>
                    ) : null}
                    <button className="bg-black/80 backdrop-blur-md text-white px-3.5 lg:px-4 py-1.5 lg:py-2 rounded-full flex items-center space-x-2 text-[11px] lg:text-[13px] font-bold shadow-sm border border-white/10">
                      <ImageIcon size={12} />
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

              <div className="relative z-20 mt-2 lg:mt-0 pt-1">
                {/* THUMBNAILS ROW */}
                <div className="flex items-center gap-2 lg:gap-3 px-5 lg:px-0 lg:pb-0 pb-3">
                  <div className="flex gap-2 lg:gap-3 overflow-x-auto scrollbar-hide justify-start w-full">
                    {allImages.slice(thumbnailStartIndex, thumbnailStartIndex + 4).map((img: string, i: number) => {
                      const actualIdx = thumbnailStartIndex + i;
                      const isLastVisible = i === 3;
                      const remainingCount = allImages.length - (thumbnailStartIndex + 4);

                      return (
                        <div 
                          key={actualIdx} 
                          onClick={() => {
                            if (isLastVisible && remainingCount > 0) {
                              setThumbnailStartIndex(Math.min(allImages.length - 4, thumbnailStartIndex + 1));
                            } else if (actualIdx === thumbnailStartIndex && thumbnailStartIndex > 0) {
                              setThumbnailStartIndex(Math.max(0, thumbnailStartIndex - 1));
                              setActiveMediaIndex(actualIdx);
                              setIsVideoPlaying(false);
                            } else {
                              setActiveMediaIndex(actualIdx);
                              setIsVideoPlaying(false);
                            }
                          }}
                          className={`relative w-[65px] h-[65px] lg:w-[75px] lg:h-[75px] rounded-[10px] lg:rounded-[12px] overflow-hidden shrink-0 cursor-pointer transition-all duration-200 ${actualIdx === activeMediaIndex && !isVideoPlaying ? 'border-[2px] lg:border-[2.5px] border-[#007672] shadow-sm' : 'opacity-90 hover:opacity-100 border border-transparent'}`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          {isLastVisible && remainingCount > 0 && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                              <span className="text-[14px] lg:text-[18px] font-bold">+{remainingCount}</span>
                              <span className="text-[9px] lg:text-[11px] font-medium">More</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Profile Details */}
            <div className="flex flex-col px-5 lg:px-0 lg:pt-2">
              <div className="flex flex-col h-full">
                <div>
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
                  <div className="flex items-center space-x-1.5 mb-4 lg:mb-4">
                    <Star size={14} className="fill-[#007672] text-[#007672] lg:w-4 lg:h-4" />
                    <span className="text-[14px] lg:text-[15px] font-extrabold text-[#1B2B48]">{provider.rating}</span>
                    <span className="text-[13px] lg:text-[14px] font-medium text-[#465E87]">({provider.reviews} reviews)</span>
                    <span className="text-[#465E87]/60 font-medium px-0.5">•</span>
                    <MapPin size={13} className="text-[#465E87] lg:w-3.5 lg:h-3.5" />
                    <span className="text-[13px] lg:text-[14px] font-medium text-[#465E87] truncate">
                      {provider.distanceStr} • {provider.locationStr.split(',')[0]}
                    </span>
                  </div>

                  {/* MOBILE PRICE & BOOK NOW ROW (Hidden on Desktop) */}
                  <div className="flex items-center justify-between mb-8 lg:hidden bg-[#F8F9FA] rounded-[14px] p-1.5 pl-4 shadow-sm border border-gray-50">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-[24px] font-extrabold text-[#1B2B48] leading-none">₹{provider.price}</span>
                      <span className="text-[13px] font-semibold text-[#465E87]">per night</span>
                    </div>
                    <Button 
                      onClick={handleBookNow}
                      className="px-6 py-3 text-[14px] font-extrabold rounded-[12px] bg-[#007672] hover:bg-[#00605c] text-white flex items-center space-x-1"
                    >
                      <span className="pr-1">Continue</span>
                      <ChevronRight size={16} strokeWidth={2.5} />
                    </Button>
                  </div>

                  {/* SERVICE FEATURES (Top Row) */}
                  <div className="flex justify-between items-stretch mb-3 lg:gap-2">
                    {[
                      { icon: Car, label: 'Pickup & Drop\nService', id: 'Pickup & Drop Service' },
                      { icon: Syringe, label: 'Vaccination\nAssistance', id: 'Vaccination Assistance' },
                      { icon: Scissors, label: 'Grooming\nAvailable', id: 'Grooming Available' },
                      { icon: User, label: provider.experience ? `${provider.experience}+ Yrs\nExperience` : '3+ Yrs\nExperience', id: 'Experience' }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex flex-col items-center lg:justify-center lg:bg-[#E6F4F1] lg:rounded-[12px] lg:p-2.5 lg:flex-1 lg:mx-0 mx-1">
                        <div className="w-9 h-9 lg:w-auto lg:h-auto lg:bg-transparent bg-[#F4F9F9] rounded-full flex items-center justify-center mb-1 lg:mb-1.5">
                          <feature.icon size={18} className="text-[#007672] lg:w-4 lg:h-4" strokeWidth={1.5} />
                        </div>
                        <span className="text-[9px] lg:text-[10px] font-bold text-[#465E87] lg:text-[#007672] leading-tight text-center whitespace-pre-line">
                          {feature.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* TRUST & SAFETY GRID (Clean White background) */}
                  <div className="rounded-[12px] p-2.5 lg:p-3 mb-4 border border-gray-100 flex flex-nowrap justify-between shadow-sm">
                    {[
                      { icon: ShieldCheck, label: 'Verified\nPartner', id: 'Verified Partner' },
                      { icon: Home, label: 'Home\nVerified', id: 'Home Verified' },
                      { icon: CheckCircle, label: 'Background\nChecked', id: 'Background Checked' },
                      { icon: Clock, label: '24/7\nSupervision', id: '24/7 Supervision' },
                      { icon: PawPrint, label: 'Pet Care\nUpdates', id: 'Pet Care Updates' },
                    ].map((facility, idx, arr) => (
                      <div key={idx} className="flex flex-col items-center shrink-0 px-0.5 flex-1 relative">
                        <div className="w-8 h-8 lg:w-8 lg:h-8 bg-[#F4F9F9] rounded-full flex items-center justify-center mb-1">
                          <facility.icon size={14} className="text-[#007672]" strokeWidth={2} />
                        </div>
                        <span className="text-[7.5px] lg:text-[9px] font-semibold text-[#465E87] leading-tight text-center whitespace-pre-line">
                          {facility.label}
                        </span>
                        {/* Divider for all except last */}
                        {idx !== arr.length - 1 && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[60%] w-[1px] bg-gray-100" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* MOBILE ABOUT THIS STAY (Hidden on Desktop) */}
                  <div className="mb-6 border-b border-gray-100 pb-6 lg:hidden">
                    <h2 className="text-[18px] font-extrabold text-[#1B2B48] mb-2">About this stay</h2>
                    <p className="text-[13px] leading-relaxed text-[#465E87] font-medium pr-2">
                      {provider.bio || `A loving home away from home! Your pet will enjoy spacious indoor and outdoor spaces, daily walks, playtime and lots of cuddles.`}
                    </p>
                    <button className="text-[#007672] text-[13px] font-extrabold mt-1.5 flex items-center hover:opacity-80">
                      Read more <ChevronDown size={14} className="ml-0.5" strokeWidth={3} />
                    </button>
                  </div>

                  {/* WHAT YOUR PET WILL ENJOY */}
                  <div className="mb-3 border-b border-gray-100 pb-3">
                    <h2 className="text-[14px] lg:text-[15px] font-extrabold text-[#1B2B48] mb-2">What your pet will enjoy</h2>
                    <div className="flex justify-between items-start w-full flex-nowrap overflow-x-hidden">
                      {[
                        { icon: Home, label: 'Indoor\nSpace' },
                        { icon: MapPin, label: 'Outdoor\nPlay Area' }, 
                        { icon: Search, label: 'Meals\nIncluded' },
                        { icon: PawPrint, label: 'Daily\nWalks' },
                        { icon: ImageIcon, label: 'Photo\nUpdates' },
                        { icon: Syringe, label: 'Medication\nSupport' },
                        { icon: Star, label: 'AC\nRoom' },
                      ].map((facility, idx) => (
                        <div key={idx} className="flex flex-col items-center flex-1 px-0.5">
                          <div className="w-8 h-8 lg:w-9 lg:h-9 bg-[#F4F9F9] lg:bg-[#E6F4F1] rounded-full flex items-center justify-center mb-1 hover:scale-105 transition-transform shrink-0">
                            <facility.icon size={14} className="text-[#007672] lg:w-4 lg:h-4" strokeWidth={2} />
                          </div>
                          <span className="text-[7px] lg:text-[8px] font-semibold text-[#465E87] leading-tight text-center whitespace-pre-line">
                            {facility.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SUITABLE FOR */}
                  <div className="mb-2">
                    <h2 className="text-[14px] lg:text-[15px] font-extrabold text-[#1B2B48] mb-2">Suitable for</h2>
                    <div className="flex overflow-x-hidden justify-between w-full">
                      {[
                        { img: smallDogImg, label: 'Small Dogs' },
                        { img: mediumDogImg, label: 'Medium Dogs' },
                        { img: largeDogImg, label: 'Large Dogs' },
                        { img: catImg, label: 'Cats' },
                        { img: multiplePetsImg, label: 'Multiple Pets' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center flex-1 px-1">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#FFF9EC] rounded-full flex items-center justify-center mb-1 overflow-hidden border border-[#FBECCB]/50 shadow-sm">
                            <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[9.5px] lg:text-[10px] font-semibold text-[#465E87] leading-tight text-center">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MOBILE CONTACT MYPET9 (Hidden on Desktop) */}
                  <div className="mb-2 lg:hidden">
                    <div className="bg-white border border-gray-100 rounded-[16px] p-5 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FFF5D1] to-transparent rounded-bl-full -z-0 opacity-80 pointer-events-none"></div>
                      <PawPrint size={28} className="absolute top-3 right-3 text-[#FBECCB] rotate-12 -z-0 pointer-events-none" fill="currentColor" />
                      
                      <h2 className="text-[16px] font-extrabold text-[#1B2B48] mb-4 relative z-10">Contact MyPet9</h2>
                      
                      <div className="relative z-10 flex flex-col space-y-4">
                        {/* Call us */}
                        <div className="flex items-start space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#FFCA28] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                            <Phone size={14} className="text-white" fill="currentColor" />
                          </div>
                          <div>
                            <h3 className="text-[13px] font-extrabold text-[#1B2B48] mb-0.5">Call us:</h3>
                            <div className="text-[11.5px] font-bold text-[#465E87] leading-[1.6]">
                              <p>+91 72920 80750 | +91 62351 92242</p>
                              <p>| +91 91104 21467 | +91 81973 83426</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full h-[1px] bg-gray-100"></div>
                        
                        {/* WhatsApp */}
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-sm">
                            <MessageCircle size={16} className="text-white" fill="currentColor" />
                          </div>
                          <div>
                            <h3 className="text-[13px] font-extrabold text-[#1B2B48] mb-0.5">WhatsApp:</h3>
                            <p className="text-[11.5px] font-bold text-[#465E87]">+91 72920 45219</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Desktop Sticky Sidebar (Hidden on Mobile) */}
            <div className="hidden lg:block relative">
              <div className="sticky top-24 flex flex-col space-y-3">
                
                {/* Desktop About Me Card */}
                <div className="bg-white border border-gray-200 rounded-[16px] p-4 shadow-sm relative overflow-hidden">
                  <PawPrint size={60} className="absolute -top-4 -right-4 text-[#E6F4F1] opacity-70 rotate-12 pointer-events-none" fill="currentColor" />
                  <div className="relative z-10">
                    <h2 className="text-[14px] font-extrabold text-[#1B2B48] mb-1.5">About this stay</h2>
                    <p className="text-[11px] leading-[1.6] text-[#465E87] font-medium pr-2">
                      {provider.bio || `A loving home away from home! Your pet will enjoy spacious indoor and outdoor spaces, daily walks, playtime and lots of cuddles.`}
                    </p>
                    <button className="text-[#007672] text-[11px] font-extrabold mt-1 flex items-center hover:opacity-80">
                      Read more <ChevronDown size={12} className="ml-0.5" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Desktop Booking Card */}
                <div className="bg-white border border-gray-200 rounded-[16px] p-4 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#FFF5D1] to-transparent rounded-bl-full -z-0 opacity-80 pointer-events-none"></div>
                  <PawPrint size={32} className="absolute top-3 right-3 text-[#FBECCB] rotate-12 -z-0 pointer-events-none" fill="currentColor" />
                  
                  <div className="relative z-10">
                    <div className="flex items-baseline space-x-1 mb-4 border-b border-gray-100 pb-4">
                      <span className="text-[28px] font-extrabold text-[#1B2B48] leading-none">₹{provider.price}</span>
                      <span className="text-[13px] font-medium text-[#465E87]">per night</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-[#465E87]">
                        <CheckCircle size={14} className="text-[#2E7D32] mr-2" />
                        <span className="font-medium text-[12px]">Free cancellation for 48 hours</span>
                      </div>
                      <div className="flex items-center text-[#465E87]">
                        <ShieldCheck size={14} className="text-[#2E7D32] mr-2" />
                        <span className="font-medium text-[12px]">Premium Pet Protection included</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleBookNow}
                      className="w-full py-3 text-[14px] font-extrabold rounded-[12px] bg-[#007672] hover:bg-[#00605c] shadow-lg shadow-[#007672]/20 hover:scale-[1.02] transition-all flex justify-center items-center space-x-2"
                    >
                      <span>Continue</span>
                      <ArrowLeft size={16} className="rotate-180" />
                    </Button>
                  </div>
                </div>

                {/* Desktop Contact MyPet9 Card */}
                <div className="bg-white border border-gray-200 rounded-[16px] p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FFF5D1] to-transparent rounded-bl-full -z-0 opacity-80 pointer-events-none"></div>
                  <PawPrint size={28} className="absolute top-3 right-3 text-[#FBECCB] rotate-12 -z-0 pointer-events-none" fill="currentColor" />
                  
                  <h2 className="text-[14px] font-extrabold text-[#1B2B48] mb-3 relative z-10">Contact MyPet9</h2>
                  
                  <div className="relative z-10 flex flex-col space-y-3">
                    {/* Call us */}
                    <div className="flex items-start space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FFCA28] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <Phone size={14} className="text-white" fill="currentColor" />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-extrabold text-[#1B2B48] mb-0.5">Call us:</h3>
                        <div className="text-[11.5px] font-bold text-[#465E87] leading-[1.6]">
                          <p>+91 72920 80750 | +91 62351 92242</p>
                          <p>| +91 91104 21467 | +91 81973 83426</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full h-[1px] bg-gray-100"></div>
                    
                    {/* WhatsApp */}
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-sm">
                        <MessageCircle size={16} className="text-white" fill="currentColor" />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-extrabold text-[#1B2B48] mb-0.5">WhatsApp:</h3>
                        <p className="text-[11.5px] font-bold text-[#465E87]">+91 72920 45219</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
