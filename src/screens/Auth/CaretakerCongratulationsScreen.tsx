import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { PawPrint, PartyPopper, CheckCircle2 } from 'lucide-react';

export const CaretakerCongratulationsScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FBF6EE] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#FBBF24]/20 blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#1B2B48]/10 blur-3xl mix-blend-multiply pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="bg-white w-full max-w-md p-8 md:p-10 rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] relative z-10 flex flex-col items-center text-center border border-gray-50"
      >
        
        {/* Logo */}
        <div className="flex items-center space-x-1.5 mb-8">
          <PawPrint size={24} className="text-[#FBBF24]" fill="#FBBF24" />
          <h1 className="text-2xl font-extrabold text-[#1B2B48] tracking-tight">
            Mypet<span className="text-[#FBBF24]">9</span>
          </h1>
        </div>

        {/* Celebration Icon */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="absolute inset-0 bg-[#FBBF24]/20 rounded-full"
          />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="absolute inset-2 bg-[#FBBF24]/40 rounded-full"
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative z-10"
          >
            <PartyPopper size={48} className="text-[#1B2B48]" />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm"
          >
            <CheckCircle2 size={24} className="text-green-500" fill="currentColor" />
          </motion.div>
        </div>

        <h2 className="text-3xl font-extrabold text-[#1B2B48] mb-3 leading-tight">
          Congratulations!
        </h2>
        
        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 px-2">
          Your application has been approved. Welcome to the MyPet9 Caretaker community! You can now access your dashboard, set your availability, and start hosting pets.
        </p>

        <Button 
          onClick={() => navigate('/caretaker/dashboard')}
          className="w-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] font-bold shadow-xl shadow-[#FBBF24]/20 py-4"
        >
          Go to My Dashboard
        </Button>

      </motion.div>
    </div>
  );
};
