import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown, Star, MapPin, Heart, Search, BadgeCheck, Car, Syringe, Scissors, User, Calendar, Moon, PawPrint, ArrowLeft, Shield, Filter, List, X, Building, Home } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { calculateDistance, formatDistance } from '../../utils/distance';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';

interface CaretakerResult {
  id: string;
  name: string;
  photo: string;
  price: number;
  rating: number;
  reviews: number;
  distance: number;
  distanceStr: string;
  locationStr: string;
  services: string[];
  images: string[];
  facilities: string[];
  latitude: number;
  longitude: number;
  bio?: string;
  experience?: number;
  capacity?: number;
}

export const BoardingSearchScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    location?: string;
    dropoffDate?: string;
    pickupDate?: string;
    pets?: {
      dog: number;
      cat: number;
      bird: number;
      other: number;
    };
    otherPetName?: string;
    isNewSearch?: boolean;
    fromAuth?: boolean;
    selectedPets?: any[];
    provider?: any;
    bookingData?: any;
  } | null;
  
  const [searchLocation, setSearchLocation] = useState(state?.location || '');
  
  // Try to load cached data to avoid replaying the animation on back navigation
  // But ignore cache if it's a completely new search from the landing page or just came from Auth
  const isNewSearch = state?.isNewSearch === true;
  const fromAuth = state?.fromAuth === true;
  const ignoreCache = isNewSearch || fromAuth;
  const cachedData = !ignoreCache ? sessionStorage.getItem('cachedCaretakers') : null;
  const initialCaretakers = cachedData ? JSON.parse(cachedData) : [];
  
  const [caretakers, setCaretakers] = useState<CaretakerResult[]>(initialCaretakers);
  const [loading, setLoading] = useState(initialCaretakers.length === 0);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');

  // Filter & UI State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    experience: [],
    homeType: [],
    petSize: [],
    rating: [],
    facilities: []
  });
  
  const [likedCaretakers, setLikedCaretakers] = useState<string[]>([]);

  // Get search location coordinates for distance calculation
  useEffect(() => {
    const getCoords = async () => {
      if (searchLocation) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}&limit=1`);
          const data = await response.json();
          if (data && data.length > 0) {
            setUserCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
            return;
          }
        } catch (error) {
          console.error("Error fetching coordinates for search location", error);
        }
      }
      
      // Fallback to GPS if no search location or if geocoding failed
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => setUserCoords({ lat: 12.9716, lng: 77.5946 })
        );
      } else {
        setUserCoords({ lat: 12.9716, lng: 77.5946 });
      }
    };
    
    getCoords();
  }, [searchLocation]);

  // Query caretakers from Firestore once we have coords
  useEffect(() => {
    const fetchCaretakers = async () => {
      if (!userCoords) return;
      
      try {
        const [snapshot] = await Promise.all([
          getDocs(collection(db, 'caretakers')),
          new Promise(r => setTimeout(r, 2000)) // Force a 2 second search time like Rapido
        ]);
        
        const results: CaretakerResult[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          
          const loc = data.locationSettings || { 
            latitude: data.location?.lat || data.latitude, 
            longitude: data.location?.lng || data.longitude,
            city: data.locationStr?.split(',').pop()?.trim() || data.address || '',
            address: data.address || data.locationStr || ''
          };
          if (!loc?.latitude || !loc?.longitude) return;
          
          let dist = calculateDistance(
            userCoords.lat,
            userCoords.lng,
            loc.latitude,
            loc.longitude
          );

          const caretakerLocStr = (loc.city ? `${loc.address || loc.landmark || ''}, ${loc.city}`.replace(/^,\s*/, '') : 'Location set').toLowerCase();

          const priceData = data.priceSettings;
          let price = data.price || 800;
          if (priceData?.dog?.price) {
            price = parseInt(priceData.dog.price) || 800;
          }

          const mediaPhotos = data.media?.photos?.map((p: any) => p.url) || data.images || [];
          
          const basicFacilities = data.facilitySettings?.basic 
            ? Object.entries(data.facilitySettings.basic).filter(([_, v]) => v === true).map(([k]) => k)
            : (data.facilities || []);

          const userName = data.name || data.ownerName || 'Caretaker';
          const userPhoto = data.photo || mediaPhotos[0] || `https://ui-avatars.com/api/?name=${userName}&background=FBBF24&color=1B2B48`;

          // --- Filtering Logic for Pets ---
          if (state?.pets) {
            // We will let them pass even if they haven't explicitly set a price yet,
            // to make sure new profiles aren't hidden. We default to 800 if missing.
          }

          results.push({
            id: doc.id,
            name: userName,
            photo: userPhoto,
            price,
            rating: data.rating || 4.5 + Math.random() * 0.5,
            reviews: data.reviewCount || Math.floor(Math.random() * 20) + 5,
            distance: dist,
            distanceStr: formatDistance(dist),
            locationStr: loc.city ? `${loc.address || loc.landmark || ''}, ${loc.city}`.replace(/^,\s*/, '') : 'Location set',
            services: data.services 
              ? (Array.isArray(data.services) ? data.services : Object.entries(data.services).filter(([_, v]) => v !== false).map(([k]) => {
                if (k === 'homeStay') return 'Home Stay';
                if (k === 'boarding') return 'Boarding';
                if (k === 'grooming') return 'Grooming';
                return k;
              })) : ['Home Stay'],
            images: mediaPhotos.length > 0 ? mediaPhotos : [userPhoto],
            facilities: basicFacilities,
            latitude: loc.latitude,
            longitude: loc.longitude,
            bio: data.bio || data.caretakerProfile?.bio,
            experience: data.experience || data.caretakerProfile?.experience,
            capacity: data.availability?.capacity || 3,
          });
        });

        results.sort((a, b) => a.distance - b.distance);

        // -------------------------------------------

        setCaretakers(results);
        sessionStorage.setItem('cachedCaretakers', JSON.stringify(results));
      } catch (error) {
        console.error("Error fetching caretakers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaretakers();
  }, [userCoords]);

  // Sort results
  const sortedCaretakers = [...caretakers].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.distance - b.distance;
  });

  // Filter by search text (lenient keyword match, fallback to returning all if none match so screen isn't empty)
  let filteredCaretakers = sortedCaretakers;
  
  if (searchLocation.trim()) {
    const textMatched = sortedCaretakers.filter(c => {
      const searchTerms = searchLocation.toLowerCase().split(/[,\s]+/);
      const locStr = c.locationStr.toLowerCase();
      const nameStr = c.name.toLowerCase();
      
      if (locStr.includes(searchLocation.toLowerCase()) || nameStr.includes(searchLocation.toLowerCase())) {
        return true;
      }
      return searchTerms.some(term => 
        term.length > 2 && (locStr.includes(term) || nameStr.includes(term))
      );
    });
    
    // If text match yields results, use it. Otherwise, just show all sorted by distance so it's not empty!
    if (textMatched.length > 0) {
      filteredCaretakers = textMatched;
    }
  }

  // Apply Advanced Filters
  if (activeFilters.experience.length > 0 && !activeFilters.experience.includes('Any')) {
    filteredCaretakers = filteredCaretakers.filter(c => {
      const exp = c.experience || 0;
      if (activeFilters.experience.includes('5+ years') && exp >= 5) return true;
      if (activeFilters.experience.includes('3+ years') && exp >= 3) return true;
      if (activeFilters.experience.includes('1+ years') && exp >= 1) return true;
      return false;
    });
  }

  if (activeFilters.rating.length > 0) {
    filteredCaretakers = filteredCaretakers.filter(c => {
      if (activeFilters.rating.includes('4.5 & above') && c.rating >= 4.5) return true;
      if (activeFilters.rating.includes('4.0 & above') && c.rating >= 4.0) return true;
      if (activeFilters.rating.includes('3.5 & above') && c.rating >= 3.5) return true;
      if (activeFilters.rating.includes('3.0 & above') && c.rating >= 3.0) return true;
      return false;
    });
  }

  if (activeFilters.facilities.length > 0) {
    filteredCaretakers = filteredCaretakers.filter(c => {
      // Map UI labels to backend fields if necessary, or do substring match
      // For now, doing a simple inclusion check across services and facilities
      const combined = [...(c.services || []), ...(c.facilities || [])].map(s => s.toLowerCase());
      return activeFilters.facilities.every(filterFac => {
        return combined.some(item => item.includes(filterFac.toLowerCase().replace(' available', '')));
      });
    });
  }

  const handleViewProfile = (caretaker: CaretakerResult) => {
    navigate('/caretaker-profile', {
      state: {
        provider: {
          id: caretaker.id,
          name: caretaker.name,
          photo: caretaker.photo,
          price: caretaker.price,
          rating: caretaker.rating.toFixed(1),
          reviews: caretaker.reviews,
          distance: caretaker.distance,
          distanceStr: caretaker.distanceStr,
          locationStr: caretaker.locationStr,
          services: caretaker.services,
          images: caretaker.images,
          facilities: caretaker.facilities,
          bio: caretaker.bio,
          experience: caretaker.experience,
          capacity: caretaker.capacity,
          latitude: caretaker.latitude,
          longitude: caretaker.longitude,
        },
        bookingData: {
          ...state,
          pets: state?.pets,
          dropoffDate: state?.dropoffDate,
          pickupDate: state?.pickupDate,
        },
        selectedPets: state?.selectedPets
      }
    });
  };

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value) 
        ? current.filter(v => v !== value) 
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };
  
  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedCaretakers(prev => 
      prev.includes(id) ? prev.filter(likedId => likedId !== id) : [...prev, id]
    );
  };

  const renderFilters = () => (
    <>
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar flex flex-col gap-6">
        {/* Price */}
        <div>
          <h3 className="text-[14px] font-bold text-[#1B2B48] mb-4">Price <span className="font-medium text-[#465E87]">(per pet, per night)</span></h3>
          <div className="h-1 w-full bg-gray-200 rounded-full relative mb-3">
            <div className="absolute left-0 top-0 h-full w-[70%] bg-[#007672] rounded-full"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#007672] rounded-full shadow border-2 border-white"></div>
            <div className="absolute left-[70%] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#007672] rounded-full shadow border-2 border-white"></div>
          </div>
          <div className="flex justify-between text-[12px] font-bold text-[#465E87]">
            <span>₹0</span>
            <span>₹3000+</span>
          </div>
        </div>

        {/* Distance */}
        <div>
          <h3 className="text-[14px] font-bold text-[#1B2B48] mb-4">Distance</h3>
          <div className="h-1 w-full bg-gray-200 rounded-full relative mb-3">
            <div className="absolute left-0 top-0 h-full w-[100%] bg-[#007672] rounded-full"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#007672] rounded-full shadow border-2 border-white"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#007672] rounded-full shadow border-2 border-white"></div>
          </div>
          <div className="flex justify-between text-[12px] font-bold text-[#465E87]">
            <span>0 km</span>
            <span>20+ km</span>
          </div>
        </div>

        {/* Experience */}
        <div>
          <h3 className="text-[14px] font-bold text-[#1B2B48] mb-3">Experience (Years)</h3>
          <div className="flex flex-col gap-2.5">
            {['Any', '1+ years', '3+ years', '5+ years'].map(exp => {
              const isChecked = activeFilters.experience.includes(exp) || (exp === 'Any' && activeFilters.experience.length === 0);
              return (
              <div key={exp} onClick={() => toggleFilter('experience', exp)} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded-[4px] border ${isChecked ? 'bg-[#007672] border-[#007672]' : 'border-gray-300 group-hover:border-[#007672]'} flex items-center justify-center transition-colors`}>
                  {isChecked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className={`text-[14px] font-medium ${isChecked ? 'text-[#1B2B48]' : 'text-[#465E87] group-hover:text-[#1B2B48]'}`}>{exp}</span>
              </div>
            )})}
          </div>
        </div>

        {/* Home Type */}
        <div>
          <h3 className="text-[14px] font-bold text-[#1B2B48] mb-3">Home Type</h3>
          <div className="flex flex-col gap-2.5">
            {[
              { icon: Building, label: 'Apartment' },
              { icon: Home, label: 'Independent House' },
              { icon: Shield, label: 'Gated Community' },
            ].map(type => {
              const isChecked = activeFilters.homeType.includes(type.label);
              return (
              <div key={type.label} onClick={() => toggleFilter('homeType', type.label)} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded-[4px] border ${isChecked ? 'bg-[#007672] border-[#007672]' : 'border-gray-300 group-hover:border-[#007672]'} flex items-center justify-center transition-colors`}>
                  {isChecked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div className="flex items-center gap-2">
                  <type.icon size={14} className="text-[#007672]" />
                  <span className={`text-[14px] font-medium ${isChecked ? 'text-[#1B2B48]' : 'text-[#465E87] group-hover:text-[#1B2B48]'}`}>{type.label}</span>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Pet Size */}
        <div>
          <h3 className="text-[14px] font-bold text-[#1B2B48] mb-3">Pet Size</h3>
          <div className="flex flex-col gap-2.5">
            {['Small (0-10 kg)', 'Medium (10-25 kg)', 'Large (25+ kg)'].map(size => {
              const isChecked = activeFilters.petSize.includes(size);
              return (
              <div key={size} onClick={() => toggleFilter('petSize', size)} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded-[4px] border ${isChecked ? 'bg-[#007672] border-[#007672]' : 'border-gray-300 group-hover:border-[#007672]'} flex items-center justify-center transition-colors`}>
                  {isChecked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className={`text-[14px] font-medium ${isChecked ? 'text-[#1B2B48]' : 'text-[#465E87] group-hover:text-[#1B2B48]'}`}>{size}</span>
              </div>
            )})}
          </div>
        </div>

        {/* Rating */}
        <div>
          <h3 className="text-[14px] font-bold text-[#1B2B48] mb-3">Rating</h3>
          <div className="flex flex-col gap-2.5">
            {['4.5 & above', '4.0 & above', '3.5 & above', '3.0 & above'].map(rating => {
              const isChecked = activeFilters.rating.includes(rating);
              return (
              <div key={rating} onClick={() => toggleFilter('rating', rating)} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded-[4px] border ${isChecked ? 'bg-[#007672] border-[#007672]' : 'border-gray-300 group-hover:border-[#007672]'} flex items-center justify-center transition-colors`}>
                  {isChecked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="fill-[#FBC02D] text-[#FBC02D]" />
                  <span className={`text-[14px] font-medium ${isChecked ? 'text-[#1B2B48]' : 'text-[#465E87] group-hover:text-[#1B2B48]'}`}>{rating}</span>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h3 className="text-[14px] font-bold text-[#1B2B48] mb-3">Facilities</h3>
          <div className="flex flex-col gap-2.5">
            {[
              { icon: Car, label: 'Pickup & Drop' },
              { icon: Syringe, label: 'Vaccination Assistance' },
              { icon: Scissors, label: 'Grooming Available' },
              { icon: Shield, label: '24/7 Supervision' },
              { icon: PawPrint, label: 'Secure Home' },
              { icon: MapPin, label: 'Outdoor Play Area' },
            ].map(fac => {
              const isChecked = activeFilters.facilities.includes(fac.label);
              return (
              <div key={fac.label} onClick={() => toggleFilter('facilities', fac.label)} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded-[4px] border ${isChecked ? 'bg-[#007672] border-[#007672]' : 'border-gray-300 group-hover:border-[#007672]'} flex items-center justify-center transition-colors`}>
                  {isChecked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div className="flex items-center gap-2">
                  <fac.icon size={14} className="text-[#007672]" />
                  <span className={`text-[14px] font-medium ${isChecked ? 'text-[#1B2B48]' : 'text-[#465E87] group-hover:text-[#1B2B48]'}`}>{fac.label}</span>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
      
      <div className="px-5 py-0 mb-4 bg-transparent mt-auto">
        <button 
          onClick={() => setIsFilterDrawerOpen(false)}
          className="w-full bg-[#007672] text-white py-3 rounded-[10px] font-extrabold text-[14px] hover:bg-[#005f5b] transition-colors shadow-sm"
        >
          Apply Filters
        </button>
      </div>
    </>
  );

  // Derived state for Header
  const city = searchLocation.split(',')[0].trim() || 'Location';
  
  let dateSubtitle = '';
  if (state?.dropoffDate && state?.pickupDate) {
    const d1 = new Date(state.dropoffDate);
    const d2 = new Date(state.pickupDate);
    const f1 = d1.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const f2 = d2.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    dateSubtitle = `${f1} - ${f2} • ${diffDays} night${diffDays > 1 ? 's' : ''}`;
  } else {
    dateSubtitle = `Flexible dates`;
  }
  
  let totalPetsCount = 1;
  if (state?.pets) {
    totalPetsCount = state.pets.dog + state.pets.cat + state.pets.bird + state.pets.other;
  }
  const petCount = `${totalPetsCount} pet${totalPetsCount > 1 ? 's' : ''}`;
  const fullSubtitle = `${dateSubtitle} • ${petCount}`;

  return (
    <DashboardLayout>
      <div className="w-full h-full flex flex-col bg-[#F8F9FA] relative">
        
        {/* Full-width Hero Banner - Desktop */}
        <div className="hidden md:flex relative w-full overflow-hidden bg-[#DDF4F5] min-h-[200px] items-center shrink-0">
          
          {/* Background Image placed on the right */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none" 
            style={{ 
              backgroundImage: "url('/Happy Pets, Happier Holidays!.png')",
              backgroundPosition: "right center",
              backgroundSize: "auto 100%",
              backgroundRepeat: "no-repeat"
            }} 
          />

          {/* Decorative Paw Prints */}
          <PawPrint size={40} className="absolute left-1/4 -top-3 text-[#007672]/10 rotate-[25deg] pointer-events-none" />
          <PawPrint size={48} className="absolute left-[10%] -bottom-4 text-[#007672]/10 rotate-[10deg] pointer-events-none" />
          <PawPrint size={56} className="absolute left-[40%] bottom-6 text-[#007672]/10 rotate-[-25deg] pointer-events-none lg:block hidden" />
          
          {/* A gradient overlay to ensure text is readable if the image overlaps on smaller screens */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#DDF4F5] via-[#DDF4F5]/90 to-transparent z-10 w-[60%] lg:w-[45%] pointer-events-none"></div>
          
          <div className="relative z-20 w-full max-w-7xl mx-auto px-8 py-5 flex flex-col justify-center h-full">
            
            <div className="flex items-start gap-5">
              <button 
                onClick={() => navigate(-1)}
                className="w-10 h-10 shrink-0 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors mt-1 border border-gray-100"
              >
                <ArrowLeft className="text-[#003B39]" size={20} />
              </button>
              
              <div className="flex flex-col mt-1">
                <h1 className="text-[32px] lg:text-[36px] font-extrabold text-[#003B39] tracking-tight leading-[1.15] mb-2.5 font-serif">
                  Find the Perfect Pet Sitter<br className="hidden lg:block" /> for a Happier, Healthier Pet
                </h1>
                
                {/* Booking details */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[#007672] font-extrabold text-[13px] mb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={15} strokeWidth={2.5} />
                    <span>{state?.dropoffDate && state?.pickupDate ? `${new Date(state.dropoffDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${new Date(state.pickupDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}` : 'Flexible dates'}</span>
                  </div>
                  <span className="text-[#71b6af]">•</span>
                  <div className="flex items-center gap-1.5">
                    <Moon size={15} strokeWidth={2.5} />
                    <span>{state?.dropoffDate && state?.pickupDate ? `${Math.ceil(Math.abs(new Date(state.pickupDate).getTime() - new Date(state.dropoffDate).getTime()) / (1000 * 60 * 60 * 24))} nights` : 'Any duration'}</span>
                  </div>
                  <span className="text-[#71b6af]">•</span>
                  <div className="flex items-center gap-1.5">
                    <PawPrint size={15} strokeWidth={2.5} />
                    <span>{petCount}</span>
                  </div>
                </div>
                
                <p className="text-[13px] font-bold text-[#465E87]">
                  Loving homes. Trusted sitters. Peace of mind for you.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Full-width Hero Banner - Mobile */}
        <div className="flex md:hidden flex-col w-full shrink-0 bg-white">
          <div className="relative">
            <img 
              src="/mobile-booking search.png" 
              alt="Search Boarding" 
              className="w-full h-auto object-cover" 
            />
            <button 
              onClick={() => navigate(-1)}
              className="absolute top-2 left-4 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm z-10"
              aria-label="Go back"
            >
              <ArrowLeft className="text-[#003B39]" size={18} />
            </button>
          </div>
          
          <div className="px-5 pt-3 pb-1">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} strokeWidth={2.5} className="text-[#007672]" />
                <span className="text-[#1B2B48] font-bold text-[12px]">{state?.dropoffDate && state?.pickupDate ? `${new Date(state.dropoffDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${new Date(state.pickupDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}` : 'Flexible dates'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Moon size={14} strokeWidth={2.5} className="text-[#007672]" />
                <span className="text-[#1B2B48] font-bold text-[12px]">{state?.dropoffDate && state?.pickupDate ? `${Math.ceil(Math.abs(new Date(state.pickupDate).getTime() - new Date(state.dropoffDate).getTime()) / (1000 * 60 * 60 * 24))} nights` : 'Any duration'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <PawPrint size={14} strokeWidth={2.5} className="text-[#007672]" />
                <span className="text-[#1B2B48] font-bold text-[12px]">{petCount}</span>
              </div>
            </div>
            <p className="text-[12px] font-medium text-[#1B2B48]">
              Loving homes. Trusted sitters. Peace of mind for you.
            </p>
          </div>
          <img 
            src="/2mobile-booking search.png" 
            alt="Book with Confidence" 
            className="w-full h-auto -mt-2" 
          />
        </div>



        {/* Content Area with Split Layout for Desktop */}
        <div className="flex-1 relative w-full bg-[#F8F9FA]">
          <div className="w-full flex flex-row items-stretch">
            
            {/* Left Sidebar (Filters) - Desktop Only */}
            <div className="hidden lg:block shrink-0 w-[260px] xl:w-[280px] bg-white border-r border-gray-200">
              <div className="w-[260px] xl:w-[280px] bg-white flex flex-col sticky top-0" style={{ height: '100vh', maxHeight: '100vh' }}>
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-[#1B2B48]">
                    <Filter size={20} className="text-[#007672]" />
                    <h2 className="text-[20px] font-extrabold">Filters</h2>
                  </div>
                  <button 
                    onClick={() => console.log('Clear All Filters')}
                    className="text-[#465E87] text-[14px] font-bold hover:text-[#007672]"
                  >
                    Clear All
                  </button>
                </div>
                {renderFilters()}
              </div>
            </div>

            {/* Middle Column: Caretaker List */}
            <div className="flex-1 w-full min-w-0 transition-all duration-300">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] px-8">
              <Player
                autoplay
                loop
                src="/loader/new.json"
                style={{ height: '300px', width: '300px' }}
              />
              <div className="w-full max-w-[200px] mb-5 -mt-24">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.0, ease: "linear" }}
                    className="h-full bg-[#007672] rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                  />
                </div>
              </div>
              <p className="text-[15px] font-extrabold text-[#1B2B48] animate-pulse">Finding caretakers near you...</p>
              <p className="text-[12px] font-medium text-[#465E87] mt-1">Calculating distance & prices</p>
            </div>


          ) : filteredCaretakers.length === 0 ? (
            <div className="px-5 pt-6 pb-32 flex flex-col items-center justify-center min-h-[50vh]">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Search className="text-blue-500" size={40} />
              </div>
              <h2 className="text-[22px] font-extrabold text-[#1B2B48] mb-3 text-center">
                No Caretakers Found
              </h2>
              <p className="text-[#465E87] text-[15px] font-medium text-center max-w-sm mb-8">
                {caretakers.length === 0 
                  ? "We are currently expanding our network. Please check back soon!"
                  : "No caretakers match your search. Try a different location."}
              </p>
            </div>
          ) : (
            <div className="px-3 lg:px-6 pt-4 lg:pt-6 pb-32 flex flex-col max-w-[750px] mx-auto w-full">
              
              {/* List Header */}
              <div className="flex flex-row justify-between items-center mb-6">
                <div className="flex items-center gap-3 sm:gap-6">
                  {/* Filter button only visible on mobile/tablet since it's permanent on desktop */}
                  <button 
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="flex lg:hidden items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-[#1B2B48] shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <Filter size={16} className="text-[#007672]" />
                    <span className="text-[13px] sm:text-[14px]">Filters</span>
                  </button>
                  
                  <div className="flex items-center gap-2 relative">
                    <span className="text-[13px] sm:text-[14px] font-semibold text-[#465E87] hidden sm:block">Sort by</span>
                    <button 
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[13px] sm:text-[14px] font-bold text-[#1B2B48] shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      {sortBy === 'distance' ? 'Distance' : sortBy === 'price' ? 'Lowest Price' : 'Highest Rating'} <ChevronDown size={14} className="text-[#465E87]" />
                    </button>

                    {/* Dropdown Menu */}
                    {isSortDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-[12px] shadow-lg z-50 overflow-hidden">
                        <button 
                          onClick={() => { setSortBy('distance'); setIsSortDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-3 text-[13px] font-bold hover:bg-gray-50 transition-colors ${sortBy === 'distance' ? 'text-[#007672] bg-gray-50' : 'text-[#1B2B48]'}`}
                        >
                          Distance
                        </button>
                        <button 
                          onClick={() => { setSortBy('price'); setIsSortDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-3 text-[13px] font-bold hover:bg-gray-50 transition-colors ${sortBy === 'price' ? 'text-[#007672] bg-gray-50' : 'text-[#1B2B48]'}`}
                        >
                          Lowest Price
                        </button>
                        <button 
                          onClick={() => { setSortBy('rating'); setIsSortDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-3 text-[13px] font-bold hover:bg-gray-50 transition-colors ${sortBy === 'rating' ? 'text-[#007672] bg-gray-50' : 'text-[#1B2B48]'}`}
                        >
                          Highest Rating
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4 lg:space-y-5">
              {filteredCaretakers.map((caretaker, index) => (
                <motion.div
                  key={caretaker.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleViewProfile(caretaker)}
                  className="bg-white rounded-[16px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-row gap-3 sm:gap-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow cursor-pointer group"
                >
                  {/* Image Grid (Left side) */}
                  <div className="w-[100px] sm:w-[200px] md:w-[220px] shrink-0 flex flex-col gap-1 sm:gap-1.5">
                    <div className="w-full h-[80px] sm:h-[120px] relative rounded-tl-[12px] rounded-tr-[12px] overflow-hidden">
                      <img 
                        src={caretaker.images[0]}
                        alt={caretaker.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button 
                        onClick={(e) => toggleLike(caretaker.id, e)}
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
                      >
                        <Heart 
                          size={14} 
                          className={`sm:w-4 sm:h-4 ${likedCaretakers.includes(caretaker.id) ? "fill-[#FF4B4B] text-[#FF4B4B]" : "text-[#003B39]"}`} 
                        />
                      </button>
                    </div>
                    <div className="flex flex-row gap-1 sm:gap-1.5 h-[35px] sm:h-[60px]">
                      <div className="flex-1 relative overflow-hidden rounded-bl-[12px]">
                        <img src={caretaker.images[1] || caretaker.images[0]} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 relative overflow-hidden">
                        <img src={caretaker.images[2] || caretaker.images[0]} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 relative overflow-hidden rounded-br-[12px]">
                        <img src={caretaker.images[3] || caretaker.images[0]} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                          <span className="text-white text-[12px] sm:text-[14px] font-bold">+{caretaker.images.length > 3 ? caretaker.images.length - 3 : 2}</span>
                          <span className="text-white text-[7px] sm:text-[9px] font-medium uppercase tracking-wider">Photos</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details (Right side) */}
                  <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                    
                    {/* Top Section: Title & Price */}
                    <div className="flex justify-between items-start mb-1 sm:mb-2">
                      <div className="flex-1 min-w-0 pr-1 sm:pr-4">
                        <div className="flex items-center flex-wrap gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                          <h3 className="text-[14px] sm:text-[20px] font-bold text-[#1B2B48] leading-tight truncate">{caretaker.name}</h3>
                          <div className="flex items-center space-x-1 bg-[#E8F5E9] px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold text-[#2E7D32] shrink-0">
                            <BadgeCheck size={10} className="sm:w-3 sm:h-3" />
                            <span>Verified Partner</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 sm:space-x-1.5 mb-0.5 sm:mb-1">
                          <Star size={12} className="fill-[#FBC02D] text-[#FBC02D] sm:w-3.5 sm:h-3.5" />
                          <span className="text-[12px] sm:text-[14px] font-bold text-[#007672]">{caretaker.rating.toFixed(1)}</span>
                          <span className="text-[11px] sm:text-[13px] text-[#465E87]">({caretaker.reviews} reviews)</span>
                        </div>

                        <div className="flex items-center space-x-1 sm:space-x-1.5 text-[11px] sm:text-[13px] text-[#465E87] truncate">
                          <MapPin size={12} className="text-[#465E87] shrink-0 sm:w-3.5 sm:h-3.5" />
                          <span className="truncate">{caretaker.distanceStr} away</span>
                        </div>
                      </div>

                      {/* Price Block & Arrow */}
                      <div className="text-right flex flex-col items-end shrink-0">
                        <div className="flex items-center space-x-0.5 sm:space-x-1 text-[#1B2B48]">
                          <span className="text-[15px] sm:text-[22px] font-bold">₹{caretaker.price}</span>
                          <ChevronRight size={16} strokeWidth={2.5} className="text-[#1B2B48] sm:w-5 sm:h-5" />
                        </div>
                        <span className="text-[8px] sm:text-[12px] text-[#465E87] mt-0">per pet, per night</span>
                      </div>
                    </div>

                    {/* Facilities Icons Row */}
                    <div className="flex flex-row justify-between items-start sm:items-end mt-auto pt-2 sm:pt-3 border-t border-gray-100">
                      
                      {/* Pick up & drop */}
                      <div className="flex flex-col items-center flex-1">
                        <Car size={14} strokeWidth={1.5} className="text-[#00B4A9] mb-1 sm:w-[18px] sm:h-[18px] sm:mb-1.5" />
                        <span className="text-[8px] sm:text-[10px] font-medium text-[#465E87] leading-tight text-center">Pickup & Drop<br className="hidden sm:block"/> Service</span>
                      </div>

                      {/* Vaccination */}
                      <div className="flex flex-col items-center flex-1">
                        <Syringe size={14} strokeWidth={1.5} className="text-[#00B4A9] mb-1 sm:w-[18px] sm:h-[18px] sm:mb-1.5" />
                        <span className="text-[8px] sm:text-[10px] font-medium text-[#465E87] leading-tight text-center">Vaccination<br className="hidden sm:block"/> Assistance</span>
                      </div>

                      {/* Grooming */}
                      <div className="flex flex-col items-center flex-1">
                        <Scissors size={14} strokeWidth={1.5} className="text-[#00B4A9] mb-1 sm:w-[18px] sm:h-[18px] sm:mb-1.5" />
                        <span className="text-[8px] sm:text-[10px] font-medium text-[#465E87] leading-tight text-center">Grooming<br className="hidden sm:block"/> Available</span>
                      </div>
                      
                      {/* 24/7 Supervision */}
                      <div className="flex flex-col items-center flex-1">
                        <Shield size={14} strokeWidth={1.5} className="text-[#00B4A9] mb-1 sm:w-[18px] sm:h-[18px] sm:mb-1.5" />
                        <span className="text-[8px] sm:text-[10px] font-medium text-[#465E87] leading-tight text-center">24/7<br className="hidden sm:block"/> Supervision</span>
                      </div>

                      {/* Experience */}
                      <div className="flex flex-col items-center flex-1">
                        <User size={14} strokeWidth={1.5} className="text-[#00B4A9] mb-1 sm:w-[18px] sm:h-[18px] sm:mb-1.5" />
                        <span className="text-[8px] sm:text-[10px] font-medium text-[#465E87] leading-tight text-center">{caretaker.experience ? `${caretaker.experience}+ Yrs` : '3+ Yrs'}<br className="hidden sm:block"/> Experience</span>
                      </div>
                      
                    </div>

                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          )}

          </div> {/* End Left Column */}

          {/* Right Column: Static Promotional Image (Desktop Only) */}
          <div className="hidden lg:flex shrink-0 bg-[#F8F9FA] relative justify-end w-[260px] xl:w-[320px]">
            <div className="w-[260px] xl:w-[320px]">
              <div className="sticky top-0 w-full flex justify-end items-start pt-6 pr-4 xl:pr-8">
                <img 
                  src="/booking-search.png" 
                  alt="Book with Confidence" 
                  className="w-full max-w-[240px] xl:max-w-[280px] h-auto object-contain object-top drop-shadow-sm rounded-[16px] ml-auto"
                />
              </div>
            </div>
          </div>
          
          </div> {/* End Split Layout Wrapper */}
        </div>

        {/* Filters Side Drawer (Mobile Overlay) */}
        {isFilterDrawerOpen && (
          <div className="fixed lg:hidden inset-0 z-[100] flex">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsFilterDrawerOpen(false)}
            />
            
            {/* Drawer Content */}
            <div className="relative w-full max-w-[320px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
              
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2 text-[#1B2B48]">
                  <Filter size={20} className="text-[#007672]" />
                  <h2 className="text-[20px] font-extrabold">Filters</h2>
                </div>
                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="text-[#465E87] text-[14px] font-bold hover:text-[#007672]"
                >
                  Clear All
                </button>
              </div>

              {renderFilters()}

              {/* Close Button on Mobile Overlay */}
              <button 
                onClick={() => setIsFilterDrawerOpen(false)}
                className="absolute top-4 -right-12 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-[#1B2B48]"
              >
                <X size={20} />
              </button>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};