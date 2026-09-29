import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PawPrint, MoreHorizontal, ShieldCheck, Home, Heart, Calendar, ArrowRight, Star, Check } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
  gender?: string;
  medicalNotes: string;
  image: string;
  vaccinated?: boolean;
  vaccinationMonth?: string;
  vaccinationYear?: string;
}

export const MyPetsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

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
        setLoading(false);
      }
    };
    fetchPets();
  }, [user]);

  const handleDeletePet = async (petId: string) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'pets', petId));
        setPets(pets.filter(p => p.id !== petId));
        setOpenDropdownId(null);
      } catch (error) {
        console.error("Error deleting pet:", error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-screen bg-[#FAF9F5]">
        
        {/* Top Banner */}
        <div className="w-full">
          <img src="/pet-herosection.png" alt="Your Pets, Our Priority" className="w-full h-auto object-cover" />
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 mt-4 mb-2">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr,280px] gap-6 xl:gap-8 items-stretch">
            
            {/* Left Column: Pets List */}
            <div className="w-full">
              
              {/* Header Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
                <div>
                  <h1 className="text-[22px] lg:text-[24px] font-extrabold text-[#1B2B48] mb-0.5">
                    Your Pets
                  </h1>
                  <p className="text-[13px] font-medium text-[#465E87] max-w-none leading-snug pr-4">
                    Here are your furry friends. Manage their profiles and keep their information up to date for the best care.
                  </p>
                </div>
                
                <div className="flex items-center gap-3 mt-3 md:mt-0 shrink-0">
                  <div className="bg-[#f0f8f8] text-[#007672] px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#007672]/10 font-bold text-[13px]">
                    <PawPrint size={14} />
                    {pets.length} Pets
                  </div>
                  <button 
                    onClick={() => navigate('/add-pet')}
                    className="bg-[#007672] hover:bg-[#00605c] transition-colors text-white px-4 py-1.5 rounded-full font-bold text-[13px] flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={16} strokeWidth={3} />
                    Add Pet
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#007672]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  
                  {/* Map through Pets */}
                  {pets.map((pet) => (
                    <div 
                      key={pet.id} 
                      onClick={() => navigate(`/edit-pet/${pet.id}`)}
                      className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col group relative cursor-pointer hover:border-[#007672]/30 hover:shadow-[0_8px_30px_rgb(0,118,114,0.12)] transition-all"
                    >
                      
                      {/* Pet Image Header */}
                      <div className="h-[130px] w-full relative">
                        <img 
                          src={pet.image || 'https://placehold.co/600x400/e0f4f2/007672?text=Pet'} 
                          alt={pet.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-2 right-2 z-30">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === pet.id ? null : pet.id);
                            }}
                            className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 shadow-sm transition-colors"
                          >
                            <MoreHorizontal size={16} />
                          </button>

                          {openDropdownId === pet.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-[12px] shadow-lg border border-gray-100 py-1 z-40">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/edit-pet/${pet.id}`);
                                }}
                                className="w-full text-left px-4 py-2 text-[13px] font-bold text-[#1B2B48] hover:bg-gray-50 transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePet(pet.id);
                                }}
                                className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pet Info Content */}
                      <div className="p-3.5 flex flex-col flex-1 bg-white relative z-20">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-[16px] font-extrabold text-[#1B2B48]">{pet.name}</h3>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${pet.type?.toLowerCase() === 'cat' ? 'bg-[#fff0f5] text-[#d63384]' : 'bg-[#e0f4f2] text-[#007672]'}`}>
                            {pet.type || 'Pet'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[#465E87] mb-4 px-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[12px] font-bold">{pet.gender?.toLowerCase() === 'female' ? '♀' : '♂'}</span>
                            <span className="text-[11px] font-medium">{pet.gender || 'Male'}</span>
                          </div>
                          <div className="flex items-center gap-1 min-w-0">
                            <Calendar size={12} className="text-[#007672] shrink-0" />
                            <span className="text-[11px] font-medium truncate">{pet.age}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <PawPrint size={12} className="text-[#007672] shrink-0" />
                            <span className="text-[11px] font-medium">{parseInt(pet.weight) < 10 ? 'Small' : parseInt(pet.weight) < 25 ? 'Medium' : 'Large'}</span>
                          </div>
                        </div>

                        {pet.vaccinated && (
                          <div className="flex items-center justify-center gap-1.5 bg-[#f0f8f8] text-[#007672] py-1.5 rounded-lg mb-4 mt-[-6px]">
                            <Check size={12} className="stroke-[3]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Vaccinated {pet.vaccinationMonth && pet.vaccinationYear ? `• ${pet.vaccinationMonth} ${pet.vaccinationYear}` : ''}
                            </span>
                          </div>
                        )}

                        <button 
                          onClick={() => navigate(`/edit-pet/${pet.id}`)}
                          className="w-full mt-auto py-1.5 rounded-full border-2 border-[#007672]/20 text-[#007672] font-extrabold text-[12px] hover:bg-[#007672] hover:text-white transition-all flex items-center justify-center gap-1.5 group/btn"
                        >
                          View Details 
                          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Pet Card */}
                  <div 
                    onClick={() => navigate('/add-pet')}
                    className="bg-[#f4fcfc] rounded-[20px] border-2 border-dashed border-[#007672]/40 flex flex-col items-center justify-center p-4 min-h-[200px] cursor-pointer hover:bg-[#ebf8f8] transition-colors group relative"
                  >
                    <div className="absolute top-3 right-3 text-[#007672]/20">
                      <PawPrint size={24} />
                      <Heart size={12} className="absolute -bottom-1 -right-1" />
                    </div>
                    
                    <div className="w-12 h-12 bg-[#007672] rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-[0_4px_12px_rgba(0,118,114,0.3)]">
                      <Plus size={24} strokeWidth={2.5} />
                    </div>
                    
                    <h3 className="text-[16px] font-extrabold text-[#1B2B48] mb-1.5 text-center">Add a Pet</h3>
                    <p className="text-[12px] font-medium text-[#465E87] text-center max-w-[160px] mb-4 leading-tight">
                      Include your furry friend to get the best care.
                    </p>
                    
                    <button className="w-full py-2 bg-[#007672] text-white rounded-full font-extrabold text-[13px] shadow-sm flex items-center justify-center gap-1.5 group-hover:bg-[#00605c] transition-colors">
                      <Plus size={16} strokeWidth={3} />
                      Add Pet
                    </button>
                  </div>
                  
                </div>
              )}
            </div>

            {/* Right Column: Sidebar */}
            <div className="w-full flex flex-col lg:mt-0 h-full">
              
              {/* Why Choose Block */}
              <div className="bg-[#f2f9f8] rounded-[20px] p-4 lg:p-6 border border-[#007672]/10 h-full flex flex-col">
                <h3 className="text-[16px] font-extrabold text-[#1B2B48] mb-6">Why Choose Mypet9?</h3>
                
                <div className="flex flex-col justify-between flex-1 space-y-5">
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-[#007672]/20 bg-white flex items-center justify-center shrink-0">
                      <ShieldCheck size={16} className="text-[#007672]" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-extrabold text-[#1B2B48] mb-0.5">Safe & Trusted Partners</h4>
                      <p className="text-[11px] font-medium text-[#465E87] leading-snug">All our pet sitters are verified and background checked.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-[#007672]/20 bg-white flex items-center justify-center shrink-0">
                      <Home size={16} className="text-[#007672]" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-extrabold text-[#1B2B48] mb-0.5">Home-Like Care</h4>
                      <p className="text-[11px] font-medium text-[#465E87] leading-snug">Your pets stay in loving homes, not cages.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-[#007672]/20 bg-white flex items-center justify-center shrink-0">
                      <Heart size={16} className="text-[#007672]" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-extrabold text-[#1B2B48] mb-0.5">Personalised Attention</h4>
                      <p className="text-[11px] font-medium text-[#465E87] leading-snug">Every pet is unique, and we match them with the right care.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-[#007672]/20 bg-white flex items-center justify-center shrink-0">
                      <Plus size={16} className="text-[#007672]" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-extrabold text-[#1B2B48] mb-0.5">Extra Services</h4>
                      <p className="text-[11px] font-medium text-[#465E87] leading-snug">Pickup & Drop, Grooming, Vaccination, Training.</p>
                    </div>
                  </div>
                  
                </div>
              </div>

            </div>
          </div>
        </div>
        
        {/* Bottom Banner */}
        <div className="w-full mt-1 pb-6">
          <img src="/pet-bottom-section.png" alt="More Than Just Boarding" className="w-full h-auto object-cover max-w-7xl mx-auto rounded-[20px] md:px-4" />
        </div>

      </div>
    </DashboardLayout>
  );
};
