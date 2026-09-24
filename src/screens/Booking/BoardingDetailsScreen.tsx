import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  CalendarDays, 
  ChevronRight, 
  ChevronDown, 
  Crosshair
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { DateTimePickerModal } from '../../components/ui/DateTimePickerModal';

// Helper to format date strings for display (e.g. "2025-09-12" -> "12 Sep 2025")
const formatCustomDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const BoardingDetailsScreen = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const pet = loc.state?.pet;
  const service = loc.state?.service || 'Home Stay';
  
  const bookingData = loc.state?.bookingData;
  const passedSelectedPets = loc.state?.selectedPets;
  const passedProvider = loc.state?.provider;

  // States for interactivity
  const [location, setLocation] = useState(bookingData?.location || 'Bengaluru, Karnataka');
  const [isDetecting, setIsDetecting] = useState(false);
  
  const [activePicker, setActivePicker] = useState<'dropoff' | 'pickup' | null>(null);
  const [dropoffDate, setDropoffDate] = useState<string>(bookingData?.dropoffDate || ''); 
  const [dropoffTime, setDropoffTime] = useState<string>(bookingData?.dropoffTime || '');
  
  const [pickupDate, setPickupDate] = useState<string>(bookingData?.pickupDate || '');
  const [pickupTime, setPickupTime] = useState<string>(bookingData?.pickupTime || '');

  const [specialReqOpen, setSpecialReqOpen] = useState(false);
  const [specialRequirements, setSpecialRequirements] = useState('');

  // Reusable GPS detection logic
  const detectGPS = async (setAddress: (val: string) => void, setLoading: (val: boolean) => void) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setAddress('Locating you...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'Accept-Language': 'en-US,en;q=0.9' } }
          );
          const data = await response.json();
          
          if (data && data.address) {
            const suburb = data.address.suburb || data.address.neighbourhood || data.address.residential;
            const city = data.address.city || data.address.town || data.address.county || data.address.state_district;
            const state = data.address.state;
            
            let finalAddress = '';
            if (suburb && city) finalAddress = `${suburb}, ${city}`;
            else if (city && state) finalAddress = `${city}, ${state}`;
            else finalAddress = data.display_name.split(',').slice(0, 2).join(',');
            
            setAddress(finalAddress.trim());
          } else {
            setAddress("Address not found");
          }
        } catch (error) {
          console.error("Geocoding failed", error);
          setAddress("Failed to get address");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        setAddress("Location permission denied");
        setLoading(false);
      }
    );
  };

  const handleDetectMainLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    detectGPS(setLocation, setIsDetecting);
  };

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col pt-6 lg:pt-10 h-full relative">
        
        <div className="w-full max-w-xl mx-auto flex flex-col space-y-6 px-4 lg:px-0 pb-32 lg:pb-12 h-full overflow-y-auto scrollbar-hide">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-2 shrink-0">
            <button 
              onClick={() => navigate(-1)} 
              className="p-1.5 rounded-full hover:bg-[#1B2B48]/5 transition-colors"
            >
              <ArrowLeft size={24} className="text-[#174f38]" />
            </button>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1B2B48] tracking-tight">
              Boarding Details
            </h1>
          </div>

          <div className="flex flex-col space-y-4 pb-10">
            
            {/* Location Block */}
            <div className="flex items-center bg-white p-4 rounded-[20px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 focus-within:border-petoo-primary/30 transition-colors">
              <div className="mr-4 text-[#174f38]">
                <MapPin size={24} strokeWidth={2} />
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor="location-input" className="text-[12px] font-semibold text-[#465E87] cursor-text">
                  Location
                </label>
                <input 
                  id="location-input"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-[15px] font-bold text-[#1B2B48] bg-transparent outline-none w-full placeholder:text-[#1B2B48]/30"
                  placeholder="Enter location"
                  disabled={isDetecting}
                />
              </div>
              <button 
                onClick={handleDetectMainLocation}
                className={`ml-4 p-2 -mr-2 rounded-full transition-colors ${
                  isDetecting ? 'text-petoo-primary animate-pulse bg-petoo-primary/10' : 'text-[#1B2B48] hover:bg-gray-100'
                }`}
                title="Detect Current Location"
              >
                <Crosshair size={20} strokeWidth={isDetecting ? 2.5 : 2} />
              </button>
            </div>

            {/* Drop-off Block (Custom Picker) */}
            <div 
              className="flex items-center bg-white p-4 rounded-[20px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-petoo-primary/30 transition-colors cursor-pointer"
              onClick={() => setActivePicker('dropoff')}
            >
              <div className="mr-4 text-[#174f38]">
                <CalendarDays size={24} strokeWidth={2} />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[12px] font-semibold text-[#465E87]">Drop-off</span>
                <span className="text-[15px] font-bold text-[#1B2B48]">
                  {dropoffDate && dropoffTime ? (
                    <>{formatCustomDate(dropoffDate)} <span className="text-[#1B2B48]/50 mx-1">•</span> {dropoffTime}</>
                  ) : (
                    <span className="text-[#1B2B48]/40">Select Date & Time</span>
                  )}
                </span>
              </div>
              <div className="ml-4 text-[#1B2B48]">
                <ChevronRight size={20} strokeWidth={2.5} />
              </div>
            </div>

            {/* Pick-up Block (Custom Picker) */}
            <div 
              className="flex items-center bg-white p-4 rounded-[20px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-petoo-primary/30 transition-colors cursor-pointer"
              onClick={() => setActivePicker('pickup')}
            >
              <div className="mr-4 text-[#174f38]">
                <CalendarDays size={24} strokeWidth={2} />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[12px] font-semibold text-[#465E87]">Pick-up</span>
                <span className="text-[15px] font-bold text-[#1B2B48]">
                  {pickupDate && pickupTime ? (
                    <>{formatCustomDate(pickupDate)} <span className="text-[#1B2B48]/50 mx-1">•</span> {pickupTime}</>
                  ) : (
                    <span className="text-[#1B2B48]/40">Select Date & Time</span>
                  )}
                </span>
              </div>
              <div className="ml-4 text-[#1B2B48]">
                <ChevronRight size={20} strokeWidth={2.5} />
              </div>
            </div>

            {/* Special Requirements Block */}
            <div className="flex flex-col bg-white rounded-[20px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden transition-colors focus-within:border-petoo-primary/30 hover:border-petoo-primary/30">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setSpecialReqOpen(!specialReqOpen)}
              >
                <div className="flex items-center space-x-1">
                  <span className="text-[15px] font-bold text-[#1B2B48]">Special Requirements</span>
                  <span className="text-[13px] font-medium text-[#465E87]">(Optional)</span>
                </div>
                <motion.div
                  animate={{ rotate: specialReqOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ChevronDown size={20} className="text-[#1B2B48]" strokeWidth={2.5} />
                </motion.div>
              </div>
              <AnimatePresence>
                {specialReqOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <textarea 
                      placeholder="e.g. feeding, medication, behaviour..."
                      value={specialRequirements}
                      onChange={(e) => setSpecialRequirements(e.target.value)}
                      className="w-full bg-gray-50/50 rounded-xl p-3 text-[14px] text-[#1B2B48] placeholder:text-[#465E87]/60 border border-gray-100 focus:outline-none focus:border-petoo-primary/30 min-h-[80px] resize-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              {!specialReqOpen && (
                <div className="px-4 pb-4">
                  <p className="text-[14px] text-[#465E87]/60 truncate">
                    e.g. feeding, medication, behaviour...
                  </p>
                </div>
              )}
            </div>



            <div className="mt-8 pt-4">
              <Button 
                fullWidth 
                className="py-4 rounded-[18px] text-[16px] font-bold shadow-xl shadow-petoo-primary/20"
                onClick={() => navigate('/search-boarding', { state: { pet, service, location, dropoffDate, dropoffTime, pickupDate, pickupTime, specialRequirements, selectedPets: passedSelectedPets, provider: passedProvider, bookingData } })}
              >
                Search Boarding
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Custom Date Time Picker Modal */}
      <DateTimePickerModal 
        isOpen={activePicker !== null}
        onClose={() => setActivePicker(null)}
        title={activePicker === 'dropoff' ? 'Select Drop-off' : 'Select Pick-up'}
        initialDate={activePicker === 'dropoff' ? dropoffDate : pickupDate}
        initialTime={activePicker === 'dropoff' ? dropoffTime : pickupTime}
        onConfirm={(dateStr, timeStr) => {
          if (activePicker === 'dropoff') {
            setDropoffDate(dateStr);
            setDropoffTime(timeStr);
          } else {
            setPickupDate(dateStr);
            setPickupTime(timeStr);
          }
        }}
      />
    </DashboardLayout>
  );
};
