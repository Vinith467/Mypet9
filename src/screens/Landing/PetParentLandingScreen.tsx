import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, Search, Target, PawPrint, Plus, Minus, X, Menu, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const InlinePetCounter = ({ label, count, onIncrement, onDecrement }: { label: string, count: number, onIncrement: () => void, onDecrement: () => void }) => (
  <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
    <span className="font-medium text-gray-900 text-[14px]">{label}</span>
    <div className="flex items-center bg-white rounded-md p-1 border border-gray-300">
      <button 
        onClick={onDecrement} 
        disabled={count === 0} 
        className="w-6 h-6 rounded flex items-center justify-center text-[#1B2B48] bg-white disabled:opacity-40 hover:bg-gray-100 transition-colors"
      >
        <Minus size={16} strokeWidth={2.5} />
      </button>
      <span className="w-4 text-center font-bold text-gray-900 text-[14px]">{count}</span>
      <button 
        onClick={onIncrement} 
        className="w-6 h-6 rounded flex items-center justify-center text-[#1B2B48] bg-white hover:bg-gray-100 transition-colors"
      >
        <Plus size={16} strokeWidth={2.5} />
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

  const handleSearch = () => {
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
      state: searchData
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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocation('Locating...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
            const data = await response.json();
            
            if (data && data.address) {
              const area = data.address.neighbourhood || data.address.suburb || data.address.village || data.address.residential || data.address.road || '';
              const district = data.address.city_district || data.address.state_district || data.address.county || data.address.city || data.address.town || '';
              
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
            console.error("Error fetching address:", error);
            setLocation('Unable to get address');
          }
        },
        (error) => {
          console.error("Error getting location", error);
          setLocation('');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setLocation('Geolocation not supported');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      {/* MyPet9 Style Header & Navigation (Yellow Theme) */}
      <div className="bg-[#FBBF24] text-[#1B2B48]">
        {/* Top Header */}
        <header className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/')}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#1B2B48] rounded-full flex items-center justify-center">
              <PawPrint className="text-[#FBBF24]" size={20} />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight">MyPet9</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {user ? (
              <button onClick={() => navigate('/home')} className="font-bold text-sm md:text-base hover:text-[#1B2B48]/80 transition-colors">
                Dashboard
              </button>
            ) : (
              <button onClick={handleGoogleSignIn} className="font-bold flex items-center gap-1.5 md:gap-2 text-sm md:text-base hover:text-[#1B2B48]/80 transition-colors">
                <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4 bg-white rounded-full p-0.5" />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            )}
            <Menu className="w-5 h-5 md:w-6 md:h-6 ml-1 md:ml-2" />
          </div>
        </header>

        {/* Categories */}
        <div className="max-w-6xl mx-auto px-4 pb-6 pt-2 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 md:gap-4 w-max">
            <button className="flex items-center gap-2 border border-[#1B2B48] px-4 py-2 rounded-full bg-[#1B2B48]/10 shrink-0">
              <PawPrint size={18} />
              <span className="font-bold text-sm md:text-base">Boarding</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full flex-1">
        {/* Search Box - Booking.com Layout with Dark Blue Border */}
        <div className="px-4 -mt-4 relative z-20 max-w-6xl mx-auto">
          <div className="bg-[#1B2B48] p-1 rounded-lg shadow-lg flex flex-col md:flex-row gap-1">
            
            {/* Location */}
            <div className="bg-white rounded-sm p-3.5 flex items-center gap-2 md:gap-3 flex-1 relative">
              <Search className="text-gray-500 shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="Where do you need a caretaker?" 
                className="w-full outline-none text-gray-900 font-bold text-base md:text-lg bg-transparent placeholder:text-gray-500 min-w-0"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button 
                onClick={getCurrentLocation}
                className="absolute right-2 p-1.5 hover:bg-gray-100 rounded-md text-[#1B2B48] transition-colors shrink-0"
                title="Use current location"
              >
                <Target size={20} />
              </button>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-sm p-3 md:p-3.5 flex items-center flex-1">
              <Calendar className="text-gray-500 shrink-0 hidden sm:block mr-3" size={20} />
              
              <div 
                className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input && 'showPicker' in input) {
                    try { input.showPicker(); } catch (err) {}
                  }
                }}
              >
                <span className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-wider shrink-0 mt-0.5 pointer-events-none">From</span>
                <input 
                  type="date" 
                  className="w-full outline-none bg-transparent cursor-pointer text-[12px] sm:text-[14px] md:text-base font-bold text-gray-900" 
                  value={dropoffDate} 
                  onChange={(e) => setDropoffDate(e.target.value)} 
                  onClick={(e) => {
                    if ('showPicker' in HTMLInputElement.prototype) {
                      try { (e.target as HTMLInputElement).showPicker(); } catch (err) {}
                    }
                  }}
                />
              </div>
              
              <div className="w-[1px] h-6 bg-gray-200 mx-1 sm:mx-3 shrink-0"></div>
              
              <div 
                className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
                onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input && 'showPicker' in input) {
                    try { input.showPicker(); } catch (err) {}
                  }
                }}
              >
                <span className="text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-wider shrink-0 mt-0.5 pointer-events-none">To</span>
                <input 
                  type="date" 
                  className="w-full outline-none bg-transparent cursor-pointer text-[12px] sm:text-[14px] md:text-base font-bold text-gray-900" 
                  value={pickupDate} 
                  onChange={(e) => setPickupDate(e.target.value)} 
                  onClick={(e) => {
                    if ('showPicker' in HTMLInputElement.prototype) {
                      try { (e.target as HTMLInputElement).showPicker(); } catch (err) {}
                    }
                  }}
                />
              </div>
            </div>

            {/* Pets - Inline directly in the bar */}
            <div className="bg-white rounded-sm p-3 md:p-3.5 flex flex-row items-center justify-between gap-1 sm:gap-3 md:gap-4 md:flex-1 overflow-hidden">
              <InlinePetCounter label="Dog" count={pets.dog} onIncrement={() => updatePetCount('dog', true)} onDecrement={() => updatePetCount('dog', false)} />
              <InlinePetCounter label="Cat" count={pets.cat} onIncrement={() => updatePetCount('cat', true)} onDecrement={() => updatePetCount('cat', false)} />
              <InlinePetCounter label="Bird" count={pets.bird} onIncrement={() => updatePetCount('bird', true)} onDecrement={() => updatePetCount('bird', false)} />
            </div>

            {/* Search Button */}
            <button 
              onClick={handleSearch}
              disabled={totalPets === 0 || !location}
              className="bg-[#1B2B48] hover:bg-[#121c2e] disabled:opacity-70 text-[#FBBF24] p-3.5 md:px-8 rounded-sm text-lg md:text-xl font-bold transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </div>

        {/* Offers / Continue Search */}
        <div className="max-w-6xl mx-auto px-4 py-8 mt-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Continue your search</h2>
          
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Banner with background image for "Deals for [Location]" */}
            <div className="relative rounded-2xl overflow-hidden min-h-[180px] md:min-h-[220px] flex items-end p-5 md:p-6 shadow-md border border-gray-200">
              <img src="/home-banner.png" alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 text-white">
                <h3 className="font-bold text-xl md:text-2xl mb-1">Find caretakers near you</h3>
                <p className="text-white/90 mb-3 md:mb-4 font-medium text-sm md:text-base">Trusted, verified caretakers for your furry family members.</p>
                <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                  Explore options
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Offers</h2>
              {/* Offers Cards */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 border border-gray-200 bg-white rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-sm min-h-[140px] md:min-h-[160px]">
                  <div>
                    <h3 className="font-bold text-lg mb-1">New to MyPet9?</h3>
                    <p className="text-sm text-gray-600 mb-4">Get 10% off your first boarding booking when you sign up with Google.</p>
                  </div>
                  <button 
                    onClick={handleGoogleSignIn}
                    className="bg-[#1B2B48] text-white w-full sm:w-max px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#121c2e] transition-colors"
                  >
                    Sign in with Google
                  </button>
                </div>
                
                <div className="flex-1 border border-gray-200 bg-white rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-sm min-h-[140px] md:min-h-[160px]">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Peace of mind</h3>
                    <p className="text-sm text-gray-600 mb-4">All caretakers are strictly verified. Daily photo updates included!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

