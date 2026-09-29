import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Trash2, PawPrint, Check, X, ChevronDown } from 'lucide-react';
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
      <div className="w-full flex flex-col min-h-full bg-[#F8F9FA] pb-24 lg:pb-0 pt-4 lg:pt-0 px-4 lg:px-6 lg:h-[calc(100vh-80px)] lg:justify-center">
        <div className="w-full max-w-[1600px] mx-auto">
          
          <form onSubmit={handleSubmit} className="bg-white p-4 lg:p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 relative w-full flex flex-col">
            
            {/* Top Action Bar (Back & Delete) */}
            <div className="flex justify-between items-center w-full mb-2 lg:mb-0">
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors text-[#1B2B48]"
                title="Go Back"
              >
                <ArrowLeft size={20} />
              </button>
              
              <button 
                type="button" 
                onClick={handleDelete}
                className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none flex items-center gap-2"
                title="Delete Pet"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
              {/* Photo Upload - Left on Desktop */}
              <div className="w-full lg:w-1/3 flex flex-col items-center justify-start lg:mt-0">
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,.heic,.heif"
                  onChange={handleFileSelect}
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-petoo-primary/20 bg-gray-100 flex items-center justify-center mb-3 cursor-pointer group relative transition-transform hover:scale-105"
                >
                  {displayPhotoUrl ? (
                    <img src={displayPhotoUrl} alt={formData.name} className="w-full h-full object-cover" />
                  ) : (
                    <PawPrint className="text-gray-400" size={40} />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={28} className="text-white" />
                  </div>
                </div>
                <span 
                  className="text-[14px] lg:text-[15px] font-bold text-petoo-primary cursor-pointer hover:underline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Photo
                </span>
              </div>

              {/* Fields - Right on Desktop */}
              <div className="w-full lg:w-2/3 flex flex-col">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[14px] font-bold text-center mb-6">
                    {error}
                  </div>
                )}

                <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-4">
                  {/* Name */}
                  <div className="lg:col-span-1">
                    <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Pet Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Bruno"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  {/* Breed */}
                  <div className="lg:col-span-1">
                    <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Breed</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Golden Retriever"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all"
                      value={formData.breed}
                      onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    />
                  </div>

                  {/* Species & Gender */}
                  <div className="lg:col-span-1 xl:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Species</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all"
                        value={formData.species}
                        onChange={(e) => setFormData({...formData, species: e.target.value})}
                      >
                        <option>Dog</option>
                        <option>Cat</option>
                        <option>Bird</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Gender</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all"
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>

                  {/* Age & Weight */}
                  <div className="lg:col-span-1 xl:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Age</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 3 years"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Weight (kg)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 15"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  {/* Vaccination */}
                  <div className="lg:col-span-1 mt-4 lg:mt-0">
                    <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Vaccinated?</label>
                    <div className="flex gap-3">
                      <label className={`flex-1 flex items-center justify-center py-2.5 rounded-[10px] border transition-colors cursor-pointer ${formData.vaccinated === true ? 'bg-[#f0f8f8] border-[#007672] shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="vaccinated"
                          checked={formData.vaccinated === true} 
                          onChange={() => setFormData({...formData, vaccinated: true})} 
                          className="hidden"
                        />
                        <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#1B2B48]">
                          <Check size={16} className="text-[#007672]" /> Yes
                        </span>
                      </label>
                      <label className={`flex-1 flex items-center justify-center py-2.5 rounded-[10px] border transition-colors cursor-pointer ${formData.vaccinated === false ? 'bg-[#FFF0F5] border-[#EC4899] shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="vaccinated"
                          checked={formData.vaccinated === false} 
                          onChange={() => setFormData({...formData, vaccinated: false})} 
                          className="hidden"
                        />
                        <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#1B2B48]">
                          <X size={16} className="text-[#EC4899]" /> No
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.vaccinated === true && (
                    <div className="lg:col-span-1 xl:col-span-2 mt-4 lg:mt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                      <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Last Vaccination Date</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <select 
                            value={formData.vaccinationMonth}
                            onChange={(e) => setFormData({...formData, vaccinationMonth: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[14px] font-medium appearance-none focus:border-[#71b6af] focus:ring-1 focus:ring-[#71b6af] outline-none transition-all text-[#1B2B48]"
                          >
                            <option value="" disabled>Month</option>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <ChevronDown size={16} className="text-gray-400" />
                          </div>
                        </div>
                        <div className="relative">
                          <select 
                            value={formData.vaccinationYear}
                            onChange={(e) => setFormData({...formData, vaccinationYear: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[14px] font-medium appearance-none focus:border-[#71b6af] focus:ring-1 focus:ring-[#71b6af] outline-none transition-all text-[#1B2B48]"
                          >
                            <option value="" disabled>Year</option>
                            {Array.from({length: 15}, (_, i) => new Date().getFullYear() - i).map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <ChevronDown size={16} className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Medical Conditions */}
                  <div className="lg:col-span-1 mt-4 lg:mt-0">
                    <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Medical Conditions/Allergies?</label>
                    <div className="flex gap-3">
                      <label className={`flex-1 flex items-center justify-center py-2.5 rounded-[10px] border transition-colors cursor-pointer ${formData.medicalConditions === true ? 'bg-[#f0f8f8] border-[#007672] shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="medicalConditions"
                          checked={formData.medicalConditions === true} 
                          onChange={() => setFormData({...formData, medicalConditions: true})} 
                          className="hidden"
                        />
                        <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#1B2B48]">
                          <Check size={16} className="text-[#007672]" /> Yes
                        </span>
                      </label>
                      <label className={`flex-1 flex items-center justify-center py-2.5 rounded-[10px] border transition-colors cursor-pointer ${formData.medicalConditions === false ? 'bg-[#FFF0F5] border-[#EC4899] shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="medicalConditions"
                          checked={formData.medicalConditions === false} 
                          onChange={() => setFormData({...formData, medicalConditions: false})} 
                          className="hidden"
                        />
                        <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#1B2B48]">
                          <X size={16} className="text-[#EC4899]" /> No
                        </span>
                      </label>
                    </div>
                  </div>

                  {formData.medicalConditions === true && (
                    <div className="lg:col-span-2 mt-2 lg:mt-0">
                      <input 
                        type="text"
                        value={formData.medicalConditionDetails}
                        onChange={(e) => setFormData({...formData, medicalConditionDetails: e.target.value})}
                        placeholder="Please describe the condition or allergy"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all"
                      />
                    </div>
                  )}

                  {/* Behavior */}
                  <div className="lg:col-span-1 xl:col-span-2 mt-4 lg:mt-0">
                    <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Behavior with other pets</label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, behavior: 'Friendly'})} 
                        className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-[10px] border transition-colors ${formData.behavior === 'Friendly' ? 'bg-[#f0f8f8] border-[#007672] shadow-sm' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <span className={`font-bold text-[13px] ${formData.behavior === 'Friendly' ? 'text-[#007672]' : 'text-[#465E87]'}`}>Friendly</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, behavior: 'Neutral'})} 
                        className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-[10px] border transition-colors ${formData.behavior === 'Neutral' ? 'bg-[#f0f8f8] border-[#007672] shadow-sm' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <span className={`font-bold text-[13px] ${formData.behavior === 'Neutral' ? 'text-[#007672]' : 'text-[#465E87]'}`}>Neutral</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, behavior: 'Not comfortable'})} 
                        className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-[10px] border transition-colors ${formData.behavior === 'Not comfortable' ? 'bg-[#FFF0F5] border-[#EC4899] shadow-sm' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <span className={`font-bold text-[13px] text-center leading-tight ${formData.behavior === 'Not comfortable' ? 'text-[#EC4899]' : 'text-[#465E87]'}`}>Not<br className="lg:hidden"/> comfortable</span>
                      </button>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="lg:col-span-2 xl:col-span-4 mt-4 lg:mt-0">
                    <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Special Instructions</label>
                    <div className="relative">
                      <textarea 
                        value={formData.specialInstructions}
                        onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                        placeholder="Eg. food preference, favourite activities, anything they love or dislike, etc."
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all h-16 resize-none"
                        maxLength={300}
                      />
                      <div className="absolute bottom-2 right-4 text-[10px] font-bold text-gray-400">
                        {formData.specialInstructions.length}/300
                      </div>
                    </div>
                  </div>

                </div>

                <Button 
                  type="submit"
                  disabled={saving}
                  className="w-full mt-5 lg:mt-6 py-3 rounded-[12px] text-[15px] font-extrabold shadow-lg shadow-petoo-primary/20 lg:col-span-3 xl:col-span-4"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </DashboardLayout>
  );
};
