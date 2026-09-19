import React from 'react';
import type { CaretakerFormData } from './types';
import { Button } from '../../../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  data: CaretakerFormData;
  updateData: (data: Partial<CaretakerFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step9Additional = ({ data, updateData, onNext, onBack }: Props) => {
  const toggleFacility = (key: keyof CaretakerFormData['specialFacilities']) => {
    updateData({ specialFacilities: { ...data.specialFacilities, [key]: !data.specialFacilities[key] } });
  };

  return (
    <div className="flex flex-col h-full bg-white px-4 md:px-8 py-6 rounded-3xl w-full max-w-md mx-auto min-h-[500px]">
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-1">Additional Remarks (Optional)</h2>
        <p className="text-sm text-gray-500 font-medium mb-6">
          Share anything else you'd like pet parents to know.
        </p>

        <div className="space-y-6 flex-1">
          <div>
            <textarea
              placeholder="E.g. special care, medical handling, diet preferences, house rules, etc."
              value={data.remarks}
              onChange={(e) => updateData({ remarks: e.target.value })}
              maxLength={500}
              className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50"
            />
            <div className="text-right text-[10px] font-bold text-gray-400 mt-1">
              {data.remarks.length}/500
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              Special Facilities (select all that apply)
            </label>
            <div className="space-y-2">
              {[
                { id: 'dedicatedRoom', label: 'Dedicated pet room' },
                { id: 'playArea', label: 'Play area' },
                { id: 'garden', label: 'Garden / Outdoor space' },
                { id: 'grooming', label: 'Pet grooming' },
                { id: 'homeCooked', label: 'Home-cooked food (custom diet)' },
                { id: 'medication', label: 'Can administer medication' },
                { id: 'cctv', label: 'CCTV monitoring' },
                { id: 'other', label: 'Other (please specify in remarks)' },
              ].map(facility => (
                <label key={facility.id} className="flex items-center space-x-3 cursor-pointer">
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                    data.specialFacilities[facility.id as keyof CaretakerFormData['specialFacilities']] ? 'bg-[#FBBF24]' : 'bg-gray-100'
                  }`}>
                    {data.specialFacilities[facility.id as keyof CaretakerFormData['specialFacilities']] && <CheckCircle2 size={16} className="text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={data.specialFacilities[facility.id as keyof CaretakerFormData['specialFacilities']]} onChange={() => toggleFacility(facility.id as keyof CaretakerFormData['specialFacilities'])} />
                  <span className="text-sm font-medium text-gray-600">{facility.label}</span>
                </label>
              ))}
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
          className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] px-8 shadow-md shadow-[#FBBF24]/20"
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};
