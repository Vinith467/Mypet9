import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth } from '../../config/firebase';
import { Button } from '../../components/ui/Button';
import { PawPrint, Clock, LogOut } from 'lucide-react';

export const ApplicationUnderReviewScreen = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FBF6EE] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#FBBF24]/10 blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#1B2B48]/5 blur-3xl mix-blend-multiply pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white lg:bg-transparent w-full max-w-md p-8 md:p-10 rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] lg:shadow-none relative z-10 flex flex-col items-center text-center border border-gray-50 lg:border-none"
      >
        
        {/* Logo */}
        <div className="flex items-center space-x-1.5 mb-8">
          <PawPrint size={24} className="text-[#FBBF24]" fill="#FBBF24" />
          <h1 className="text-2xl font-extrabold text-[#1B2B48] tracking-tight">
            Mypet<span className="text-[#FBBF24]">9</span>
          </h1>
        </div>

        {/* Loading Animation Placeholder (User will design this) */}
        <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-dashed border-[#FBBF24]/30"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-4 border-dashed border-[#1B2B48]/10"
          />
          <div className="bg-[#FBBF24]/10 p-4 rounded-full">
            <Clock size={40} className="text-[#FBBF24]" />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-[#1B2B48] mb-3">
          Application Under Review
        </h2>
        
        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 px-2">
          Thank you for applying to become a MyPet9 Caretaker! Our vetting team is currently reviewing your application. We will visit your home within 48 hours to complete the verification process.
        </p>

        <div className="w-full bg-[#FBF6EE] rounded-2xl p-4 mb-8 text-sm text-[#1B2B48] font-bold shadow-inner">
          <p>Status: <span className="text-[#FBBF24]">Pending Verification</span></p>
        </div>

        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full text-gray-500 border-gray-200 hover:bg-gray-50 font-bold flex items-center justify-center"
        >
          <LogOut size={18} className="mr-2" />
          Log Out
        </Button>

      </motion.div>
    </div>
  );
};
