import React from 'react';
import type { CaretakerFormData } from './types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { User } from 'lucide-react';

interface Props {
  data: CaretakerFormData;
  updateData: (data: Partial<CaretakerFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2BasicInfo = ({ data, updateData, onNext, onBack }: Props) => {
  return (
    <div className="flex flex-col h-full bg-white px-4 md:px-8 py-6 rounded-3xl w-full max-w-md mx-auto min-h-[500px]">
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-1">Tell Us About Yourself</h2>
        <p className="text-sm text-gray-500 font-medium mb-8">
          Let's get to know you.
        </p>

        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input 
              leftIcon={<User size={18} />}
              placeholder="Rohan" 
              value={data.firstName}
              onChange={e => updateData({ firstName: e.target.value })}
              className="h-12 bg-gray-50 border-gray-200"
            />
            <p className="text-[11px] text-gray-400 font-medium ml-1">This will be used for your partner profile.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              Registering as <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => updateData({ registeringAs: 'Individual' })}
                className={`flex-1 h-14 rounded-xl flex items-center justify-center space-x-2 font-bold transition-all ${
                  data.registeringAs === 'Individual' 
                    ? 'bg-[#FBBF24] text-[#1B2B48] shadow-md shadow-[#FBBF24]/20 border-2 border-transparent' 
                    : 'bg-white border-2 border-gray-100 text-gray-500 hover:border-gray-200'
                }`}
              >
                <User size={18} className={data.registeringAs === 'Individual' ? 'text-[#1B2B48]' : 'text-gray-400'} />
                <span>Individual</span>
              </button>
              
              <button
                onClick={() => updateData({ registeringAs: 'Business' })}
                className={`flex-1 h-14 rounded-xl flex items-center justify-center space-x-2 font-bold transition-all ${
                  data.registeringAs === 'Business' 
                    ? 'bg-[#FBBF24] text-[#1B2B48] shadow-md shadow-[#FBBF24]/20 border-2 border-transparent' 
                    : 'bg-white border-2 border-gray-100 text-gray-500 hover:border-gray-200'
                }`}
              >
                <span className="text-lg">🏢</span>
                <span>Business</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <Button variant="ghost" onClick={onBack} className="text-[#FBBF24] hover:bg-[#FFF9E6]">
          &larr; Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!data.firstName}
          className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] px-8 shadow-md shadow-[#FBBF24]/20"
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};
