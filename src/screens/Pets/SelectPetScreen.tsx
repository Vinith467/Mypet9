import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Plus, CheckCircle2, PawPrint, Weight } from 'lucide-react';
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007672]"></div>
      </div>
    );
  }

  // If auto-redirecting, return null to avoid flash
  if (pets.length === 0) return null;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#FDFDFD] flex flex-col overflow-hidden z-0">
      {/* Husky Background Images */}
      <div className="absolute top-[72px] left-0 w-1/4 max-w-[350px] z-0 pointer-events-none hidden lg:block opacity-100">
        <img src="/petselect.png" alt="Husky decoration left" className="w-full h-auto object-top" />
      </div>
      <div className="absolute top-[72px] right-0 w-1/4 max-w-[350px] z-0 pointer-events-none hidden lg:block opacity-100">
        <img src="/petselect2.png" alt="Husky decoration right" className="w-full h-auto object-top" />
      </div>



      <div className="relative z-10 w-full flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Top Navbar (Logo Only) */}
        <div className="lg:hidden w-full shrink-0 flex items-center p-4 bg-white border-b border-gray-100 z-40 relative shadow-sm">
           <PawPrint className="text-[#007672] w-6 h-6 mr-2" strokeWidth={2.5} />
           <span className="font-extrabold text-[22px] tracking-tight text-[#1B2B48]">mypet9</span>
        </div>
        {/* Simple Top Navbar */}
        <div className="w-full shrink-0 flex justify-start items-center px-5 lg:px-8 pt-4 pb-3 z-30 bg-transparent pointer-events-none">
          <button 
            onClick={() => navigate(-1)}
            className="pointer-events-auto flex items-center space-x-2 text-[#1B2B48] hover:text-[#007672] font-bold transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-[16px]">Back</span>
          </button>
        </div>

        <div className="max-w-[600px] mx-auto w-full px-6 flex flex-col shrink-0">
          {/* Desktop Title (Hidden on Mobile) */}
          <div className="hidden lg:block mb-8 mt-0 text-center relative z-10">
            <div className="flex justify-center mb-2">
              <PawPrint className="text-[#007672] fill-[#007672]" size={36} />
            </div>
            <h1 className="text-[32px] font-extrabold text-[#1B2B48] mb-1 tracking-tight">
              Your <span className="text-[#007672]">Pets</span>
            </h1>
            <p className="text-[15px] text-[#465E87] font-medium">
              You've added {pets.length} pet{pets.length !== 1 ? 's' : ''} so far.
            </p>
          </div>

          {/* Mobile Title (CSS) */}
          <div className="block lg:hidden mb-6 mt-4 relative z-10 text-center">
             <div className="flex justify-center mb-2">
               <PawPrint className="text-[#007672] fill-[#007672]" size={36} />
             </div>
             <h1 className="text-[32px] font-extrabold text-[#1B2B48] mb-1 tracking-tight">
               Your <span className="text-[#007672]">Pets</span>
             </h1>
             <p className="text-[15px] text-[#465E87] font-medium">
               You've added {pets.length} pet{pets.length !== 1 ? 's' : ''} so far.
             </p>
          </div>

        </div>

        {/* Scrollable Pet List */}
          <div className="flex-1 overflow-y-auto w-full pb-[120px] scrollbar-hide">
            <div className="max-w-[600px] mx-auto w-full px-6 space-y-4">
            {pets.map(pet => {
              const isSelected = selectedPetIds.includes(pet.id);
              return (
                <div 
                  key={pet.id}
                  onClick={() => togglePetSelection(pet.id)}
                  className={`relative flex flex-row p-4 lg:p-5 rounded-[24px] transition-all duration-300 cursor-pointer border-[2px] bg-white ${
                    isSelected 
                      ? 'border-[#007672] shadow-md ring-1 ring-[#007672]' 
                      : 'border-transparent shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Check Mark for Selected State */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm z-10 animate-in zoom-in duration-200">
                      <CheckCircle2 size={24} className="text-white fill-[#007672]" />
                    </div>
                  )}

                  {/* Pet Image */}
                  <div className="w-[80px] h-[80px] rounded-[20px] overflow-hidden shrink-0 bg-gray-100 mr-5">
                    {pet.image ? (
                      <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#007672] bg-[#E6F4F1] font-bold text-2xl">
                        {pet.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-[18px] font-extrabold text-[#1B2B48] leading-tight">{pet.name}</h3>
                        <span className="bg-[#E6F4F1] text-[#007672] px-2.5 py-0.5 rounded-full text-[11px] font-bold">Dog</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 p-1 -mr-2" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical size={20} />
                      </button>
                    </div>
                    <p className="text-[14px] font-semibold text-[#465E87] mb-2">{pet.breed || pet.type || 'Breed'}</p>
                    
                    {/* Details Icons Row */}
                    <div className="flex flex-wrap items-center text-[13px] font-semibold text-[#465E87] gap-x-5 gap-y-2">
                      {pet.age && (
                        <div className="flex items-center space-x-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#007672" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          <span>{pet.age}</span>
                        </div>
                      )}
                      {pet.gender && (
                        <div className="flex items-center space-x-1.5">
                          {pet.gender.toLowerCase() === 'male' ? <span className="text-[#007672] font-bold text-[16px] leading-none">♂</span> : <span className="text-[#007672] font-bold text-[16px] leading-none">♀</span>}
                          <span>{pet.gender}</span>
                        </div>
                      )}
                      {pet.weight && (
                        <div className="flex items-center space-x-1.5">
                          <Weight size={14} className="text-[#007672]" strokeWidth={2.5} />
                          <span>{pet.weight} {pet.weight.toString().includes('kg') ? '' : 'kg'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
              {/* Add New Pet Button */}
              <button 
                onClick={() => navigate('/add-pet', { state: { returnTo: '/select-pet', provider, bookingData } })}
                className="w-full mt-4 flex items-center justify-center space-x-2 text-[#007672] font-bold bg-[#F0FDF4] px-5 py-4 rounded-[24px] shadow-sm border-2 border-dashed border-[#007672]/30 hover:bg-[#E6FBF0] hover:border-[#007672]/50 transition-all duration-300"
              >
                <Plus size={20} strokeWidth={3} />
                <span className="text-[16px]">Add New Pet</span>
              </button>
            </div>
          </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 z-40 pb-safe-bottom">
        <div className="max-w-[600px] mx-auto w-full">
          <Button 
            onClick={handleNext}
            disabled={selectedPetIds.length === 0}
            className="w-full h-[56px] bg-[#007672] hover:bg-[#00605c] disabled:bg-gray-300 disabled:text-gray-500 text-white text-[16px] font-extrabold rounded-[16px] flex items-center justify-center space-x-2 shadow-[0_8px_20px_rgba(0,118,114,0.25)] disabled:shadow-none transition-all duration-300"
          >
            <span>Continue</span>
            <ArrowLeft size={20} className="rotate-180" />
          </Button>
        </div>
      </div>

    </div>
  );
};
