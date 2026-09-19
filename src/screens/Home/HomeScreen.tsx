import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { PawPrint, Plus, ArrowRight, Search } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Pet } from '../Pets/MyPetsScreen';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const HomeScreen = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'users', user.uid, 'pets'));
        const snapshot = await getDocs(q);
        const petsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pet));
        setPets(petsData);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoadingPets(false);
      }
    };
    fetchPets();
  }, [user]);

  const firstName = userData?.name ? userData.name.split(' ')[0] : 'User';

  return (
    <DashboardLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full flex flex-col pt-6 lg:pt-10 space-y-8 max-w-2xl mx-auto lg:max-w-none pb-24"
      >
        
        {/* Top Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-start px-2">
          <div className="flex flex-col">
            <h1 className="text-xl lg:text-3xl font-bold text-[#1B2B48] mb-1 flex items-center gap-2">
              Good morning, {firstName}! <span>👋</span>
            </h1>
            <p className="text-[#1B2B48]/70 text-sm lg:text-base max-w-[260px] lg:max-w-md font-medium">
              Find a loving home for your pet while you're away.
            </p>
          </div>
        </motion.div>

        {/* Banner CTA */}
        <motion.div variants={itemVariants} className="w-full px-2 mt-4">
          <div 
            onClick={() => navigate('/select-pet')}
            className="w-full h-56 lg:h-[280px] rounded-3xl bg-cover bg-center shadow-xl relative overflow-hidden group cursor-pointer border border-gray-100"
            style={{ backgroundImage: "url('/home-banner.png')" }}
          >
            {/* Elegant dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
            
            {/* Content inside the banner */}
            <div className="absolute inset-0 p-6 lg:p-10 flex flex-col justify-center w-full sm:max-w-sm lg:max-w-md">
              <h2 className="text-white text-2xl lg:text-4xl font-extrabold mb-2 leading-tight drop-shadow-md">
                Planning a trip?
              </h2>
              <p className="text-white/90 text-sm lg:text-base font-medium mb-6 drop-shadow-sm max-w-[280px] lg:max-w-none">
                Book a loving, verified caretaker for your furry friend in just a few taps.
              </p>
              
              <button 
                className="bg-white text-[#174f38] px-6 py-3 lg:px-8 lg:py-3.5 rounded-full font-extrabold text-sm lg:text-base shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center w-max hover:bg-gray-50 transition-all active:scale-95 group-hover:shadow-2xl"
              >
                <PawPrint size={18} className="mr-2 text-petoo-primary" />
                Book a Stay
                <ArrowRight size={18} className="ml-2 text-petoo-primary/70 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Your Pets Section */}
        <motion.div variants={itemVariants} className="flex flex-col px-2 mt-4">
          <h2 className="text-lg lg:text-xl font-bold text-[#1B2B48] mb-4">Your Pets</h2>
          
          <div className="flex items-center space-x-6 overflow-x-auto scrollbar-hide pb-2">
            
            {loadingPets ? (
               <div className="flex space-x-6">
                 {[1, 2].map((i) => (
                    <div key={i} className="flex flex-col items-center animate-pulse">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gray-200"></div>
                      <div className="h-3 w-12 bg-gray-200 rounded mt-3"></div>
                    </div>
                 ))}
               </div>
            ) : (
              <>
                {pets.map((pet) => (
                  <button 
                    key={pet.id} 
                    onClick={() => navigate(`/edit-pet/${pet.id}`)}
                    className="flex flex-col items-center cursor-pointer group focus:outline-none text-left"
                  >
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-[3px] border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center group-hover:border-petoo-primary transition-colors">
                      {pet.image ? (
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                      ) : (
                        <PawPrint className="text-gray-400" size={24} />
                      )}
                    </div>
                    <span className="mt-2 text-[13px] lg:text-sm font-bold text-[#1B2B48] leading-none text-center truncate max-w-[80px]">{pet.name}</span>
                    <span className="text-[11px] text-[#1B2B48]/50 mt-1 text-center">{pet.type}</span>
                  </button>
                ))}

                <button 
                  onClick={() => navigate('/add-pet')}
                  className="flex flex-col items-center cursor-pointer group focus:outline-none shrink-0"
                >
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-[2px] border-dashed border-[#1B2B48]/20 bg-white flex items-center justify-center group-hover:border-petoo-primary transition-colors">
                    <Plus size={24} className="text-petoo-primary" />
                  </div>
                  <span className="mt-2 text-[13px] lg:text-sm font-bold text-[#1B2B48] leading-none text-center">Add Pet</span>
                  <span className="text-[11px] text-transparent mt-1 text-center">-</span>
                </button>
              </>
            )}

          </div>
        </motion.div>

        {/* Recommended for You Section (Empty State) */}
        <motion.div variants={itemVariants} className="flex flex-col px-2 mt-4 pb-12">
          <h2 className="text-lg lg:text-xl font-bold text-[#1B2B48] mb-4">Recommended for You</h2>
          
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Search className="text-blue-500" size={32} />
            </div>
            <h3 className="text-lg font-extrabold text-[#1B2B48] mb-2">No Caretakers Found</h3>
            <p className="text-[#465E87] text-[14px] font-medium max-w-sm">
              We are currently expanding our network of trusted caretakers. Check back soon for caretakers in your area!
            </p>
          </div>
        </motion.div>

      </motion.div>
    </DashboardLayout>
  );
}
