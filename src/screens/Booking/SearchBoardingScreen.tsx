import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown, Star, MapPin, Heart, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { calculateDistance, formatDistance } from '../../utils/distance';
import { motion } from 'framer-motion';

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
          // Default to Bangalore center if location denied
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
        const snapshot = await getDocs(collection(db, 'caretaker_applications'));
        const results: CaretakerResult[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          
          // Skip if no location set or not approved
          const loc = data.locationSettings;
          if (!loc?.latitude || !loc?.longitude) return;
          
          // Calculate distance
          const dist = calculateDistance(
            userCoords.lat,
            userCoords.lng,
            loc.latitude,
            loc.longitude
          );

          // Get price - use dog price as default
          const priceData = data.priceSettings;
          let price = 800; // default
          if (priceData?.dog?.price) {
            price = parseInt(priceData.dog.price) || 800;
          }

          // Get photos
          const mediaPhotos = data.media?.photos?.map((p: any) => p.url) || [];
          
          // Get facilities  
          const basicFacilities = data.facilitySettings?.basic 
            ? Object.entries(data.facilitySettings.basic).filter(([_, v]) => v === true).map(([k]) => k)
            : [];

          // Get user name from the data or fallback
          const userName = data.name || data.ownerName || 'Caretaker';
          const userPhoto = data.photo || mediaPhotos[0] || `https://ui-avatars.com/api/?name=${userName}&background=FBBF24&color=1B2B48`;

          // Build result
          results.push({
            id: doc.id,
            name: userName,
            photo: userPhoto,
            price,
            rating: data.rating || 4.5 + Math.random() * 0.5, // Will be real once reviews exist
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

        // Sort by distance (nearest first) — like Ola/Rapido
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

  // Filter by search text
  const filteredCaretakers = searchLocation.trim()
    ? sortedCaretakers.filter(c => 
        c.locationStr.toLowerCase().includes(searchLocation.toLowerCase()) ||
        c.name.toLowerCase().includes(searchLocation.toLowerCase())
      )
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

  return (
    <DashboardLayout>
      <div className="w-full h-full flex flex-col bg-[#F8F9FA] relative">
        
        {/* Sticky Header with Search */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100 pt-6 lg:pt-10 pb-4 px-5">
          <div className="max-w-2xl mx-auto w-full">
            <div className="flex items-center mb-4">
              <button 
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors mr-3"
              >
                <ArrowLeft className="text-[#1B2B48]" size={24} />
              </button>
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 flex items-center shadow-inner">
                <Search className="text-gray-400 mr-2 shrink-0" size={18} />
                <input 
                  type="text" 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Search location..."
                  className="bg-transparent border-none outline-none w-full text-[15px] font-medium text-[#1B2B48]"
                />
              </div>
            </div>

            {/* Quick Filters / Sort */}
            <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide py-1">
              {(['distance', 'price', 'rating'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setSortBy(filter)}
                  className={`px-4 py-2 rounded-full text-[13px] font-bold shrink-0 transition-all capitalize ${
                    sortBy === filter
                      ? 'bg-[#1B2B48] text-white'
                      : 'bg-white border border-gray-200 text-[#465E87] hover:bg-gray-50'
                  }`}
                >
                  {filter === 'distance' ? 'Nearest' : filter === 'price' ? 'Lowest Price' : 'Top Rated'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative max-w-2xl mx-auto w-full overflow-y-auto">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <Loader2 size={32} className="animate-spin text-petoo-primary mb-3" />
              <p className="text-[14px] text-gray-500 font-medium">Finding caretakers near you...</p>
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
            <div className="px-5 pt-4 pb-32 space-y-4">
              <p className="text-[13px] text-gray-500 font-medium">
                {filteredCaretakers.length} caretaker{filteredCaretakers.length > 1 ? 's' : ''} found
              </p>
              
              {filteredCaretakers.map((caretaker, index) => (
                <motion.div
                  key={caretaker.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => handleViewProfile(caretaker)}
                  className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
                >
                  {/* Image Row */}
                  <div className="flex h-[140px] lg:h-[180px] relative">
                    <img 
                      src={caretaker.images[0]}
                      alt={caretaker.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Distance Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center space-x-1.5">
                      <MapPin size={12} className="text-petoo-primary" />
                      <span className="text-[11px] font-bold text-[#1B2B48]">{caretaker.distanceStr}</span>
                    </div>
                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3 bg-[#1B2B48]/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                      <span className="text-[13px] font-extrabold text-white">₹{caretaker.price}</span>
                      <span className="text-[10px] text-white/70 ml-0.5">/ night</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-[16px] font-extrabold text-[#1B2B48] mb-0.5">{caretaker.name}</h3>
                        <p className="text-[12px] text-gray-500 font-medium">{caretaker.locationStr}</p>
                      </div>
                      <div className="flex items-center space-x-1 bg-amber-50 px-2.5 py-1 rounded-full">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        <span className="text-[12px] font-extrabold text-amber-700">{caretaker.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-amber-600 font-medium">({caretaker.reviews})</span>
                      </div>
                    </div>

                    {/* Service Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {caretaker.services.map((svc, i) => (
                        <span key={i} className="text-[10px] font-bold text-petoo-primary bg-petoo-primary/5 px-2.5 py-1 rounded-full">
                          {svc}
                        </span>
                      ))}
                      {caretaker.facilities.slice(0, 3).map((fac, i) => (
                        <span key={`f-${i}`} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full capitalize">
                          {fac.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
};