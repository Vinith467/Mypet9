import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { MapPin, User, CheckCircle2, ChevronRight, ChevronLeft, CreditCard, Camera } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const CaretakerOnboardingScreen = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [experience, setExperience] = useState('');
  
  // Services & Pricing State
  const [services, setServices] = useState({
    atHome: { enabled: true, price: 500 },
    standard: { enabled: true, price: 300 },
    premium: { enabled: false, price: 600 },
    luxury: { enabled: false, price: 1000 },
  });

  // Payout Details
  const [upiId, setUpiId] = useState('');

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const toggleService = (key: keyof typeof services) => {
    setServices(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled }
    }));
  };

  const updatePrice = (key: keyof typeof services, value: string) => {
    setServices(prev => ({
      ...prev,
      [key]: { ...prev[key], price: Number(value) }
    }));
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        onboardingComplete: true,
        caretakerProfile: {
          bio,
          address,
          experience: Number(experience),
          services,
          payout: {
            upiId
          },
          status: 'active',
          rating: 5.0,
          totalReviews: 0,
        }
      });
      navigate('/caretaker/dashboard');
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6EE] flex flex-col pt-12 pb-24 px-6 lg:items-center lg:justify-center">
      
      {/* Top Navigation */}
      <div className="w-full max-w-xl flex items-center justify-between mb-8 lg:mb-12">
        {step > 1 ? (
          <button onClick={handleBack} className="p-2 bg-white rounded-full shadow-sm">
            <ChevronLeft size={24} className="text-[#1B2B48]" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        
        <div className="flex space-x-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-[#174F38]' : 'w-2 bg-gray-200'}`} 
            />
          ))}
        </div>
        
        <div className="w-10" />
      </div>

      <div className="w-full max-w-xl bg-white rounded-[32px] p-6 lg:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] relative overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Basic Profile */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-2">Build your profile</h2>
              <p className="text-gray-500 text-sm mb-8">Let pet parents know who you are.</p>

              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-[#FBF6EE] rounded-full border-2 border-dashed border-[#174F38]/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#174F38]/5 transition-colors">
                  <Camera size={24} className="text-[#174F38] mb-1" />
                  <span className="text-[10px] font-bold text-[#174F38]">Add Photo</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">About You (Bio)</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="E.g. I have 5 years of experience handling dogs and cats..."
                    className="w-full bg-[#FBF6EE]/50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#174F38]/20 transition-all min-h-[100px] resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Location Address</label>
                  <Input
                    leftIcon={<MapPin size={18} />}
                    placeholder="Full home address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Years of Experience</label>
                  <Input
                    leftIcon={<User size={18} />}
                    type="number"
                    placeholder="E.g. 2"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleNext} 
                className="mt-8 bg-[#174F38] hover:bg-[#113a29] shadow-lg shadow-[#174F38]/30"
                disabled={!bio || !address || !experience}
              >
                Next Step
              </Button>
            </motion.div>
          )}

          {/* STEP 2: Services & Pricing */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-2">Set your prices</h2>
              <p className="text-gray-500 text-sm mb-8">Select the services you offer and set a nightly rate.</p>

              <div className="space-y-4">
                {/* At Home Boarding */}
                <div className={`border-2 rounded-[24px] p-4 transition-all ${services.atHome.enabled ? 'border-[#174F38] bg-[#174F38]/5' : 'border-gray-100 bg-white'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => toggleService('atHome')} className={`w-6 h-6 rounded-full flex items-center justify-center ${services.atHome.enabled ? 'bg-[#174F38]' : 'bg-gray-200'}`}>
                        {services.atHome.enabled && <CheckCircle2 size={14} className="text-white" />}
                      </button>
                      <span className="font-bold text-[#1B2B48]">At-Home Boarding</span>
                    </div>
                  </div>
                  {services.atHome.enabled && (
                    <div className="flex items-center space-x-2 pl-9">
                      <span className="text-gray-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={services.atHome.price}
                        onChange={(e) => updatePrice('atHome', e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 w-24 text-sm font-bold focus:outline-none focus:border-[#174F38]"
                      />
                      <span className="text-gray-400 text-xs">/ night</span>
                    </div>
                  )}
                </div>

                {/* Standard Boarding */}
                <div className={`border-2 rounded-[24px] p-4 transition-all ${services.standard.enabled ? 'border-[#174F38] bg-[#174F38]/5' : 'border-gray-100 bg-white'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => toggleService('standard')} className={`w-6 h-6 rounded-full flex items-center justify-center ${services.standard.enabled ? 'bg-[#174F38]' : 'bg-gray-200'}`}>
                        {services.standard.enabled && <CheckCircle2 size={14} className="text-white" />}
                      </button>
                      <span className="font-bold text-[#1B2B48]">Standard Boarding</span>
                    </div>
                  </div>
                  {services.standard.enabled && (
                    <div className="flex items-center space-x-2 pl-9">
                      <span className="text-gray-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={services.standard.price}
                        onChange={(e) => updatePrice('standard', e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 w-24 text-sm font-bold focus:outline-none focus:border-[#174F38]"
                      />
                      <span className="text-gray-400 text-xs">/ night</span>
                    </div>
                  )}
                </div>

                {/* Premium Boarding */}
                <div className={`border-2 rounded-[24px] p-4 transition-all ${services.premium.enabled ? 'border-[#174F38] bg-[#174F38]/5' : 'border-gray-100 bg-white'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => toggleService('premium')} className={`w-6 h-6 rounded-full flex items-center justify-center ${services.premium.enabled ? 'bg-[#174F38]' : 'bg-gray-200'}`}>
                        {services.premium.enabled && <CheckCircle2 size={14} className="text-white" />}
                      </button>
                      <span className="font-bold text-[#1B2B48]">Premium Boarding</span>
                    </div>
                  </div>
                  {services.premium.enabled && (
                    <div className="flex items-center space-x-2 pl-9">
                      <span className="text-gray-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={services.premium.price}
                        onChange={(e) => updatePrice('premium', e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 w-24 text-sm font-bold focus:outline-none focus:border-[#174F38]"
                      />
                      <span className="text-gray-400 text-xs">/ night</span>
                    </div>
                  )}
                </div>

                {/* Luxury Boarding */}
                <div className={`border-2 rounded-[24px] p-4 transition-all ${services.luxury.enabled ? 'border-[#174F38] bg-[#174F38]/5' : 'border-gray-100 bg-white'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => toggleService('luxury')} className={`w-6 h-6 rounded-full flex items-center justify-center ${services.luxury.enabled ? 'bg-[#174F38]' : 'bg-gray-200'}`}>
                        {services.luxury.enabled && <CheckCircle2 size={14} className="text-white" />}
                      </button>
                      <span className="font-bold text-[#1B2B48]">Luxury Boarding</span>
                    </div>
                  </div>
                  {services.luxury.enabled && (
                    <div className="flex items-center space-x-2 pl-9">
                      <span className="text-gray-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={services.luxury.price}
                        onChange={(e) => updatePrice('luxury', e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 w-24 text-sm font-bold focus:outline-none focus:border-[#174F38]"
                      />
                      <span className="text-gray-400 text-xs">/ night</span>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleNext} 
                className="mt-8 bg-[#174F38] hover:bg-[#113a29] shadow-lg shadow-[#174F38]/30"
              >
                Next Step
              </Button>
            </motion.div>
          )}

          {/* STEP 3: Payout */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-2">How you get paid</h2>
              <p className="text-gray-500 text-sm mb-8">Enter your UPI ID so we can securely transfer your earnings.</p>

              <div className="bg-[#174F38]/5 border border-[#174F38]/20 rounded-2xl p-4 mb-6 flex items-start space-x-3">
                <CreditCard className="text-[#174F38] mt-0.5" size={20} />
                <p className="text-sm text-[#1B2B48] font-medium leading-relaxed">
                  Payments are automatically settled to your UPI ID 24 hours after a boarding is successfully completed.
                </p>
              </div>

              <div className="space-y-1 mb-8">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">UPI ID</label>
                <Input
                  leftIcon={<CreditCard size={18} />}
                  placeholder="e.g. 9876543210@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleFinish} 
                className="mt-4 bg-[#174F38] hover:bg-[#113a29] shadow-lg shadow-[#174F38]/30"
                disabled={loading || !upiId}
              >
                Complete Profile
              </Button>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    </div>
  );
};
