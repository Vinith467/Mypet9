import React, { useState } from 'react';
import { PawPrint, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { CaretakerFormData } from './CaretakerOnboarding/types';
import { INITIAL_FORM_DATA } from './CaretakerOnboarding/types';
import { Step1SignUp } from './CaretakerOnboarding/Step1SignUp';
import { Step2BasicInfo } from './CaretakerOnboarding/Step2BasicInfo';
import { Step3Contact } from './CaretakerOnboarding/Step3Contact';
import { Step4Experience } from './CaretakerOnboarding/Step4Experience';
import { Step5Services } from './CaretakerOnboarding/Step5Services';
import { Step6Facility } from './CaretakerOnboarding/Step6Facility';
import { Step7Photos } from './CaretakerOnboarding/Step7Photos';
import { Step8KYC } from './CaretakerOnboarding/Step8KYC';
import { Step9Additional } from './CaretakerOnboarding/Step9Additional';
import { Step10Review } from './CaretakerOnboarding/Step10Review';
import { Button } from '../../components/ui/Button';

interface Props {
  onBack?: () => void;
  onLoginClick?: () => void;
}

export const CaretakerApplicationForm = ({ onBack, onLoginClick }: Props) => {
  const [step, setStep] = useState(0); // 0 = Sign Up, 1 = Basic Info... 9 = Review
  const [formData, setFormData] = useState<CaretakerFormData>(INITIAL_FORM_DATA);
  const [submitted, setSubmitted] = useState(false);

  const updateData = (newData: Partial<CaretakerFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 9));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  if (submitted) {
    return (
      <div className="flex flex-col h-full bg-white px-4 md:px-8 py-10 rounded-3xl w-full max-w-md mx-auto text-center items-center justify-center min-h-[500px]">
        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-[#FBBF24]" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-3">Application Received!</h2>
        <p className="text-gray-500 font-medium text-sm px-4 mb-8">
          Thank you for applying to be a MyPet9 Partner! Our vetting team will review your application and visit your home within 48 hours.
        </p>
        <Button onClick={onBack} className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] font-bold shadow-md shadow-[#FBBF24]/20 px-8">
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Header Container */}
      <div className="max-w-md mx-auto w-full mb-6 sticky top-0 bg-white z-20 pt-8 pb-4">
        <div className="flex items-center justify-between mb-4 px-2">
          {step > 0 ? (
            <button onClick={prevStep} className="p-2 text-[#FBBF24] hover:bg-yellow-50 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
          ) : (
            <button onClick={onBack} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
          )}
          
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center space-x-1.5">
              <PawPrint size={22} className="text-[#FBBF24]" fill="#FBBF24" />
              <h1 className="text-xl font-extrabold text-[#1B2B48] tracking-tight">
                MyPet <span className="text-[#FBBF24]">9</span>
              </h1>
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Partner App</span>
          </div>

          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Progress Bar (Visible on Steps 1 to 9) */}
        {step > 0 && (
          <div className="px-4">
            <div className="text-[10px] font-bold text-gray-500 mb-1">
              Step {step} of 9
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#FBBF24] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 9) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Form Steps */}
      <div className="transition-all duration-300">
        {step === 0 && <Step1SignUp data={formData} updateData={updateData} onNext={nextStep} onLoginClick={onLoginClick || (() => {})} />}
        {step === 1 && <Step2BasicInfo data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
        {step === 2 && <Step3Contact data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
        {step === 3 && <Step4Experience data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
        {step === 4 && <Step5Services data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
        {step === 5 && <Step6Facility data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
        {step === 6 && <Step7Photos data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
        {step === 7 && <Step8KYC data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
        {step === 8 && <Step9Additional data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
        {step === 9 && <Step10Review data={formData} updateData={updateData} onBack={prevStep} setStep={setStep} onSuccess={() => setSubmitted(true)} />}
      </div>
    </div>
  );
};
