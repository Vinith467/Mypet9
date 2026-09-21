import React from 'react';
import type { CaretakerFormData } from './types';
import { Button } from '../../../components/ui/Button';
import { Home, Briefcase, Scissors, CheckCircle2 } from 'lucide-react';

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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div 
              onClick={() => toggleService('homeStay')}
              className={`relative cursor-pointer rounded-2xl p-3 border-2 transition-all text-center flex flex-col items-center justify-center ${
                data.services.homeStay ? 'border-[#FBBF24] bg-[#FFF9E6] shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              {data.services.homeStay && <CheckCircle2 size={16} className="absolute top-2 right-2 text-[#FBBF24] fill-white" />}
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mb-2">
                <Home size={20} className="text-[#FBBF24]" />
              </div>
              <h3 className="font-extrabold text-[#1B2B48] text-xs mb-1">Home Stay</h3>
              <p className="text-[9px] text-gray-500 font-medium leading-tight">In your home.</p>
            </div>
            
            <div 
              onClick={() => toggleService('boarding')}
              className={`relative cursor-pointer rounded-2xl p-3 border-2 transition-all text-center flex flex-col items-center justify-center ${
                data.services.boarding ? 'border-[#FBBF24] bg-[#FFF9E6] shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              {data.services.boarding && <CheckCircle2 size={16} className="absolute top-2 right-2 text-[#FBBF24] fill-white" />}
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mb-2">
                <Briefcase size={20} className="text-[#FBBF24]" />
              </div>
              <h3 className="font-extrabold text-[#1B2B48] text-xs mb-1">Boarding</h3>
              <p className="text-[9px] text-gray-500 font-medium leading-tight">At your facility.</p>
            </div>

            <div 
              onClick={() => toggleService('grooming')}
              className={`relative cursor-pointer rounded-2xl p-3 border-2 transition-all text-center flex flex-col items-center justify-center col-span-2 sm:col-span-1 ${
                data.services.grooming ? 'border-[#FBBF24] bg-[#FFF9E6] shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              {data.services.grooming && <CheckCircle2 size={16} className="absolute top-2 right-2 text-[#FBBF24] fill-white" />}
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mb-2">
                <Scissors size={20} className="text-[#FBBF24]" />
              </div>
              <h3 className="font-extrabold text-[#1B2B48] text-xs mb-1">Grooming</h3>
              <p className="text-[9px] text-gray-500 font-medium leading-tight">Pet spa & hygiene.</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              Select Pets You Can Care For <span className="text-red-500">*</span>
            </label>
            <p className="text-[10px] text-gray-500 font-medium ml-1 mb-2">
              Choose all that apply.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { id: 'dogs', label: 'Dogs', img: '/images/pets/dog.jpg' },
                { id: 'cats', label: 'Cats', img: '/images/pets/cat.jpg' },
                { id: 'birds', label: 'Birds', img: '/images/pets/bird.jpg' },
                { id: 'rabbits', label: 'Rabbits', img: '/images/pets/rabbit.jpg' },
                { id: 'others', label: 'Others', img: '/images/pets/other.jpg' },
              ].map(pet => (
                <label key={pet.id} className={`relative cursor-pointer rounded-2xl border-2 transition-all p-2 flex flex-col items-center justify-center ${
                  data.acceptedPets[pet.id as keyof CaretakerFormData['acceptedPets']] ? 'border-[#FBBF24] bg-white shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
                }`}>
                  <div className={`absolute top-2 right-2 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    data.acceptedPets[pet.id as keyof CaretakerFormData['acceptedPets']] ? 'bg-[#FBBF24] border-[#FBBF24]' : 'border-gray-300'
                  }`}>
                    {data.acceptedPets[pet.id as keyof CaretakerFormData['acceptedPets']] && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={data.acceptedPets[pet.id as keyof CaretakerFormData['acceptedPets']]} onChange={() => togglePet(pet.id as keyof CaretakerFormData['acceptedPets'])} />
                  <img src={pet.img} alt={pet.label} className="w-12 h-12 object-cover rounded-full mb-1 bg-white" />
                  <span className="text-xs font-bold text-[#1B2B48]">{pet.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          {data.acceptedPets.dogs && (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
                Dog Size (select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'small', label: 'Small', sub: '(up to 10 kg)', img: '/images/pets/dog_small.jpg' },
                  { id: 'medium', label: 'Medium', sub: '(10 - 25 kg)', img: '/images/pets/dog_medium.jpg' },
                  { id: 'large', label: 'Large', sub: '(above 25 kg)', img: '/images/pets/dog_large.jpg' },
                ].map(size => (
                  <label key={size.id} className={`relative cursor-pointer rounded-2xl border-2 transition-all p-2 flex items-center ${
                    data.dogSize[size.id as keyof CaretakerFormData['dogSize']] ? 'border-[#FBBF24] bg-white shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}>
                    <div className={`absolute top-2 right-2 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      data.dogSize[size.id as keyof CaretakerFormData['dogSize']] ? 'bg-[#FBBF24] border-[#FBBF24]' : 'border-gray-300'
                    }`}>
                      {data.dogSize[size.id as keyof CaretakerFormData['dogSize']] && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <input type="checkbox" className="hidden" checked={data.dogSize[size.id as keyof CaretakerFormData['dogSize']]} onChange={() => toggleDogSize(size.id as keyof CaretakerFormData['dogSize'])} />
                    
                    <img src={size.img} alt={size.label} className="w-10 h-10 object-cover rounded-full mr-2 bg-white" />
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-[#1B2B48]">{size.label}</span>
                      <span className="text-[9px] text-gray-500 font-medium">{size.sub}</span>
                    </div>
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
          disabled={!data.services.homeStay && !data.services.boarding && !data.services.grooming}
          className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] px-8 shadow-md shadow-[#FBBF24]/20"
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};
