import React from 'react';
import { CaretakerApplicationForm } from './CaretakerApplicationForm';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PawPrint } from 'lucide-react';

interface Props {
  onBack?: () => void;
  onLoginClick?: () => void;
}

export const CaretakerApplicationScreen = ({ onBack, onLoginClick }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side: Image/Branding (Hidden on mobile, visible on desktop) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 bg-[#FBBF24] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-black/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-12">
            <div className="bg-white p-2 rounded-xl shadow-md">
              <PawPrint size={28} className="text-[#FBBF24]" fill="#FBBF24" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#1B2B48] tracking-tight">
              MyPet<span className="text-white">9</span>
            </h1>
          </div>
          
          <h2 className="text-5xl font-extrabold text-[#1B2B48] leading-[1.1] mb-6">
            Turn your love for pets into a rewarding career.
          </h2>
          <p className="text-lg text-[#1B2B48]/80 font-medium max-w-md">
            Join thousands of trusted caretakers and create a safe, loving environment for pets when their parents are away.
          </p>
        </div>

        <div className="relative z-10 bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 mt-8 max-w-md">
          <div className="flex -space-x-3 mb-4">
            <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-[#FBBF24]" alt="User" />
            <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-2 border-[#FBBF24]" alt="User" />
            <img src="https://i.pravatar.cc/100?img=3" className="w-10 h-10 rounded-full border-2 border-[#FBBF24]" alt="User" />
            <div className="w-10 h-10 rounded-full border-2 border-[#FBBF24] bg-white flex items-center justify-center text-xs font-bold text-[#1B2B48]">+2k</div>
          </div>
          <p className="font-extrabold text-[#1B2B48] text-sm">Join our growing community of 2,000+ verified caretakers.</p>
        </div>
      </div>

      {/* Right Side: Form (Full width on mobile, half width on desktop) */}
      <div className="w-full lg:w-[55%] xl:w-1/2 h-screen overflow-y-auto px-4 lg:px-8 xl:px-12 relative">
        <div className="w-full max-w-md xl:max-w-lg mx-auto pb-12">
          <CaretakerApplicationForm 
            onBack={onBack || (() => navigate(-1))} 
            onLoginClick={onLoginClick || (() => navigate('/auth', { state: { role: 'caretaker' } }))}
          />
        </div>
      </div>
    </div>
  );
};
