import { useState, useEffect } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ChevronLeft, Info, Plus, Minus, ChevronRight, Calendar as CalendarIcon, CheckCircle2, X, PawPrint } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type DateStatus = 'available' | 'limited' | 'full' | 'blocked';

export const CaretakerAvailabilityScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [savingCapacity, setSavingCapacity] = useState(false);
  const [showCapacitySuccess, setShowCapacitySuccess] = useState(false);
  
  const [capacity, setCapacity] = useState(3);
  const [dateStatuses, setDateStatuses] = useState<Record<string, DateStatus>>({});
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingModal, setSavingModal] = useState(false);
  const [modalFromDate, setModalFromDate] = useState('');
  const [modalToDate, setModalToDate] = useState('');
  const [modalBookedSlots, setModalBookedSlots] = useState(0);
  const [modalIsBlocked, setModalIsBlocked] = useState(false);

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

  const saveToFirebase = async (newStatuses: Record<string, DateStatus>) => {
    if (!user?.uid) return;
    const docRef = doc(db, 'caretaker_applications', user.uid);
    await setDoc(docRef, {
      availability: {
        capacity,
        dateStatuses: newStatuses
      }
    }, { merge: true });
    setDateStatuses(newStatuses);
  };

  const handleSaveCapacity = async () => {
    if (!user?.uid) return;
    setSavingCapacity(true);
    try {
      await saveToFirebase(dateStatuses);
      setShowCapacitySuccess(true);
      setTimeout(() => setShowCapacitySuccess(false), 3000);
    } catch (error) {
      console.error("Error saving capacity:", error);
      alert('Failed to save settings.');
    } finally {
      setSavingCapacity(false);
    }
  };

  const handleSaveModal = async () => {
    if (!user?.uid || !modalFromDate || !modalToDate) return;
    setSavingModal(true);
    
    try {
      const from = new Date(modalFromDate);
      const to = new Date(modalToDate);
      
      // Normalize time to midnight
      from.setHours(0,0,0,0);
      to.setHours(0,0,0,0);
      
      if (to < from) {
        alert("To Date must be after From Date");
        setSavingModal(false);
        return;
      }

      const newStatuses = { ...dateStatuses };
      let d = new Date(from);
      
      while (d <= to) {
        const yearStr = d.getFullYear();
        const monthStr = String(d.getMonth() + 1).padStart(2, '0');
        const dayStr = String(d.getDate()).padStart(2, '0');
        const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
        
        let newStatus: DateStatus = 'available';
        
        if (modalIsBlocked) {
          newStatus = 'blocked';
        } else {
          if (modalBookedSlots >= capacity) {
            newStatus = 'full';
          } else if (modalBookedSlots > 0) {
            newStatus = 'limited';
          }
        }
        
        if (newStatus === 'available') {
          delete newStatuses[dateStr];
        } else {
          newStatuses[dateStr] = newStatus;
        }
        
        d.setDate(d.getDate() + 1);
      }
      
      await saveToFirebase(newStatuses);
      
      setIsModalOpen(false);
      // Reset modal state
      setModalFromDate('');
      setModalToDate('');
      setModalBookedSlots(0);
      setModalIsBlocked(false);
      
    } catch (err) {
      console.error(err);
      alert("Failed to update availability");
    } finally {
      setSavingModal(false);
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
  
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const days = [];
  for (let i = 0; i < offset; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

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
      <div className="w-full flex flex-col bg-[#FAFAFA] min-h-screen font-quicksand pb-32 text-petoo-textDark relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-[#FAFAFA]/95 backdrop-blur-md z-40 border-b border-gray-100">
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
            
            <h2 className="text-[14px] text-gray-500 font-medium mb-6">View and manage your boarding schedule</h2>
            
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
                onClick={handleSaveCapacity}
                disabled={savingCapacity || showCapacitySuccess}
                className={`w-full py-3 border-2 rounded-2xl font-extrabold text-[15px] transition-colors ${
                  showCapacitySuccess
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : 'border-petoo-primary text-petoo-textDark hover:bg-petoo-primary/10 active:bg-petoo-primary/20'
                }`}
              >
                {showCapacitySuccess ? 'Saved!' : 'Update Capacity'}
              </button>
            </div>

            {/* Calendar Section (View Only) */}
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
            <div className="mb-8 bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-gray-400 font-medium text-[13px] py-2">
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
                    <div 
                      key={day} 
                      className="flex flex-col items-center justify-start h-12 pt-1 relative"
                    >
                      <span className={`text-[15px] font-bold z-10 w-8 h-8 flex items-center justify-center rounded-full
                        ${status === 'blocked' ? 'text-gray-400 line-through decoration-gray-400/50' : 'text-[#1B2B48]'}
                        ${isToday ? 'bg-petoo-primary/20' : ''}
                      `}>
                        {day}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${getStatusColor(status)}`}></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between px-2 mb-8 flex-wrap gap-2">
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-[12px] font-bold text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-[12px] font-bold text-gray-600">Limited</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-[12px] font-bold text-gray-600">Full</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-[12px] font-bold text-gray-600">Blocked</span>
              </div>
            </div>
            
            {/* Open Modal Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-petoo-primary text-petoo-textDark font-extrabold text-[16px] py-4 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] mt-2 flex items-center justify-center"
            >
              <CalendarIcon size={20} className="mr-2" />
              Update Availability
            </button>
          </div>
        )}

        {/* Update Availability Modal Overlay */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1B2B48]/40 backdrop-blur-sm sm:p-5"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl font-extrabold text-petoo-textDark">Update Availability</h2>
                    <p className="text-[13px] text-gray-500 font-medium">Update booked slots for a date range</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto flex-1">
                  
                  {/* Block Dates Toggle */}
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                    <div className="flex-1 pr-4">
                      <h4 className="font-extrabold text-[15px] text-petoo-textDark">Block these dates?</h4>
                      <p className="text-[12px] text-gray-500 font-medium leading-snug mt-0.5">Toggle this if you are not available for any bookings (e.g. vacation).</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={modalIsBlocked}
                        onChange={(e) => setModalIsBlocked(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-petoo-primary"></div>
                    </label>
                  </div>

                  {/* Date Range Selection */}
                  <div className="mb-8">
                    <div className="flex items-center text-petoo-textDark mb-4">
                      <CalendarIcon size={18} className="mr-2" />
                      <h4 className="font-extrabold text-[15px]">Select Date Range</h4>
                    </div>
                    
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-[12px] font-bold text-gray-500 mb-1.5">From</label>
                        <input 
                          type="date" 
                          value={modalFromDate}
                          onChange={(e) => setModalFromDate(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-petoo-textDark focus:outline-none focus:border-petoo-primary focus:ring-1 focus:ring-petoo-primary"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[12px] font-bold text-gray-500 mb-1.5">To</label>
                        <input 
                          type="date"
                          value={modalToDate}
                          min={modalFromDate}
                          onChange={(e) => setModalToDate(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-petoo-textDark focus:outline-none focus:border-petoo-primary focus:ring-1 focus:ring-petoo-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Booked Slots (Only show if not blocking) */}
                  {!modalIsBlocked && (
                    <div className="mb-6">
                      <div className="flex items-center text-petoo-textDark mb-2">
                        <PawPrint size={18} className="mr-2" />
                        <h4 className="font-extrabold text-[15px]">Booked Slots</h4>
                        <Info size={14} className="text-gray-400 ml-1.5" />
                      </div>
                      <p className="text-[13px] text-gray-500 font-medium mb-5">
                        How many pets are already booked during this period?
                      </p>
                      
                      <div className="flex flex-col items-center justify-center mb-6">
                        <div className="flex items-center justify-center space-x-5 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                          <button 
                            onClick={() => setModalBookedSlots(prev => Math.max(0, prev - 1))}
                            className="w-10 h-10 bg-petoo-primary rounded-xl flex items-center justify-center text-petoo-textDark active:scale-95 transition-transform shadow-sm"
                          >
                            <Minus size={20} />
                          </button>
                          <div className="flex items-center justify-center min-w-[60px]">
                            <span className="text-3xl font-extrabold text-petoo-textDark">{modalBookedSlots}</span>
                          </div>
                          <button 
                            onClick={() => setModalBookedSlots(prev => Math.min(capacity, prev + 1))}
                            className="w-10 h-10 bg-petoo-primary rounded-xl flex items-center justify-center text-petoo-textDark active:scale-95 transition-transform shadow-sm"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                        <span className="text-gray-500 font-bold text-[14px] mt-3">/ {capacity} pets max capacity</span>
                      </div>
                    </div>
                  )}

                  {/* Info Warning */}
                  <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-start">
                    <Info size={20} className="text-orange-500 mt-0.5 shrink-0" />
                    <p className="text-[13px] text-orange-800 font-medium ml-3 leading-relaxed">
                      {modalIsBlocked 
                        ? "Blocking these dates will prevent any new bookings for this period."
                        : "Increase or decrease the number of booked slots. Use this when you receive a booking from another source or if a booking is cancelled."}
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-gray-100 bg-white sm:rounded-b-3xl">
                  <button 
                    onClick={handleSaveModal}
                    disabled={savingModal || !modalFromDate || !modalToDate}
                    className="w-full bg-petoo-primary text-petoo-textDark font-extrabold text-[16px] py-4 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-50"
                  >
                    {savingModal ? 'Saving...' : 'Save Availability'}
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CaretakerLayout>
  );
};
