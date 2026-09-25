import { useNavigate } from 'react-router-dom';
import { 
  PawPrint, 
  Calendar, 
  Heart, 
  Truck, 
  Wallet, 
  Bell, 
  HelpCircle, 
  Shield, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { label: 'My Pets', icon: PawPrint, path: '/pets' },
  { label: 'Bookings', icon: Calendar, path: '/bookings' },
  { label: 'Saved Caretakers', icon: Heart, path: '/saved-caretakers' },
  { label: 'Pickup & Drop History', icon: Truck, path: '/history' },
  { label: 'Payments', icon: Wallet, path: '/payments' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Help & Support', icon: HelpCircle, path: '/support' },
  { label: 'Terms & Policies', icon: Shield, path: '/terms' },
];

export const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#F8F9FA] pb-24 lg:pb-12 pt-8 lg:pt-12 px-5">
        <div className="max-w-2xl mx-auto w-full">
          
          {/* User Profile Header */}
          <button 
            onClick={() => navigate('/edit-profile')}
            className="flex items-center mb-8 w-full text-left bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <img 
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || "User")}&background=E5E7EB&color=1B2B48`} 
              alt={userData?.name || "User"} 
              className="w-16 h-16 rounded-full object-cover mr-4 shadow-sm"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || "User")}&background=E5E7EB&color=1B2B48`;
              }}
            />
            <div className="flex flex-col flex-1">
              <span className="text-[22px] font-extrabold text-[#1B2B48]">{userData?.name || 'User'}</span>
              <span className="text-[14px] font-medium text-[#465E87]">{user?.email || 'No email set'}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-[#1B2B48] font-bold text-[12px]">Edit</span>
            </div>
          </button>

          {/* Menu List */}
          <div className="bg-white rounded-[24px] p-2 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 mb-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <button 
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition-colors rounded-xl group"
                  >
                    <div className="flex items-center text-[#1B2B48]">
                      <div className="w-8 flex justify-center">
                        <Icon size={20} className="text-[#465E87] group-hover:text-petoo-primary transition-colors" strokeWidth={2.5} />
                      </div>
                      <span className="text-[15px] font-bold ml-3">{item.label}</span>
                    </div>
                    <ChevronRight size={20} className="text-[#465E87] opacity-60" />
                  </button>
                  {index < menuItems.length - 1 && (
                    <div className="border-t border-gray-100 mx-4"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Logout Button */}
          <button 
            onClick={async () => {
              await logout();
              navigate('/');
            }}
            className="w-full bg-white rounded-[16px] p-4 flex items-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 hover:bg-red-50 transition-colors group"
          >
            <div className="w-8 flex justify-center ml-4">
              <LogOut size={20} className="text-red-500 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-bold text-red-500 ml-3">Logout</span>
          </button>

        </div>
      </div>
    </DashboardLayout>
  );
};
