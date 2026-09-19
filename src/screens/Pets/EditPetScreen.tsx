import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Trash2, PawPrint } from 'lucide-react';
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
    image: ''
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
            image: data.image || ''
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
      <div className="w-full flex flex-col min-h-full bg-[#F8F9FA] pb-24 lg:pb-12 pt-8 lg:pt-12 px-5">
        <div className="max-w-xl mx-auto w-full">
          
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors mr-3"
            >
              <ArrowLeft className="text-[#1B2B48]" size={24} />
            </button>
            <h1 className="text-[22px] font-extrabold text-[#1B2B48]">Edit Pet</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 relative">
            
            <button 
              type="button" 
              onClick={handleDelete}
              className="absolute top-6 right-6 p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none"
              title="Delete Pet"
            >
              <Trash2 size={20} />
            </button>

            {/* Photo Upload */}
            <div className="flex flex-col items-center justify-center mb-8 mt-2">
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.heic,.heif"
                onChange={handleFileSelect}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full overflow-hidden border-2 border-petoo-primary bg-gray-100 flex items-center justify-center mb-3 cursor-pointer group relative"
              >
                {displayPhotoUrl ? (
                  <img src={displayPhotoUrl} alt={formData.name} className="w-full h-full object-cover" />
                ) : (
                  <PawPrint className="text-gray-400" size={32} />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <span 
                className="text-[14px] font-bold text-petoo-primary cursor-pointer hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </span>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-[14px] font-bold text-center mb-6">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Pet Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Bruno"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* Species & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Species</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all"
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
                  <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Gender</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>

              {/* Breed */}
              <div>
                <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Breed</label>
                <input 
                  type="text" 
                  placeholder="e.g. Golden Retriever"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all"
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                />
              </div>

              {/* Age & Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Age</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 3 years"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#1B2B48] mb-2">Weight (kg)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 15"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-petoo-primary/20 focus:border-petoo-primary transition-all"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={saving}
              className="w-full mt-8 py-4 rounded-[16px] text-[16px] font-extrabold shadow-lg shadow-petoo-primary/20"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>

        </div>
      </div>
    </DashboardLayout>
  );
};
