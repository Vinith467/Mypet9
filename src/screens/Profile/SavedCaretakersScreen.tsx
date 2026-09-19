import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, MapPin } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useSavedCaretakers } from '../../hooks/useSavedCaretakers';
import { motion } from 'framer-motion';

export const SavedCaretakersScreen = () => {
  const navigate = useNavigate();
  const { savedCaretakers, toggleSaved } = useSavedCaretakers();

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#FAF9F5] pb-24 lg:pb-12 pt-6 lg:pt-10 px-5">
        <div className="max-w-2xl mx-auto w-full">
          
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 hover:bg-gray-50 transition-colors mr-3"
            >
              <ArrowLeft className="text-[#1B2B48]" size={20} />
            </button>
            <h1 className="text-[24px] font-extrabold text-[#1B2B48]">
              Saved Caretakers
            </h1>
          </div>

          {/* List */}
          {savedCaretakers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Heart size={32} className="text-gray-300" />
              </div>
              <h3 className="text-[18px] font-bold text-[#1B2B48] mb-2">No saved caretakers yet</h3>
              <p className="text-[#465E87] text-[15px] font-medium max-w-[280px]">
                When you see a caretaker you like, tap the heart icon to save them for later.
              </p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {savedCaretakers.map((provider) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={provider.id}
                  className="bg-white rounded-[24px] p-3 lg:p-4 shadow-sm border border-gray-100 flex items-center cursor-pointer hover:shadow-md transition-shadow relative"
                  onClick={() => navigate('/caretaker-profile', { state: { provider } })}
                >
                  {/* Left Side: Avatar */}
                  <div className="w-[84px] h-[84px] lg:w-[100px] lg:h-[100px] rounded-[18px] overflow-hidden shrink-0 relative">
                    <img 
                      src={provider.images?.[0] || 'https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?auto=format&fit=crop&q=80&w=200'} 
                      alt={provider.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Right Side: Details */}
                  <div className="ml-4 flex-1">
                    <h3 className="text-[16px] lg:text-[18px] font-extrabold text-[#1B2B48] leading-tight mb-1 pr-8">
                      {provider.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1.5 mb-2">
                      <Star size={14} className="fill-amber-500 text-amber-500" />
                      <span className="text-[13px] font-extrabold text-[#1B2B48]">{provider.rating}</span>
                      <span className="text-[13px] font-medium text-gray-400">({provider.reviews})</span>
                    </div>

                    <div className="flex items-center text-[#465E87] space-x-1">
                      <MapPin size={14} />
                      <span className="text-[13px] font-medium">{provider.locationStr}</span>
                    </div>
                  </div>

                  {/* Heart Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaved(provider);
                    }}
                    className="absolute top-4 right-4 w-9 h-9 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Heart size={18} className="fill-red-500 text-red-500" />
                  </button>

                </motion.div>
              ))}
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};
