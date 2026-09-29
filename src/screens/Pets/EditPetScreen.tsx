import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Trash2, PawPrint, Check, X, ChevronDown, Heart, Cat, Dog, Calendar, Weight, Syringe, HeartPulse, FileText, Save } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

export const EditPetScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    weight: '',
    image: '',
    vaccinated: null as boolean | null,
    medicalConditions: null as boolean | null,
    medicalConditionDetails: '',
    behavior: '',
    specialInstructions: '',
    vaccinationMonth: '',
    vaccinationYear: ''
  });

  useEffect(() => {
    const fetchPet = async () => {
      if (!user || !id) return;
      
      try {
        const petRef = doc(db, 'users', user.uid, 'pets', id);
        const petSnap = await getDoc(petRef);
        
        if (petSnap.exists()) {
          const data = petSnap.data();
          setFormData({
            name: data.name || '',
            species: data.type || data.species || 'Dog',
            breed: data.breed || '',
            age: data.age || '',
            gender: data.gender || 'Male',
            weight: data.weight || '',
            image: data.image || '',
            vaccinated: data.vaccinated !== undefined ? data.vaccinated : null,
            medicalConditions: data.medicalConditions !== undefined ? data.medicalConditions : null,
            medicalConditionDetails: data.medicalConditionDetails || '',
            behavior: data.behavior || '',
            specialInstructions: data.specialInstructions || '',
            vaccinationMonth: data.vaccinationMonth || '',
            vaccinationYear: data.vaccinationYear || ''
          });
        } else {
          setError('Pet not found.');
        }
      } catch (err) {
        console.error("Error fetching pet:", err);
        setError('Failed to load pet details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [user, id]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    
    setSaving(true);
    setError('');

    try {
      let downloadUrl = formData.image;

      if (photoFile) {
        downloadUrl = await uploadImageToCloudinary(photoFile);
      }

      const petRef = doc(db, 'users', user.uid, 'pets', id);
      await updateDoc(petRef, {
        ...formData,
        type: formData.species,
        ...(photoFile && { image: downloadUrl })
      });
      navigate('/pets');
    } catch (err) {
      console.error("Error updating pet: ", err);
      setError('Failed to update pet. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !id) return;
    if (window.confirm("Are you sure you want to delete this pet? This action cannot be undone.")) {
      setSaving(true);
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'pets', id));
        navigate('/pets');
      } catch (err) {
        console.error("Error deleting pet:", err);
        setError('Failed to delete pet.');
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full h-[80vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-petoo-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const displayPhotoUrl = previewUrl || formData.image;

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-[calc(100vh-64px)] bg-[#E8F3F3] lg:flex-row relative items-center justify-center p-2 lg:p-4 overflow-hidden z-0">
        
        {/* Wavy Background Graphic for Entire Page */}
        <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
           <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[70%] bg-[#D4EDED] rounded-full blur-[80px] opacity-70"></div>
           <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[60%] bg-[#D4EDED] rounded-full blur-[80px] opacity-70"></div>
           <PawPrint size={40} className="absolute top-10 right-1/4 text-[#007672]/10 rotate-12" />
           <Heart size={30} className="absolute top-20 right-20 text-[#007672]/20 -rotate-12" />
           <Cat size={50} className="absolute top-10 right-10 text-[#007672]/20 rotate-12" />
           <PawPrint size={50} className="absolute bottom-20 left-10 text-[#007672]/10 -rotate-12" />
        </div>

        {/* The Main White Card Container */}
        <div className="w-full max-w-[1350px] bg-white rounded-[32px] md:rounded-[48px] shadow-xl flex flex-col lg:flex-row overflow-visible relative z-10 border border-white">
            
            {/* Desktop Delete Button (Top Right of Card) */}
            <button 
              type="button" 
              onClick={handleDelete}
              className="hidden lg:flex absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 z-20"
              title="Delete Pet"
            >
              <Trash2 size={20} />
            </button>

            {/* Left Section - Hero Area */}
            <div className="w-full lg:w-[42%] xl:w-[40%] relative overflow-hidden bg-white rounded-t-[32px] lg:rounded-tr-none lg:rounded-l-[48px] min-h-[400px] lg:min-h-full shrink-0">
              
              {/* Back Button */}
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 z-30 flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm border border-white rounded-full shadow-sm text-[#1B2B48] hover:bg-white transition-all cursor-pointer hover:scale-105"
                title="Go Back"
              >
                <ArrowLeft size={20} />
              </button>

              {/* All-in-one Image covering the entire left panel */}
              <img 
                src="/petdetailspage.png" 
                alt="Update Pet Details" 
                className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
              />
            </div>

            {/* Right Section - Form Area */}
            <div className="w-full lg:w-[58%] xl:w-[60%] p-5 lg:p-8 relative bg-white rounded-b-[32px] lg:rounded-bl-none lg:rounded-r-[48px] flex flex-col justify-center">
              
              <form onSubmit={handleSubmit} className="w-full flex flex-col relative z-10 pt-2 lg:pt-0">
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-2.5 rounded-xl text-[13px] font-bold text-center mb-4 w-full">
                    {error}
                  </div>
                )}

                {/* Top Section: Photo on left, first fields on right */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-4 items-start w-full">
                  
                  {/* Photo Upload - Now positioned normally in the document flow */}
                  <div className="w-full lg:w-auto shrink-0 flex flex-col items-center justify-center">
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*,.heic,.heif"
                      onChange={handleFileSelect}
                    />
                    <div className="relative group cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-[40px] p-2 bg-white" onClick={() => fileInputRef.current?.click()}>
                      <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {displayPhotoUrl ? (
                          <img src={displayPhotoUrl} alt={formData.name} className="w-full h-full object-cover" />
                        ) : (
                          <PawPrint className="text-gray-300" size={40} />
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-9 h-9 bg-[#00A39D] rounded-full border-[3px] border-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                        <Camera size={14} className="text-white" />
                      </div>
                    </div>
                    <button 
                      type="button"
                      className="mt-3 px-3 py-1.5 border border-[#00A39D]/30 bg-[#F4F9F9] rounded-full text-[11px] font-bold text-[#007672] hover:bg-[#007672] hover:text-white transition-colors flex items-center gap-1.5 shadow-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera size={12} /> Change Photo
                    </button>
                  </div>

                  {/* Top Form Fields Grid */}
                  <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                    
                    <div className="col-span-1">
                      <label className="flex items-center text-[12px] font-extrabold text-[#1B2B48] mb-1">
                        <span className="w-4 flex justify-center text-[#007672]"><Cat size={12} /></span> Pet Name
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. lucy"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-[10px] text-[12.5px] focus:border-[#007672] focus:ring-1 focus:ring-[#007672] outline-none shadow-sm font-medium"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="col-span-1">
                      <label className="flex items-center text-[12px] font-extrabold text-[#1B2B48] mb-1">
                        <span className="w-4 flex justify-center text-[#007672]"><PawPrint size={12} /></span> Breed
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Ginger"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-[10px] text-[12.5px] focus:border-[#007672] focus:ring-1 focus:ring-[#007672] outline-none shadow-sm font-medium"
                        value={formData.breed}
                        onChange={(e) => setFormData({...formData, breed: e.target.value})}
                      />
                    </div>

                    <div className="col-span-1 relative">
                      <label className="flex items-center text-[12px] font-extrabold text-[#1B2B48] mb-1">
                        <span className="w-4 flex justify-center text-[#007672]"><Cat size={12} /></span> Species
                      </label>
                      <select 
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-[10px] text-[12.5px] focus:border-[#007672] focus:ring-1 focus:ring-[#007672] outline-none appearance-none shadow-sm font-medium text-[#1B2B48]"
                        value={formData.species}
                        onChange={(e) => setFormData({...formData, species: e.target.value})}
                      >
                        <option>Dog</option>
                        <option>Cat</option>
                        <option>Bird</option>
                        <option>Other</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-[32px] text-gray-400 pointer-events-none" />
                    </div>

                    <div className="col-span-1">
                      <label className="flex items-center text-[12px] font-extrabold text-[#1B2B48] mb-1">
                        <span className="w-4 flex justify-center text-[#007672]"><div className="text-[12px] leading-none font-sans">⚥</div></span> Gender
                      </label>
                      <div className="flex gap-1.5">
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, gender: 'Female'})} 
                          className={`flex-1 py-2 rounded-[10px] border flex items-center justify-center gap-1 transition-colors shadow-sm ${formData.gender === 'Female' ? 'border-[#007672] text-[#007672] bg-[#F4F9F9]' : 'border-gray-200 text-[#465E87] bg-white'}`}
                        >
                          <span className="text-[14px] leading-none">♀</span> <span className="text-[12px] font-bold">Female</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, gender: 'Male'})} 
                          className={`flex-1 py-2 rounded-[10px] border flex items-center justify-center gap-1 transition-colors shadow-sm ${formData.gender === 'Male' ? 'border-[#007672] text-[#007672] bg-[#F4F9F9]' : 'border-gray-200 text-[#465E87] bg-white'}`}
                        >
                          <span className="text-[14px] leading-none">♂</span> <span className="text-[12px] font-bold">Male</span>
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 relative">
                      <label className="flex items-center text-[12px] font-extrabold text-[#1B2B48] mb-1">
                        <span className="w-4 flex justify-center text-[#007672]"><Calendar size={12} /></span> Age
                      </label>
                      <select 
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-[10px] text-[12.5px] focus:border-[#007672] focus:ring-1 focus:ring-[#007672] outline-none appearance-none shadow-sm font-medium text-[#1B2B48]"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                      >
                        <option value="">Select Age</option>
                        <option value="Puppy/Kitten (< 1 yr)">Puppy/Kitten (&lt; 1 yr)</option>
                        <option value="Young (1-3 yrs)">Young (1-3 yrs)</option>
                        <option value="Adult (3-8 yrs)">Adult (3-8 yrs)</option>
                        <option value="Senior (8+ yrs)">Senior (8+ yrs)</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-[32px] text-gray-400 pointer-events-none" />
                    </div>

                    <div className="col-span-1">
                      <label className="flex items-center text-[12px] font-extrabold text-[#1B2B48] mb-1">
                        <span className="w-4 flex justify-center text-[#007672]"><Weight size={12} /></span> Weight (kg)
                      </label>
                      <div className="relative">
                        <input 
                          type="number" 
                          placeholder="2"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-[10px] text-[12.5px] focus:border-[#007672] focus:ring-1 focus:ring-[#007672] outline-none shadow-sm font-medium pr-8"
                          value={formData.weight}
                          onChange={(e) => setFormData({...formData, weight: e.target.value})}
                        />
                        <span className="absolute right-3 top-2 text-[12px] font-bold text-[#465E87] pointer-events-none">kg</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Bottom Form Fields Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
                  <div className="col-span-1">
                    <label className="flex items-center text-[12px] font-extrabold text-[#1B2B48] mb-1">
                      <span className="w-4 flex justify-center text-[#007672]"><Syringe size={12} /></span> Vaccinated?
                    </label>
                    <div className="flex gap-1.5">
                      <label className={`flex-1 flex items-center justify-center py-2 rounded-[10px] border transition-colors shadow-sm cursor-pointer ${formData.vaccinated === true ? 'bg-[#F4F9F9] border-[#007672]' : 'bg-white border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="vaccinated"
                          checked={formData.vaccinated === true} 
                          onChange={() => setFormData({...formData, vaccinated: true})} 
                          className="hidden"
                        />
                        <span className="flex items-center gap-1 text-[12px] font-bold text-[#1B2B48]">
                          <Check size={12} className="text-[#007672]" strokeWidth={3} /> Yes
                        </span>
                      </label>
                      <label className={`flex-1 flex items-center justify-center py-2 rounded-[10px] border transition-colors shadow-sm cursor-pointer ${formData.vaccinated === false ? 'bg-[#FFF0F5] border-[#EC4899]' : 'bg-white border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="vaccinated"
                          checked={formData.vaccinated === false} 
                          onChange={() => setFormData({...formData, vaccinated: false})} 
                          className="hidden"
                        />
                        <span className="flex items-center gap-1 text-[12px] font-bold text-[#1B2B48]">
                          <X size={12} className="text-[#EC4899]" strokeWidth={3} /> No
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="flex items-center text-[12px] font-extrabold text-[#1B2B48] mb-1">
                      <span className="w-4 flex justify-center text-[#007672]"><Calendar size={12} /></span> Last Vaccination Date
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="relative">
                        <select 
                          value={formData.vaccinationMonth}
                          onChange={(e) => setFormData({...formData, vaccinationMonth: e.target.value})}
                          disabled={formData.vaccinated === false}
                          className="w-full px-2 py-2 bg-white border border-gray-200 rounded-[10px] text-[12.5px] appearance-none focus:border-[#007672] focus:ring-1 focus:ring-[#007672] outline-none shadow-sm font-medium text-[#1B2B48] disabled:bg-gray-50 disabled:text-gray-400"
                        >
                          <option value="" disabled>Month</option>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select 
                          value={formData.vaccinationYear}
                          onChange={(e) => setFormData({...formData, vaccinationYear: e.target.value})}
                          disabled={formData.vaccinated === false}
                          className="w-full px-2 py-2 bg-white border border-gray-200 rounded-[10px] text-[12.5px] appearance-none focus:border-[#007672] focus:ring-1 focus:ring-[#007672] outline-none shadow-sm font-medium text-[#1B2B48] disabled:bg-gray-50 disabled:text-gray-400"
                        >
                          <option value="" disabled>Year</option>
                          {Array.from({length: 15}, (_, i) => new Date().getFullYear() - i).map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="flex items-center text-[12px] font-extrabold text-[#1B2B48] mb-1">
                      <span className="w-4 flex justify-center text-[#007672]"><HeartPulse size={12} /></span> Medical Conditions?
                    </label>
                    <div className="flex gap-1.5">
                      <label className={`flex-1 flex items-center justify-center py-2 rounded-[10px] border transition-colors shadow-sm cursor-pointer ${formData.medicalConditions === true ? 'bg-[#F4F9F9] border-[#007672]' : 'bg-white border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="medicalConditions"
                          checked={formData.medicalConditions === true} 
                          onChange={() => setFormData({...formData, medicalConditions: true})} 
                          className="hidden"
                        />
                        <span className="flex items-center gap-1 text-[12px] font-bold text-[#1B2B48]">
                          <Check size={12} className="text-[#007672]" strokeWidth={3} /> Yes
                        </span>
                      </label>
                      <label className={`flex-1 flex items-center justify-center py-2 rounded-[10px] border transition-colors shadow-sm cursor-pointer ${formData.medicalConditions === false ? 'bg-[#FFF0F5] border-[#EC4899]' : 'bg-white border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="medicalConditions"
                          checked={formData.medicalConditions === false} 
                          onChange={() => setFormData({...formData, medicalConditions: false})} 
                          className="hidden"
                        />
                        <span className="flex items-center gap-1 text-[12px] font-bold text-[#1B2B48]">
                          <X size={12} className="text-[#EC4899]" strokeWidth={3} /> No
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.medicalConditions === true && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 -mt-2">
                      <input 
                        type="text"
                        value={formData.medicalConditionDetails}
                        onChange={(e) => setFormData({...formData, medicalConditionDetails: e.target.value})}
                        placeholder="Please describe the condition or allergy"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-[10px] text-[12.5px] focus:border-[#007672] focus:ring-1 focus:ring-[#007672] outline-none shadow-sm font-medium"
                      />
                    </div>
                  )}

                  {/* Row 4 */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="flex items-center text-[12px] font-extrabold text-[#1B2B48] mb-1">
                      <span className="w-4 flex justify-center text-[#007672]"><PawPrint size={12} /></span> Behavior with other pets
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, behavior: 'Friendly'})} 
                        className={`px-6 py-2 rounded-[10px] border transition-colors shadow-sm ${formData.behavior === 'Friendly' ? 'bg-[#F4F9F9] border-[#007672] text-[#007672]' : 'bg-white border-gray-200 text-[#465E87]'}`}
                      >
                        <span className="font-bold text-[12px]">Friendly</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, behavior: 'Neutral'})} 
                        className={`px-6 py-2 rounded-[10px] border transition-colors shadow-sm ${formData.behavior === 'Neutral' ? 'bg-[#F4F9F9] border-[#007672] text-[#007672]' : 'bg-white border-gray-200 text-[#465E87]'}`}
                      >
                        <span className="font-bold text-[12px]">Neutral</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, behavior: 'Not comfortable'})} 
                        className={`px-5 py-2 rounded-[10px] border transition-colors shadow-sm ${formData.behavior === 'Not comfortable' ? 'bg-[#FFF0F5] border-[#EC4899] text-[#EC4899]' : 'bg-white border-gray-200 text-[#465E87]'}`}
                      >
                        <span className="font-bold text-[12px]">Not comfortable</span>
                      </button>
                    </div>
                  </div>

                  {/* Row 5 */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="flex items-center text-[12px] font-extrabold text-[#1B2B48] mb-1">
                      <span className="w-4 flex justify-center text-[#007672]"><FileText size={12} /></span> Special Instructions
                    </label>
                    <div className="relative">
                      <textarea 
                        value={formData.specialInstructions}
                        onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                        placeholder="Eg. food preference, favourite activities, anything they love or dislike, etc."
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-[10px] text-[12.5px] focus:border-[#007672] focus:ring-1 focus:ring-[#007672] outline-none h-20 resize-none placeholder-gray-400 shadow-sm font-medium"
                        maxLength={300}
                      />
                      <div className="absolute bottom-2 right-3 text-[11px] font-bold text-gray-400">
                        {formData.specialInstructions.length}/300
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={saving}
                  className="w-full mt-6 py-3 rounded-[12px] text-[14px] font-extrabold bg-gradient-to-r from-[#00A39D] to-[#007672] hover:opacity-90 transition-opacity text-white shadow-[0_8px_20px_rgba(0,118,114,0.25)] flex items-center justify-center gap-2"
                >
                  <Save size={16} strokeWidth={2.5} /> {saving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </form>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
