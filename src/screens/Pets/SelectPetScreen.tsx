import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Pet } from './MyPetsScreen';

export const SelectPetScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const provider = location.state?.provider;
  const bookingData = location.state?.bookingData;
  const passedSelectedPets = location.state?.selectedPets;

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'users', user.uid, 'pets'));
        const snapshot = await getDocs(q);
        const petsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pet));
        setPets(petsData);
        
        if (petsData.length === 0) {
          navigate('/add-pet', { state: { returnTo: '/select-pet', provider, bookingData }, replace: true });
        } else {
          // If we came back from booking summary, restore selection
          if (passedSelectedPets && passedSelectedPets.length > 0) {
            setSelectedPetIds(passedSelectedPets.map((p: Pet) => p.id));
          } else if (bookingData?.pets && bookingData.pets.length > 0) {
            setSelectedPetIds(bookingData.pets.map((p: Pet) => p.id));
          } else {
            // Otherwise pre-select the first pet
            setSelectedPetIds([petsData[0].id]);
          }
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [user, navigate, provider, bookingData]);

  const togglePetSelection = (id: string) => {
    setSelectedPetIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selectedPetIds.length > 0) {
      const selectedPets = pets.filter(p => selectedPetIds.includes(p.id));
      // For now, console log and navigate to placeholder. The user will provide the next step.
      console.log("Selected pets:", selectedPets);
      // Wait for user instruction for the next page, but pass state just in case.
      navigate('/booking-summary', { 
        state: { 
          provider, 
          bookingData, 
          selectedPets 
        } 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FBBF24]"></div>
      </div>
    );
  }

  // If auto-redirecting, return null to avoid flash
  if (pets.length === 0) return null;

  return (
    <div className="flex-1 min-h-screen bg-white flex flex-col relative pb-28">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center sticky top-0 bg-white/90 backdrop-blur-md z-30">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center -ml-2"
        >
          <ArrowLeft size={24} className="text-[#1B2B48]" />
        </button>
      </div>

      <div className="px-6">
        <div className="mb-8 text-center">
          <h1 className="text-[22px] font-extrabold text-[#1B2B48] mb-1 tracking-tight">Your Pets</h1>
          <p className="text-[14px] text-[#465E87] font-medium">
            You've added {pets.length} pet{pets.length !== 1 ? 's' : ''} so far.
          </p>
        </div>

        {/* Pet List */}
        <div className="space-y-4">
          {pets.map(pet => {
            const isSelected = selectedPetIds.includes(pet.id);
            return (
              <div 
                key={pet.id}
                onClick={() => togglePetSelection(pet.id)}
                className={`relative flex flex-row p-4 rounded-[20px] transition-all cursor-pointer border ${
                  isSelected 
                    ? 'border-[#FBBF24] bg-[#FFF9EC] shadow-[0_4px_15px_rgba(251,191,36,0.15)]' 
                    : 'border-gray-100 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.03)]'
                }`}
              >
                {/* Check Mark for Selected State */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm z-10 animate-in zoom-in duration-200">
                    <CheckCircle2 size={24} className="text-white fill-[#FBBF24]" />
                  </div>
                )}

                {/* Pet Image */}
                <div className="w-[72px] h-[72px] rounded-[16px] overflow-hidden shrink-0 bg-gray-100 mr-4">
                  {pet.image ? (
                    <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                      {pet.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[16px] font-extrabold text-[#1B2B48] leading-tight mb-1">{pet.name}</h3>
                    <button className="text-gray-400 p-1 -mr-2" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  <p className="text-[13px] font-medium text-[#465E87] mb-1">{pet.breed || pet.type || 'Breed'}</p>
                  <div className="flex items-center text-[12px] font-semibold text-[#465E87]/70 space-x-1.5">
                    {pet.age && <span>{pet.age}</span>}
                    {pet.age && pet.gender && <span>•</span>}
                    {pet.gender && <span>{pet.gender}</span>}
                    {pet.gender && pet.weight && <span>•</span>}
                    {pet.weight && <span>{pet.weight} {pet.weight.toString().includes('kg') ? '' : 'kg'}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Another Pet */}
        <div 
          onClick={() => navigate('/add-pet', { state: { returnTo: '/select-pet', provider, bookingData } })}
          className="mt-6 border-2 border-dashed border-gray-200 rounded-[20px] p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="w-12 h-12 bg-[#FDD835] rounded-full flex items-center justify-center mb-3">
            <Plus size={24} className="text-[#1B2B48]" strokeWidth={2.5} />
          </div>
          <h4 className="text-[15px] font-extrabold text-[#1B2B48] mb-1">Add Another Pet</h4>
          <p className="text-[12px] font-medium text-[#465E87]">You can add multiple pets</p>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent z-40 pb-safe-bottom">
        <Button 
          onClick={handleNext}
          disabled={selectedPetIds.length === 0}
          className="w-full h-14 bg-[#FDD835] hover:bg-[#FBBF24] text-[#1B2B48] text-[16px] font-extrabold rounded-[16px] flex items-center justify-center space-x-2"
        >
          <span>Continue</span>
          <ArrowLeft size={18} className="rotate-180" />
        </Button>
      </div>

    </div>
  );
};
