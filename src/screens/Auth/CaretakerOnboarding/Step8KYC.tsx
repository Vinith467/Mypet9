import React, { useState } from 'react';
import type { CaretakerFormData } from './types';
import { Button } from '../../../components/ui/Button';
import { Upload, CheckCircle2, FileText, Home, CreditCard, User } from 'lucide-react';
import { uploadImageToCloudinary } from '../../../utils/cloudinary';

interface Props {
  data: CaretakerFormData;
  updateData: (data: Partial<CaretakerFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step8KYC = ({ data, updateData, onNext, onBack }: Props) => {
  const [uploading, setUploading] = useState<string | null>(null);

  const handleUpload = async (key: keyof CaretakerFormData['kyc'], file: File) => {
    setUploading(key);
    try {
      const url = await uploadImageToCloudinary(file);
      updateData({ kyc: { ...data.kyc, [key]: url } });
    } catch (error) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  const UploadRow = ({ 
    title, subtitle, icon, docKey 
  }: { 
    title: string; subtitle?: string; icon: React.ReactNode; docKey: keyof CaretakerFormData['kyc'] 
  }) => {
    const isUploaded = !!data.kyc[docKey];
    const isUploading = uploading === docKey;

    return (
      <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#FBBF24] shadow-sm">
            {icon}
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#1B2B48] flex items-center">
              {title} <span className="text-red-500 ml-1">*</span>
            </h4>
            {subtitle && <p className="text-[10px] text-gray-500 font-medium">{subtitle}</p>}
          </div>
        </div>

        <div className="shrink-0">
          {isUploaded ? (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold">
              <CheckCircle2 size={14} />
              <span>Uploaded</span>
            </div>
          ) : isUploading ? (
            <div className="flex items-center space-x-2 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500"></div>
              <span>Uploading</span>
            </div>
          ) : (
            <label className="flex items-center space-x-1.5 text-[#1B2B48] bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
              <Upload size={14} />
              <span>Upload</span>
              <input 
                type="file" 
                accept="image/*,.pdf" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleUpload(docKey, e.target.files[0]);
                  }
                }}
              />
            </label>
          )}
        </div>
      </div>
    );
  };

  const allUploaded = data.kyc.aadhaar && data.kyc.addressProof && data.kyc.pan && data.kyc.photo;

  return (
    <div className="flex flex-col h-full bg-white px-4 md:px-8 py-6 rounded-3xl w-full max-w-md mx-auto min-h-[500px]">
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-1">Verify Your Identity</h2>
        <p className="text-sm text-gray-500 font-medium mb-6">
          Upload the required documents for verification.
        </p>

        <div className="space-y-3 flex-1">
          <UploadRow 
            title="Aadhaar Card" 
            icon={<FileText size={20} />} 
            docKey="aadhaar" 
          />
          <UploadRow 
            title="Address Proof" 
            subtitle="(Electricity bill, Water bill, or Rent Agreement)"
            icon={<Home size={20} />} 
            docKey="addressProof" 
          />
          <UploadRow 
            title="PAN Card" 
            icon={<CreditCard size={20} />} 
            docKey="pan" 
          />
          <UploadRow 
            title="Your Photo" 
            icon={<User size={20} />} 
            docKey="photo" 
          />

          <div className="flex items-start space-x-2 mt-6 p-4 bg-[#FFF9E6] rounded-xl">
            <span className="text-xl">🔒</span>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Your documents are safe and secure with us. They will only be used for verification.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <Button variant="ghost" onClick={onBack} className="text-[#FBBF24] hover:bg-[#FFF9E6]">
          &larr; Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!allUploaded}
          className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] px-8 shadow-md shadow-[#FBBF24]/20"
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};
