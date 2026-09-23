import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, Star, MapPin, Heart, Search, BadgeCheck, Car, Syringe, Scissors, User } from 'lucide-react';
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
    pet?: any;
    service?: string;
    location?: string;
    dropoffDate?: string;
    dropoffTime?: string;
    pickupDate?: string;
    pickupTime?: string;
    specialRequirements?: string;
  } | null;
  
  const [searchLocation, setSearchLocation] = useState(state?.location || '');
  const [loading, setLoading] = useState(true);
  const [caretakers, setCaretakers] = useState<CaretakerResult[]>([]);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');

  // Get user's current location for distance calculation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setUserCoords({ lat: 12.9716, lng: 77.5946 });
        }
      );
    } else {
      setUserCoords({ lat: 12.9716, lng: 77.5946 });
    }
  }, []);

  // Query caretakers from Firestore once we have coords
  useEffect(() => {
    const fetchCaretakers = async () => {
      if (!userCoords) return;
      
      try {
        const [snapshot] = await Promise.all([
          getDocs(collection(db, 'caretaker_applications')),
          new Promise(r => setTimeout(r, 2000)) // Force a 2 second search time like Rapido
        ]);
        
        const results: CaretakerResult[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          
          const loc = data.locationSettings;
          if (!loc?.latitude || !loc?.longitude) return;
          
          const dist = calculateDistance(
            userCoords.lat,
            userCoords.lng,
            loc.latitude,
            loc.longitude
          );

          const priceData = data.priceSettings;
          let price = 800; // default
          if (priceData?.dog?.price) {
            price = parseInt(priceData.dog.price) || 800;
          }

          const mediaPhotos = data.media?.photos?.map((p: any) => p.url) || [];
          
          const basicFacilities = data.facilitySettings?.basic 
            ? Object.entries(data.facilitySettings.basic).filter(([_, v]) => v === true).map(([k]) => k)
            : [];

          const userName = data.name || data.ownerName || 'Caretaker';
          const userPhoto = data.photo || mediaPhotos[0] || `https://ui-avatars.com/api/?name=${userName}&background=FBBF24&color=1B2B48`;

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
            services: data.services ? 
              Object.entries(data.services).filter(([_, v]) => v !== false).map(([k]) => {
                if (k === 'homeStay') return 'Home Stay';
                if (k === 'boarding') return 'Boarding';
                if (k === 'grooming') return 'Grooming';
                return k;
              }) : ['Home Stay'],
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
        setCaretakers(results);
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

  // Filter by search text (lenient keyword match)
  const filteredCaretakers = searchLocation.trim()
    ? sortedCaretakers.filter(c => {
        const searchTerms = searchLocation.toLowerCase().split(/[,\s]+/);
        const locStr = c.locationStr.toLowerCase();
        const nameStr = c.name.toLowerCase();
        
        if (locStr.includes(searchLocation.toLowerCase()) || nameStr.includes(searchLocation.toLowerCase())) {
          return true;
        }

        return searchTerms.some(term => 
          term.length > 2 && (locStr.includes(term) || nameStr.includes(term))
        );
      })
    : sortedCaretakers;

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
          distance: caretaker.distanceStr,
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
          pet: state?.pet,
          service: state?.service,
          dropoffDate: state?.dropoffDate,
          dropoffTime: state?.dropoffTime,
          pickupDate: state?.pickupDate,
          pickupTime: state?.pickupTime,
          specialRequirements: state?.specialRequirements,
        }
      }
    });
  };

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
  
  const petCount = state?.pet ? '1 pet' : '1 pet';
  const fullSubtitle = `${dateSubtitle} • ${petCount}`;

  return (
    <DashboardLayout>
      <div className="w-full h-full flex flex-col bg-[#F8F9FA] relative">
        
        {/* Header section: Edge-to-edge on mobile, rounded banner on desktop */}
        <div className="sticky top-0 lg:static z-40 bg-[#FDD835] lg:bg-transparent shadow-sm lg:shadow-none pt-6 pb-4 px-4 lg:pt-8 lg:px-8">
          <div className="w-full lg:bg-[#FDD835] lg:rounded-[32px] lg:px-10 lg:py-8 lg:shadow-md lg:mx-auto">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              
              <div className="flex items-center lg:space-x-4 w-full lg:w-auto justify-between lg:justify-start">
                <button 
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="text-[#1B2B48]" size={24} />
                </button>
                
                <div className="flex-1 text-center lg:text-left px-4 lg:px-2">
                  <h1 className="text-[18px] lg:text-[28px] font-extrabold text-[#1B2B48] tracking-tight">Boarding in {city}</h1>
                  <p className="text-[12px] lg:text-[15px] font-bold text-[#1B2B48]/80 mt-0.5 lg:mt-1">{fullSubtitle}</p>
                </div>

                <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors lg:hidden">
                  <Heart className="text-[#1B2B48]" size={20} />
                </button>
              </div>

              <button className="hidden lg:flex w-12 h-12 items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                <Heart className="text-[#1B2B48]" size={24} />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-2.5 overflow-x-auto scrollbar-hide py-1 lg:mt-4">
              {(['Price', 'Pet Size', 'Facilities', 'Rating', 'Distance']).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    if(filter === 'Price') setSortBy('price');
                    if(filter === 'Rating') setSortBy('rating');
                    if(filter === 'Distance') setSortBy('distance');
                  }}
                  className="px-3 lg:px-5 py-1.5 lg:py-2.5 bg-white rounded-[10px] lg:rounded-full text-[13px] lg:text-[14px] font-bold text-[#1B2B48] shrink-0 shadow-sm flex items-center space-x-1.5 hover:bg-gray-50 transition-colors"
                >
                  <span>{filter}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative w-full overflow-y-auto">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] px-8">
              <Player
                autoplay
                loop
                src="/animation/Cute Pappy.json"
                style={{ height: '180px', width: '180px', marginBottom: '8px' }}
              />
              <div className="w-full max-w-[200px] mb-5">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.0, ease: "linear" }}
                    className="h-full bg-[#FBBF24] rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
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
            <div className="px-3 lg:px-8 pt-4 lg:pt-6 pb-32 flex flex-col space-y-3 lg:space-y-5 max-w-5xl mx-auto w-full">
              {filteredCaretakers.map((caretaker, index) => (
                <motion.div
                  key={caretaker.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleViewProfile(caretaker)}
                  className="bg-white rounded-[16px] lg:rounded-[24px] p-2.5 lg:p-5 shadow-sm border border-gray-100 cursor-pointer flex flex-row gap-3 lg:gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Image (Left side) */}
                  <div className="w-[110px] h-[120px] lg:w-[260px] lg:h-[220px] relative rounded-[12px] lg:rounded-[16px] overflow-hidden shrink-0">
                    <img 
                      src={caretaker.images[0]}
                      alt={caretaker.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button className="absolute top-2 right-2 w-7 h-7 lg:w-10 lg:h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/30 transition-colors">
                      <Heart size={14} className="text-white lg:w-5 lg:h-5" />
                    </button>
                  </div>

                  {/* Details (Right side) */}
                  <div className="flex-1 flex flex-col justify-between py-0.5 lg:py-2 min-w-0">
                    
                    {/* Top Row: Title, Verified, Price */}
                    <div className="flex justify-between items-start lg:mb-1">
                      <div className="flex-1 pr-2 min-w-0">
                        <div className="flex items-center flex-wrap gap-1.5 lg:gap-2 mb-1 lg:mb-2.5">
                          <h3 className="text-[15px] lg:text-[22px] font-extrabold text-[#1B2B48] leading-tight truncate">{caretaker.name}</h3>
                          <div className="flex items-center space-x-1 bg-[#E8F5E9] px-1.5 lg:px-2 py-0.5 rounded text-[9px] lg:text-[11px] font-bold text-[#2E7D32] shrink-0">
                            <BadgeCheck size={10} className="lg:w-4 lg:h-4" />
                            <span className="hidden lg:inline">Verified Partner</span>
                            <span className="lg:hidden">Verified Partner</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 mb-1.5 lg:mb-3">
                          <Star size={12} className="fill-[#FBBF24] text-[#FBBF24] lg:w-5 lg:h-5" />
                          <span className="text-[12px] lg:text-[16px] font-extrabold text-[#1B2B48]">{caretaker.rating.toFixed(1)}</span>
                          <span className="text-[11px] lg:text-[15px] font-medium text-[#465E87]">({caretaker.reviews} reviews)</span>
                        </div>

                        <div className="flex items-center space-x-1 text-[11px] lg:text-[15px] font-medium text-[#465E87] mb-2 lg:mb-0 truncate">
                          <MapPin size={11} className="text-[#465E87] shrink-0 lg:w-5 lg:h-5" />
                          <span className="truncate">{caretaker.distanceStr} • {caretaker.locationStr.split(',')[0]}</span>
                        </div>
                      </div>

                      {/* Price Block */}
                      <div className="text-right flex flex-col items-end shrink-0 pl-2 lg:pl-4">
                        <div className="flex items-center space-x-0.5 lg:space-x-1">
                          <span className="text-[16px] lg:text-[28px] font-extrabold text-[#1B2B48]">₹{caretaker.price}</span>
                          <ChevronLeft size={16} className="text-[#1B2B48] rotate-180 shrink-0 lg:w-6 lg:h-6" />
                        </div>
                        <span className="text-[9px] lg:text-[13px] font-medium text-[#465E87] text-right mt-0.5 lg:mt-1 leading-tight">per pet, per night</span>
                      </div>
                    </div>

                    {/* Facilities Icons Row */}
                    <div className="flex flex-row justify-between lg:justify-start lg:gap-12 mt-auto pt-2 border-t border-gray-50 lg:border-none lg:pt-0">
                      
                      {/* Pick up & drop */}
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 lg:w-12 lg:h-12 bg-[#FFF5D1] rounded-full flex items-center justify-center mb-1 lg:mb-2">
                          <Car size={13} className="text-[#B99266] lg:w-6 lg:h-6" />
                        </div>
                        <span className="text-[7.5px] lg:text-[12px] font-semibold text-[#465E87] leading-tight text-center">Pickup & Drop<br/>Service</span>
                      </div>

                      {/* Vaccination */}
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 lg:w-12 lg:h-12 bg-[#FFF5D1] rounded-full flex items-center justify-center mb-1 lg:mb-2">
                          <Syringe size={13} className="text-[#B99266] lg:w-6 lg:h-6" />
                        </div>
                        <span className="text-[7.5px] lg:text-[12px] font-semibold text-[#465E87] leading-tight text-center">Vaccination<br/>Assistance</span>
                      </div>

                      {/* Grooming */}
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 lg:w-12 lg:h-12 bg-[#FFF5D1] rounded-full flex items-center justify-center mb-1 lg:mb-2">
                          <Scissors size={13} className="text-[#B99266] lg:w-6 lg:h-6" />
                        </div>
                        <span className="text-[7.5px] lg:text-[12px] font-semibold text-[#465E87] leading-tight text-center">Grooming<br/>Available</span>
                      </div>

                      {/* Experience */}
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 lg:w-12 lg:h-12 bg-[#FFF5D1] rounded-full flex items-center justify-center mb-1 lg:mb-2">
                          <User size={13} className="text-[#B99266] lg:w-6 lg:h-6" />
                        </div>
                        <span className="text-[7.5px] lg:text-[12px] font-semibold text-[#465E87] leading-tight text-center">{caretaker.experience ? `${caretaker.experience}+ Yrs` : '3+ Yrs'}<br/>Experience</span>
                      </div>
                      
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Floating Bottom Bar (Mobile Only) */}
          {!loading && filteredCaretakers.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-30 flex justify-center lg:hidden">
               <span className="text-[13px] font-extrabold text-[#1B2B48]">{filteredCaretakers.length} stays available</span>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};