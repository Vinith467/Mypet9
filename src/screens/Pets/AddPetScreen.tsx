import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Camera, Check, X, PawPrint, ChevronDown, Calendar, Weight, HeartPulse } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { uploadImageToCloudinary } from '../../utils/cloudinary';
import mediumDogImg from '../../assets/images/medium_dog.jpg';
import largeDogImg from '../../assets/images/large_dog.jpg';

import { TopNavbar } from '../../components/layout/TopNavbar';

export const AddPetScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    customBreed: '',
    age: '',
    gender: '',
    weight: '',
    vaccinated: null as boolean | null,
    medicalConditions: null as boolean | null,
    medicalConditionDetails: '',
    behavior: '',
    specialInstructions: '',
    vaccinationMonth: '',
    vaccinationYear: ''
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (!formData.name) {
      setError('Please enter pet name');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      let downloadUrl = '';
      if (photoFile) {
        downloadUrl = await uploadImageToCloudinary(photoFile);
      }

      const finalBreed = formData.breed === 'Other' ? formData.customBreed : formData.breed;
      await addDoc(collection(db, 'users', user.uid, 'pets'), {
        ...formData,
        breed: finalBreed,
        type: formData.species || 'Dog',
        image: downloadUrl,
        createdAt: new Date().toISOString()
      });
      
      const returnTo = location.state?.returnTo || '/pets';
      navigate(returnTo, { 
        state: { 
          provider: location.state?.provider, 
          bookingData: location.state?.bookingData 
        },
        replace: true 
      });
    } catch (err) {
      console.error("Error adding pet: ", err);
      setError('Failed to add pet. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#F4F9F9] relative pb-8 font-sans">
      
      {/* Top Navbar */}
      <TopNavbar />

      <div className="mx-4 lg:mx-12 xl:mx-20 relative pb-12 mt-8 z-20">
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#E8F3F3] w-full overflow-hidden mx-auto max-w-[1400px]">
          
          {/* Card Header Banner (Now inside the card) */}
          <div className="relative w-full overflow-hidden bg-[#F0F9F9] border-b border-gray-100">
            <div className="w-full relative h-[160px] md:h-[200px] lg:h-[220px]">
              {/* Banner Image */}
              <img 
                src="/pet-application.png" 
                alt="Pet Application Banner" 
                className="absolute right-0 top-0 h-full w-full object-contain object-right pointer-events-none"
              />
              {/* Text Content */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4 lg:left-8 z-10 max-w-[70%] md:max-w-[50%] flex flex-col items-start justify-center">
                <button 
                  onClick={handleBack} 
                  className="flex items-center gap-2 text-[#007672] bg-white/60 backdrop-blur-md px-3.5 py-1.5 rounded-full mb-3 hover:bg-white hover:shadow-md transition-all shadow-sm border border-white/40"
                >
                  <ArrowLeft size={16} strokeWidth={2.5} />
                  <span className="font-bold text-[13px]">Back</span>
                </button>
                <h1 className="text-[28px] md:text-[38px] lg:text-[42px] font-extrabold text-[#003B39] leading-[1.1] mb-2 tracking-tight" style={{ fontFamily: 'serif' }}>
                  Tell us about<br />your pet
                </h1>
                <p className="text-[13px] md:text-[15px] font-medium text-[#465E87] max-w-[280px] md:max-w-[340px] leading-relaxed hidden sm:block">
                  We just need a few simple details to help us find the perfect care for your furry friend.
                </p>
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <div className="p-5 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 w-full items-start">
          
          {/* Pet Photo */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="col-span-2 md:col-span-1 xl:col-span-1 border border-dashed border-[#71b6af] bg-[#E8F3F3]/30 hover:bg-[#E8F3F3]/60 transition-colors rounded-[12px] p-3 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer h-full"
          >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
              
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm border border-[#71b6af]/50 shrink-0">
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <Camera size={18} className="text-[#007672]" />
                )}
              </div>
              
              <div>
                <h4 className="text-[12px] font-extrabold text-[#1B2B48]">Upload a photo</h4>
                <p className="text-[9px] font-medium text-[#465E87] leading-tight px-1 mt-0.5">JPG, PNG (Max 5 MB)</p>
              </div>
          </div>

          {/* 1. Pet Name */}
          <div className="col-span-1">
            <label className="block text-[13px] font-extrabold text-[#1B2B48] mb-2">1. Pet Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <PawPrint size={15} className="text-[#007672]" />
              </div>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="Enter your pet's name"
                className="w-full pl-10 pr-3 py-1.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-medium focus:border-[#71b6af] focus:ring-1 focus:ring-[#71b6af] outline-none shadow-sm"
              />
            </div>
          </div>

          {/* 2. Species */}
          <div className="col-span-1">
            <label className="block text-[13px] font-extrabold text-[#1B2B48] mb-2">2. Species <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <PawPrint size={15} className="text-[#007672]" />
              </div>
              <select 
                value={formData.species}
                onChange={(e) => updateForm('species', e.target.value)}
                className="w-full pl-10 pr-7 py-1.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-medium appearance-none focus:border-[#71b6af] focus:ring-1 focus:ring-[#71b6af] outline-none shadow-sm text-[#1B2B48]"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* 3. Breed */}
          <div className="col-span-1">
            <label className="block text-[13px] font-extrabold text-[#1B2B48] mb-2">3. Breed <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <PawPrint size={15} className="text-[#007672]" />
              </div>
              <input 
                type="text"
                value={formData.breed}
                onChange={(e) => updateForm('breed', e.target.value)}
                placeholder="e.g. Golden Retriever"
                className="w-full pl-10 pr-3 py-1.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-medium focus:border-[#71b6af] focus:ring-1 focus:ring-[#71b6af] outline-none shadow-sm"
              />
            </div>
          </div>

          {/* 4. Age */}
          <div className="col-span-1">
            <label className="block text-[13px] font-extrabold text-[#1B2B48] mb-2">4. Age <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Calendar size={15} className="text-[#007672]" />
              </div>
              <select 
                value={formData.age}
                onChange={(e) => updateForm('age', e.target.value)}
                className="w-full pl-10 pr-7 py-1.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-medium appearance-none focus:border-[#71b6af] focus:ring-1 focus:ring-[#71b6af] outline-none shadow-sm text-[#1B2B48]"
              >
                <option value="" disabled>Select age</option>
                <option value="Puppy (0-1 yrs)">Puppy (0-1 yrs)</option>
                <option value="Young (1-3 yrs)">Young (1-3 yrs)</option>
                <option value="Adult (3-8 yrs)">Adult (3-8 yrs)</option>
                <option value="Senior (8+ yrs)">Senior (8+ yrs)</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* 5. Gender */}
          <div className="col-span-1">
            <label className="block text-[13px] font-extrabold text-[#1B2B48] mb-2">5. Gender <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <button onClick={() => updateForm('gender', 'Male')} className={`flex-1 flex items-center justify-center py-1.5 rounded-[10px] border font-bold text-[13px] transition-colors shadow-sm ${formData.gender === 'Male' ? 'bg-[#F4F7FF] border-[#3B82F6] text-[#3B82F6]' : 'bg-white border-gray-200 text-[#465E87]'}`}>
                <span className="mr-1.5 text-sm leading-none mt-[-1px]">♂</span> Male
              </button>
              <button onClick={() => updateForm('gender', 'Female')} className={`flex-1 flex items-center justify-center py-1.5 rounded-[10px] border font-bold text-[13px] transition-colors shadow-sm ${formData.gender === 'Female' ? 'bg-[#FFF0F5] border-[#EC4899] text-[#EC4899]' : 'bg-white border-gray-200 text-[#465E87]'}`}>
                <span className="mr-1.5 text-sm leading-none mt-[-1px]">♀</span> Female
              </button>
            </div>
          </div>

          {/* 6. Weight */}
          <div className="col-span-1 relative">
            <label className="block text-[13px] font-extrabold text-[#1B2B48] mb-2">6. Weight (kg) <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Weight size={15} className="text-[#007672]" />
              </div>
              <input 
                type="number"
                value={formData.weight}
                onChange={(e) => updateForm('weight', e.target.value)}
                placeholder="Enter weight"
                className="w-full pl-10 pr-9 py-1.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-medium focus:border-[#71b6af] focus:ring-1 focus:ring-[#71b6af] outline-none shadow-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <span className="text-[13px] font-extrabold text-[#1B2B48]">kg</span>
              </div>
            </div>
          </div>

          {/* 7. Vaccinated */}
          <div className="col-span-1">
            <label className="block text-[13px] font-extrabold text-[#1B2B48] mb-2">7. Vaccinated? <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <label className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] border transition-colors cursor-pointer ${formData.vaccinated === true ? 'bg-[#FFF9EC] border-[#007672] shadow-sm' : 'bg-white border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="vaccinated"
                  checked={formData.vaccinated === true} 
                  onChange={() => updateForm('vaccinated', true)} 
                  className="hidden"
                />
                <Check size={12} className={formData.vaccinated === true ? 'text-[#10B981] stroke-[3]' : 'text-gray-300'} />
                <span className="text-[12px] font-bold text-[#1B2B48]">Yes</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] border transition-colors cursor-pointer ${formData.vaccinated === false ? 'bg-[#FFF0F5] border-[#EC4899] shadow-sm' : 'bg-white border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="vaccinated"
                  checked={formData.vaccinated === false} 
                  onChange={() => updateForm('vaccinated', false)} 
                  className="hidden"
                />
                <X size={12} className={formData.vaccinated === false ? 'text-[#EF4444] stroke-[3]' : 'text-gray-300'} />
                <span className="text-[12px] font-bold text-[#1B2B48]">No</span>
              </label>
            </div>
          </div>

          {/* 8. Medical */}
          <div className="col-span-1">
            <label className="block text-[13px] font-extrabold text-[#1B2B48] mb-2">8. Medical conditions? <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <label className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] border transition-colors cursor-pointer ${formData.medicalConditions === true ? 'bg-[#FFF9EC] border-[#007672] shadow-sm' : 'bg-white border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="medicalConditions"
                  checked={formData.medicalConditions === true} 
                  onChange={() => updateForm('medicalConditions', true)} 
                  className="hidden"
                />
                <HeartPulse size={14} className={formData.medicalConditions === true ? 'text-[#007672]' : 'text-gray-300'} />
                <span className="text-[12px] font-bold text-[#1B2B48]">Yes</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] border transition-colors cursor-pointer ${formData.medicalConditions === false ? 'bg-[#FFF0F5] border-[#EC4899] shadow-sm' : 'bg-white border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="medicalConditions"
                  checked={formData.medicalConditions === false} 
                  onChange={() => updateForm('medicalConditions', false)} 
                  className="hidden"
                />
                <X size={12} className={formData.medicalConditions === false ? 'text-[#EF4444] stroke-[3]' : 'text-gray-300'} />
                <span className="text-[12px] font-bold text-[#1B2B48]">No</span>
              </label>
            </div>
          </div>

          {/* Conditional inputs */}
          {formData.vaccinated === true && (
            <div className="col-span-1 grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-[10px] animate-in fade-in zoom-in-95 duration-200">
              <div>
                <label className="block text-[11px] font-bold text-[#465E87] mb-1">Vaccination Month</label>
                <select 
                  value={formData.vaccinationMonth}
                  onChange={(e) => updateForm('vaccinationMonth', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-[8px] text-[12px] font-medium outline-none"
                >
                  <option value="" disabled>Month</option>
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#465E87] mb-1">Vaccination Year</label>
                <select 
                  value={formData.vaccinationYear}
                  onChange={(e) => updateForm('vaccinationYear', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-[8px] text-[12px] font-medium outline-none"
                >
                  <option value="" disabled>Year</option>
                  {Array.from({length: 15}, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          )}

          {formData.medicalConditions === true && (
            <div className="col-span-1 p-3 bg-gray-50 rounded-[10px] animate-in fade-in zoom-in-95 duration-200">
              <label className="block text-[11px] font-bold text-[#465E87] mb-1">Condition Details</label>
              <input 
                type="text"
                value={formData.medicalConditionDetails}
                onChange={(e) => updateForm('medicalConditionDetails', e.target.value)}
                placeholder="Describe condition or allergy"
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-[8px] text-[12px] font-medium outline-none"
              />
            </div>
          )}

          {/* 9. Behavior */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[13px] font-extrabold text-[#1B2B48] mb-2">9. Behavior with other pets? <span className="text-red-500">*</span></label>
            <div className="flex gap-2 lg:gap-4">
              <button onClick={() => updateForm('behavior', 'Friendly')} className={`w-[90px] h-[90px] flex flex-col items-center justify-center gap-2 rounded-[16px] border transition-all ${formData.behavior === 'Friendly' ? 'bg-[#E8F5E9] border-[#10B981] shadow-md scale-105' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'}`}>
                <PawPrint size={22} className={formData.behavior === 'Friendly' ? 'text-[#10B981]' : 'text-gray-300'} fill="currentColor" />
                <span className={`font-extrabold text-[11px] ${formData.behavior === 'Friendly' ? 'text-[#1B2B48]' : 'text-[#465E87]'}`}>Friendly</span>
              </button>
              <button onClick={() => updateForm('behavior', 'Neutral')} className={`w-[90px] h-[90px] flex flex-col items-center justify-center gap-2 rounded-[16px] border transition-all ${formData.behavior === 'Neutral' ? 'bg-[#F0F9F9] border-[#007672] shadow-md scale-105' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'}`}>
                <PawPrint size={22} className={formData.behavior === 'Neutral' ? 'text-[#007672]' : 'text-gray-300'} fill="currentColor" />
                <span className={`font-extrabold text-[11px] ${formData.behavior === 'Neutral' ? 'text-[#1B2B48]' : 'text-[#465E87]'}`}>Neutral</span>
              </button>
              <button onClick={() => updateForm('behavior', 'Not comfortable')} className={`w-[90px] h-[90px] flex flex-col items-center justify-center gap-1.5 rounded-[16px] border transition-all ${formData.behavior === 'Not comfortable' ? 'bg-[#FFF0F5] border-[#EF4444] shadow-md scale-105' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm px-1 text-center'}`}>
                <PawPrint size={22} className={formData.behavior === 'Not comfortable' ? 'text-[#EF4444]' : 'text-gray-300'} fill="currentColor" />
                <span className={`font-extrabold text-[10px] leading-tight ${formData.behavior === 'Not comfortable' ? 'text-[#1B2B48]' : 'text-[#465E87]'}`}>Not comfortable</span>
              </button>
            </div>
          </div>

          {/* 10. Special Instructions */}
          <div className="col-span-2 md:col-span-2">
            <label className="block text-[13px] font-extrabold text-[#1B2B48] mb-2">10. Special instructions <span className="text-[#8A9BAE] font-medium">(optional)</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 pt-3.5 flex items-start pointer-events-none">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#007672" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <textarea 
                value={formData.specialInstructions}
                onChange={(e) => updateForm('specialInstructions', e.target.value)}
                placeholder="Food preference, feeding routine, allergies, behavior notes, etc."
                className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-[10px] text-[13px] font-medium focus:border-[#71b6af] focus:ring-1 focus:ring-[#71b6af] outline-none shadow-sm h-[44px] resize-none overflow-hidden"
                maxLength={500}
              />
              <div className="absolute inset-y-0 right-0 pr-3 pb-1 flex items-end pointer-events-none">
                <span className="text-[10px] font-medium text-[#8A9BAE]">{formData.specialInstructions.length}/500</span>
              </div>
            </div>
          </div>
            </div>
            
            {error && <p className="text-red-500 text-sm mt-3 font-medium text-center">{error}</p>}
            
            <div className="mt-8 flex justify-end">
              <Button onClick={handleSubmit} loading={loading} className="w-full md:w-[300px] h-[48px] bg-[#007672] hover:bg-[#00605c] text-white text-[15px] font-extrabold rounded-[12px] flex items-center justify-center space-x-2 shadow-lg shadow-[#71b6af]/20">
                <span>Save Pet Details</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
