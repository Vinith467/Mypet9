import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, CheckCircle2, PawPrint } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Pet } from './MyPetsScreen';

export const SelectPetScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'users', user.uid, 'pets'));
        const snapshot = await getDocs(q);
        const petsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pet));
        setPets(petsData);
        if (petsData.length > 0) {
          setSelectedPetId(petsData[0].id);
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [user]);

  const handleNext = () => {
    if (selectedPetId) {
      navigate('/choose-service');
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col pt-6 lg:pt-10 space-y-6 max-w-2xl mx-auto lg:max-w-none px-4 lg:px-0 pb-20">
        
        {/* Header */}
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1B2B48] tracking-tight">
          Select Your Pet
        </h1>

        {loading ? (
          <div className="w-full flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-petoo-primary"></div>
          </div>
        ) : (
          <>
            {/* Pet List */}
            <div className="flex flex-col space-y-4 w-full">
              {pets.map((pet) => {
                const isSelected = selectedPetId === pet.id;

                return (
                  <motion.div
                    key={pet.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPetId(pet.id)}
                    className={`relative flex items-center bg-white p-3 lg:p-4 rounded-3xl cursor-pointer transition-all duration-300 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] ${
                      isSelected 
                        ? 'border-2 border-petoo-primary shadow-lg shadow-petoo-primary/10' 
                        : 'border border-gray-100 hover:border-petoo-primary/30'
                    }`}
                  >
                    {/* Pet Image (Square) */}
                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                      {pet.image ? (
                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                      ) : (
                        <PawPrint className="text-gray-400" size={32} />
                      )}
                    </div>

                    {/* Pet Details */}
                    <div className="ml-4 lg:ml-6 flex flex-col flex-1">
                      <h3 className="text-lg lg:text-xl font-bold text-[#1B2B48] leading-tight">
                        {pet.name}
                      </h3>
                      <p className="text-[13px] lg:text-[15px] font-medium text-[#465E87] mt-1 lg:mt-1.5">
                        {pet.breed || pet.type}
                      </p>
                      <p className="text-[12px] lg:text-[14px] font-medium text-[#1B2B48]/60 mt-1 flex items-center gap-1.5">
                        <span>{pet.gender}</span>
                        {pet.age && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-[#1B2B48]/30" />
                            <span>{pet.age}</span>
                          </>
                        )}
                        {pet.weight && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-[#1B2B48]/30" />
                            <span>{pet.weight} kg</span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Selected Checkmark */}
                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute top-4 right-4"
                      >
                        <div className="bg-petoo-primary rounded-full p-0.5 shadow-sm">
                          <CheckCircle2 className="text-white fill-petoo-primary" size={24} />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}

              {pets.length === 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center py-10">
                  <div className="w-16 h-16 bg-petoo-primary/10 rounded-full flex items-center justify-center mb-4">
                    <PawPrint className="text-petoo-primary" size={32} />
                  </div>
                  <h3 className="text-[18px] font-extrabold text-[#1B2B48] mb-2">No pets found</h3>
                  <p className="text-[#465E87] text-[14px] font-medium max-w-sm mb-6">
                    Add a pet to continue with your booking.
                  </p>
                </div>
              )}

              {/* Add New Pet Button */}
              <button 
                onClick={() => navigate('/add-pet')}
                className="flex items-center justify-center p-4 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer group h-24"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm group-hover:scale-105 transition-transform">
                  <Plus className="text-[#1B2B48]" size={20} />
                </div>
                <span className="text-[15px] font-bold text-[#1B2B48]">Add another pet</span>
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="w-full mt-8 flex justify-center lg:justify-start">
              <Button 
                fullWidth 
                size="lg"
                onClick={handleNext}
                disabled={!selectedPetId}
                className="shadow-[0_4px_12px_rgba(23,79,56,0.2)] lg:w-[300px] h-14 text-[16px] font-bold rounded-2xl"
              >
                Continue
              </Button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
