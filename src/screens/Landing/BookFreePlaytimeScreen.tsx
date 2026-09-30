import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Users, PawPrint, ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowRight, Check, ChevronDown } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

export const BookFreePlaytimeScreen = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<number>(18);
  const [selectedTime, setSelectedTime] = useState<string>('9:00 AM');
  const [petName, setPetName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [petSize, setPetSize] = useState<'Small' | 'Medium' | 'Large' | ''>('');

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const availableDates = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
  
  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const dateStr = `2026-09-${selectedDate}`;
        const q = query(
          collection(db, 'free_playtime_bookings'), 
          where('date', '==', dateStr)
        );
        const querySnapshot = await getDocs(q);
        const slots: string[] = [];
        querySnapshot.forEach((doc) => {
          slots.push(doc.data().timeSlot);
        });
        setBookedSlots(slots);
      } catch (err) {
        console.error("Error fetching bookings", err);
      }
    };
    fetchBookings();
  }, [selectedDate]);

  const ALL_TIME_SLOTS = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
  ];

  const timeSlots = ALL_TIME_SLOTS.map(time => {
    return {
      time,
      status: bookedSlots.includes(time) ? 'disabled' : (selectedTime === time ? 'selected' : 'available')
    };
  });

  const handleBook = async () => {
    if (!petName || !breed || !age || !petSize || !selectedTime) {
      alert("Please fill all details and select a time slot.");
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'free_playtime_bookings'), {
        userId: user ? user.uid : null,
        date: `2026-09-${selectedDate}`,
        timeSlot: selectedTime,
        petName,
        breed,
        age,
        size: petSize,
        createdAt: Timestamp.now()
      });
      alert("Booking successful! We will notify you shortly.");
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Failed to book playtime. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row min-h-screen bg-[#F8F9FA] lg:bg-white pb-24 lg:pb-0">
      
      {/* Left Column / Hero Section */}
      <div className="relative w-full lg:w-1/2 lg:min-h-screen lg:h-screen lg:sticky lg:top-0 lg:overflow-hidden flex flex-col bg-white">
        
        {/* Top Nav (Mobile Only) */}
        <div className="lg:hidden fixed top-0 left-0 w-full px-4 py-3 flex items-center z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <ArrowLeft className="text-[#1B2B48]" size={24} />
          </button>
          <div className="flex items-center ml-3 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
            <PawPrint className="text-[#007672] w-5 h-5 mr-1" strokeWidth={2.5} />
            <span className="text-[#1B2B48] font-extrabold text-[18px] tracking-tight">mypet9</span>
          </div>
        </div>

        {/* Mobile Background Image */}
        <img 
          src="/mobilebookfree.png" 
          alt="Book Free Playtime" 
          className="lg:hidden w-full h-auto block z-0"
        />
        
        {/* Desktop Background Image */}
        <img 
          src="/desktopbookfree.png" 
          alt="Book Free Playtime" 
          className="hidden lg:block w-full h-auto object-contain object-top z-0"
        />

        {/* Desktop Visible Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="hidden lg:flex absolute top-6 left-6 xl:top-8 xl:left-8 w-11 h-11 xl:w-12 xl:h-12 z-20 items-center justify-center bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm text-[#1B2B48]"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>

      </div>

      {/* Right Column / Main Content */}
      <div className="lg:flex-1 lg:w-1/2 lg:h-screen lg:overflow-y-auto w-full px-5 pt-0 lg:pt-8 lg:px-6 xl:px-8 flex flex-col space-y-5 relative z-10 lg:pb-12 bg-[#F8F9FA] lg:bg-white -mt-1 lg:mt-0">
        
        {/* Desktop Heading Form */}
        <div className="hidden lg:block relative mb-2">
          <h2 className="text-[32px] font-extrabold text-[#1B2B48] tracking-tight">Book Free Playtime</h2>
          <p className="text-[#465E87] text-[15px] mt-1">Select a date, time and provide your pet's details.</p>
          <PawPrint className="absolute right-0 top-0 text-[#E9F5FB] w-24 h-24 -mr-4 -mt-4 opacity-60 rotate-12 pointer-events-none" />
        </div>

        {/* Step 1: Select Date */}
        <div className="bg-white rounded-2xl lg:rounded-[20px] p-5 lg:p-6 shadow-sm lg:shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 relative">
          <div className="flex items-center mb-5">
            <div className="w-7 h-7 rounded-full bg-[#007672] text-white flex items-center justify-center font-bold text-[14px] mr-3 shadow-md shadow-[#007672]/20">1</div>
            <h2 className="text-[17px] font-bold text-[#1B2B48]">Select Date</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            {/* Calendar */}
            <div className="w-full lg:flex-1 lg:max-w-[420px]">
              <div className="flex items-center justify-between mb-4 px-2">
                <button className="text-[#1B2B48] hover:bg-gray-50 p-1 rounded-md transition-colors"><ChevronLeft size={20} /></button>
                <span className="font-bold text-[#1B2B48] text-[15px]">September 2026</span>
                <button className="text-[#1B2B48] hover:bg-gray-50 p-1 rounded-md transition-colors"><ChevronRight size={20} /></button>
              </div>
              
              <div className="grid grid-cols-7 gap-y-3 gap-x-1 mb-2 text-center">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-[13px] text-[#465E87] font-semibold mb-1">{day}</div>
                ))}
                
                {/* Dummy calendar dates just to match the visual */}
                <div className="text-[14px] text-gray-300 flex items-center justify-center h-10 w-10 mx-auto">31</div>
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(date => (
                  <div key={date} className="text-[14px] text-[#8fa0b5] flex items-center justify-center h-10 w-10 mx-auto">
                    {date}
                  </div>
                ))}
                {availableDates.map(date => {
                  const isSelected = date === selectedDate;
                  return (
                    <button 
                      key={date} 
                      onClick={() => setSelectedDate(date)}
                      className={`text-[15px] font-bold flex items-center justify-center h-10 w-10 mx-auto rounded-full transition-all ${
                        isSelected 
                          ? 'bg-[#007672] text-white shadow-md shadow-[#007672]/30 scale-110 z-10' 
                          : 'text-[#007672] bg-[#E9F5FB] hover:bg-[#d6effa]'
                      }`}
                    >
                      {date}
                    </button>
                  )
                })}
                {[28, 29, 30].map(date => (
                  <div key={date} className="text-[15px] text-[#8fa0b5] flex items-center justify-center h-10 w-10 mx-auto">
                    {date}
                  </div>
                ))}
                {[1, 2, 3, 4].map(date => (
                  <div key={`next-${date}`} className="text-[14px] text-gray-300 flex items-center justify-center h-10 w-10 mx-auto">
                    {date}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Legend */}
            <div className="hidden lg:flex flex-col gap-3 mt-16 ml-4">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[#E9F5FB]" />
                <span className="text-[14px] text-[#465E87] font-medium">Available</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-gray-50 border border-gray-100" />
                <span className="text-[14px] text-[#465E87] font-medium">Not Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Select Time Slot */}
        <div className="bg-white rounded-2xl lg:rounded-[20px] p-5 lg:p-6 shadow-sm lg:shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex items-center mb-5">
            <div className="w-7 h-7 rounded-full bg-[#007672] text-white flex items-center justify-center font-bold text-[14px] mr-3 shadow-md shadow-[#007672]/20">2</div>
            <h2 className="text-[17px] font-bold text-[#1B2B48]">Select Time Slot</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {timeSlots.map((slot, index) => {
              const isSelected = selectedTime === slot.time;
              const isDisabled = slot.status === 'disabled';
              return (
                <button
                  key={index}
                  onClick={() => !isDisabled && setSelectedTime(slot.time)}
                  disabled={isDisabled}
                  className={`py-2.5 rounded-lg text-[13px] font-bold border transition-colors ${
                    isSelected
                      ? 'bg-[#007672] text-white border-[#007672] shadow-md shadow-[#007672]/20'
                      : isDisabled
                      ? 'bg-gray-50/80 text-gray-400 border-gray-100 cursor-not-allowed'
                      : 'bg-white text-[#1B2B48] border-[#E8F3F3] hover:border-[#007672]/50 hover:bg-[#F4FAFC]'
                  }`}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Pet Details */}
        <div className="bg-white rounded-2xl lg:rounded-[20px] p-5 lg:p-6 shadow-sm lg:shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 lg:pb-8">
          <div className="flex items-center mb-5">
            <div className="w-7 h-7 rounded-full bg-[#007672] text-white flex items-center justify-center font-bold text-[14px] mr-3 shadow-md shadow-[#007672]/20">3</div>
            <h2 className="text-[17px] font-bold text-[#1B2B48]">Pet Details</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 lg:mb-5">
            <div>
              <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Pet Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PawPrint size={15} className="text-[#007672]" />
                </div>
                <input 
                  type="text" 
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Bella"
                  className="w-full pl-9 pr-3 py-2.5 lg:py-2.5 bg-white border border-[#E8F3F3] rounded-xl lg:rounded-lg text-[14px] text-[#1B2B48] font-medium focus:outline-none focus:border-[#007672] focus:ring-1 focus:ring-[#007672] transition-colors hover:border-[#bde1df]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Breed *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PawPrint size={15} className="text-[#007672]" />
                </div>
                <input 
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Golden Retriever"
                  className="w-full pl-9 pr-3 py-2.5 lg:py-2.5 bg-white border border-[#E8F3F3] rounded-xl lg:rounded-lg text-[14px] text-[#1B2B48] font-medium focus:outline-none focus:border-[#007672] transition-colors hover:border-[#bde1df]"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Age *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon size={15} className="text-[#007672]" />
                </div>
                <select 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 lg:py-2.5 bg-white border border-[#E8F3F3] rounded-xl lg:rounded-lg text-[14px] text-[#1B2B48] font-medium focus:outline-none focus:border-[#007672] transition-colors hover:border-[#bde1df] appearance-none"
                >
                  <option value="" disabled>Select age</option>
                  <option value="Puppy (0-1 yrs)">Puppy (0-1 yrs)</option>
                  <option value="Young (1-3 yrs)">Young (1-3 yrs)</option>
                  <option value="Adult (3-8 yrs)">Adult (3-8 yrs)</option>
                  <option value="Senior (8+ yrs)">Senior (8+ yrs)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={16} className="text-[#465E87]" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Size *</label>
              <div className="flex gap-2 h-[42px] lg:h-[42px]">
                {(['Small', 'Medium', 'Large'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setPetSize(size)}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl lg:rounded-lg border transition-all ${
                      petSize === size 
                        ? 'bg-[#E9F5FB] border-[#007672] text-[#007672] shadow-sm' 
                        : 'bg-white border-[#E8F3F3] text-[#1B2B48] hover:border-[#007672]/50 hover:bg-[#F4FAFC]'
                    }`}
                  >
                    {size === 'Small' && <PawPrint size={12} className={petSize === size ? 'text-[#007672]' : 'text-[#8fa0b5]'} />}
                    {size === 'Medium' && <PawPrint size={14} className={petSize === size ? 'text-[#007672]' : 'text-[#8fa0b5]'} />}
                    {size === 'Large' && <PawPrint size={16} className={petSize === size ? 'text-[#007672]' : 'text-[#8fa0b5]'} />}
                    <span className="text-[13px] font-bold">{size}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Desktop Button - inside the card */}
          <div className="hidden lg:flex mt-8">
            <button 
              onClick={handleBook}
              disabled={loading}
              className="w-full bg-[#007672] hover:bg-[#00605c] hover:scale-[1.01] active:scale-[0.99] text-white font-extrabold text-[15px] py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#007672]/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Book Free Playtime'}
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        
      </div>
      
      {/* Sticky Bottom Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 z-30 flex justify-center">
        <button 
          onClick={handleBook}
          disabled={loading}
          className="w-full max-w-md bg-[#007672] hover:bg-[#00605c] active:scale-[0.99] text-white font-extrabold text-[16px] py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#007672]/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Booking...' : 'Book Free Playtime'}
          <ArrowRight size={20} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  );
};
