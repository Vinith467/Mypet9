import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, PawPrint, Plus, Minus, ChevronDown, Heart, Headset } from 'lucide-react';
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    if (!location.trim()) {
      alert("Please enter a location to search for homestays.");
      return;
    }

    if (!user) {
      navigate('/auth', { 
        state: { 
          returnTo: '/search-boarding',
          bookingData: { location, dropoffDate, pickupDate, pets }
        } 
      });
      return;
    }
    
    // Navigate to Search Boarding screen
    navigate('/search-boarding', {
      state: { location, dropoffDate, pickupDate, pets }
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
      <main className="w-full relative">
        <OfflineBookingSection />
      </main>

      {/* Scroll Down Indicator */}
      <div 
        className="w-full flex flex-col items-center justify-center py-8 md:py-12 bg-white cursor-pointer group"
        onClick={() => window.scrollBy({top: 500, behavior: 'smooth'})}
      >
        <p className="text-[#007672] text-[13px] md:text-[15px] font-extrabold uppercase tracking-[0.2em] mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
          Scroll to explore
        </p>
        <div className="bg-[#E0F4F2] p-3 md:p-4 rounded-full animate-bounce shadow-md shadow-[#007672]/10 border border-[#007672]/20 group-hover:bg-[#007672] transition-colors duration-300">
          <ChevronDown className="text-[#007672] group-hover:text-white w-7 h-7 md:w-8 md:h-8 transition-colors duration-300" strokeWidth={3} />
        </div>
      </div>

      {/* How It Works Section */}
      <section className="w-full px-4 md:px-12 pb-8 bg-white" style={{ perspective: '1200px' }}>
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
            <img src={`/mobile ui/${num}.${num === 8 ? 'png' : 'jpeg'}`} alt={`Section ${num}`} className="w-full h-auto block" />
          </div>
        </section>
      ))}



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
