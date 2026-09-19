import React from 'react';
import type { CaretakerFormData } from './types';
import { Button } from '../../../components/ui/Button';

interface Props {
  data: CaretakerFormData;
  updateData: (data: Partial<CaretakerFormData>) => void;
  onNext: () => void;
  onLoginClick: () => void;
}

export const Step1SignUp = ({ data, updateData, onNext, onLoginClick }: Props) => {
  return (
    <div className="flex flex-col h-full bg-white px-4 md:px-8 py-6 rounded-3xl w-full max-w-md mx-auto min-h-[500px]">
      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-2xl font-extrabold text-[#1B2B48] mt-2 mb-2">Create Your Partner Account</h2>
        <p className="text-sm text-gray-500 font-medium text-center px-4 mb-8">
          Join our community of trusted pet care providers and help pets feel at home.
        </p>

        <div className="w-full space-y-3">
          <button 
            onClick={() => {
              updateData({ authMethod: 'google' });
              onNext();
            }}
            className="w-full h-12 flex items-center justify-center space-x-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-bold text-[#1B2B48] shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            <span>Continue with Google</span>
          </button>
          
          <button 
            onClick={() => {
              updateData({ authMethod: 'phone' });
              onNext();
            }}
            className="w-full h-12 flex items-center justify-center space-x-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-bold text-[#1B2B48] shadow-sm"
          >
            <span className="text-xl">📞</span>
            <span>Continue with Phone Number</span>
          </button>
          
          <button 
            onClick={() => {
              updateData({ authMethod: 'email' });
              onNext();
            }}
            className="w-full h-12 flex items-center justify-center space-x-3 rounded-xl border border-gray-200 bg-white hover:bg-[#FFF9E6] transition-colors font-bold text-[#1B2B48] shadow-sm"
          >
            <span className="text-xl text-[#FBBF24]">✉️</span>
            <span>Continue with Email</span>
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-4 w-full">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">OR</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <div className="mt-6 text-center">
          <span className="text-gray-500 font-medium text-sm">Already have an account? </span>
          <button 
            onClick={onLoginClick}
            className="text-[#FBBF24] font-extrabold text-sm hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
