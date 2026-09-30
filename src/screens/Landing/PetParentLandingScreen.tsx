import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, PawPrint, Plus, Minus, ChevronDown, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { TopNavbar } from '../../components/layout/TopNavbar';
import { OfflineBookingSection } from '../../components/landing/OfflineBookingSection';
import { Navigation } from '../../components/layout/Navigation';

const InlinePetCounter = ({ label, count, onIncrement, onDecrement, iconUrl }: { label: string, count: number, onIncrement: () => void, onDecrement: () => void, iconUrl?: string }) => (
  <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
    {iconUrl && <img src={iconUrl} alt={label} className="w-4 h-4 md:w-7 md:h-7 object-cover rounded-full shadow-sm" />}
    <span className="font-bold text-gray-900 text-[11px] md:text-[14px]">{label}</span>
    <div className="flex items-center bg-white flex-shrink-0">
      <button 
        onClick={onDecrement} 
        disabled={count === 0} 
        className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[#007672] disabled:opacity-40 hover:bg-gray-100 transition-colors rounded"
      >
        <Minus className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={3} />
      </button>
      <span className="w-4 md:w-5 text-center font-extrabold text-gray-900 text-[11px] md:text-[13px]">{count}</span>
      <button 
        onClick={onIncrement} 
        className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[#007672] hover:bg-gray-100 transition-colors rounded"
      >
        <Plus className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={3} />
      </button>
    </div>
  </div>
);

export const PetParentLandingScreen = () => {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  
  // Search State
  const [location, setLocation] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  
  // Pet Counters
  const [pets, setPets] = useState({
    dog: 1,
    cat: 0,
    bird: 0,
    other: 0
  });

  const totalPets = pets.dog + pets.cat + pets.bird + pets.other;

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [selectedFromSuggestion, setSelectedFromSuggestion] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const fetchSuggestions = async () => {
      if (selectedFromSuggestion) {
        setSelectedFromSuggestion(false);
        return;
      }
      if (!location || location.length < 3 || location === 'Locating...') {
        setSuggestions([]);
        return;
      }
      setIsSearchingLocation(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=5&addressdetails=1`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsSearchingLocation(false);
      }
    };
    timeoutId = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeoutId);
  }, [location, selectedFromSuggestion]);

  const handleSearch = () => {
    if (totalPets === 0) {
      alert("Please select at least one pet.");
      return;
    }
    if (!location) {
      alert("Please enter a location.");
      return;
    }

    const searchData = {
      location,
      dropoffDate,
      pickupDate,
      pets,
      otherPetName: ''
    };

    if (!user) {
      navigate('/auth', { 
        state: { 
          returnTo: '/search-boarding',
          searchState: searchData
        } 
      });
      return;
    }

    navigate('/search-boarding', {
      state: { ...searchData, isNewSearch: true }
    });
  };

  const updatePetCount = (type: keyof typeof pets, increment: boolean) => {
    setPets(prev => {
      const current = prev[type];
      const next = increment ? current + 1 : current - 1;
      if (next < 0) return prev;
      return { ...prev, [type]: next };
    });
  };

  const getCurrentLocation = async () => {
    try {
      setLocation('Locating...');
      
      let latitude: number;
      let longitude: number;

      if (Capacitor.isNativePlatform()) {
        const permissions = await Geolocation.checkPermissions();
        if (permissions.location !== 'granted') {
          const requested = await Geolocation.requestPermissions();
          if (requested.location !== 'granted') {
            setLocation('');
            return;
          }
        }
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } else {
        // Web fallback
        const pos: any = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser.'));
          } else {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0
            });
          }
        });
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      }
      
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
      const data = await response.json();
      
      if (data && data.address) {
        const area = data.address.neighbourhood || data.address.suburb || data.address.village || data.address.city_district || data.address.residential || data.address.road || '';
        const district = data.address.city || data.address.town || data.address.state_district || data.address.county || '';
        
        if (area && district && area !== district) {
          setLocation(`${area}, ${district}`);
        } else if (district || area) {
          setLocation(district || area);
        } else {
          setLocation(data.display_name.split(',').slice(0, 2).join(', '));
        }
      } else {
        setLocation('Location found');
      }
    } catch (error) {
      console.error("Error getting location", error);
      setLocation('');
    }
  };

  return (
    <div className={`min-h-screen bg-white flex flex-col font-sans overflow-x-hidden relative ${user ? 'pb-20 md:pb-0' : ''}`}>
      
      {/* Shared Top Navbar */}
      <TopNavbar currentLocationStr={location} />

      {/* Main Hero & Search Section */}
      <main className="w-full relative pt-2 md:pt-2">
        
        {/* Background Decorative Blob for Mobile */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 h-[60vh] bg-[#E0F4F2]/80 rounded-t-[120px] -z-10 skew-y-3 translate-y-20" />

        <div className="w-full px-2 md:px-12 flex flex-col md:flex-row items-stretch justify-between relative z-10 gap-0 md:gap-6 lg:gap-8">
          
          {/* Desktop Text (Hidden on mobile) */}
          <div className="hidden md:flex flex-col justify-center w-full md:w-[22%] lg:w-[22%] xl:w-[20%] z-10 shrink-0">
             <h1 className="text-[42px] lg:text-[54px] leading-[1.0] font-extrabold text-[#1c1c1c] mb-4">
               A second<br/>home for<br/>your pet.
             </h1>
             <p className="text-gray-700 font-medium text-[17px] leading-snug max-w-[200px]">
               Trusted homestays.<br/>Comfortable homes.<br/>Happier pets.
             </p>
          </div>
          
          {/* Search Card Container */}
          <div className="w-full md:w-[50%] lg:w-[50%] xl:w-[48%] z-20 order-first md:order-none relative shrink-0 flex items-center">
            <div className="bg-white rounded-[24px] p-4 md:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#007672]/10 w-full">
              
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="text-[#007672]" size={18} strokeWidth={2.5} />
                <h2 className="font-extrabold text-gray-900 text-[15px]">Where's your pet staying?</h2>
              </div>
              
              {/* Location Input */}
              <div className="relative mb-3 z-30">
                <div className="relative border border-gray-200 rounded-xl p-2 md:p-2.5 flex items-center bg-white shadow-sm">
                  <Search className="text-[#007672] w-4 h-4 mr-2 shrink-0" strokeWidth={2.5} />
                  <input 
                    type="text" 
                    placeholder="Select area" 
                    className="w-full outline-none text-[14px] font-bold text-gray-900 placeholder:text-gray-400 bg-transparent pr-28" 
                    value={location} 
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  <button 
                    onClick={getCurrentLocation} 
                    className="absolute right-1.5 px-2.5 py-1.5 bg-gray-50 rounded-lg text-[10px] md:text-[11px] font-bold text-[#007672] hover:bg-[#E0F4F2] hover:text-[#00605c] transition-colors whitespace-nowrap border border-[#007672]/20"
                  >
                    Use Current Location
                  </button>
                </div>
                
                {/* Autocomplete Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                    {suggestions.map((sug, idx) => (
                      <div 
                        key={idx}
                        className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 cursor-pointer flex items-start gap-3"
                        onClick={() => {
                          const area = sug.address?.neighbourhood || sug.address?.suburb || sug.address?.village || sug.address?.city_district || sug.address?.residential || sug.address?.road || '';
                          const district = sug.address?.city || sug.address?.town || sug.address?.state_district || sug.address?.county || '';
                          const finalLoc = (area && district && area !== district) ? `${area}, ${district}` : (district || area || sug.display_name.split(',').slice(0, 2).join(', '));
                          setSelectedFromSuggestion(true);
                          setLocation(finalLoc);
                          setShowSuggestions(false);
                        }}
                      >
                        <MapPin className="text-[#007672] w-4 h-4 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-gray-900 truncate">{sug.name || sug.display_name.split(',')[0]}</p>
                          <p className="text-[11px] text-gray-500 truncate">{sug.display_name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dates Grid */}
              <div className="flex border border-gray-200 rounded-xl mb-3 overflow-hidden bg-white shadow-sm">
                <div className="flex-1 p-2 md:p-2.5 flex items-center justify-between border-r border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-[#007672] w-5 h-5" strokeWidth={2} />
                    <div className="flex flex-col cursor-pointer relative" onClick={(e) => {
                      const input = e.currentTarget.querySelector('input');
                      if (input && 'showPicker' in input) {
                        try { input.showPicker(); } catch (err) {}
                      }
                    }}>
                      <span className="text-[10px] font-extrabold text-gray-900">Check in</span>
                      <input 
                        type="date" 
                        className="text-[12px] text-gray-500 font-medium outline-none w-24 bg-transparent cursor-pointer" 
                        value={dropoffDate} 
                        onChange={e => setDropoffDate(e.target.value)} 
                      />
                    </div>
                  </div>
                  <ChevronDown className="text-gray-400 w-3 h-3 shrink-0 hidden sm:block" />
                </div>
                
                <div className="flex-1 p-2 md:p-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-[#007672] w-5 h-5" strokeWidth={2} />
                    <div className="flex flex-col cursor-pointer relative" onClick={(e) => {
                      const input = e.currentTarget.querySelector('input');
                      if (input && 'showPicker' in input) {
                        try { input.showPicker(); } catch (err) {}
                      }
                    }}>
                      <span className="text-[10px] font-extrabold text-gray-900">Check out</span>
                      <input 
                        type="date" 
                        className="text-[12px] text-gray-500 font-medium outline-none w-24 bg-transparent cursor-pointer" 
                        value={pickupDate} 
                        onChange={e => setPickupDate(e.target.value)} 
                      />
                    </div>
                  </div>
                  <ChevronDown className="text-gray-400 w-3 h-3 shrink-0 hidden sm:block" />
                </div>
              </div>

              {/* Pets Selector */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <PawPrint className="text-[#007672]" size={16} strokeWidth={2.5} />
                  <span className="font-extrabold text-gray-900 text-[14px]">Your pets</span>
                </div>
                <div className="flex border border-gray-200 rounded-xl p-1.5 md:p-2 justify-between items-center gap-1 md:gap-2 bg-white shadow-sm w-full">
                  <InlinePetCounter 
                    label="Dog" 
                    count={pets.dog} 
                    iconUrl="/husky_avatar.jpg" 
                    onIncrement={() => updatePetCount('dog', true)} 
                    onDecrement={() => updatePetCount('dog', false)} 
                  />
                  <div className="w-[1px] h-6 bg-gray-200 shrink-0" />
                  <InlinePetCounter 
                    label="Cat" 
                    count={pets.cat} 
                    iconUrl="/persian_cat_avatar.jpg" 
                    onIncrement={() => updatePetCount('cat', true)} 
                    onDecrement={() => updatePetCount('cat', false)} 
                  />
                  <div className="w-[1px] h-6 bg-gray-200 shrink-0 hidden sm:block" />
                  <InlinePetCounter 
                    label="Bird" 
                    count={pets.bird} 
                    iconUrl="/parrot_avatar.jpg" 
                    onIncrement={() => updatePetCount('bird', true)} 
                    onDecrement={() => updatePetCount('bird', false)} 
                  />
                </div>
              </div>

              {/* Find Homestays Button */}
              <button 
                onClick={handleSearch} 
                className="w-full bg-[#71b6af] hover:bg-[#5fa39d] text-white font-extrabold text-[15px] py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#71b6af]/30"
              >
                <Search className="w-4 h-4" strokeWidth={3} />
                Find Homestays
              </button>

              {/* Directly Reach Us Button (Mobile Only) */}
              <button 
                onClick={() => navigate('/directly-reach-us')}
                className="md:hidden w-full bg-transparent border-2 border-[#71b6af] text-[#71b6af] font-extrabold text-[15px] py-3.5 rounded-lg flex items-center justify-center transition-colors mt-3"
              >
                Directly Reach Us
              </button>

            </div>
          </div>
          

          
          {/* Hero Image Area */}
          <div className="w-[calc(100%+16px)] -mx-2 md:mx-0 md:w-[28%] lg:w-[28%] xl:w-[32%] z-0 order-last relative shrink-0 flex items-center justify-end overflow-hidden">
             {/* Desktop Image */}
             <img 
               src="/desktop-hero-pets.png" 
               alt="Happy pets" 
               className="hidden md:block w-full h-full object-contain object-right drop-shadow-xl" 
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://placehold.co/600x800/e0f4f2/007672?text=Pets+Image';
               }}
             />
             
             {/* Mobile Image */}
             <img 
               src="/mobile-hero-pets.png" 
               alt="Happy pets" 
               className="md:hidden w-full h-auto object-cover object-top relative z-10 drop-shadow-xl" 
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://placehold.co/600x800/e0f4f2/007672?text=Pets+Image';
               }}
             />
          </div>

        </div>
      </main>

      {/* How It Works Section */}
      <section className="w-full px-4 md:px-12 py-3 bg-white" style={{ perspective: '1200px' }}>
        <div 
          className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-default"
          style={{
            transform: 'rotateX(2deg)',
            boxShadow: '0 20px 60px -15px rgba(0,118,114,0.25), 0 8px 20px -8px rgba(0,118,114,0.15), 0 -2px 6px 0px rgba(0,118,114,0.04), inset 0 -3px 0 0 rgba(0,118,114,0.3)',
          }}
        >
          {/* Desktop Image */}
          <img src="/how-it-works.png" alt="How It Works" className="w-full h-auto hidden md:block" />
          {/* Mobile Image */}
          <img src="/mobile-how-it-works.jpeg" alt="How It Works" className="w-full h-auto block md:hidden" />
        </div>
      </section>

      {/* Additional Mobile Images (4-8) */}
      {[4, 5, 6, 7, 8].map((num) => (
        <section key={num} className="w-full px-4 py-3 bg-white block md:hidden" style={{ perspective: '1200px' }}>
          <div 
            className="w-full rounded-[24px] overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-default"
            style={{
              transform: 'rotateX(2deg)',
              boxShadow: '0 20px 60px -15px rgba(0,118,114,0.25), 0 8px 20px -8px rgba(0,118,114,0.15), 0 -2px 6px 0px rgba(0,118,114,0.04), inset 0 -3px 0 0 rgba(0,118,114,0.3)',
            }}
          >
            <img src={`/mobile ui/${num}.jpeg`} alt={`Section ${num}`} className="w-full h-auto block" />
          </div>
        </section>
      ))}


      {/* Offline Booking Section */}
      <div className="hidden md:block">
        <OfflineBookingSection />
      </div>
      {/* Why Homestay vs Boarding Section */}
      <section className="hidden md:block w-full px-4 md:px-12 py-3 bg-white" style={{ perspective: '1200px' }}>
        <div 
          className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-default"
          style={{
            transform: 'rotateX(2deg)',
            boxShadow: '0 20px 60px -15px rgba(0,0,0,0.2), 0 8px 20px -8px rgba(0,0,0,0.12), 0 -2px 6px 0px rgba(0,0,0,0.03), inset 0 -3px 0 0 rgba(0,118,114,0.25)',
          }}
        >
          {/* Desktop Image */}
          <img src="/why-homestay.png" alt="Why Homestay and Not Boarding" className="w-full h-auto hidden md:block" />
          {/* Mobile Image */}
          <img src="/next-section.png" alt="Why Homestay and Not Boarding" className="w-full h-auto block md:hidden" />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="hidden md:block w-full px-4 md:px-12 py-3 bg-white" style={{ perspective: '1200px' }}>
        <div 
          className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-default"
          style={{
            transform: 'rotateX(2deg)',
            boxShadow: '0 20px 60px -15px rgba(0,118,114,0.25), 0 8px 20px -8px rgba(0,118,114,0.15), 0 -2px 6px 0px rgba(0,118,114,0.04), inset 0 -3px 0 0 rgba(0,118,114,0.3)',
          }}
        >
          <img src="/whychoose-mypet9.png" alt="Why Choose MyPet9" className="w-full h-auto block" />
        </div>
      </section>

      {/* Exclusive Care Plan Section */}
      <section className="hidden md:block w-full px-4 md:px-12 py-3 bg-white" style={{ perspective: '1200px' }}>
        <div 
          className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-default"
          style={{
            transform: 'rotateX(2deg)',
            boxShadow: '0 20px 60px -15px rgba(0,0,0,0.2), 0 8px 20px -8px rgba(0,0,0,0.12), 0 -2px 6px 0px rgba(0,0,0,0.03), inset 0 -3px 0 0 rgba(0,118,114,0.25)',
          }}
        >
          <img src="/care-plan.png" alt="Exclusive Care Plan" className="w-full h-auto block" />
        </div>
      </section>
      {/* Available Cities Section */}
      <section className="hidden md:block w-full px-4 md:px-12 py-3 bg-white" style={{ perspective: '1200px' }}>
        <div 
          className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2 cursor-default"
          style={{
            transform: 'rotateX(2deg)',
            boxShadow: '0 20px 60px -15px rgba(0,118,114,0.25), 0 8px 20px -8px rgba(0,118,114,0.15), 0 -2px 6px 0px rgba(0,118,114,0.04), inset 0 -3px 0 0 rgba(0,118,114,0.3)',
          }}
        >
          <img src="/available-cities.png" alt="Available Major Cities" className="w-full h-auto block" />
        </div>
      </section>

      {/* Mobile Bottom Navigation (Authenticated Only) */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <Navigation />
        </div>
      )}
    </div>
  );
};
