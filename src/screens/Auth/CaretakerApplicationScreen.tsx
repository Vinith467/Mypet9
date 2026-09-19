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
    <div className="min-h-screen bg-[#FBF6EE] flex flex-col items-center justify-center py-4 px-4 relative overflow-hidden">
      <button 
        onClick={onBack || (() => navigate(-1))}
        className="absolute top-4 left-4 lg:top-6 lg:left-6 p-2 bg-white rounded-full shadow-md text-[#1B2B48] hover:bg-gray-50 transition-colors z-10"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="max-w-4xl w-full">
        <div className="flex flex-col items-center justify-center mb-6">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="bg-[#174F38] p-2 rounded-xl shadow-md shadow-[#174F38]/20">
              <PawPrint size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-extrabold text-[#1B2B48] tracking-tight">
              Mypet<span className="text-[#174F38]">9</span>
            </h1>
          </div>
          
          <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-1">
            Become a Caretaker
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Join the community and turn your love for pets into earnings.
          </p>
        </div>

        <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-xl shadow-gray-200/50">
          <CaretakerApplicationForm />
          
          <div className="mt-4 text-center">
            <span className="text-gray-500 font-medium text-sm">Already a caretaker? </span>
            <button 
              onClick={onLoginClick || (() => navigate('/auth', { state: { role: 'caretaker' } }))}
              className="text-[#174F38] font-bold text-sm hover:underline"
            >
              Log in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
