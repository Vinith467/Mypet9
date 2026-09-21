import React, { useState } from 'react';
import type { CaretakerFormData } from './types';
import { Button } from '../../../components/ui/Button';
import { User, Phone, MapPin, PawPrint, Home, FileText, Image, MessageSquare } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';

interface Props {
  data: CaretakerFormData;
  updateData: (data: Partial<CaretakerFormData>) => void;
  onBack: () => void;
  setStep: (step: number) => void;
  onSuccess: () => void;
}

export const Step10Review = ({ data, updateData, onBack, setStep, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!data.termsAccepted) return;
    
    const user = auth.currentUser;
    if (!user) {
      setError('You must be logged in to submit an application.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use setDoc with user.uid to prevent multiple applications
      await setDoc(doc(db, 'caretaker_applications', user.uid), {
        ...data,
        status: 'pending',
        uid: user.uid,
        createdAt: serverTimestamp()
      });

      // Update the user's status to under_review and save core profile data
      await updateDoc(doc(db, 'users', user.uid), {
        status: 'under_review',
        name: data.firstName,
        phone: data.phone
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ title, icon, onEdit, children }: any) => (
    <div className="border-b border-gray-100 py-4 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-[#1B2B48]">
          {icon}
          <h4 className="font-extrabold text-sm">{title}</h4>
        </div>
        <button onClick={onEdit} className="text-[#FBBF24] text-xs font-bold hover:underline">Edit</button>
      </div>
      <div className="pl-6 space-y-1">
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white px-4 md:px-8 py-6 rounded-3xl w-full max-w-md mx-auto min-h-[500px]">
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-1">Review & Submit</h2>
        <p className="text-sm text-gray-500 font-medium mb-6">
          Please check your details before submitting.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-4 border border-red-100">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-3">
          <Section title="Basic Information" icon={<User size={16} className="text-[#FBBF24]" />} onEdit={() => setStep(1)}>
            <div className="text-xs text-gray-600 font-medium space-y-1">
              <div><span className="text-gray-400 w-16 inline-block">Name:</span> <span className="font-bold text-[#1B2B48]">{data.firstName}</span></div>
              <div><span className="text-gray-400 w-16 inline-block">Type:</span> <span className="font-bold text-[#1B2B48]">{data.registeringAs}</span></div>
            </div>
          </Section>

          <Section title="Contact Details" icon={<Phone size={16} className="text-[#FBBF24]" />} onEdit={() => setStep(2)}>
            <div className="text-xs font-bold text-[#1B2B48] space-y-1.5 flex flex-col">
              <div className="flex items-center space-x-2"><span className="text-[14px]">📞</span> <span>{data.phone}</span></div>
              <div className="flex items-center space-x-2"><span className="text-[14px]">💬</span> <span>{data.whatsapp}</span></div>
              <div className="flex items-center space-x-2"><span className="text-[14px]">✉️</span> <span>{data.email}</span></div>
            </div>
          </Section>

          <Section title="Experience & Address" icon={<MapPin size={16} className="text-[#FBBF24]" />} onEdit={() => setStep(3)}>
            <div className="text-xs text-gray-600 font-medium space-y-1">
              <div><span className="font-bold text-[#1B2B48]">{data.experienceYears}</span></div>
              <div className="whitespace-pre-line leading-relaxed">{data.address}</div>
            </div>
          </Section>

          <Section title="Services & Pets" icon={<PawPrint size={16} className="text-[#FBBF24]" />} onEdit={() => setStep(4)}>
            <div className="text-xs text-gray-600 font-medium space-y-1">
              <div>
                <span className="text-gray-400 w-16 inline-block">Services:</span> 
                <span className="font-bold text-[#1B2B48]">
                  {[data.services.homeStay && 'Home Stay', data.services.boarding && 'Boarding', data.services.grooming && 'Grooming'].filter(Boolean).join(', ')}
                </span>
              </div>
              <div>
                <span className="text-gray-400 w-16 inline-block">Pets:</span> 
                <span className="font-bold text-[#1B2B48]">
                  {Object.entries(data.acceptedPets).filter(([_, v]) => v).map(([k]) => k.charAt(0).toUpperCase() + k.slice(1)).join(', ')}
                </span>
              </div>
            </div>
          </Section>

          <Section title="Facility Details" icon={<Home size={16} className="text-[#FBBF24]" />} onEdit={() => setStep(5)}>
            <div className="text-xs text-gray-600 font-medium space-y-1">
              <div><span className="font-bold text-[#1B2B48]">{data.homeType}</span></div>
              <div>{data.spaceAvailable}</div>
              <div>Max Pets: <span className="font-bold text-[#1B2B48]">{data.maxPets}</span></div>
            </div>
          </Section>

          <Section title="KYC Documents" icon={<FileText size={16} className="text-[#FBBF24]" />} onEdit={() => setStep(7)}>
            <div className="text-xs text-gray-500">
              Aadhaar, Address Proof, PAN, Photo
            </div>
          </Section>

          <Section title="Photos" icon={<Image size={16} className="text-[#FBBF24]" />} onEdit={() => setStep(6)}>
            <div className="text-xs text-gray-500">
              {data.photos.length} photos uploaded
            </div>
          </Section>

          <Section title="Additional Remarks" icon={<MessageSquare size={16} className="text-[#FBBF24]" />} onEdit={() => setStep(8)}>
            <div className="text-xs text-gray-500">
              {data.remarks ? 'Added' : 'None'}
            </div>
          </Section>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4 pb-2">
          <label className="flex items-start space-x-3 cursor-pointer group">
            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
              data.termsAccepted ? 'bg-[#FBBF24] border-[#FBBF24]' : 'border-gray-300 bg-white group-hover:border-[#FBBF24]'
            }`}>
              {data.termsAccepted && <span className="text-white text-xs font-bold">✓</span>}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={data.termsAccepted} 
              onChange={() => updateData({ termsAccepted: !data.termsAccepted })} 
            />
            <span className="text-xs font-medium text-gray-600 leading-tight">
              I confirm that the information provided is correct and I agree to the <a href="#" className="font-bold text-[#FBBF24] hover:underline">Partner Terms & Conditions</a>
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button variant="ghost" onClick={onBack} className="text-[#FBBF24] hover:bg-[#FFF9E6]">
          &larr; Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!data.termsAccepted || loading}
          className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] px-6 shadow-md shadow-[#FBBF24]/20"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </div>
  );
};
