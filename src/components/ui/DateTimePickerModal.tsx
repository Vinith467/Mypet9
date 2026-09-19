import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

interface DateTimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dateStr: string, timeStr: string) => void;
  title?: string;
  initialDate?: string; // e.g. "2025-09-12"
  initialTime?: string; // e.g. "10:00 AM"
}

// Generate next 14 days
const generateUpcomingDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    
    let label = '';
    if (i === 0) label = 'Today';
    else if (i === 1) label = 'Tomorrow';
    else {
      label = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    }
    
    const value = d.toISOString().split('T')[0]; // "YYYY-MM-DD"
    dates.push({ label, value, dateObj: d });
  }
  return dates;
};

// Generate Time Slots from 8 AM to 8 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 8; i <= 20; i++) {
    const hour = i > 12 ? i - 12 : i;
    const ampm = i >= 12 ? 'PM' : 'AM';
    const formattedHour = hour.toString().padStart(2, '0');
    slots.push(`${formattedHour}:00 ${ampm}`);
    slots.push(`${formattedHour}:30 ${ampm}`);
  }
  return slots;
};

export const DateTimePickerModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Select Date & Time",
  initialDate,
  initialTime
}: DateTimePickerModalProps) => {
  
  const [dates, setDates] = useState<{label: string, value: string, dateObj: Date}[]>([]);
  const [timeSlots] = useState(generateTimeSlots());
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    const upcoming = generateUpcomingDates();
    setDates(upcoming);
    
    if (initialDate) {
      setSelectedDate(initialDate);
    } else {
      setSelectedDate(upcoming[0].value); // Default to today
    }
    
    if (initialTime) {
      setSelectedTime(initialTime);
    } else {
      setSelectedTime(timeSlots[4]); // Default to 10:00 AM
    }
  }, [isOpen, initialDate, initialTime, timeSlots]);

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[#1B2B48]/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center pointer-events-none">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-md lg:rounded-[32px] rounded-t-[32px] shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] lg:max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                <h2 className="text-xl font-bold text-[#1B2B48]">{title}</h2>
                <button 
                  onClick={onClose}
                  className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-[#1B2B48]" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto scrollbar-hide py-6 flex flex-col space-y-8">
                
                {/* Date Selection */}
                <div className="flex flex-col space-y-4">
                  <h3 className="px-6 text-sm font-bold text-[#465E87] uppercase tracking-wider">Date</h3>
                  <div className="flex overflow-x-auto scrollbar-hide px-6 space-x-3 pb-2">
                    {dates.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setSelectedDate(d.value)}
                        className={`shrink-0 flex flex-col items-center justify-center min-w-[80px] h-[90px] rounded-2xl border-2 transition-all ${
                          selectedDate === d.value 
                            ? 'border-petoo-primary bg-petoo-primary/5 shadow-md' 
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        <span className={`text-xs font-semibold mb-1 ${selectedDate === d.value ? 'text-petoo-primary' : 'text-[#465E87]'}`}>
                          {d.dateObj.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className={`text-2xl font-black ${selectedDate === d.value ? 'text-[#1B2B48]' : 'text-[#1B2B48]'}`}>
                          {d.dateObj.getDate()}
                        </span>
                        <span className={`text-[10px] font-bold mt-1 ${selectedDate === d.value ? 'text-petoo-primary' : 'text-[#465E87]/60'}`}>
                          {d.label === 'Today' || d.label === 'Tomorrow' ? d.label : d.dateObj.toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="flex flex-col space-y-4 px-6">
                  <h3 className="text-sm font-bold text-[#465E87] uppercase tracking-wider">Time Slot</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-2 rounded-xl border-2 text-sm font-bold transition-all ${
                          selectedTime === time
                            ? 'border-petoo-primary bg-petoo-primary/5 text-petoo-primary shadow-sm'
                            : 'border-gray-100 bg-white text-[#1B2B48] hover:border-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 shrink-0">
                <Button fullWidth onClick={handleConfirm} className="py-4 rounded-[18px] text-[16px] font-bold">
                  Confirm Selection
                </Button>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
