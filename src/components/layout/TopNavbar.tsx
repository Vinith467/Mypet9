import { useNavigate, useLocation } from 'react-router-dom';
import { PawPrint, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface TopNavbarProps {
  currentLocationStr?: string;
}

export const TopNavbar = ({ currentLocationStr }: TopNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/pets' && location.pathname.startsWith('/add-pet')) return true;
    return location.pathname.startsWith(path) || (location.pathname === '/' && path === '/home');
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 fixed top-0 left-0 w-full z-50">
         <div className="flex items-center">
           <PawPrint className="text-[#007672] w-6 h-6 mr-2" strokeWidth={2.5} />
           <span className="font-extrabold text-[22px] tracking-tight text-[#1B2B48]">mypet9</span>
         </div>
         {(user?.email === 'ojasvinanand514@gmail.com' || user?.email === 'vinuvinith0007@gmail.com') && (
           <button onClick={() => navigate('/inquiry')} className="text-[11px] font-bold bg-[#E6FBF0] text-[#007672] px-3 py-1.5 rounded-full border border-[#007672]/20 shadow-sm hover:bg-[#D1F4E0] transition-colors">
             Inquiry Form
           </button>
         )}
      </div>
      <div className="md:hidden h-[60px] w-full shrink-0" />

      {/* Desktop Top Bar */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white w-full border-b border-gray-100 z-50 fixed top-0 left-0 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/')}>
           <PawPrint className="text-[#007672] w-8 h-8" strokeWidth={2.5} />
           <span className="font-extrabold text-[24px] tracking-tight text-[#1B2B48]">mypet9</span>
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-[15px] font-bold text-gray-500">
          <span 
            onClick={() => navigate('/home')} 
            className={`cursor-pointer transition-colors ${isActive('/home') ? 'text-[#007672] border-b-2 border-[#007672] pb-1' : 'hover:text-gray-900 pb-1 border-b-2 border-transparent'}`}
          >
            Home
          </span>
          {user && (
            <>
              <span 
                onClick={() => navigate('/pets')} 
                className={`cursor-pointer transition-colors ${isActive('/pets') ? 'text-[#007672] border-b-2 border-[#007672] pb-1' : 'hover:text-gray-900 pb-1 border-b-2 border-transparent'}`}
              >
                My Pets
              </span>
              <span 
                onClick={() => navigate('/bookings')} 
                className={`cursor-pointer transition-colors ${isActive('/bookings') ? 'text-[#007672] border-b-2 border-[#007672] pb-1' : 'hover:text-gray-900 pb-1 border-b-2 border-transparent'}`}
              >
                Bookings
              </span>
              <span 
                onClick={() => navigate('/messages')} 
                className={`cursor-pointer transition-colors ${isActive('/messages') ? 'text-[#007672] border-b-2 border-[#007672] pb-1' : 'hover:text-gray-900 pb-1 border-b-2 border-transparent'}`}
              >
                Messages
              </span>
            </>
          )}
          
          {currentLocationStr && (
            <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer ml-4 border border-gray-200 shrink-0">
              <MapPin size={14} className="text-gray-700" />
              <span className="text-gray-900 max-w-[150px] truncate">{currentLocationStr}</span>
              <ChevronDown size={14} className="text-gray-500 ml-1" />
            </div>
          )}
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {!user ? (
            <>
              <button onClick={() => navigate('/auth')} className="px-6 py-2.5 text-[#007672] font-bold text-sm border border-[#007672] rounded-full hover:bg-teal-50 transition-colors">Log In</button>
              <button onClick={() => navigate('/auth')} className="px-6 py-2.5 bg-[#007672] text-white font-bold text-sm rounded-full hover:bg-[#00605c] transition-colors">Sign Up</button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full border-2 border-[#007672] overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=007672&color=fff`} alt="Profile" className="w-full h-full object-cover" />
            </button>
          )}
        </div>
      </header>
      <div className="hidden md:block h-[73px] w-full shrink-0" />
    </>
  );
};
