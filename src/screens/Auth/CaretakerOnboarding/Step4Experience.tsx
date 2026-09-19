import React, { useState } from 'react';
import type { CaretakerFormData } from './types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { MapPin } from 'lucide-react';

interface Props {
  data: CaretakerFormData;
  updateData: (data: Partial<CaretakerFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4Experience = ({ data, updateData, onNext, onBack }: Props) => {
  const [locating, setLocating] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const json = await res.json();
          if (json && json.display_name) {
            updateData({ address: json.display_name });
          } else {
            alert('Could not determine address from location.');
          }
        } catch (error) {
          alert('Failed to fetch address.');
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        alert('Unable to retrieve your location. Please ensure location permissions are granted.');
        setLocating(false);
      }
    );
  };

  return (
    <div className="flex flex-col h-full bg-white px-4 md:px-8 py-6 rounded-3xl w-full max-w-md mx-auto min-h-[500px]">
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-1">Your Experience & Location</h2>
        <p className="text-sm text-gray-500 font-medium mb-8">
          Help us understand your background and where you are located.
        </p>

        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <select
              value={data.experienceYears}
              onChange={e => updateData({ experienceYears: e.target.value })}
              className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50"
            >
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1 - 3 years">1 - 3 years</option>
              <option value="3 - 5 years">3 - 5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1B2B48] uppercase tracking-wider ml-1">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3.5 text-[#FBBF24]">
                <MapPin size={18} />
              </div>
              <textarea 
                placeholder="123, Green Park Apartment&#10;Koramangala&#10;Bangalore - 560034"
                value={data.address}
                onChange={e => updateData({ address: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50"
              />
            </div>
          </div>
          
          <div className="relative h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
            {/* Fake Map Background */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button 
                variant="outline" 
                onClick={handleGetLocation}
                disabled={locating}
                className="bg-white/90 backdrop-blur-sm border-gray-200 shadow-sm text-gray-700 text-xs px-4 h-8 hover:bg-gray-50 font-bold"
              >
                {locating ? 'Locating...' : '📍 Use Current Location'}
              </Button>
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
          disabled={!data.experienceYears || !data.address}
          className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] px-8 shadow-md shadow-[#FBBF24]/20"
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};
