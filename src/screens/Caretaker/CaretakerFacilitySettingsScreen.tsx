import { useState, useEffect } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Building2,
  CheckCircle2,
  Check,
  Plus,
  X,
  Wifi,
  Droplets,
  Wind,
  Shield,
  Camera,
  Utensils,
  ParkingCircle,
  Dumbbell,
  Flower2,
  Tv,
  BedDouble,
  Sparkles,
  Activity,
  Heart,
  Stethoscope,
  Bath,
  Dog,
} from 'lucide-react';

interface FacilityItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export const CaretakerFacilitySettingsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'basic' | 'additional' | null>('basic');

  // Basic Facilities
  const [basicFacilities, setBasicFacilities] = useState<FacilityItem[]>([
    { id: 'spacious_room', label: 'Spacious Room', icon: <BedDouble size={20} />, enabled: false },
    { id: 'clean_water', label: 'Clean Drinking Water', icon: <Droplets size={20} />, enabled: false },
    { id: 'proper_ventilation', label: 'Proper Ventilation', icon: <Wind size={20} />, enabled: false },
    { id: 'safe_fencing', label: 'Safe Fencing / Enclosure', icon: <Shield size={20} />, enabled: false },
    { id: 'cctv', label: 'CCTV Surveillance', icon: <Camera size={20} />, enabled: false },
    { id: 'regular_meals', label: 'Regular Meals', icon: <Utensils size={20} />, enabled: false },
    { id: 'parking', label: 'Parking Available', icon: <ParkingCircle size={20} />, enabled: false },
    { id: 'wifi', label: 'Wi-Fi', icon: <Wifi size={20} />, enabled: false },
  ]);

  // Additional Facilities
  const [additionalFacilities, setAdditionalFacilities] = useState<FacilityItem[]>([
    { id: 'grooming', label: 'Grooming Services', icon: <Sparkles size={20} />, enabled: false },
    { id: 'play_area', label: 'Outdoor Play Area', icon: <Dumbbell size={20} />, enabled: false },
    { id: 'garden', label: 'Garden / Green Space', icon: <Flower2 size={20} />, enabled: false },
    { id: 'ac_rooms', label: 'Air Conditioned Rooms', icon: <Wind size={20} />, enabled: false },
    { id: 'live_updates', label: 'Live Photo / Video Updates', icon: <Tv size={20} />, enabled: false },
    { id: 'exercise', label: 'Exercise & Walks', icon: <Activity size={20} />, enabled: false },
    { id: 'vet_on_call', label: 'Vet on Call', icon: <Stethoscope size={20} />, enabled: false },
    { id: 'spa_bath', label: 'Spa / Bath Facility', icon: <Bath size={20} />, enabled: false },
    { id: 'special_care', label: 'Special Care (Senior/Pup)', icon: <Heart size={20} />, enabled: false },
    { id: 'training', label: 'Basic Training', icon: <Dog size={20} />, enabled: false },
  ]);

  // Custom facilities
  const [customFacility, setCustomFacility] = useState('');
  const [customFacilities, setCustomFacilities] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      try {
        const docRef = doc(db, 'caretaker_applications', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data().facilitySettings;
          if (data) {
            if (data.basicFacilities) {
              setBasicFacilities(prev => prev.map(f => ({
                ...f,
                enabled: data.basicFacilities[f.id] ?? f.enabled
              })));
            }
            if (data.additionalFacilities) {
              setAdditionalFacilities(prev => prev.map(f => ({
                ...f,
                enabled: data.additionalFacilities[f.id] ?? f.enabled
              })));
            }
            if (data.customFacilities) {
              setCustomFacilities(data.customFacilities);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching facility settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const toggleBasicFacility = (id: string) => {
    setBasicFacilities(prev => prev.map(f =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const toggleAdditionalFacility = (id: string) => {
    setAdditionalFacilities(prev => prev.map(f =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const addCustomFacility = () => {
    const trimmed = customFacility.trim();
    if (trimmed && !customFacilities.includes(trimmed)) {
      setCustomFacilities(prev => [...prev, trimmed]);
      setCustomFacility('');
    }
  };

  const removeCustomFacility = (facility: string) => {
    setCustomFacilities(prev => prev.filter(f => f !== facility));
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'caretaker_applications', user.uid);

      const basicObj: Record<string, boolean> = {};
      basicFacilities.forEach(f => { basicObj[f.id] = f.enabled; });

      const additionalObj: Record<string, boolean> = {};
      additionalFacilities.forEach(f => { additionalObj[f.id] = f.enabled; });

      await setDoc(docRef, {
        facilitySettings: {
          basicFacilities: basicObj,
          additionalFacilities: additionalObj,
          customFacilities
        }
      }, { merge: true });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving facility settings:", error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const enabledBasicCount = basicFacilities.filter(f => f.enabled).length;
  const enabledAdditionalCount = additionalFacilities.filter(f => f.enabled).length;

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
            <h1 className="text-xl font-extrabold tracking-tight">Facility Settings</h1>
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
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200/50 mb-3">
                <Building2 size={24} className="text-white" />
              </div>
              <p className="text-[#1B2B48]/60 text-sm font-medium text-center">Select the facilities available at your homestay</p>
            </div>

            {/* Basic Facilities Section */}
            <div className="mb-4">
              <button
                onClick={() => setExpandedSection(expandedSection === 'basic' ? null : 'basic')}
                className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Shield size={20} className="text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-[16px] font-extrabold text-[#1B2B48]">Basic Facilities</h3>
                    <p className="text-[11px] text-[#1B2B48]/50 font-medium">
                      {enabledBasicCount} of {basicFacilities.length} selected
                    </p>
                  </div>
                </div>
                {expandedSection === 'basic' ? (
                  <ChevronUp size={20} className="text-[#1B2B48]/40" />
                ) : (
                  <ChevronDown size={20} className="text-[#1B2B48]/40" />
                )}
              </button>

              {expandedSection === 'basic' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="grid grid-cols-2 gap-2.5">
                    {basicFacilities.map((facility) => (
                      <motion.button
                        key={facility.id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleBasicFacility(facility.id)}
                        className={`flex items-center space-x-2.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                          facility.enabled
                            ? 'border-emerald-400 bg-emerald-50/50 shadow-sm'
                            : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                        }`}
                      >
                        <div className={`shrink-0 transition-colors ${
                          facility.enabled ? 'text-emerald-600' : 'text-gray-400'
                        }`}>
                          {facility.icon}
                        </div>
                        <span className={`text-[12px] lg:text-[13px] font-bold text-left leading-tight ${
                          facility.enabled ? 'text-emerald-700' : 'text-gray-500'
                        }`}>
                          {facility.label}
                        </span>
                        {facility.enabled && (
                          <Check size={14} className="text-emerald-500 ml-auto shrink-0" strokeWidth={3} />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Additional Facilities Section */}
            <div className="mb-4">
              <button
                onClick={() => setExpandedSection(expandedSection === 'additional' ? null : 'additional')}
                className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                    <Sparkles size={20} className="text-violet-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-[16px] font-extrabold text-[#1B2B48]">Additional Facilities</h3>
                    <p className="text-[11px] text-[#1B2B48]/50 font-medium">
                      {enabledAdditionalCount + customFacilities.length} of {additionalFacilities.length + customFacilities.length} selected
                    </p>
                  </div>
                </div>
                {expandedSection === 'additional' ? (
                  <ChevronUp size={20} className="text-[#1B2B48]/40" />
                ) : (
                  <ChevronDown size={20} className="text-[#1B2B48]/40" />
                )}
              </button>

              {expandedSection === 'additional' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="grid grid-cols-2 gap-2.5">
                    {additionalFacilities.map((facility) => (
                      <motion.button
                        key={facility.id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleAdditionalFacility(facility.id)}
                        className={`flex items-center space-x-2.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                          facility.enabled
                            ? 'border-violet-400 bg-violet-50/50 shadow-sm'
                            : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                        }`}
                      >
                        <div className={`shrink-0 transition-colors ${
                          facility.enabled ? 'text-violet-600' : 'text-gray-400'
                        }`}>
                          {facility.icon}
                        </div>
                        <span className={`text-[12px] lg:text-[13px] font-bold text-left leading-tight ${
                          facility.enabled ? 'text-violet-700' : 'text-gray-500'
                        }`}>
                          {facility.label}
                        </span>
                        {facility.enabled && (
                          <Check size={14} className="text-violet-500 ml-auto shrink-0" strokeWidth={3} />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Facilities */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[13px] font-bold text-[#1B2B48]/70 mb-2.5">Add Custom Facility</p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={customFacility}
                        onChange={(e) => setCustomFacility(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomFacility()}
                        placeholder="e.g. Swimming Pool"
                        className="flex-1 py-2.5 px-3.5 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-[13px] font-medium text-[#1B2B48] placeholder:text-gray-300 outline-none focus:border-violet-300 transition-colors"
                      />
                      <button
                        onClick={addCustomFacility}
                        className="w-10 h-10 bg-violet-500 hover:bg-violet-600 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    {customFacilities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {customFacilities.map((cf) => (
                          <div key={cf} className="flex items-center space-x-1.5 bg-violet-50 border border-violet-200 rounded-full px-3 py-1.5">
                            <span className="text-[12px] font-bold text-violet-700">{cf}</span>
                            <button onClick={() => removeCustomFacility(cf)} className="text-violet-400 hover:text-violet-600 transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Save Button */}
            <button 
              onClick={handleSave}
              disabled={saving || showSuccess}
              className={`w-full font-bold text-[15px] py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all mt-4 flex items-center justify-center disabled:opacity-50 disabled:active:scale-100 ${
                showSuccess 
                  ? 'bg-green-500 text-white active:scale-100' 
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
                'Save Facility Settings'
              )}
            </button>

          </div>
        )}
      </div>
    </CaretakerLayout>
  );
};
