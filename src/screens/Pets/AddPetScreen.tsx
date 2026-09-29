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
    <div className="flex-1 min-h-screen bg-white relative pb-28">
      
      <div className="relative w-full overflow-hidden bg-[#F0F9F9]">
        <div className="max-w-6xl mx-auto w-full relative h-[180px] md:h-[220px]">
          {/* Banner Image */}
          <img 
            src="/pet-application.png" 
            alt="Pet Application Banner" 
            className="absolute right-0 top-0 h-full w-full object-cover object-right pointer-events-none"
          />
          {/* Text Content */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 lg:left-8 z-10 max-w-[60%] flex flex-col items-start justify-center">
            <button onClick={handleBack} className="flex items-center gap-2 text-[#1B2B48] mb-3 hover:opacity-80 transition-opacity -ml-1">
              <ArrowLeft size={20} strokeWidth={2.5} />
              <span className="font-extrabold text-[15px]">Add Pet</span>
            </button>
            <h1 className="text-[26px] md:text-[36px] font-extrabold text-[#1B2B48] leading-tight mb-2" style={{ fontFamily: 'serif' }}>
              Tell us about your pet
            </h1>
            <p className="text-[13px] md:text-[15px] font-medium text-[#465E87]">
              A few simple details to help us find the best care.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 relative pb-20 mt-6 z-20">

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-6 max-w-6xl mx-auto">
          
          {/* Pet Photo */}
          <div className="col-span-2 md:col-span-3 xl:col-span-4 border border-dashed border-[#71b6af] bg-[#E8F3F3]/30 rounded-[12px] p-3 flex items-center justify-between">
              <div className="flex items-center gap-4 relative z-10">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center cursor-pointer overflow-hidden shadow-sm border border-gray-200 shrink-0"
                >
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <Camera size={18} className="text-[#007672]" />
                  )}
                </div>
                <div>
                  <h4 className="text-[13px] font-extrabold text-[#1B2B48] mb-0.5">Upload a photo of your pet</h4>
                  <p className="text-[11px] font-medium text-[#465E87] hidden sm:block">A clear, recent photo helps sitters get to know your pet better.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="flex flex-col items-end mr-2 md:mr-6">
                  <button 
                    type="button"
                    className="px-4 py-1.5 border border-[#007672] bg-white rounded-full text-[12px] font-bold text-[#007672] shadow-sm hover:bg-[#007672] hover:text-white transition-colors whitespace-nowrap mb-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </button>
                  <span className="text-[9px] text-[#465E87] font-medium">JPG, PNG (Max 5 MB)</span>
                </div>
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
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-medium focus:border-[#71b6af] focus:ring-1 focus:ring-[#71b6af] outline-none shadow-sm"
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
                className="w-full pl-10 pr-7 py-2.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-medium appearance-none focus:border-[#71b6af] focus:ring-1 focus:ring-[#71b6af] outline-none shadow-sm text-[#1B2B48]"
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
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-medium focus:border-[#71b6af] focus:ring-1 focus:ring-[#71b6af] outline-none shadow-sm"
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
                className="w-full pl-10 pr-7 py-2.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-medium appearance-none focus:border-[#71b6af] focus:ring-1 focus:ring-[#71b6af] outline-none shadow-sm text-[#1B2B48]"
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
              <button onClick={() => updateForm('gender', 'Male')} className={`flex-1 flex items-center justify-center py-2.5 rounded-[10px] border font-bold text-[13px] transition-colors shadow-sm ${formData.gender === 'Male' ? 'bg-[#F4F7FF] border-[#3B82F6] text-[#3B82F6]' : 'bg-white border-gray-200 text-[#465E87]'}`}>
                <span className="mr-1.5 text-sm leading-none mt-[-1px]">♂</span> Male
              </button>
              <button onClick={() => updateForm('gender', 'Female')} className={`flex-1 flex items-center justify-center py-2.5 rounded-[10px] border font-bold text-[13px] transition-colors shadow-sm ${formData.gender === 'Female' ? 'bg-[#FFF0F5] border-[#EC4899] text-[#EC4899]' : 'bg-white border-gray-200 text-[#465E87]'}`}>
                <span className="mr-1.5 text-sm leading-none mt-[-1px]">♀</span> Female
              </button>
              <button onClick={() => updateForm('gender', 'Other')} className={`flex-1 flex items-center justify-center py-2.5 rounded-[10px] border font-bold text-[13px] transition-colors shadow-sm ${formData.gender === 'Other' ? 'bg-[#F3F4F6] border-gray-500 text-gray-700' : 'bg-white border-gray-200 text-[#465E87]'}`}>
                <PawPrint size={14} className="mr-1.5" /> Other
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
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-[10px] text-[13px] font-medium focus:border-[#71b6af] focus:ring-1 focus:ring-[#71b6af] outline-none shadow-sm"
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
            <div className="col-span-2 md:col-span-3 xl:col-span-4 grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-[10px] animate-in fade-in zoom-in-95 duration-200">
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
            <div className="col-span-2 md:col-span-3 xl:col-span-4 p-3 bg-gray-50 rounded-[10px] animate-in fade-in zoom-in-95 duration-200">
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
          <div className="col-span-2">
            <label className="block text-[13px] font-extrabold text-[#1B2B48] mb-2">9. Behavior with other pets? <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <button onClick={() => updateForm('behavior', 'Friendly')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] border transition-colors shadow-sm ${formData.behavior === 'Friendly' ? 'bg-[#E8F5E9] border-[#10B981]' : 'bg-white border-gray-200'}`}>
                <PawPrint size={14} className="text-[#10B981]" fill="currentColor" />
                <span className="font-extrabold text-[11px] text-[#1B2B48]">Friendly</span>
              </button>
              <button onClick={() => updateForm('behavior', 'Neutral')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] border transition-colors shadow-sm ${formData.behavior === 'Neutral' ? 'bg-[#F3F4F6] border-gray-500' : 'bg-white border-gray-200'}`}>
                <PawPrint size={14} className="text-[#00605c]" fill="currentColor" />
                <span className="font-extrabold text-[11px] text-[#1B2B48]">Neutral</span>
              </button>
              <button onClick={() => updateForm('behavior', 'Not comfortable')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] border transition-colors shadow-sm ${formData.behavior === 'Not comfortable' ? 'bg-[#FFF0F5] border-[#EF4444]' : 'bg-white border-gray-200'}`}>
                <PawPrint size={14} className="text-[#EF4444]" fill="currentColor" />
                <span className="font-extrabold text-[11px] text-[#1B2B48]">Not comfortable</span>
              </button>
            </div>
          </div>

          {/* 10. Special Instructions */}
          <div className="col-span-2">
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
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-40 pb-safe-bottom">
          <Button onClick={handleSubmit} loading={loading} className="w-full max-w-6xl mx-auto h-12 bg-[#007672] hover:bg-[#00605c] text-white text-[15px] font-extrabold rounded-[12px] flex items-center justify-center space-x-2 shadow-lg shadow-[#71b6af]/20">
            <span>Save Pet Details</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Button>
        </div>
      </div>
    </div>
  );
};
