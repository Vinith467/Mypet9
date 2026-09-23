import { useState, useEffect, useRef } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db, storage } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  ChevronLeft,
  Camera,
  Video,
  Plus,
  X,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Film,
} from 'lucide-react';

interface MediaItem {
  url: string;
  type: 'photo' | 'video';
  name: string;
}

export const CaretakerPhotosVideosScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');

  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      try {
        const docRef = doc(db, 'caretaker_applications', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data().media;
          if (data) {
            if (data.photos) setPhotos(data.photos);
            if (data.videos) setVideos(data.videos);
          }
        }
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleUpload = async (files: FileList | null, type: 'photo' | 'video') => {
    if (!files || !user?.uid) return;
    setUploading(true);
    
    try {
      const newItems: MediaItem[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `caretakers/${user.uid}/${type}s/${fileName}`);
        
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        
        newItems.push({ url, type, name: fileName });
      }
      
      if (type === 'photo') {
        setPhotos(prev => [...prev, ...newItems]);
      } else {
        setVideos(prev => [...prev, ...newItems]);
      }
    } catch (error) {
      console.error("Error uploading:", error);
      alert('Failed to upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = async (item: MediaItem) => {
    if (!user?.uid) return;
    try {
      const storageRef = ref(storage, `caretakers/${user.uid}/${item.type}s/${item.name}`);
      await deleteObject(storageRef);
      
      if (item.type === 'photo') {
        setPhotos(prev => prev.filter(p => p.name !== item.name));
      } else {
        setVideos(prev => prev.filter(v => v.name !== item.name));
      }
    } catch (error) {
      console.error("Error removing media:", error);
      // Still remove from UI even if storage delete fails
      if (item.type === 'photo') {
        setPhotos(prev => prev.filter(p => p.name !== item.name));
      } else {
        setVideos(prev => prev.filter(v => v.name !== item.name));
      }
    }
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'caretaker_applications', user.uid);
      await setDoc(docRef, {
        media: {
          photos,
          videos
        }
      }, { merge: true });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving media:", error);
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <CaretakerLayout>
      <div className="w-full flex flex-col bg-[#FAFAFA] min-h-screen font-quicksand pb-40 lg:pb-12 text-[#1B2B48]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-[#FAFAFA]/95 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center -ml-2 text-[#1B2B48] hover:bg-black/5 rounded-full transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-xl font-extrabold tracking-tight">Photos & Videos</h1>
          </div>
          <div className="w-10"></div>
        </div>

        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-petoo-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex-1 px-5 lg:px-8 pt-6 w-full flex flex-col max-w-3xl mx-auto">
            
            {/* Hero */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200/50 mb-3">
                <Camera size={24} className="text-white" />
              </div>
              <p className="text-[#1B2B48]/60 text-sm font-medium text-center">
                Upload photos and videos of your homestay to attract pet parents
              </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-3 mb-6">
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  activeTab === 'photos' 
                    ? 'bg-petoo-primary text-[#1B2B48] shadow-lg shadow-petoo-primary/20 scale-105' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <ImageIcon size={18} />
                <span>Photos ({photos.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  activeTab === 'videos' 
                    ? 'bg-petoo-primary text-[#1B2B48] shadow-lg shadow-petoo-primary/20 scale-105' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Film size={18} />
                <span>Videos ({videos.length})</span>
              </button>
            </div>

            {/* Upload Area */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => activeTab === 'photos' ? photoInputRef.current?.click() : videoInputRef.current?.click()}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-petoo-primary/50 p-8 flex flex-col items-center justify-center cursor-pointer transition-all mb-6 group"
            >
              {uploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-petoo-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-bold text-[#1B2B48]/60">Uploading...</p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-gray-50 group-hover:bg-petoo-primary/10 rounded-2xl flex items-center justify-center mb-3 transition-colors">
                    <Upload size={24} className="text-gray-400 group-hover:text-petoo-primary transition-colors" />
                  </div>
                  <p className="text-sm font-bold text-[#1B2B48]/70">
                    Tap to upload {activeTab === 'photos' ? 'photos' : 'videos'}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium mt-1">
                    {activeTab === 'photos' ? 'JPG, PNG up to 5MB each' : 'MP4, MOV up to 50MB each'}
                  </p>
                </>
              )}
            </motion.div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files, 'photo')}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files, 'video')}
            />

            {/* Media Grid */}
            {activeTab === 'photos' && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm"
                  >
                    <img src={photo.url} alt="Homestay" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    <button
                      onClick={(e) => { e.stopPropagation(); removeMedia(photo); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}

                {photos.length === 0 && (
                  <div className="col-span-3 py-10 flex flex-col items-center text-gray-300">
                    <ImageIcon size={40} className="mb-2" />
                    <p className="text-sm font-bold">No photos uploaded yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative aspect-video rounded-2xl overflow-hidden group shadow-sm bg-black"
                  >
                    <video src={video.url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                        <Video size={18} className="text-[#1B2B48] ml-0.5" />
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeMedia(video); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}

                {videos.length === 0 && (
                  <div className="col-span-2 py-10 flex flex-col items-center text-gray-300">
                    <Film size={40} className="mb-2" />
                    <p className="text-sm font-bold">No videos uploaded yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Save Button */}
            <button 
              onClick={handleSave}
              disabled={saving || showSuccess}
              className={`w-full font-bold text-[15px] py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all mt-2 flex items-center justify-center disabled:opacity-50 ${
                showSuccess 
                  ? 'bg-green-500 text-white' 
                  : 'bg-[#FBBF24] text-[#1B2B48] active:scale-[0.98]'
              }`}
            >
              {showSuccess ? (
                <>
                  <CheckCircle2 size={20} className="mr-2" />
                  Successfully Saved!
                </>
              ) : saving ? (
                'Saving...'
              ) : (
                'Save Changes'
              )}
            </button>

          </div>
        )}
      </div>
    </CaretakerLayout>
  );
};
