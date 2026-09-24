import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Camera, Check, X, PawPrint, ChevronDown, Calendar, Weight } from 'lucide-react';
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
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    customBreed: '',
    age: '',
    gender: '',
    weight: '',
    vaccinated: null as boolean | null,
    medicalConditions: null as boolean | null,
    medicalConditionDetails: '',
    behavior: '',
    specialInstructions: ''
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

  const handleNext = () => {
    if (!formData.name) {
      setError('Please enter pet name');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
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
        type: 'Dog', // Defaulting to Dog as per mockups, could be dynamic
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
      
      {/* Header */}
      <div className="px-5 pt-12 pb-2 flex items-center sticky top-0 bg-white/90 backdrop-blur-md z-30 justify-between">
        <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center -ml-2">
          <ArrowLeft size={24} className="text-[#1B2B48]" />
        </button>
        
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center space-x-1 mb-1">
            <div className={`h-1.5 w-12 rounded-full ${step >= 1 ? 'bg-[#FDD835]' : 'bg-gray-100'}`} />
            <div className={`h-1.5 w-12 rounded-full ${step >= 2 ? 'bg-[#FDD835]' : 'bg-gray-100'}`} />
          </div>
        </div>

        <div className="text-[12px] font-bold text-[#465E87] w-12 text-right">
          Step {step} of 2
        </div>
      </div>

      <div className="px-6 mt-4 relative">
        {step === 1 ? (
          <>
            <div className="relative mb-8">
              <div className="w-[65%]">
                <h1 className="text-[28px] font-extrabold text-[#1B2B48] leading-tight mb-2" style={{ fontFamily: 'serif' }}>
                  Tell us about<br/>your pet
                </h1>
                <p className="text-[14px] font-medium text-[#465E87] leading-relaxed pr-2">
                  A few simple details to help us find the best care for your pet.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-[#FFF9EC] rounded-full overflow-hidden flex items-end justify-center -mt-4 -mr-4">
                <img src={mediumDogImg} className="w-[90%] h-[90%] object-cover rounded-full shadow-inner mb-2" alt="Dog" />
              </div>
            </div>

            <div className="space-y-5">
              {/* Pet Name */}
              <div>
                <label className="block text-[14px] font-extrabold text-[#1B2B48] mb-2">1. Pet Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <PawPrint size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    placeholder="Enter your pet's name"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-[16px] text-[15px] font-medium focus:border-[#FDD835] focus:ring-1 focus:ring-[#FDD835] outline-none transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                  />
                </div>
              </div>

              {/* Pet Photo */}
              <div>
                <label className="block text-[14px] font-extrabold text-[#1B2B48] mb-2">2. Pet Photo</label>
                <div className="border border-dashed border-gray-200 rounded-[20px] p-6 flex flex-col items-center bg-gray-50/30">
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 rounded-full bg-[#FFF9EC] flex items-center justify-center mb-3 cursor-pointer overflow-hidden border-2 border-white shadow-sm"
                  >
                    {previewUrl ? (
                      <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <Camera size={24} className="text-[#8B5A2B]" />
                    )}
                  </div>
                  <h4 className="text-[14px] font-extrabold text-[#1B2B48] mb-1">Upload a photo</h4>
                  <p className="text-[12px] font-medium text-[#465E87] text-center max-w-[200px]">
                    A clear photo helps sitters get to know your pet better
                  </p>
                </div>
              </div>

              {/* Breed */}
              <div>
                <label className="block text-[14px] font-extrabold text-[#1B2B48] mb-2">3. Breed</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <PawPrint size={18} className="text-gray-400" />
                  </div>
                  <select 
                    value={formData.breed}
                    onChange={(e) => updateForm('breed', e.target.value)}
                    className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-[16px] text-[15px] font-medium appearance-none focus:border-[#FDD835] focus:ring-1 focus:ring-[#FDD835] outline-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-[#1B2B48]"
                  >
                    <option value="" disabled>Select breed</option>
                    <option value="Golden Retriever">Golden Retriever</option>
                    <option value="Labrador">Labrador</option>
                    <option value="German Shepherd">German Shepherd</option>
                    <option value="Pug">Pug</option>
                    <option value="Beagle">Beagle</option>
                    <option value="Indie">Indie</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <ChevronDown size={18} className="text-gray-400" />
                  </div>
                </div>
                {formData.breed === 'Other' && (
                  <div className="mt-3 relative animate-in fade-in slide-in-from-top-2 duration-200">
                    <input 
                      type="text"
                      value={formData.customBreed}
                      onChange={(e) => updateForm('customBreed', e.target.value)}
                      placeholder="Please specify your pet's breed"
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[16px] text-[15px] font-medium focus:border-[#FDD835] focus:ring-1 focus:ring-[#FDD835] outline-none shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-[14px] font-extrabold text-[#1B2B48] mb-2">4. Age</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <select 
                    value={formData.age}
                    onChange={(e) => updateForm('age', e.target.value)}
                    className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-[16px] text-[15px] font-medium appearance-none focus:border-[#FDD835] focus:ring-1 focus:ring-[#FDD835] outline-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-[#1B2B48]"
                  >
                    <option value="" disabled>Select age</option>
                    <option value="Puppy (0-1 yrs)">Puppy (0-1 yrs)</option>
                    <option value="Young (1-3 yrs)">Young (1-3 yrs)</option>
                    <option value="Adult (3-8 yrs)">Adult (3-8 yrs)</option>
                    <option value="Senior (8+ yrs)">Senior (8+ yrs)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <ChevronDown size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[14px] font-extrabold text-[#1B2B48] mb-2">5. Gender</label>
                <div className="flex gap-3">
                  <button onClick={() => updateForm('gender', 'Male')} className={`flex-1 flex items-center justify-center py-3.5 rounded-[16px] border font-bold text-[14px] transition-colors ${formData.gender === 'Male' ? 'bg-[#F4F7FF] border-[#3B82F6] text-[#3B82F6]' : 'bg-gray-50 border-gray-200 text-[#465E87]'}`}>
                    <span className="mr-2 text-xl font-normal leading-none text-[#3B82F6] mt-[-2px]">♂</span> Male
                  </button>
                  <button onClick={() => updateForm('gender', 'Female')} className={`flex-1 flex items-center justify-center py-3.5 rounded-[16px] border font-bold text-[14px] transition-colors ${formData.gender === 'Female' ? 'bg-[#FFF0F5] border-[#EC4899] text-[#EC4899]' : 'bg-gray-50 border-gray-200 text-[#465E87]'}`}>
                    <span className="mr-2 text-xl font-normal leading-none text-[#EC4899] mt-[-2px]">♀</span> Female
                  </button>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-[14px] font-extrabold text-[#1B2B48] mb-2">6. Weight</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Weight size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="number"
                    value={formData.weight}
                    onChange={(e) => updateForm('weight', e.target.value)}
                    placeholder="Enter weight"
                    className="w-full pl-11 pr-12 py-3.5 bg-white border border-gray-200 rounded-[16px] text-[15px] font-medium focus:border-[#FDD835] focus:ring-1 focus:ring-[#FDD835] outline-none shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-[#465E87] font-bold text-[14px]">kg</span>
                  </div>
                </div>
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm mt-4 font-medium text-center">{error}</p>}
            
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent z-40 pb-safe-bottom mt-10">
              <Button onClick={handleNext} className="w-full h-14 bg-[#FDD835] hover:bg-[#FBBF24] text-[#1B2B48] text-[16px] font-extrabold rounded-[16px] flex items-center justify-center space-x-2 shadow-lg shadow-[#FDD835]/20">
                <span>Next</span>
                <ArrowLeft size={18} className="rotate-180" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="relative mb-8">
              <div className="w-[65%]">
                <h1 className="text-[28px] font-extrabold text-[#1B2B48] leading-tight mb-2" style={{ fontFamily: 'serif' }}>
                  A few more details
                </h1>
                <p className="text-[14px] font-medium text-[#465E87] leading-relaxed pr-2">
                  This helps us ensure a safe and comfortable stay for your pet.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-[#FFF9EC] rounded-full overflow-hidden flex items-end justify-center -mt-4 -mr-4">
                <img src={largeDogImg} className="w-[90%] h-[90%] object-cover rounded-full shadow-inner mb-2" alt="Dog" />
              </div>
            </div>

            <div className="space-y-6">
              
              {/* Vaccination */}
              <div>
                <label className="block text-[14px] font-extrabold text-[#1B2B48] mb-3">7. Is your pet vaccinated?</label>
                <div className="flex gap-3 mt-2">
                  <label className={`flex-1 flex flex-col items-center justify-center py-5 rounded-[16px] border transition-colors cursor-pointer ${formData.vaccinated === true ? 'bg-[#FFF9EC] border-[#FBBF24] shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2 transition-colors ${formData.vaccinated === true ? 'border-[#FBBF24]' : 'border-gray-300'}`}>
                      {formData.vaccinated === true && <div className="w-3 h-3 rounded-full bg-[#FBBF24]" />}
                    </div>
                    <input 
                      type="radio" 
                      name="vaccinated"
                      checked={formData.vaccinated === true} 
                      onChange={() => updateForm('vaccinated', true)} 
                      className="hidden"
                    />
                    <span className="text-[#10B981] flex items-center justify-center p-1 bg-[#10B981]/10 rounded-full mt-1">
                      <Check size={20} className="stroke-[3]" />
                    </span>
                  </label>
                  <label className={`flex-1 flex flex-col items-center justify-center py-5 rounded-[16px] border transition-colors cursor-pointer ${formData.vaccinated === false ? 'bg-[#FFF0F5] border-[#EC4899] shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2 transition-colors ${formData.vaccinated === false ? 'border-[#EC4899]' : 'border-gray-300'}`}>
                      {formData.vaccinated === false && <div className="w-3 h-3 rounded-full bg-[#EC4899]" />}
                    </div>
                    <input 
                      type="radio" 
                      name="vaccinated"
                      checked={formData.vaccinated === false} 
                      onChange={() => updateForm('vaccinated', false)} 
                      className="hidden"
                    />
                    <span className="text-[#EF4444] flex items-center justify-center p-1 bg-[#EF4444]/10 rounded-full mt-1">
                      <X size={20} className="stroke-[3]" />
                    </span>
                  </label>
                </div>
              </div>

              {/* Medical Conditions */}
              <div>
                <label className="block text-[14px] font-extrabold text-[#1B2B48] mb-3">8. Does your pet have any medical conditions or allergies?</label>
                <div className="flex gap-3 mt-2">
                  <label className={`flex-1 flex flex-col items-center justify-center py-5 rounded-[16px] border transition-colors cursor-pointer ${formData.medicalConditions === true ? 'bg-[#FFF9EC] border-[#FBBF24] shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2 transition-colors ${formData.medicalConditions === true ? 'border-[#FBBF24]' : 'border-gray-300'}`}>
                      {formData.medicalConditions === true && <div className="w-3 h-3 rounded-full bg-[#FBBF24]" />}
                    </div>
                    <input 
                      type="radio" 
                      name="medicalConditions"
                      checked={formData.medicalConditions === true} 
                      onChange={() => updateForm('medicalConditions', true)} 
                      className="hidden"
                    />
                    <span className="text-[#10B981] flex items-center justify-center p-1 bg-[#10B981]/10 rounded-full mt-1">
                      <Check size={20} className="stroke-[3]" />
                    </span>
                  </label>
                  <label className={`flex-1 flex flex-col items-center justify-center py-5 rounded-[16px] border transition-colors cursor-pointer ${formData.medicalConditions === false ? 'bg-[#FFF0F5] border-[#EC4899] shadow-sm' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2 transition-colors ${formData.medicalConditions === false ? 'border-[#EC4899]' : 'border-gray-300'}`}>
                      {formData.medicalConditions === false && <div className="w-3 h-3 rounded-full bg-[#EC4899]" />}
                    </div>
                    <input 
                      type="radio" 
                      name="medicalConditions"
                      checked={formData.medicalConditions === false} 
                      onChange={() => updateForm('medicalConditions', false)} 
                      className="hidden"
                    />
                    <span className="text-[#EF4444] flex items-center justify-center p-1 bg-[#EF4444]/10 rounded-full mt-1">
                      <X size={20} className="stroke-[3]" />
                    </span>
                  </label>
                </div>

                {formData.medicalConditions === true && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <input 
                      type="text"
                      value={formData.medicalConditionDetails}
                      onChange={(e) => updateForm('medicalConditionDetails', e.target.value)}
                      placeholder="Please describe the condition or allergy"
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-[16px] text-[14px] font-medium focus:border-[#FDD835] focus:ring-1 focus:ring-[#FDD835] outline-none shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                )}
              </div>

              {/* Behavior */}
              <div>
                <label className="block text-[14px] font-extrabold text-[#1B2B48] mb-3">9. How is your pet with other pets?</label>
                <div className="flex gap-2">
                  <button onClick={() => updateForm('behavior', 'Friendly')} className={`flex-1 flex flex-col items-center justify-center py-4 rounded-[16px] border transition-colors ${formData.behavior === 'Friendly' ? 'bg-[#FFF9EC] border-[#FBBF24] shadow-sm' : 'bg-white border-gray-100'}`}>
                    <PawPrint size={24} className="text-[#10B981] mb-2" fill="currentColor" />
                    <span className="font-extrabold text-[12px] text-[#1B2B48]">Friendly</span>
                  </button>
                  <button onClick={() => updateForm('behavior', 'Neutral')} className={`flex-1 flex flex-col items-center justify-center py-4 rounded-[16px] border transition-colors ${formData.behavior === 'Neutral' ? 'bg-[#FFF9EC] border-[#FBBF24] shadow-sm' : 'bg-white border-gray-100'}`}>
                    <PawPrint size={24} className="text-[#F59E0B] mb-2" fill="currentColor" />
                    <span className="font-extrabold text-[12px] text-[#1B2B48]">Neutral</span>
                  </button>
                  <button onClick={() => updateForm('behavior', 'Not comfortable')} className={`flex-1 flex flex-col items-center justify-center py-4 rounded-[16px] border transition-colors ${formData.behavior === 'Not comfortable' ? 'bg-[#FFF9EC] border-[#FBBF24] shadow-sm' : 'bg-white border-gray-100'}`}>
                    <PawPrint size={24} className="text-[#EF4444] mb-2" fill="currentColor" />
                    <span className="font-extrabold text-[12px] text-[#1B2B48] text-center leading-tight">Not<br/>comfortable</span>
                  </button>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-[14px] font-extrabold text-[#1B2B48] mb-2">10. Any special instructions we should know about?</label>
                <div className="relative">
                  <textarea 
                    value={formData.specialInstructions}
                    onChange={(e) => updateForm('specialInstructions', e.target.value)}
                    placeholder="Eg. food preference, favourite activities, anything they love or dislike, etc."
                    className="w-full p-4 bg-white border border-gray-200 rounded-[16px] text-[14px] font-medium focus:border-[#FDD835] focus:ring-1 focus:ring-[#FDD835] outline-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-32 resize-none"
                    maxLength={300}
                  />
                  <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-400">
                    {formData.specialInstructions.length}/300
                  </div>
                </div>
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm mt-4 font-medium text-center">{error}</p>}
            
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent z-40 pb-safe-bottom mt-10">
              <Button onClick={handleSubmit} loading={loading} className="w-full h-14 bg-[#FDD835] hover:bg-[#FBBF24] text-[#1B2B48] text-[16px] font-extrabold rounded-[16px] flex items-center justify-center space-x-2 shadow-lg shadow-[#FDD835]/20">
                <span>Save Pet Details</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
