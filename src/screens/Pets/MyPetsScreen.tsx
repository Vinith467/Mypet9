import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PawPrint } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, getDocs } from 'firebase/firestore';
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
}

export const MyPetsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#FAF9F5] pb-24 lg:pb-12 pt-8 lg:pt-12 px-5">
        <div className="max-w-2xl mx-auto w-full">
          
          {/* Header */}
          <h1 className="text-[24px] font-extrabold text-[#1B2B48] mb-8">
            Your Pets
          </h1>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-petoo-primary"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6 lg:gap-8">
              
              {pets.map((pet) => (
                <button 
                  key={pet.id} 
                  onClick={() => navigate(`/edit-pet/${pet.id}`)}
                  className="flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                >
                  <div className="w-24 h-24 lg:w-[100px] lg:h-[100px] rounded-full overflow-hidden border-4 border-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-3 bg-gray-100 flex items-center justify-center">
                    {pet.image ? (
                      <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                      <PawPrint className="text-gray-400" size={32} />
                    )}
                  </div>
                  <span className="text-[16px] font-bold text-[#1B2B48]">{pet.name}</span>
                  <span className="text-[13px] font-medium text-gray-400 mt-0.5">{pet.type}</span>
                </button>
              ))}

              {/* Add Pet Button */}
              <button 
                onClick={() => navigate('/add-pet')}
                className="flex flex-col items-center cursor-pointer group focus:outline-none"
              >
                <div className="w-24 h-24 lg:w-[100px] lg:h-[100px] rounded-full flex items-center justify-center border-2 border-dashed border-[#174F38] bg-transparent group-hover:bg-[#174F38]/5 transition-colors mb-3">
                  <Plus size={32} className="text-[#174F38]" strokeWidth={1.5} />
                </div>
                <span className="text-[16px] font-bold text-[#1B2B48]">Add Pet</span>
              </button>
            </div>
          )}

          {/* Empty State Help Text */}
          {!loading && pets.length === 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-petoo-primary/10 rounded-full flex items-center justify-center mb-4">
                <PawPrint className="text-petoo-primary" size={32} />
              </div>
              <h3 className="text-[18px] font-extrabold text-[#1B2B48] mb-2">No pets added yet</h3>
              <p className="text-[#465E87] text-[14px] font-medium max-w-sm">
                Add your furry friends to easily book boarding services and keep track of their details.
              </p>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};
