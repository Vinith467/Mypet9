import React from 'react';
import type { CaretakerFormData } from './types';
import { Button } from '../../../components/ui/Button';

interface Props {
  data: CaretakerFormData;
  updateData: (data: Partial<CaretakerFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step6Facility = ({ data, updateData, onNext, onBack }: Props) => {
  const toggleFeature = (key: keyof CaretakerFormData['safetyFeatures']) => {
    updateData({ safetyFeatures: { ...data.safetyFeatures, [key]: !data.safetyFeatures[key] } });
  };

  return (
    <div className="flex flex-col h-full bg-white px-4 md:px-8 py-6 rounded-3xl w-full max-w-md mx-auto min-h-[500px]">
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-1">Tell Us About Your Facility</h2>
        <p className="text-sm text-gray-500 font-medium mb-6">
          Share details about your space and the facilities available for pets.
        </p>

        <div className="space-y-4 flex-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              Type of Home <span className="text-red-500">*</span>
            </label>
            <select
              value={data.homeType}
              onChange={e => updateData({ homeType: e.target.value })}
              className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50"
            >
              <option value="Apartment">Apartment</option>
              <option value="Independent House">Independent House</option>
              <option value="Villa">Villa</option>
              <option value="Farmhouse">Farmhouse</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              Space Available for Pets <span className="text-red-500">*</span>
            </label>
            <select
              value={data.spaceAvailable}
              onChange={e => updateData({ spaceAvailable: e.target.value })}
              className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50"
            >
              <option value="Spacious room + Balcony">Spacious room + Balcony</option>
              <option value="Dedicated Pet Room">Dedicated Pet Room</option>
              <option value="Living Room only">Living Room only</option>
              <option value="Whole house access">Whole house access</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              Outdoor Access
            </label>
            <select
              value={data.outdoorAccess}
              onChange={e => updateData({ outdoorAccess: e.target.value })}
              className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50"
            >
              <option value="Not available">Not available</option>
              <option value="Small Garden / Backyard">Small Garden / Backyard</option>
              <option value="Large Fenced Garden">Large Fenced Garden</option>
              <option value="Terrace">Terrace</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              Number of Pets You Can Board at a Time <span className="text-red-500">*</span>
            </label>
            <select
              value={data.maxPets}
              onChange={e => updateData({ maxPets: e.target.value })}
              className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50"
            >
              <option value="Only 1 pet">Only 1 pet</option>
              <option value="Up to 3 pets">Up to 3 pets</option>
              <option value="4 - 6 pets">4 - 6 pets</option>
              <option value="More than 6 pets">More than 6 pets</option>
            </select>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-100">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              Safety Features
            </label>
            <div className="space-y-2">
              {[
                { id: 'secureBalcony', label: 'Secure balcony / windows' },
                { id: 'fencedArea', label: 'Fenced area' },
                { id: 'separateRoom', label: 'Separate pet room' },
                { id: 'supervision247', label: '24/7 supervision' },
              ].map(feature => (
                <label key={feature.id} className="flex items-center space-x-3 cursor-pointer">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    data.safetyFeatures[feature.id as keyof CaretakerFormData['safetyFeatures']] ? 'bg-[#FBBF24] border-[#FBBF24]' : 'border-gray-300'
                  }`}>
                    {data.safetyFeatures[feature.id as keyof CaretakerFormData['safetyFeatures']] && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <input type="checkbox" className="hidden" checked={data.safetyFeatures[feature.id as keyof CaretakerFormData['safetyFeatures']]} onChange={() => toggleFeature(feature.id as keyof CaretakerFormData['safetyFeatures'])} />
                  <span className="text-sm font-medium text-gray-600">{feature.label}</span>
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
