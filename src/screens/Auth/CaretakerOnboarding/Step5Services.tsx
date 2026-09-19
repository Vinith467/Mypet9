import React from 'react';
import type { CaretakerFormData } from './types';
import { Button } from '../../../components/ui/Button';
import { Home, Briefcase, CheckCircle2 } from 'lucide-react';

interface Props {
  data: CaretakerFormData;
  updateData: (data: Partial<CaretakerFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step5Services = ({ data, updateData, onNext, onBack }: Props) => {
  const toggleService = (key: keyof CaretakerFormData['services']) => {
    updateData({ services: { ...data.services, [key]: !data.services[key] } });
  };

  const togglePet = (key: keyof CaretakerFormData['acceptedPets']) => {
    updateData({ acceptedPets: { ...data.acceptedPets, [key]: !data.acceptedPets[key] } });
  };

  const toggleDogSize = (key: keyof CaretakerFormData['dogSize']) => {
    updateData({ dogSize: { ...data.dogSize, [key]: !data.dogSize[key] } });
  };

  return (
    <div className="flex flex-col h-full bg-white px-4 md:px-8 py-6 rounded-3xl w-full max-w-md mx-auto min-h-[500px]">
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-1">Select Services You Offer</h2>
        <p className="text-sm text-gray-500 font-medium mb-6">
          Choose the type of care you provide.
        </p>

        <div className="space-y-6 flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => toggleService('homeStay')}
              className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all text-center flex flex-col items-center justify-center ${
                data.services.homeStay ? 'border-[#FBBF24] bg-[#FFF9E6] shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              {data.services.homeStay && <CheckCircle2 size={16} className="absolute top-2 right-2 text-[#FBBF24] fill-white" />}
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mb-2">
                <Home size={20} className="text-[#FBBF24]" />
              </div>
              <h3 className="font-extrabold text-[#1B2B48] text-sm mb-1">Home Stay</h3>
              <p className="text-[10px] text-gray-500 font-medium leading-tight">Pets stay in your home as part of your family.</p>
            </div>
            
            <div 
              onClick={() => toggleService('boarding')}
              className={`relative cursor-pointer rounded-2xl p-4 border-2 transition-all text-center flex flex-col items-center justify-center ${
                data.services.boarding ? 'border-[#FBBF24] bg-[#FFF9E6] shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              {data.services.boarding && <CheckCircle2 size={16} className="absolute top-2 right-2 text-[#FBBF24] fill-white" />}
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mb-2">
                <Briefcase size={20} className="text-[#FBBF24]" />
              </div>
              <h3 className="font-extrabold text-[#1B2B48] text-sm mb-1">Boarding</h3>
              <p className="text-[10px] text-gray-500 font-medium leading-tight">Dedicated space for pets at your facility.</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              Select Pets You Can Care For <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { id: 'dogs', label: 'Dogs', icon: '🐶' },
                { id: 'cats', label: 'Cats', icon: '🐱' },
                { id: 'birds', label: 'Birds', icon: '🦜' },
                { id: 'rabbits', label: 'Rabbits', icon: '🐰' },
                { id: 'others', label: 'Others', icon: '🐾' },
              ].map(pet => (
                <label key={pet.id} className="flex items-center space-x-3 cursor-pointer">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    data.acceptedPets[pet.id as keyof CaretakerFormData['acceptedPets']] ? 'bg-[#FBBF24] border-[#FBBF24]' : 'border-gray-300'
                  }`}>
                    {data.acceptedPets[pet.id as keyof CaretakerFormData['acceptedPets']] && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <input type="checkbox" className="hidden" checked={data.acceptedPets[pet.id as keyof CaretakerFormData['acceptedPets']]} onChange={() => togglePet(pet.id as keyof CaretakerFormData['acceptedPets'])} />
                  <span className="text-sm font-bold text-gray-700">{pet.icon} {pet.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          {data.acceptedPets.dogs && (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
                Dog Size (select all that apply)
              </label>
              <div className="space-y-2">
                {[
                  { id: 'small', label: 'Small (up to 10 kg)' },
                  { id: 'medium', label: 'Medium (10 - 25 kg)' },
                  { id: 'large', label: 'Large (above 25 kg)' },
                ].map(size => (
                  <label key={size.id} className="flex items-center space-x-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      data.dogSize[size.id as keyof CaretakerFormData['dogSize']] ? 'bg-[#FBBF24] border-[#FBBF24]' : 'border-gray-300'
                    }`}>
                      {data.dogSize[size.id as keyof CaretakerFormData['dogSize']] && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" checked={data.dogSize[size.id as keyof CaretakerFormData['dogSize']]} onChange={() => toggleDogSize(size.id as keyof CaretakerFormData['dogSize'])} />
                    <span className="text-sm font-medium text-gray-600">{size.label}</span>
                  </label>
                ))}
              </div>
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
          disabled={!data.services.homeStay && !data.services.boarding}
          className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] px-8 shadow-md shadow-[#FBBF24]/20"
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};
