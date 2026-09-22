import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ClipboardList, Users, CalendarCheck, 
  Settings, PawPrint, LogOut, ChevronLeft, MessageSquare
} from 'lucide-react';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/applications', icon: ClipboardList, label: 'Applications' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/bookings', icon: CalendarCheck, label: 'Bookings' },
  { to: '/admin/support', icon: MessageSquare, label: 'Support Chats' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth');
  };

  return (
    <div className="flex h-screen bg-[#F8F9FB] overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] bg-[#1B2B48] text-white shrink-0">
        {/* Logo */}
        <div className="flex items-center space-x-3 px-6 py-6 border-b border-white/10">
          <div className="bg-[#174F38] p-2 rounded-xl">
            <PawPrint size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">Mypet<span className="text-emerald-400">9</span></h1>
            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon size={18} className="shrink-0 transition-colors" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-[13px] font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all w-full"
          >
            <ChevronLeft size={18} />
            <span>Back to App</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-[13px] font-bold text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#1B2B48] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PawPrint size={20} className="text-emerald-400" />
          <span className="font-extrabold text-sm">Mypet9 Admin</span>
        </div>
        <button onClick={handleLogout} className="text-white/60 hover:text-white">
          <LogOut size={18} />
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex">
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2.5 text-[10px] font-bold transition-colors ${
                isActive ? 'text-[#174F38]' : 'text-gray-400'
              }`
            }
          >
            <item.icon size={20} />
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};
