import { useState } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import confetti from 'canvas-confetti';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Briefcase, CheckCircle2, Search, PawPrint, Check, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CaretakerApplicationForm = () => {
  const [view, setView] = useState<'apply' | 'status'>('apply');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Status Check State
  const [statusPhone, setStatusPhone] = useState('');
  const [applicationStatus, setApplicationStatus] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [accountCreating, setAccountCreating] = useState(false);

  // Application Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    maxPets: '',
    services: {
      atHome: { enabled: false, price: '' },
      standard: { enabled: false, price: '' },
      premium: { enabled: false, price: '' },
      luxury: { enabled: false, price: '' },
    },
    acceptedPets: {
      dogs: false,
      cats: false,
      birds: false,
    }
  });

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleService = (key: keyof typeof formData.services) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: { ...prev.services[key], enabled: !prev.services[key].enabled }
      }
    }));
  };

  const updateServicePrice = (key: keyof typeof formData.services, price: string) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: { ...prev.services[key], price }
      }
    }));
  };

  const togglePet = (key: keyof typeof formData.acceptedPets) => {
    setFormData(prev => ({
      ...prev,
      acceptedPets: {
        ...prev.acceptedPets,
        [key]: !prev.acceptedPets[key]
      }
    }));
  };

  const handleSubmit = async () => {
    setError('');
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      setError("Please fill in all basic details.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'caretaker_applications'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    setError('');
    setApplicationStatus(null);
    if (!statusPhone) {
      setError("Please enter your phone number.");
      return;
    }
    
    setLoading(true);
    try {
      const q = query(collection(db, 'caretaker_applications'), where("phone", "==", statusPhone));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError("No application found with this phone number.");
      } else {
        // Get the most recent application
        const docData = querySnapshot.docs[0].data();
        const docId = querySnapshot.docs[0].id;
        
        if (docData.status === 'approved' && !docData.accountCreated) {
          triggerConfetti();
        }
        
        setApplicationStatus({ id: docId, ...docData });
      }
    } catch (err: any) {
      setError("Failed to fetch status.");
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#174F38', '#ffeb3b', '#4caf50']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#174F38', '#ffeb3b', '#4caf50']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const createAccount = async () => {
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setAccountCreating(true);
    setError('');

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, applicationStatus.email, password);
      const user = userCredential.user;

      // 2. Create users collection document
      await setDoc(doc(db, 'users', user.uid), {
        email: applicationStatus.email,
        fullName: applicationStatus.fullName,
        phone: applicationStatus.phone,
        address: applicationStatus.address,
        type: 'caretaker',
        createdAt: serverTimestamp(),
        caretakerDetails: {
          experience: applicationStatus.experience,
          maxPets: applicationStatus.maxPets,
          acceptedPets: applicationStatus.acceptedPets,
          services: applicationStatus.services
        }
      });

      // 3. Update application document to prevent re-creation
      await updateDoc(doc(db, 'caretaker_applications', applicationStatus.id), {
        accountCreated: true
      });

      // User is now logged in automatically by Firebase Auth
      // The auth listener in App.tsx will route them to their dashboard
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create account.");
    } finally {
      setAccountCreating(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-3">Application Received! 🐾</h2>
          <p className="text-gray-600 text-sm leading-relaxed px-4">
            Thank you for your interest in joining Mypet9! To ensure the highest safety standards, our vetting team will visit your home within the next 48 hours for a physical cross-verification.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed px-4 mt-4 font-bold">
            We will contact you at {formData.phone} to schedule the visit.
          </p>
        </div>
        <Button onClick={() => setView('status')} className="mt-4">Check Status Later</Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col mt-2">
      {/* Tabs */}
      <div className="flex max-w-sm mx-auto w-full bg-white rounded-full p-1 border border-gray-200 shadow-sm mb-6 relative">
        <div 
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#174F38] rounded-full transition-all duration-300 ease-out shadow-sm"
          style={{ left: view === 'apply' ? '4px' : 'calc(50%)' }}
        />
        <button 
          className={`flex-1 py-2 text-[13px] font-extrabold tracking-wide z-10 transition-colors duration-300 rounded-full ${view === 'apply' ? 'text-white' : 'text-gray-500 hover:text-[#1B2B48]'}`}
          onClick={() => setView('apply')}
        >
          Apply Now
        </button>
        <button 
          className={`flex-1 py-2 text-[13px] font-extrabold tracking-wide z-10 transition-colors duration-300 rounded-full ${view === 'status' ? 'text-white' : 'text-gray-500 hover:text-[#1B2B48]'}`}
          onClick={() => setView('status')}
        >
          Check Status
        </button>
      </div>

      {error && (
        <div className="w-full bg-red-50 text-red-600 text-[13px] font-bold p-3 rounded-xl mb-4 border border-red-100">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === 'status' ? (
          <motion.div
            key="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col space-y-5 max-w-md mx-auto w-full py-8"
          >
            <p className="text-sm text-gray-500 font-medium mb-2 text-center">
              Enter your phone number to check the status of your physical verification.
            </p>
            <Input 
              placeholder="Phone Number (+91)" 
              value={statusPhone}
              onChange={(e) => setStatusPhone(e.target.value)}
              leftIcon={<Search size={18} />}
              className="h-12 text-[15px] shadow-sm"
            />
            <Button onClick={checkStatus} disabled={loading} className="w-full h-12 text-[15px] font-extrabold tracking-wide rounded-xl bg-[#174F38] hover:bg-[#113a29] shadow-lg shadow-[#174F38]/20 transition-all hover:-translate-y-0.5">
              {loading ? 'Please wait...' : 'Check Status'}
            </Button>

            {applicationStatus && (
              <div className="mt-6 p-6 rounded-2xl border-2 flex flex-col items-center text-center transition-all">
                {applicationStatus.status === 'pending' && (
                  <>
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">⏳</span>
                    </div>
                    <h3 className="font-extrabold text-lg text-[#1B2B48] mb-2">Pending Verification</h3>
                    <p className="text-sm text-gray-500">We are reviewing your application and will visit you shortly.</p>
                  </>
                )}
                {applicationStatus.status === 'rejected' && (
                  <>
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">❌</span>
                    </div>
                    <h3 className="font-extrabold text-lg text-red-600 mb-2">Application Unsuccessful</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Unfortunately, your home did not meet our current safety requirements during the physical verification. Ensuring a safe environment for pets is our top priority.
                    </p>
                    <Button variant="outline" onClick={() => { setView('apply'); setApplicationStatus(null); }}>
                      Re-Apply Application
                    </Button>
                  </>
                )}
                {applicationStatus.status === 'approved' && !applicationStatus.accountCreated && (
                  <div className="w-full">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <PartyPopper size={36} className="text-green-600" />
                    </div>
                    <h3 className="font-extrabold text-[22px] text-[#1B2B48] mb-2">Congratulations! 🎉</h3>
                    <p className="text-sm text-gray-500 mb-6 font-medium px-4">
                      Your home passed our physical verification and you are officially approved to be a Mypet9 Caretaker! Please set a password to create your account.
                    </p>
                    
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold">
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-4 mb-6">
                      <div className="text-left">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Your Email</label>
                        <Input value={applicationStatus.email} disabled className="bg-gray-50 text-gray-500" />
                      </div>
                      <div className="text-left">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Set Password</label>
                        <Input 
                          type="password" 
                          placeholder="Create a strong password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full h-12 text-[15px] font-extrabold tracking-wide rounded-xl bg-[#174F38] shadow-lg shadow-[#174F38]/20"
                      onClick={createAccount}
                      disabled={accountCreating}
                    >
                      {accountCreating ? 'Setting up account...' : 'Create My Account'}
                    </Button>
                  </div>
                )}
                {applicationStatus.status === 'approved' && applicationStatus.accountCreated && (
                  <div className="w-full py-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} className="text-blue-600" />
                    </div>
                    <h3 className="font-extrabold text-lg text-[#1B2B48] mb-2">Account Ready</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Your account has already been set up. Please use the login button below.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="apply"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col space-y-6"
          >
            {/* Section 1: Personal Details */}
            <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-[#174F38]/10 p-1.5 rounded-lg text-[#174F38]"><User size={16} /></div>
                <h3 className="text-[14px] font-extrabold text-[#1B2B48]">Personal Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="Full Legal Name" className="h-11 text-[13px] bg-white border-transparent shadow-sm" value={formData.fullName} onChange={e => updateFormData('fullName', e.target.value)} />
                <Input placeholder="Email Address" type="email" className="h-11 text-[13px] bg-white border-transparent shadow-sm" value={formData.email} onChange={e => updateFormData('email', e.target.value)} />
                <Input placeholder="Phone Number" type="tel" className="h-11 text-[13px] bg-white border-transparent shadow-sm" value={formData.phone} onChange={e => updateFormData('phone', e.target.value)} />
                <Input placeholder="Full Home Address" className="h-11 text-[13px] bg-white border-transparent shadow-sm" value={formData.address} onChange={e => updateFormData('address', e.target.value)} />
              </div>
            </div>

            {/* Section 2: Capacity & Pets */}
            <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-[#174F38]/10 p-1.5 rounded-lg text-[#174F38]"><PawPrint size={16} /></div>
                <h3 className="text-[14px] font-extrabold text-[#1B2B48]">Experience & Capacity</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="space-y-1.5">
                  <span className="text-[12px] font-bold text-gray-500 px-1">Years of Experience</span>
                  <Input placeholder="e.g. 2" type="number" className="h-11 text-[13px] bg-white border-transparent shadow-sm" value={formData.experience} onChange={e => updateFormData('experience', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[12px] font-bold text-gray-500 px-1">Max Pets per Day</span>
                  <Input placeholder="e.g. 3" type="number" className="h-11 text-[13px] bg-white border-transparent shadow-sm" value={formData.maxPets} onChange={e => updateFormData('maxPets', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[12px] font-bold text-gray-500 px-1">Pets Accepted</span>
                  <div className="flex gap-2">
                    {[
                      { id: 'dogs', icon: '🐶', label: 'Dogs' },
                      { id: 'cats', icon: '🐱', label: 'Cats' },
                      { id: 'birds', icon: '🦜', label: 'Birds' }
                    ].map(pet => {
                      const isSelected = formData.acceptedPets[pet.id as keyof typeof formData.acceptedPets];
                      return (
                        <button 
                          key={pet.id}
                          onClick={() => togglePet(pet.id as keyof typeof formData.acceptedPets)}
                          className={`flex-1 h-11 flex items-center justify-center space-x-1.5 rounded-xl text-[13px] font-bold transition-all ${isSelected ? 'bg-[#174F38] text-white shadow-md shadow-[#174F38]/20' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#174F38]/50 hover:bg-gray-50'}`}
                        >
                          <span className="text-[14px]">{pet.icon}</span>
                          <span>{pet.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Services */}
            <div>
              <div className="flex items-center space-x-2 mb-3 px-1">
                <div className="bg-[#174F38]/10 p-1.5 rounded-lg text-[#174F38]"><Briefcase size={16} /></div>
                <h3 className="text-[14px] font-extrabold text-[#1B2B48]">Services & Pricing (per night)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries({
                  atHome: 'At-Home Boarding',
                  standard: 'Standard Boarding',
                  premium: 'Premium Boarding',
                  luxury: 'Luxury Boarding'
                }).map(([key, label]) => {
                  const isActive = formData.services[key as keyof typeof formData.services].enabled;
                  return (
                    <div 
                      key={key} 
                      onClick={() => toggleService(key as keyof typeof formData.services)}
                      className={`relative flex flex-col p-4 rounded-2xl border-2 transition-all cursor-pointer h-[104px] ${isActive ? 'border-[#174F38] bg-[#174F38]/5 shadow-md shadow-[#174F38]/10' : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`font-extrabold text-[13px] leading-tight pr-2 ${isActive ? 'text-[#174F38]' : 'text-[#1B2B48]'}`}>{label}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isActive ? 'border-[#174F38] bg-[#174F38]' : 'border-gray-200 bg-gray-50'}`}>
                          {isActive && <Check size={12} className="text-white" strokeWidth={4} />}
                        </div>
                      </div>
                      
                      {isActive && (
                        <div onClick={e => e.stopPropagation()} className="flex items-center space-x-1.5 mt-auto">
                          <span className="text-[#174F38] font-extrabold text-sm">₹</span>
                          <input 
                            type="number"
                            placeholder="Price"
                            value={formData.services[key as keyof typeof formData.services].price}
                            onChange={(e) => updateServicePrice(key as keyof typeof formData.services, e.target.value)}
                            className="w-full bg-white border border-[#174F38]/30 rounded-lg px-2 py-1 text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-[#174F38]/20 text-right text-[#174F38]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button className="w-full md:w-auto px-12 bg-[#174F38] hover:bg-[#113a29] shadow-lg shadow-[#174F38]/20 h-12 text-[15px] font-extrabold tracking-wide rounded-xl transition-all hover:-translate-y-0.5" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
