import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const NotificationsScreen = () => {
  const navigate = useNavigate();

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
              Notifications
            </h1>
          </div>

          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell size={32} className="text-gray-300" />
            </div>
            <h3 className="text-[18px] font-extrabold text-[#1B2B48] mb-2">
              No notifications yet
            </h3>
            <p className="text-[#465E87] text-[14px] font-medium max-w-[280px]">
              We'll let you know when you have important updates about your bookings.
            </p>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};
