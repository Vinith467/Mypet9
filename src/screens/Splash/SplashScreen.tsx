import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { PawPrint, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: '/1.png',
    text: "Trusted pet boarding when you're away.",
  },
  {
    id: 2,
    image: '/2.png',
    text: 'All our boarding partners are verified and love pets.',
  },
  {
    id: 3,
    image: '/3.png',
    text: 'We offer pickup and drop services for a stress-free experience.',
  },
];

const SWIPE_THRESHOLD = 50;

const SplashScreen = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      handleNext();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      handlePrev();
    }
  };

  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex flex-col">
      
      {/* Background Images (Carousel) */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
        />
      </AnimatePresence>

      {/* Gradients removed as requested since text/images are baked in */}

      {/* Main Interactive Area (Swipeable) */}
      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="relative z-20 flex-1 flex flex-col justify-between w-full h-full cursor-grab active:cursor-grabbing"
      >
        
        {/* Top Section: Logo */}
        <div className="flex flex-col items-center pt-12 lg:pt-16 pointer-events-none z-30 relative">
          {/* We hide the old Petoo logo here since the new images might have their own branding, 
              or we can display the new MyPet9 logo if desired. The user said everything is in the image, 
              but typically we might want to keep the new logo unless it overlaps. 
              I'll render the new MyPet9 logo at the top, but slightly smaller. */}
        </div>

        {/* Bottom Section: Text & Actions */}
        <div className="w-full max-w-xl mx-auto px-6 pb-12 lg:pb-16 flex flex-col items-center text-center pointer-events-auto">
          
          {/* No Text Element here since it's baked into the images */}
          <div className="min-h-[80px] flex items-center justify-center mb-2" />

          {/* Dots Indicator */}
          <div className="flex space-x-2 mb-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full h-2 ${
                  index === currentSlide ? 'w-8 bg-[#FBBF24]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Actions Container */}
          <div className="w-full h-[60px] flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {!isLastSlide ? (
                <motion.div
                  key="next-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex items-center justify-between lg:justify-center"
                >
                  {/* Mobile Side Arrows */}
                  <button 
                    onClick={handlePrev}
                    className={`lg:hidden w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md text-[#1B2B48] border border-gray-100 transition-opacity ${currentSlide === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 active:bg-gray-50'}`}
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Desktop Next Button */}
                  <div className="hidden lg:flex w-full max-w-sm">
                    <Button fullWidth onClick={handleNext} className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] font-bold shadow-xl shadow-[#FBBF24]/20 border-none">
                      Next
                    </Button>
                  </div>

                  {/* Mobile Side Arrows / Next Button */}
                  <button 
                    onClick={handleNext}
                    className="lg:hidden w-12 h-12 rounded-full flex items-center justify-center bg-[#FBBF24] shadow-md text-[#1B2B48] active:bg-[#F59E0B]"
                  >
                    <ChevronRight size={24} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="auth-btns"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col sm:flex-row gap-3 max-w-sm"
                >
                  <Button 
                    variant="outline" 
                    fullWidth 
                    className="bg-white border-gray-200 text-[#1B2B48] hover:bg-gray-50 font-bold shadow-sm"
                    onClick={() => navigate('/auth', { state: { mode: 'login' } })}
                  >
                    Log In
                  </Button>
                  <Button 
                    fullWidth 
                    className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] font-bold shadow-xl shadow-[#FBBF24]/20 border-none"
                    onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
                  >
                    Sign Up
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>

    </div>
  );
};

export default SplashScreen;
