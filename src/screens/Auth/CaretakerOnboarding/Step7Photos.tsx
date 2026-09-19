import React, { useState } from 'react';
import type { CaretakerFormData } from './types';
import { Button } from '../../../components/ui/Button';
import { Camera, X, Plus } from 'lucide-react';
import { uploadImageToCloudinary } from '../../../utils/cloudinary';

interface Props {
  data: CaretakerFormData;
  updateData: (data: Partial<CaretakerFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step7Photos = ({ data, updateData, onNext, onBack }: Props) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (data.photos.length + files.length > 10) {
      alert("You can upload a maximum of 10 photos.");
      return;
    }

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImageToCloudinary(files[i]);
        newUrls.push(url);
      }
      updateData({ photos: [...data.photos, ...newUrls] });
    } catch (error) {
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...data.photos];
    newPhotos.splice(index, 1);
    updateData({ photos: newPhotos });
  };

  return (
    <div className="flex flex-col h-full bg-white px-4 md:px-8 py-6 rounded-3xl w-full max-w-md mx-auto min-h-[500px]">
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-1">Upload Photos & Videos</h2>
        <p className="text-sm text-gray-500 font-medium mb-6">
          Help pet parents see your space.
        </p>

        <div className="space-y-4 flex-1">
          <label className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#FBBF24] hover:bg-yellow-50/50 transition-colors">
            <Camera size={32} className="text-gray-400 mb-2" />
            <span className="font-extrabold text-[#1B2B48] text-sm mb-1">Add Photos / Videos</span>
            <span className="text-xs text-gray-500 font-medium px-4">Upload clear photos of your home, rooms, play area, balcony, etc. (Max 10 files)</span>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleFileUpload} 
              disabled={uploading || data.photos.length >= 10}
            />
          </label>

          {uploading && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FBBF24]"></div>
              <span className="ml-2 text-sm font-bold text-gray-500">Uploading...</span>
            </div>
          )}

          {data.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {data.photos.map((url, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 group">
                  <img src={url} alt={`Facility ${i + 1}`} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {data.photos.length < 10 && !uploading && (
                <label className="aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#FBBF24] transition-colors">
                  <Plus size={20} className="text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-500">Add More</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
                </label>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <Button variant="ghost" onClick={onBack} className="text-[#FBBF24] hover:bg-[#FFF9E6]">
          &larr; Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={data.photos.length === 0}
          className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] px-8 shadow-md shadow-[#FBBF24]/20"
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};
