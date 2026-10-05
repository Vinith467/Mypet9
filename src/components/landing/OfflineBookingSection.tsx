import { useState } from 'react';
import { 
  User, Phone, Mail, MapPin, PawPrint, Calendar, ChevronDown, 
  CheckCircle2, Circle, FileText, Plus, Minus, Info, Loader2, CheckCircle,
  Navigation, Home, Building
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

const DOG_BREEDS = ['Golden Retriever', 'Labrador Retriever', 'Husky', 'German Shepherd', 'Beagle', 'Poodle', 'Bulldog', 'Pug', 'Rottweiler', 'Indie', 'Other'];
const CAT_BREEDS = ['Persian', 'Maine Coon', 'Siamese', 'British Shorthair', 'Bengal', 'Sphynx', 'Indie', 'Other'];

export const OfflineBookingSection = () => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  
  // Advanced Location State
  const [location, setLocation] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [breedSelect, setBreedSelect] = useState('');
  const [customBreed, setCustomBreed] = useState('');
  const [petCount, setPetCount] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  
  const [petAge, setPetAge] = useState('');
  const [petGender, setPetGender] = useState('');
  const [vaccination, setVaccination] = useState('');
  const [medical, setMedical] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const [services, setServices] = useState({
    pickup: false,
    grooming: false,
    training: false,
    vaccination: false,
    none: false
  });

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const currentBreeds = petType === 'Dog' ? DOG_BREEDS : petType === 'Cat' ? CAT_BREEDS : [];

  const handleServiceToggle = (key: keyof typeof services) => {
    if (key === 'none') {
      setServices({ pickup: false, grooming: false, training: false, vaccination: false, none: true });
    } else {
      setServices(prev => ({ ...prev, [key]: !prev[key], none: false }));
    }
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
            const data = await response.json();
            if (data && data.display_name) {
              setLocation(data.display_name);
            } else {
              setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
            }
          } catch (err) {
            setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get your location. Please check browser permissions.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !mobileNumber || !location || !petName || !petType || !checkInDate || !checkOutDate) {
      setError('Please fill in all mandatory fields (*)');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    const finalBreed = (breedSelect === 'Other' || !currentBreeds.length) ? customBreed : breedSelect;
    
    try {
      await addDoc(collection(db, 'offline_bookings'), {
        ownerDetails: {
          fullName,
          mobileNumber,
          emailAddress,
          location,
          flatNumber,
          landmark
        },
        stayDetails: {
          checkInDate,
          checkOutDate,
          preferredLocation
        },
        petDetails: {
          petName,
          petType,
          breed: finalBreed,
          petCount,
          petAge,
          petGender,
          vaccination,
          medicalCondition: medical,
          specialInstructions
        },
        additionalServices: services,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setIsSuccess(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="w-full relative py-20 bg-[#F4F9F9] flex flex-col items-center justify-center border-t border-gray-100">
        <CheckCircle className="w-20 h-20 text-[#007672] mb-6" />
        <h2 className="text-3xl font-extrabold text-[#0B2533] mb-3">Request Received!</h2>
        <p className="text-gray-500 font-medium text-center max-w-md px-4">
          Thank you for reaching out. Our team will review your request and contact you shortly to confirm availability and pricing.
        </p>
        <button onClick={() => window.location.reload()} className="mt-8 bg-[#007672] text-white px-8 py-3 rounded-full font-bold hover:bg-[#00605c]">
          Submit Another Request
        </button>
      </section>
    );
  }

  return (
    <section className="w-full relative">
      <div className="absolute top-10 left-10 text-[#007672] opacity-30 transform -rotate-12 hidden md:block z-0 pointer-events-none">
         <PawPrint size={40} fill="currentColor" strokeWidth={0} />
      </div>

      <div className="bg-white overflow-hidden relative border-t border-gray-100 z-10 w-full">
        <div className="relative w-full min-h-[400px] hidden md:flex flex-col md:flex-row bg-[#F4F9F9]">
          <div className="w-full md:w-[45%] relative z-20 pt-10 md:pt-16 pb-8 px-6 md:px-12 flex flex-col justify-center bg-gradient-to-r from-white via-white to-transparent">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#007672] text-3xl font-black">🐾</span>
              <span className="text-[#007672] text-2xl font-black tracking-tight">MyPet9</span>
            </div>
            
            <h2 className="text-[42px] leading-[1.1] font-extrabold text-[#0B2533] mb-6 font-serif">
              Book a Homestay<br/>for Your Pet <span className="text-[#007672] opacity-80">♡</span>
            </h2>
            
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                 <div className="w-12 h-12 border-2 border-red-500 rounded-full flex items-center justify-center relative">
                   <div className="w-[2px] h-[140%] bg-red-500 absolute transform rotate-45"></div>
                   <div className="w-6 h-8 border-[1.5px] border-[#0B2533] rounded-md relative bg-white z-10 flex flex-col">
                     <div className="flex-1"></div>
                     <div className="h-2 w-full border-t-[1.5px] border-[#0B2533] flex items-center justify-center">
                       <div className="w-1.5 h-1.5 bg-[#0B2533] rounded-full"></div>
                     </div>
                   </div>
                 </div>
              </div>
              <div>
                <p className="text-[17px] font-bold text-[#007672] leading-tight mb-2">
                  If you don't want to use the app,<br/>
                  <span className="text-[#007672] font-black">just fill this form and we will reach out to you.</span>
                </p>
                <p className="text-[13px] text-gray-500 font-medium">
                  Our team will contact you to confirm availability, pricing and homestay details.
                </p>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-full md:w-[70%] h-full z-10 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-[#F4F9F9] via-transparent to-transparent z-10"></div>
             <img src="/next-section.png" alt="Happy pets" className="w-full h-full object-cover object-right" />
          </div>
        </div>

        <div className="bg-white py-6 md:py-8 px-4 md:px-6 border-b border-gray-100 flex items-start md:items-center justify-between md:justify-center gap-2 md:gap-4 relative z-20 max-w-full overflow-hidden">
           <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-2 w-[30%] md:w-auto text-center md:text-left">
             <div className="w-7 h-7 shrink-0 rounded-full bg-[#007672] text-white flex items-center justify-center font-bold text-sm">1</div>
             <span className="font-bold text-[#007672] text-[10px] md:text-sm leading-tight">Your Details</span>
           </div>
           <div className="w-8 md:w-16 h-[2px] bg-[#007672] shrink-0 mt-3.5 md:mt-0"></div>
           <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-2 w-[30%] md:w-auto text-center md:text-left">
             <div className="w-7 h-7 shrink-0 rounded-full bg-[#007672] text-white flex items-center justify-center font-bold text-sm">2</div>
             <span className="font-bold text-[#0B2533] text-[10px] md:text-sm leading-tight">Pet & Boarding Details</span>
           </div>
           <div className="w-8 md:w-16 h-[2px] bg-gray-300 shrink-0 mt-3.5 md:mt-0"></div>
           <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-2 w-[30%] md:w-auto text-center md:text-left opacity-50">
             <div className="w-7 h-7 shrink-0 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-sm">3</div>
             <span className="font-bold text-gray-500 text-[10px] md:text-sm leading-tight">Review & Submit</span>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 md:p-8 bg-white relative z-20">
          <div className="lg:col-span-4 bg-[#F2FAF9] rounded-[24px] p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#007672] text-white flex items-center justify-center font-bold text-xl shrink-0">1</div>
              <div>
                <h3 className="font-extrabold text-[#0B2533] text-lg leading-tight">Your Details</h3>
                <p className="text-xs text-gray-500 mt-1">Tell us about yourself. Our team will contact you to arrange the stay.</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-[13px] font-bold text-[#0B2533] mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#007672] w-4 h-4" />
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your name" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672]" />
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-[#0B2533] mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#007672] w-4 h-4" />
                  <input type="tel" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} placeholder="+91 98765 43210" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672]" />
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-[#0B2533] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#007672] w-4 h-4" />
                  <input type="email" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} placeholder="Enter your email" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672]" />
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <label className="block text-[13px] font-bold text-[#0B2533]">Location Details <span className="text-red-500">*</span></label>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#007672] w-4 h-4" />
                  <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter your city or area" className="w-full pl-9 pr-[85px] py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672]" />
                  <button onClick={handleLocateMe} type="button" className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-[#E5F5F4] text-[#007672] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-[#d0edeb] transition-colors">
                    {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                    Locate
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" value={flatNumber} onChange={e => setFlatNumber(e.target.value)} placeholder="House / Flat No." className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672]" />
                  </div>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="Landmark" className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672]" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="lg:col-span-8 bg-[#F9FDFD] border border-[#E5F5F4] rounded-[24px] p-6 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 opacity-10 text-[#007672] pointer-events-none transform -rotate-12">
              <PawPrint size={150} fill="currentColor" strokeWidth={0} />
            </div>

            <div className="flex items-start gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#007672] text-white flex items-center justify-center font-bold text-xl shrink-0">2</div>
              <div>
                <h3 className="font-extrabold text-[#0B2533] text-lg leading-tight">Pet & Boarding Details</h3>
                <p className="text-xs text-gray-500 mt-1">Tell us about your pet and stay requirements.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 relative z-10">
              <div>
                <label className="block text-[13px] font-bold text-[#0B2533] mb-1.5">Pet Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <PawPrint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#007672] w-4 h-4" />
                  <input type="text" value={petName} onChange={e => setPetName(e.target.value)} placeholder="Enter your pet's name" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672]" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#0B2533] mb-1.5">Pet Type <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <button onClick={() => { setPetType('Dog'); setBreedSelect(''); setCustomBreed(''); }} className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${petType === 'Dog' ? 'border-[#007672] bg-[#E5F5F4]' : 'border-gray-100 bg-white hover:border-[#007672]/30'}`}>
                    <img src="/husky_avatar.jpg" alt="Dog" className="w-9 h-9 rounded-full object-cover mb-1 border border-gray-200" />
                    <span className={`text-[11px] font-bold ${petType === 'Dog' ? 'text-[#007672]' : 'text-gray-500'}`}>Dog</span>
                  </button>
                  <button onClick={() => { setPetType('Cat'); setBreedSelect(''); setCustomBreed(''); }} className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${petType === 'Cat' ? 'border-[#007672] bg-[#E5F5F4]' : 'border-gray-100 bg-white hover:border-[#007672]/30'}`}>
                    <img src="/persian_cat_avatar.jpg" alt="Cat" className="w-9 h-9 rounded-full object-cover mb-1 border border-gray-200" />
                    <span className={`text-[11px] font-bold ${petType === 'Cat' ? 'text-[#007672]' : 'text-gray-500'}`}>Cat</span>
                  </button>
                  <button onClick={() => { setPetType('Other'); setBreedSelect(''); setCustomBreed(''); }} className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${petType === 'Other' ? 'border-[#007672] bg-[#E5F5F4]' : 'border-gray-100 bg-white hover:border-[#007672]/30'}`}>
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mb-1 border border-gray-200">
                      <PawPrint className="text-gray-400 w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-bold ${petType === 'Other' ? 'text-[#007672]' : 'text-gray-500'}`}>Other</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-[13px] font-bold text-[#0B2533]">Breed</label>
                {petType !== 'Other' ? (
                  <div className="relative">
                    <select value={breedSelect} onChange={e => setBreedSelect(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672] appearance-none cursor-pointer text-gray-700">
                      <option value="">Select breed</option>
                      {currentBreeds.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                ) : null}
                
                {(breedSelect === 'Other' || petType === 'Other') && (
                  <div className="relative animate-fade-in mt-1">
                    <input type="text" value={customBreed} onChange={e => setCustomBreed(e.target.value)} placeholder="Enter breed" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672]" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6 relative z-10">
              <div>
                <label className="block text-[13px] font-bold text-[#0B2533] mb-1.5">Number of Pets <span className="text-red-500">*</span></label>
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl h-[42px] px-3">
                  <button onClick={() => setPetCount(p => Math.max(1, p - 1))} className="w-6 h-6 rounded bg-[#E5F5F4] text-[#007672] flex items-center justify-center hover:bg-[#d0edeb]">
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <span className="font-extrabold text-[#0B2533]">{petCount}</span>
                  <button onClick={() => setPetCount(p => p + 1)} className="w-6 h-6 rounded bg-[#E5F5F4] text-[#007672] flex items-center justify-center hover:bg-[#d0edeb]">
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#0B2533] mb-1.5">Check-in Date <span className="text-red-500">*</span></label>
                <div className="relative" onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input && 'showPicker' in input) {
                    try { input.showPicker(); } catch (err) {}
                  }
                }}>
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#007672] w-4 h-4 pointer-events-none" />
                  <input type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-500 font-medium outline-none focus:border-[#007672] cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#0B2533] mb-1.5">Check-out Date <span className="text-red-500">*</span></label>
                <div className="relative" onClick={(e) => {
                  const input = e.currentTarget.querySelector('input');
                  if (input && 'showPicker' in input) {
                    try { input.showPicker(); } catch (err) {}
                  }
                }}>
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#007672] w-4 h-4 pointer-events-none" />
                  <input type="date" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] text-gray-500 font-medium outline-none focus:border-[#007672] cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#0B2533] mb-1.5">Preferred Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#007672] w-4 h-4" />
                  <input type="text" value={preferredLocation} onChange={e => setPreferredLocation(e.target.value)} placeholder="Enter area" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672]" />
                </div>
              </div>
            </div>

            <div className="bg-[#E5F5F4]/40 border border-[#E5F5F4] rounded-2xl p-5 relative z-10 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <PawPrint className="text-[#007672] w-4 h-4" strokeWidth={2.5} />
                <h4 className="font-extrabold text-[#0B2533] text-[15px]">Pet Care Information</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5">
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-[#0B2533] mb-1.5">Pet Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <select value={petAge} onChange={e => setPetAge(e.target.value)} className="w-full pl-8 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium outline-none focus:border-[#007672] appearance-none cursor-pointer text-gray-600">
                      <option value="">Select age</option>
                      <option value="Puppy">Puppy (0-1 yr)</option>
                      <option value="Adult">Adult (1-7 yrs)</option>
                      <option value="Senior">Senior (7+ yrs)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-[#0B2533] mb-1.5">Pet Gender</label>
                  <div className="flex gap-4 min-h-[34px] items-center">
                    <label className="flex items-center gap-1.5 cursor-pointer group" onClick={() => setPetGender('Male')}>
                      <div className={petGender === 'Male' ? 'text-[#007672]' : 'text-gray-300'}>
                        {petGender === 'Male' ? <CheckCircle2 size={14} strokeWidth={2.5} /> : <Circle size={14} strokeWidth={2.5} />}
                      </div>
                      <span className={`text-xs font-bold ${petGender === 'Male' ? 'text-[#0B2533]' : 'text-gray-500'}`}>Male</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer group" onClick={() => setPetGender('Female')}>
                      <div className={petGender === 'Female' ? 'text-[#007672]' : 'text-gray-300'}>
                        {petGender === 'Female' ? <CheckCircle2 size={14} strokeWidth={2.5} /> : <Circle size={14} strokeWidth={2.5} />}
                      </div>
                      <span className={`text-xs font-bold ${petGender === 'Female' ? 'text-[#0B2533]' : 'text-gray-500'}`}>Female</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-6">
                  <label className="block text-xs font-bold text-[#0B2533] mb-1.5">Vaccination Status</label>
                  <div className="flex flex-wrap gap-4 min-h-[34px] items-center">
                    {['Fully Vaccinated', 'Partially Vaccinated', 'Not Vaccinated'].map(status => (
                      <label key={status} className="flex items-center gap-1.5 cursor-pointer group" onClick={() => setVaccination(status)}>
                        <div className={vaccination === status ? 'text-[#007672]' : 'text-gray-300'}>
                          {vaccination === status ? <CheckCircle2 size={14} strokeWidth={2.5} /> : <Circle size={14} strokeWidth={2.5} />}
                        </div>
                        <span className={`text-xs font-bold ${vaccination === status ? 'text-[#0B2533]' : 'text-gray-500'}`}>{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-[#0B2533] mb-1.5">Any Medical Conditions / Allergies?</label>
                  <div className="flex gap-4 min-h-[34px] items-center">
                    {['Yes', 'No'].map(status => (
                      <label key={status} className="flex items-center gap-1.5 cursor-pointer group" onClick={() => setMedical(status)}>
                        <div className={medical === status ? 'text-[#007672]' : 'text-gray-300'}>
                          {medical === status ? <CheckCircle2 size={14} strokeWidth={2.5} /> : <Circle size={14} strokeWidth={2.5} />}
                        </div>
                        <span className={`text-xs font-bold ${medical === status ? 'text-[#0B2533]' : 'text-gray-500'}`}>{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-8">
                  <label className="block text-xs font-bold text-[#0B2533] mb-1.5">Special Care Instructions</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2.5 text-gray-400 w-3.5 h-3.5" />
                    <textarea 
                      value={specialInstructions}
                      onChange={e => setSpecialInstructions(e.target.value)}
                      placeholder="Tell us anything important about your pet..." 
                      className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium outline-none focus:border-[#007672] h-[52px] resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Info className="text-[#007672] w-4 h-4" strokeWidth={2.5} />
                <h4 className="font-extrabold text-[#0B2533] text-[15px]">Additional Services</h4>
              </div>
              <p className="text-xs text-gray-500 mb-3">Would you like any additional services?</p>
              
              <div className="flex flex-wrap gap-4">
                {[
                  { key: 'pickup', label: 'Pickup & Drop', icon: '🚙' },
                  { key: 'grooming', label: 'Grooming', icon: '✂️' },
                  { key: 'training', label: 'Basic Training', icon: '🎓' },
                  { key: 'vaccination', label: 'Vaccination', icon: '💉' },
                  { key: 'none', label: 'None', icon: '🚫' }
                ].map(service => (
                  <label key={service.key} className="flex items-center gap-2 cursor-pointer group" onClick={(e) => { e.preventDefault(); handleServiceToggle(service.key as any); }}>
                    <div className={`w-4 h-4 rounded-sm border ${services[service.key as keyof typeof services] ? 'bg-[#007672] border-[#007672]' : 'bg-white border-gray-300'} flex items-center justify-center transition-colors`}>
                      {services[service.key as keyof typeof services] && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className="text-xs font-bold text-[#0B2533] flex items-center gap-1.5">
                      <span>{service.icon}</span> {service.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-white pb-10 pt-4 px-6 flex flex-col items-center justify-center relative z-20 overflow-hidden">
          {error && (
            <div className="mb-4 text-red-500 font-medium text-sm text-center relative z-30">
              {error}
            </div>
          )}

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#007672] text-white px-12 py-3.5 rounded-full font-extrabold text-[17px] shadow-lg shadow-[#007672]/30 hover:bg-[#00605c] disabled:opacity-70 transition-colors flex items-center gap-3 relative z-30"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Request a Homestay
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </>
            )}
          </button>
          
          <p className="text-xs text-gray-500 font-medium mt-4 relative z-30 text-center max-w-full">
            Our team will contact you shortly to confirm availability, pricing and homestay details.
          </p>

          <div className="absolute left-[20%] lg:left-[30%] bottom-16 text-[#007672] opacity-80 transform -rotate-12 z-0">
            <PawPrint size={20} fill="currentColor" />
          </div>
          <div className="absolute right-[20%] lg:right-[30%] bottom-10 text-[#E5F5F4] transform rotate-12 z-0">
            <PawPrint size={28} fill="currentColor" />
          </div>
          <div className="absolute right-[15%] lg:right-[26%] bottom-16 text-[#E5F5F4] transform rotate-45 z-0">
            <PawPrint size={18} fill="currentColor" />
          </div>
        </div>
      </div>
    </section>
  );
};
