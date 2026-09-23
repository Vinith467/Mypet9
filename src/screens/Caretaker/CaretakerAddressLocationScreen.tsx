import { useState, useEffect, useCallback } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  ChevronLeft,
  MapPin,
  CheckCircle2,
  Navigation,
  Home,
  Search,
  Info,
  LocateFixed,
} from 'lucide-react';

interface LocationData {
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
}

export const CaretakerAddressLocationScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const [locationData, setLocationData] = useState<LocationData>({
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      try {
        const docRef = doc(db, 'caretaker_applications', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data().locationSettings;
          if (data) {
            setLocationData(prev => ({ ...prev, ...data }));
          }
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const detectCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationData(prev => ({ ...prev, latitude, longitude }));

        // Try reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          if (data && data.address) {
            const addr = data.address;
            setLocationData(prev => ({
              ...prev,
              latitude,
              longitude,
              address: data.display_name?.split(',').slice(0, 3).join(', ') || prev.address,
              city: addr.city || addr.town || addr.village || addr.county || prev.city,
              state: addr.state || prev.state,
              pincode: addr.postcode || prev.pincode,
            }));
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
        }

        setDetectingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert('Unable to detect location. Please enter manually.');
        setDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const updateField = (field: keyof LocationData, value: string) => {
    setLocationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    
    if (!locationData.address || !locationData.city || !locationData.pincode) {
      alert('Please fill in address, city and pincode.');
      return;
    }

    setSaving(true);
    try {
      const docRef = doc(db, 'caretaker_applications', user.uid);
      await setDoc(docRef, {
        locationSettings: locationData
      }, { merge: true });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving location:", error);
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const hasCoordinates = locationData.latitude !== null && locationData.longitude !== null;

  return (
    <CaretakerLayout>
      <div className="w-full flex flex-col bg-[#FAFAFA] min-h-screen font-quicksand pb-40 lg:pb-12 text-[#1B2B48]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-[#FAFAFA]/95 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center -ml-2 text-[#1B2B48] hover:bg-black/5 rounded-full transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-xl font-extrabold tracking-tight">Facility Address</h1>
          </div>
          <div className="w-10"></div>
        </div>

        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-petoo-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex-1 px-5 lg:px-8 pt-6 w-full flex flex-col max-w-3xl mx-auto">
            
            {/* Hero */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/50 mb-3">
                <MapPin size={24} className="text-white" />
              </div>
              <p className="text-[#1B2B48]/60 text-sm font-medium text-center max-w-xs">
                Your facility's location helps pet parents nearby discover and reach you easily
              </p>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 rounded-2xl p-4 flex items-start space-x-3 mb-6 border border-blue-100">
              <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-blue-700 text-[12px] font-medium leading-snug">
                Pet parents search by location. We calculate the distance between your homestay 
                and their location to show relevant results — just like Ola or Rapido. Make sure 
                your address is accurate!
              </p>
            </div>

            {/* Detect Location Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={detectCurrentLocation}
              disabled={detectingLocation}
              className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-all mb-4 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  {detectingLocation ? (
                    <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <LocateFixed size={20} className="text-emerald-600" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-bold text-[#1B2B48]">
                    {detectingLocation ? 'Detecting location...' : 'Use Current Location'}
                  </p>
                  <p className="text-[11px] text-[#1B2B48]/50 font-medium">Auto-fill address using GPS</p>
                </div>
              </div>
              <Navigation size={18} className="text-emerald-500" />
            </motion.button>

            {/* GPS Status */}
            {hasCoordinates && (
              <div className="bg-emerald-50 rounded-xl p-3 flex items-center space-x-2 mb-4 border border-emerald-100">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <p className="text-emerald-700 text-[12px] font-bold">
                  GPS coordinates captured: {locationData.latitude?.toFixed(4)}, {locationData.longitude?.toFixed(4)}
                </p>
              </div>
            )}

            {/* Address Form */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
              
              <div className="flex items-center space-x-2 mb-2">
                <Home size={18} className="text-[#1B2B48]/60" />
                <h3 className="text-[15px] font-extrabold text-[#1B2B48]">Address Details</h3>
              </div>

              {/* Address */}
              <div>
                <label className="text-[12px] font-bold text-[#1B2B48]/60 mb-1.5 block">Full Address *</label>
                <textarea
                  value={locationData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="House/Flat No., Street, Area"
                  rows={3}
                  className="w-full py-2.5 px-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-[13px] font-medium text-[#1B2B48] placeholder:text-gray-300 outline-none focus:border-petoo-primary transition-colors resize-none"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="text-[12px] font-bold text-[#1B2B48]/60 mb-1.5 block">Landmark</label>
                <input
                  type="text"
                  value={locationData.landmark}
                  onChange={(e) => updateField('landmark', e.target.value)}
                  placeholder="Near park, temple, mall, etc."
                  className="w-full py-2.5 px-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-[13px] font-medium text-[#1B2B48] placeholder:text-gray-300 outline-none focus:border-petoo-primary transition-colors"
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-bold text-[#1B2B48]/60 mb-1.5 block">City *</label>
                  <input
                    type="text"
                    value={locationData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="City"
                    className="w-full py-2.5 px-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-[13px] font-medium text-[#1B2B48] placeholder:text-gray-300 outline-none focus:border-petoo-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#1B2B48]/60 mb-1.5 block">State</label>
                  <input
                    type="text"
                    value={locationData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    placeholder="State"
                    className="w-full py-2.5 px-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-[13px] font-medium text-[#1B2B48] placeholder:text-gray-300 outline-none focus:border-petoo-primary transition-colors"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="text-[12px] font-bold text-[#1B2B48]/60 mb-1.5 block">Pincode *</label>
                <input
                  type="text"
                  value={locationData.pincode}
                  onChange={(e) => updateField('pincode', e.target.value)}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className="w-full py-2.5 px-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-[13px] font-medium text-[#1B2B48] placeholder:text-gray-300 outline-none focus:border-petoo-primary transition-colors"
                />
              </div>
            </div>

            {/* Save Button */}
            <button 
              onClick={handleSave}
              disabled={saving || showSuccess}
              className={`w-full font-bold text-[15px] py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all mt-6 flex items-center justify-center disabled:opacity-50 ${
                showSuccess 
                  ? 'bg-green-500 text-white' 
                  : 'bg-[#FBBF24] text-[#1B2B48] active:scale-[0.98]'
              }`}
            >
              {showSuccess ? (
                <>
                  <CheckCircle2 size={20} className="mr-2" />
                  Successfully Saved!
                </>
              ) : saving ? (
                'Saving...'
              ) : (
                'Save Location'
              )}
            </button>

          </div>
        )}
      </div>
    </CaretakerLayout>
  );
};
