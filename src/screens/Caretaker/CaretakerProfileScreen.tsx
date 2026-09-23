import { useState, useEffect } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  ChevronLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  PawPrint,
  Shield,
  LogOut,
  ChevronRight,
  Edit2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CaretakerProfileScreen = () => {
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [caretakerData, setCaretakerData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'caretaker_applications', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCaretakerData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const profileItems = [
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: user?.email || 'Not set',
    },
    {
      icon: <Phone size={20} />,
      label: 'Phone',
      value: user?.phoneNumber || userData?.phone || caretakerData?.phone || 'Not set',
    },
    {
      icon: <MapPin size={20} />,
      label: 'Location',
      value: caretakerData?.locationSettings?.city 
        ? `${caretakerData.locationSettings.city}, ${caretakerData.locationSettings.state || ''}`
        : caretakerData?.address || 'Not set',
    },
    {
      icon: <Calendar size={20} />,
      label: 'Member Since',
      value: user?.metadata?.creationTime 
        ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
        : 'N/A',
    },
  ];

  return (
    <CaretakerLayout>
      <div className="w-full flex flex-col bg-[#FAFAFA] min-h-screen font-quicksand pb-40 lg:pb-12 text-[#1B2B48]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-[#FAFAFA]/95 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center -ml-2 text-[#1B2B48] hover:bg-black/5 rounded-full transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-xl font-extrabold tracking-tight">My Profile</h1>
          </div>
          <div className="w-10"></div>
        </div>

        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-petoo-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex-1 px-5 lg:px-8 pt-6 w-full flex flex-col max-w-3xl mx-auto">
            
            {/* Avatar & Name */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <img 
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=FBBF24&color=1B2B48&size=120&bold=true`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-petoo-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <Shield size={14} className="text-[#1B2B48]" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-[#1B2B48] tracking-tight">{userData?.name || 'Partner'}</h2>
              <div className="flex items-center space-x-1.5 mt-1">
                <PawPrint size={14} className="text-[#FBBF24]" fill="currentColor" />
                <span className="text-[12px] font-bold text-[#FBBF24] uppercase tracking-wider">Verified Partner</span>
              </div>
            </div>

            {/* Profile Info Cards */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 mb-6">
              {profileItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-4 p-4"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-[14px] font-bold text-[#1B2B48] truncate">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col space-y-3 mb-6">
              <button 
                onClick={() => navigate('/edit-profile')}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Edit2 size={18} className="text-blue-500" />
                  </div>
                  <span className="text-[14px] font-bold text-[#1B2B48]">Edit Profile</span>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-[#1B2B48] group-hover:translate-x-1 transition-all" />
              </button>

              <button 
                onClick={() => navigate('/support')}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Mail size={18} className="text-emerald-500" />
                  </div>
                  <span className="text-[14px] font-bold text-[#1B2B48]">Help & Support</span>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-[#1B2B48] group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="w-full bg-red-50 hover:bg-red-100 rounded-2xl p-4 flex items-center justify-center space-x-2 transition-colors border border-red-100"
            >
              <LogOut size={18} className="text-red-500" />
              <span className="text-[14px] font-bold text-red-500">Logout</span>
            </button>

          </div>
        )}
      </div>
    </CaretakerLayout>
  );
};
