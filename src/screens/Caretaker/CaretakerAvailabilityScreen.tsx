import { useState, useEffect } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ChevronLeft, Info, Plus, Minus, ChevronRight, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

type DateStatus = 'available' | 'limited' | 'full' | 'blocked';

export const CaretakerAvailabilityScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [capacity, setCapacity] = useState(3);
  const [dateStatuses, setDateStatuses] = useState<Record<string, DateStatus>>({});
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      try {
        const docRef = doc(db, 'caretaker_applications', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data().availability;
          if (data) {
            if (data.capacity) setCapacity(data.capacity);
            if (data.dateStatuses) setDateStatuses(data.dateStatuses);
          }
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'caretaker_applications', user.uid);
      await setDoc(docRef, {
        availability: {
          capacity,
          dateStatuses
        }
      }, { merge: true });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving availability:", error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const decreaseCapacity = () => setCapacity(prev => Math.max(1, prev - 1));
  const increaseCapacity = () => setCapacity(prev => prev + 1);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  
  // Convert 0-6 (Sun-Sat) to 0-6 (Mon-Sun) for offset
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const days = [];
  for (let i = 0; i < offset; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleDateClick = (day: number | null) => {
    if (day === null) return;
    
    // Format YYYY-MM-DD
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Cycle status: available -> limited -> full -> blocked -> available
    const currentStatus = dateStatuses[dateStr] || 'available';
    let nextStatus: DateStatus = 'available';
    
    if (currentStatus === 'available') nextStatus = 'limited';
    else if (currentStatus === 'limited') nextStatus = 'full';
    else if (currentStatus === 'full') nextStatus = 'blocked';
    
    const newStatuses = { ...dateStatuses };
    if (nextStatus === 'available') {
      delete newStatuses[dateStr];
    } else {
      newStatuses[dateStr] = nextStatus;
    }
    setDateStatuses(newStatuses);
  };

  const getStatusColor = (status: DateStatus) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'limited': return 'bg-yellow-400';
      case 'full': return 'bg-red-500';
      case 'blocked': return 'bg-gray-400';
      default: return 'bg-green-500';
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <CaretakerLayout>
      <div className="w-full flex flex-col bg-[#FAFAFA] min-h-screen font-quicksand pb-32 text-petoo-textDark">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-[#FAFAFA]/95 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center -ml-2 text-petoo-textDark hover:bg-black/5 rounded-full transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-xl font-extrabold tracking-tight">Availability</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-petoo-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex-1 px-5 lg:px-12 pt-6 w-full flex flex-col max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            <h2 className="text-[14px] text-gray-500 font-medium mb-6">Manage your boarding availability</h2>
            
            {/* Capacity Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center mb-1">
                <h3 className="text-petoo-textDark font-extrabold text-[16px]">Boarding Capacity</h3>
                <Info size={16} className="text-gray-400 ml-2" />
              </div>
              <p className="text-gray-500 text-[13px] font-medium mb-5">
                Maximum pets you can accommodate at the same time
              </p>
              
              <div className="flex items-center justify-center space-x-4 mb-5">
                <button 
                  onClick={decreaseCapacity}
                  className="w-12 h-12 bg-petoo-primary rounded-xl flex items-center justify-center text-petoo-textDark active:scale-95 transition-transform"
                >
                  <Minus size={24} />
                </button>
                <div className="flex items-center justify-center min-w-[80px]">
                  <span className="text-4xl font-extrabold text-petoo-textDark">{capacity}</span>
                  <span className="text-gray-500 font-medium text-[16px] ml-2 mt-2">pets</span>
                </div>
                <button 
                  onClick={increaseCapacity}
                  className="w-12 h-12 bg-petoo-primary rounded-xl flex items-center justify-center text-petoo-textDark active:scale-95 transition-transform"
                >
                  <Plus size={24} />
                </button>
              </div>
              
              <button 
                onClick={handleSave}
                disabled={saving || showSuccess}
                className={`w-full py-3 border-2 rounded-2xl font-extrabold text-[15px] transition-colors ${
                  showSuccess
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : 'border-petoo-primary text-petoo-textDark hover:bg-petoo-primary/10 active:bg-petoo-primary/20'
                }`}
              >
                {showSuccess ? 'Saved!' : 'Update Capacity'}
              </button>
            </div>

            {/* Calendar Section */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#1B2B48] font-extrabold text-[18px]">
                {monthNames[month]} {year}
              </h3>
              <div className="flex items-center space-x-2">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full text-[#1B2B48] transition-colors"><ChevronLeft size={24} /></button>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full text-[#1B2B48] transition-colors"><ChevronRight size={24} /></button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="mb-8">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-gray-500 font-medium text-[13px] py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 gap-y-3">
                {days.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="h-12"></div>;
                  }
                  
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const status = dateStatuses[dateStr] || 'available';
                  
                  const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                  
                  return (
                    <button 
                      key={day} 
                      onClick={() => handleDateClick(day)}
                      className="flex flex-col items-center justify-start h-12 pt-1 relative active:scale-90 transition-transform"
                    >
                      <span className={`text-[15px] font-bold z-10 w-8 h-8 flex items-center justify-center rounded-full
                        ${status === 'blocked' ? 'text-gray-400' : 'text-[#1B2B48]'}
                        ${isToday ? 'bg-petoo-primary/20' : ''}
                      `}>
                        {day}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${getStatusColor(status)}`}></div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between px-2 mb-8">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-[12px] font-medium text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-[12px] font-medium text-gray-600">Limited</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-[12px] font-medium text-gray-600">Full</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-[12px] font-medium text-gray-600">Blocked</span>
              </div>
            </div>
            
            {/* Bottom Save Button */}
            <button 
              onClick={handleSave}
              disabled={saving || showSuccess}
              className={`w-full font-extrabold text-[16px] py-4 rounded-2xl shadow-md hover:shadow-lg transition-all mt-4 flex items-center justify-center disabled:opacity-50 ${
                showSuccess 
                  ? 'bg-green-500 text-white active:scale-100' 
                  : 'bg-petoo-primary text-petoo-textDark active:scale-[0.98]'
              }`}
            >
              {showSuccess ? (
                <>
                  <CheckCircle2 size={20} className="mr-2" />
                  Successfully Saved!
                </>
              ) : saving ? (
                'Saving...'
              ) : (
                <>
                  <CalendarIcon size={20} className="mr-2" />
                  Update Availability
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </CaretakerLayout>
  );
};
