content = """import { useState, useEffect } from 'react';
import { Plus, MoreVertical, PawPrint, Calendar, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, Check, Edit2, MoreHorizontal, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { TopNavbar } from '../../components/layout/TopNavbar';
import { BottomNav } from '../../components/layout/BottomNav';

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  vaccinated: boolean;
  image?: string;
  userId: string;
}

export const MyPetsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'pets'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const petsData: Pet[] = [];
      querySnapshot.forEach((doc) => {
        petsData.push({ id: doc.id, ...doc.data() } as Pet);
      });
      setPets(petsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching pets:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDeletePet = async (petId: string) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await deleteDoc(doc(db, 'pets', petId));
        setOpenDropdownId(null);
      } catch (error) {
        console.error("Error deleting pet:", error);
        alert("Failed to delete pet. Please try again.");
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7F9] font-sans pb-24 md:pb-8">
      {/* Mobile Top Navbar */}
      <div className="md:hidden">
        <TopNavbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-extrabold text-[#111111] leading-tight">My Pets</h1>
            <p className="text-[14px] font-medium text-[#666666] mt-1">Manage your furry friends' profiles and medical details.</p>
          </div>
          <button 
            onClick={() => navigate('/add-pet')}
            className="bg-[#007672] hover:bg-[#00605c] transition-colors text-white px-5 py-2.5 rounded-full font-bold text-[14px] flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} strokeWidth={3} />
            Add Pet
          </button>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden mb-6 mt-2">
          <div className="flex items-center justify-between">
            <h1 className="text-[24px] font-extrabold text-[#111111]">Your Pets</h1>
            <div className="bg-[#EAF8F8] text-[#007672] px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold text-[12px]">
              <PawPrint size={14} />
              {pets.length} Pets
            </div>
          </div>
          <p className="text-[13px] font-medium text-[#666666] mt-1.5 leading-snug">
            Here are your furry friends. Manage their profiles and keep their information up to date for the best care.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007672]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            
            {/* Map through Pets */}
            {pets.map((pet) => (
              <div 
                key={pet.id} 
                onClick={() => navigate(`/edit-pet/${pet.id}`)}
                className="bg-white rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col p-0 group cursor-pointer hover:border-[#007672]/30 hover:shadow-[0_8px_30px_rgb(0,118,114,0.12)] transition-all overflow-hidden h-full"
              >
                {/* Pet Image Header */}
                <div className="w-full h-[160px] relative shrink-0">
                  <img 
                    src={pet.image || 'https://placehold.co/600x400/e0f4f2/007672?text=Pet'} 
                    alt={pet.name} 
                    className="w-full h-full object-cover" 
                  />
                  
                  {/* 3 dots menu OVER image */}
                  <div className="absolute top-3 right-3 z-30">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === pet.id ? null : pet.id);
                      }}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 shadow-sm transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {openDropdownId === pet.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white rounded-[16px] shadow-lg border border-gray-100 py-1 z-40 overflow-hidden">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-pet/${pet.id}`);
                          }}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-[#111111] hover:bg-gray-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePet(pet.id);
                          }}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pet Info Content */}
                <div className="p-4 flex flex-col flex-1 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[18px] font-extrabold text-[#111111] truncate">{pet.name}</h3>
                    <Edit2 size={12} className="text-gray-300 shrink-0" />
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide shrink-0 ${pet.type?.toLowerCase() === 'cat' ? 'bg-[#FFF0F5] text-[#D63384]' : 'bg-[#EAF8F8] text-[#007672]'}`}>
                      {pet.type || 'Dog'}
                    </span>
                  </div>

                  <div className="flex items-center gap-x-3 gap-y-1.5 flex-wrap text-[#666666] mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-bold text-[#b0bec5] leading-none">{pet.gender?.toLowerCase() === 'female' ? '♀' : '♂'}</span>
                      <span className="text-[12px] font-medium leading-none">{pet.gender || 'Male'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={13} className="text-[#007672] shrink-0" />
                      <span className="text-[12px] font-medium leading-none">{pet.age}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <PawPrint size={13} className="text-[#007672] shrink-0" />
                      <span className="text-[12px] font-medium leading-none">{parseInt(pet.weight) < 10 ? 'Small' : parseInt(pet.weight) < 25 ? 'Medium' : 'Large'}</span>
                    </div>
                  </div>
                  
                  {pet.vaccinated ? (
                    <div className="flex items-center justify-between bg-[#F2F9F9] text-[#007672] py-2 px-4 rounded-[12px] mb-3">
                      <ShieldCheck size={16} className="fill-[#007672] text-white" />
                      <span className="text-[12px] font-extrabold tracking-wide uppercase">
                        Vaccinated
                      </span>
                      <Check size={16} className="stroke-[3]" />
                    </div>
                  ) : (
                    <div className="h-[40px] mb-3"></div> // Spacer if not vaccinated
                  )}

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-pet/${pet.id}`);
                    }}
                    className="w-full mt-auto py-2 rounded-full border border-[#EAF8F8] text-[#007672] font-extrabold text-[13px] hover:bg-[#F2F9F9] transition-all flex items-center justify-center gap-1.5 group/btn"
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
              className="bg-[#F8F9FA] rounded-[24px] border-2 border-dashed border-[#b0bec5]/50 flex flex-col items-center justify-center p-6 group cursor-pointer hover:bg-[#EAF8F8] hover:border-[#007672]/50 transition-all min-h-[300px]"
            >
              <div className="w-[60px] h-[60px] bg-[#007672] rounded-full flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(0,118,114,0.3)] group-hover:scale-110 transition-transform">
                <Plus size={28} className="text-white" strokeWidth={3} />
              </div>
              <h3 className="text-[18px] font-extrabold text-[#111111] mb-1">Add a Pet</h3>
              <p className="text-[13px] font-medium text-[#666666] text-center max-w-[180px] mb-5">
                Include your furry friend to get the best care.
              </p>
              <button className="bg-[#007672] text-white px-6 py-2.5 rounded-full font-bold text-[13px] flex items-center gap-1.5 shadow-sm group-hover:bg-[#00605c] transition-colors">
                <Plus size={16} strokeWidth={3} />
                Add Pet
              </button>
              
              {/* Decorative Paw */}
              <div className="absolute top-4 right-4 text-[#b0bec5]/30">
                <PawPrint size={32} />
              </div>
            </div>
            
          </div>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};
"""

with open('src/screens/Pets/MyPetsScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
