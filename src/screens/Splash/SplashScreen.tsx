import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { PawPrint, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&q=80&w=800',
    text: "Trusted pet boarding when you're away.",
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800',
    text: 'All our boarding partners are verified and love pets.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1597626133663-cb34ae923184?auto=format&fit=crop&q=80&w=800',
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

      {/* Gradients for readability */}
      {/* Top Gradient (White-ish for Logo) */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/70 to-transparent pointer-events-none z-10" />
      {/* Bottom Gradient (Dark for Text) */}
      <div className="absolute inset-x-0 bottom-0 h-[60vh] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

      {/* Main Interactive Area (Swipeable) */}
      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="relative z-20 flex-1 flex flex-col justify-between w-full h-full cursor-grab active:cursor-grabbing"
      >
        
        {/* Top Section: Logo */}
        <div className="flex flex-col items-center pt-16 lg:pt-20 pointer-events-none">
          <div className="bg-petoo-primary p-3 rounded-[24px] shadow-lg mb-3">
            <PawPrint size={40} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-extrabold text-petoo-primary mb-1 tracking-tight drop-shadow-sm" style={{ fontFamily: 'serif' }}>
            Petoo
          </h1>
          <p className="text-petoo-primary font-bold text-[13px] tracking-wide drop-shadow-sm">
            Safe Homes. Happy Pets.
          </p>
        </div>

        {/* Bottom Section: Text & Actions */}
        <div className="w-full max-w-xl mx-auto px-6 pb-12 lg:pb-16 flex flex-col items-center text-center pointer-events-auto">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="min-h-[80px] flex items-center justify-center mb-6"
            >
              <h2 className="text-white text-xl lg:text-2xl font-bold leading-snug drop-shadow-md px-4">
                {slides[currentSlide].text}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex space-x-2 mb-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  index === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
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
                    className={`lg:hidden w-12 h-12 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md text-white border border-white/20 transition-opacity ${currentSlide === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 active:bg-white/20'}`}
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* Desktop Next Button */}
                  <div className="hidden lg:flex w-full max-w-sm">
                    <Button fullWidth onClick={handleNext} className="shadow-xl">
                      Next
                    </Button>
                  </div>

                  {/* Mobile Side Arrows */}
                  <button 
                    onClick={handleNext}
                    className="lg:hidden w-12 h-12 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md text-white border border-white/20 active:bg-white/20"
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
                    className="bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white/20 hover:text-white shadow-xl"
                    onClick={() => navigate('/auth')}
                  >
                    Log In
                  </Button>
                  <Button 
                    fullWidth 
                    className="shadow-xl"
                    onClick={() => navigate('/auth')}
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
