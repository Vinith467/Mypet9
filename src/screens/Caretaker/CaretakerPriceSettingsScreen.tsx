import { useState, useEffect } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ChevronLeft, Info, CheckCircle2, Home, Edit2, Check, PawPrint } from 'lucide-react';

interface ServiceOption {
  enabled: boolean;
  price: string;
}

interface Services {
  pickupDrop: ServiceOption;
  vaccination: ServiceOption;
  grooming: ServiceOption;
  training?: ServiceOption;
}

export const CaretakerPriceSettingsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'dog' | 'cat'>('dog');
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  
  // State for Dog
  const [dogPrice, setDogPrice] = useState('800');
  const [dogServices, setDogServices] = useState<Services>({
    pickupDrop: { enabled: false, price: '300' },
    vaccination: { enabled: false, price: '500' },
    grooming: { enabled: false, price: '800' },
    training: { enabled: false, price: '600' }
  });

  // State for Cat
  const [catPrice, setCatPrice] = useState('600');
  const [catServices, setCatServices] = useState<Services>({
    pickupDrop: { enabled: false, price: '300' },
    vaccination: { enabled: false, price: '500' },
    grooming: { enabled: false, price: '600' },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      try {
        const docRef = doc(db, 'caretaker_applications', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data().priceSettings;
          if (data) {
            if (data.dogPrice) setDogPrice(data.dogPrice);
            if (data.dogServices) setDogServices(data.dogServices);
            if (data.catPrice) setCatPrice(data.catPrice);
            if (data.catServices) setCatServices(data.catServices);
          }
        }
      } catch (error) {
        console.error("Error fetching price settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'caretaker_applications', user.uid);
      await setDoc(docRef, {
        priceSettings: {
          dogPrice,
          dogServices,
          catPrice,
          catServices
        }
      }, { merge: true });
      setIsEditingPrice(false);
      alert('Price settings saved successfully!');
    } catch (error) {
      console.error("Error saving price settings:", error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    const isDog = activeTab === 'dog';
    const currentPrice = isDog ? dogPrice : catPrice;
    const setPrice = isDog ? setDogPrice : setCatPrice;
    const currentServices = isDog ? dogServices : catServices;
    const setServices = isDog ? setDogServices : setCatServices;

    return (
      <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Top Header Card */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-petoo-primary/20 rounded-xl flex items-center justify-center text-petoo-textDark shrink-0">
            <Home size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-petoo-textDark leading-tight">
              {isDog ? 'Dog' : 'Cat'} Boarding
            </h2>
            <div className="flex items-center text-gray-500 text-[13px] font-medium mt-0.5">
              <span>Set your standard price per night</span>
              <Info size={14} className="ml-1 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Standard Price Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-[13px] font-medium mb-1">Standard Price (per night)</p>
              <div className="flex items-center text-petoo-textDark">
                <span className="text-3xl font-extrabold mr-1">₹</span>
                {isEditingPrice ? (
                  <input 
                    type="number"
                    value={currentPrice}
                    onChange={(e) => setPrice(e.target.value)}
                    className="text-4xl font-extrabold bg-gray-50 rounded-lg outline-none w-32 px-2 py-1 border-2 border-petoo-primary focus:border-petoo-primary transition-colors"
                    autoFocus
                  />
                ) : (
                  <span className="text-4xl font-extrabold">{currentPrice}</span>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsEditingPrice(!isEditingPrice)}
              className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center text-petoo-textDark transition-colors"
            >
              {isEditingPrice ? <Check size={20} /> : <Edit2 size={20} />}
            </button>
          </div>

          <div className="bg-orange-50/50 rounded-xl p-3 flex items-start space-x-2.5">
            <Info size={16} className="text-orange-600 mt-0.5 shrink-0" />
            <p className="text-orange-800 text-[12px] font-medium leading-snug">
              This price will be shown to all customers automatically until you change it.
            </p>
          </div>
        </div>

        {/* What's included */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-petoo-textDark font-extrabold text-[16px]">What's included in this stay?</h3>
          </div>
          <div className="flex flex-col space-y-3">
            {[
              'Safe & comfortable stay',
              'Regular meals',
              'Daily updates with photos'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-petoo-primary flex items-center justify-center shrink-0">
                  <Check size={14} className="text-petoo-textDark" strokeWidth={3} />
                </div>
                <span className="text-gray-600 font-medium text-[14px]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-start space-x-3 mb-5">
            <div className="mt-0.5 text-petoo-textDark">
              <PawPrint size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-petoo-textDark font-extrabold text-[16px]">Additional Services (Optional)</h3>
              <p className="text-gray-500 text-[12px] font-medium">You can set extra services and prices</p>
            </div>
          </div>

          <div className="flex flex-col space-y-5">
            {Object.entries(currentServices).map(([key, service]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-gray-700 font-bold text-[14px] capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()} (per {key === 'pickupDrop' ? 'trip' : 'session'})
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-petoo-textDark font-extrabold text-[15px]">
                    <span className="mr-1">₹</span>
                    {service.enabled ? (
                      <input 
                        type="number"
                        value={service.price}
                        onChange={(e) => setServices({ ...currentServices, [key]: { ...service, price: e.target.value } })}
                        className="w-14 bg-gray-50 rounded text-center outline-none border border-gray-200"
                      />
                    ) : (
                      <span>{service.price}</span>
                    )}
                  </div>
                  {/* Toggle */}
                  <button 
                    onClick={() => setServices({ ...currentServices, [key]: { ...service, enabled: !service.enabled } })}
                    className={`w-11 h-6 rounded-full relative transition-colors ${service.enabled ? 'bg-petoo-primary' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${service.enabled ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <CaretakerLayout>
      <div className="w-full flex flex-col bg-[#FAFAFA] min-h-screen font-quicksand pb-40 text-petoo-textDark">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-[#FAFAFA]/95 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center -ml-2 text-petoo-textDark hover:bg-black/5 rounded-full transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-xl font-extrabold tracking-tight">Set Boarding Price</h1>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="text-petoo-textDark font-extrabold text-[16px] px-2 active:opacity-70 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-petoo-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex-1 px-5 lg:px-12 pt-6 w-full flex flex-col max-w-2xl mx-auto">
            {/* Tabs */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setActiveTab('dog')}
                className={`flex-1 py-3 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'dog' ? 'bg-petoo-primary text-petoo-textDark shadow-lg shadow-petoo-primary/20 scale-105' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
              >
                Dog Boarding
              </button>
              <button
                onClick={() => setActiveTab('cat')}
                className={`flex-1 py-3 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'cat' ? 'bg-petoo-primary text-petoo-textDark shadow-lg shadow-petoo-primary/20 scale-105' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
              >
                Cat Boarding
              </button>
            </div>

            {renderContent()}
          </div>
        )}
      </div>
    </CaretakerLayout>
  );
};
