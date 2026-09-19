import React from 'react';
import type { CaretakerFormData } from './types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Phone, Mail } from 'lucide-react';

interface Props {
  data: CaretakerFormData;
  updateData: (data: Partial<CaretakerFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Contact = ({ data, updateData, onNext, onBack }: Props) => {
  return (
    <div className="flex flex-col h-full bg-white px-4 md:px-8 py-6 rounded-3xl w-full max-w-md mx-auto min-h-[500px]">
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-1">Contact Information</h2>
        <p className="text-sm text-gray-500 font-medium mb-8">
          We'll use this to get in touch with you for bookings and important updates.
        </p>

        <div className="space-y-5 flex-1">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              Phone Number (Call) <span className="text-red-500">*</span>
            </label>
            <Input 
              leftIcon={<Phone size={18} className="text-[#FBBF24]" />}
              placeholder="+91 7292080750" 
              type="tel"
              value={data.phone}
              onChange={e => updateData({ phone: e.target.value })}
              className="h-12 bg-gray-50 border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <Input 
              leftIcon={<span className="text-[#25D366] font-bold text-lg leading-none">W</span>}
              placeholder="+91 7292045219" 
              type="tel"
              value={data.whatsapp}
              onChange={e => updateData({ whatsapp: e.target.value })}
              className="h-12 bg-gray-50 border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input 
              leftIcon={<Mail size={18} className="text-[#FBBF24]" />}
              placeholder="rohan@gmail.com" 
              type="email"
              value={data.email}
              onChange={e => updateData({ email: e.target.value })}
              className="h-12 bg-gray-50 border-gray-200"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <Button variant="ghost" onClick={onBack} className="text-[#FBBF24] hover:bg-[#FFF9E6]">
          &larr; Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!data.phone || !data.whatsapp || !data.email}
          className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] px-8 shadow-md shadow-[#FBBF24]/20"
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};
