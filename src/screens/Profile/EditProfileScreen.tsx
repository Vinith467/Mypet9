import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, Mail, HeartPulse, Phone } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../../config/firebase';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

export const EditProfileScreen = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setPhone(userData.phone || '');
      setEmergencyContact(userData.emergencyContact || '');
    }
  }, [userData]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setMessage('');
    
    try {
      let downloadUrl = user.photoURL || userData?.photoURL || '';

      // 1. Upload new photo to Cloudinary if selected
      if (photoFile) {
        downloadUrl = await uploadImageToCloudinary(photoFile);
        
        // Update Firebase Auth profile
        await updateProfile(user, { photoURL: downloadUrl });
      }

      // 2. Update Firestore document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name,
        phone,
        emergencyContact,
        ...(downloadUrl && { photoURL: downloadUrl })
      });

      setMessage('Profile updated successfully!');
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error("Error updating profile: ", error);
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const displayPhotoUrl = previewUrl || user?.photoURL || userData?.photoURL || "https://ui-avatars.com/api/?name=" + (name || "User") + "&background=E5E7EB&color=1B2B48";

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#FAF9F5] pb-24 lg:pb-12 pt-6 lg:pt-10 px-5">
        <div className="max-w-xl mx-auto w-full">
          
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 hover:bg-gray-50 transition-colors mr-3 shadow-sm"
            >
              <ArrowLeft className="text-[#1B2B48]" size={20} />
            </button>
            <h1 className="text-[24px] font-extrabold text-[#1B2B48]">
              Edit Profile
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-8"
          >
            {/* Avatar Uploader */}
            <div className="flex flex-col items-center justify-center">
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.heic,.heif"
                onChange={handleFileSelect}
              />
              <div 
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <img 
                  src={displayPhotoUrl} 
                  alt="Profile" 
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md bg-gray-100"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <span 
                className="text-[#465E87] text-[13px] font-medium mt-3 cursor-pointer hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                Tap to change photo
              </span>
            </div>

            {message && (
              <div className={`p-3 rounded-xl text-[14px] font-bold text-center ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {message}
              </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 space-y-4">
              <Input 
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User size={18} />}
              />
              <Input 
                placeholder="Email Address"
                value={user?.email || ''}
                readOnly
                disabled
                leftIcon={<Mail size={18} />}
              />
              <Input 
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone size={18} />}
              />
              <Input 
                placeholder="Emergency Contact (Optional)"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                leftIcon={<HeartPulse size={18} />}
              />
            </div>

            <Button 
              fullWidth 
              size="lg"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>

          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};
