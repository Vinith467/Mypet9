import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const MessagesListScreen = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#F8F9FA] pb-24 lg:pb-12 pt-8 lg:pt-12 px-5">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors mr-3 lg:hidden"
            >
              <ArrowLeft className="text-[#1B2B48]" size={24} />
            </button>
            <h1 className="text-[22px] font-extrabold text-[#1B2B48]">Messages</h1>
          </div>

          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={32} className="text-gray-300" />
            </div>
            <h3 className="text-[18px] font-extrabold text-[#1B2B48] mb-2">
              No Messages Yet
            </h3>
            <p className="text-[#465E87] text-[14px] font-medium max-w-[280px]">
              When you contact a caretaker or they message you, it will appear here.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
