import { ArrowLeft, Calendar, Briefcase, Check, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { MapSelectionModal } from '../../components/ui/MapSelectionModal';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const calculateNights = (dropoff: string, pickup: string): number => {
  if (!dropoff || !pickup) return 1;
  const d1 = new Date(dropoff);
  const d2 = new Date(pickup);
  const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
};

const ADD_ONS = [
  { id: 'pickup', label: 'Pickup & Drop Service', price: 300, defaultChecked: false }
];

export const BookingSummaryScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;
  const bookingData = location.state?.bookingData;

  // Real data from the flow
  const pet = bookingData?.pet;
  const service = bookingData?.service || 'Home Stay';
  const dropoffDate = bookingData?.dropoffDate || '';
  const dropoffTime = bookingData?.dropoffTime || '';
  const pickupDate = bookingData?.pickupDate || '';
  const pickupTime = bookingData?.pickupTime || '';
  const specialRequirements = bookingData?.specialRequirements || '';

  const basePricePerNight = provider?.price || 800;
  const nights = calculateNights(dropoffDate, pickupDate);
  const baseTotal = basePricePerNight * nights;

  // Add-ons state
  const [addons, setAddons] = useState(
    ADD_ONS.reduce((acc, addon) => ({ ...acc, [addon.id]: addon.defaultChecked }), {} as Record<string, boolean>)
  );

  const toggleAddon = (id: string) => {
    setAddons(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addonsTotal = ADD_ONS.reduce((total, addon) => {
    return total + (addons[addon.id] ? addon.price : 0);
  }, 0);

  const finalTotal = baseTotal + addonsTotal;

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(true);

  return (
    <>
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#F8F9FA] pb-24 lg:pb-12">
        
        {/* Header */}
        <div className="bg-[#F8F9FA]/90 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100/50">
          <div className="px-4 py-4 max-w-2xl mx-auto w-full flex items-center space-x-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 -ml-2 rounded-full hover:bg-gray-200/50 transition-colors"
            >
              <ArrowLeft size={24} className="text-[#1B2B48]" />
            </button>
            <h1 className="text-[20px] font-extrabold text-[#1B2B48]">Booking Summary</h1>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-2xl mx-auto w-full px-5 py-4 space-y-4">
          
          {/* Provider Card */}
          <div className="bg-white rounded-[20px] p-4 flex items-center space-x-4 shadow-sm border border-gray-100">
            <img 
              src={provider?.images?.[0] || provider?.photo || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=200'} 
              alt="Provider" 
              className="w-20 h-14 rounded-[12px] object-cover bg-gray-100 shrink-0" 
            />
            <div className="flex flex-col">
              <h3 className="text-[16px] font-extrabold text-[#1B2B48] leading-tight mb-1">
                {provider?.name || 'Caretaker'}
              </h3>
              <div className="text-[13px] font-medium text-[#465E87] flex items-center">
                <span className="w-[14px] flex justify-center mr-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 block" />
                </span>
                {provider?.locationStr || 'Location'}
              </div>
            </div>
          </div>

          {/* Pet Info Card */}
          {pet && (
            <div className="bg-white rounded-[20px] p-4 flex items-center space-x-4 shadow-sm border border-gray-100">
              <img 
                src={pet.image || `https://ui-avatars.com/api/?name=${pet.name}&background=FBBF24&color=1B2B48`} 
                alt={pet.name} 
                className="w-14 h-14 rounded-full object-cover bg-gray-100 shrink-0 shadow-sm border border-gray-50" 
              />
              <div className="flex flex-col">
                <h3 className="text-[16px] font-extrabold text-[#1B2B48] leading-tight mb-1">
                  {pet.name}
                </h3>
                <p className="text-[13px] font-medium text-[#465E87]">
                  {pet.breed} • {pet.age} • {pet.weight || pet.gender || ''}
                </p>
              </div>
            </div>
          )}

          {/* Dates Card */}
          <div className="bg-white rounded-[20px] p-4 lg:p-5 flex items-start space-x-4 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-[#174F38]/5 flex items-center justify-center shrink-0 mt-0.5">
              <Calendar size={20} className="text-[#174F38]" />
            </div>
            <div className="flex flex-col mt-0.5">
              <p className="text-[15px] font-extrabold text-[#1B2B48] mb-1">
                {dropoffDate && pickupDate 
                  ? `${formatDate(dropoffDate)} – ${formatDate(pickupDate)}`
                  : 'Dates not selected'}
              </p>
              <p className="text-[13px] font-semibold text-[#465E87]">
                {nights} night{nights > 1 ? 's' : ''}
                {dropoffTime && ` • Drop-off: ${dropoffTime}`}
                {pickupTime && ` • Pick-up: ${pickupTime}`}
              </p>
            </div>
          </div>

          {/* Service Card */}
          <div className="bg-white rounded-[20px] p-4 lg:p-5 flex items-start justify-between shadow-sm border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#174F38]/5 flex items-center justify-center shrink-0 mt-0.5">
                <Briefcase size={20} className="text-[#174F38]" />
              </div>
              <div className="flex flex-col mt-0.5">
                <p className="text-[13px] font-bold text-[#1B2B48] mb-1">Service</p>
                <p className="text-[15px] font-semibold text-[#465E87]">
                  {service}
                </p>
              </div>
            </div>
            <div className="flex items-end mt-1">
               <span className="text-[16px] font-extrabold text-[#1B2B48]">₹{basePricePerNight}</span>
               <span className="text-[13px] font-medium text-[#465E87] ml-1 mb-[2px]">/ night</span>
            </div>
          </div>

          {/* Add-ons List */}
          <div className="pt-4 pb-2 px-1">
            <h3 className="text-[16px] font-extrabold text-[#1B2B48] mb-4">Add-ons</h3>
            <div className="flex flex-col space-y-4">
              {ADD_ONS.map((addon) => (
                <div key={addon.id} className="flex flex-col">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox"
                          checked={addons[addon.id]}
                          onChange={() => toggleAddon(addon.id)}
                          className="peer appearance-none w-5 h-5 rounded-[6px] border border-gray-300 checked:bg-petoo-primary checked:border-petoo-primary transition-colors cursor-pointer outline-none ring-0"
                        />
                        <Check size={14} className="absolute text-white stroke-[3] pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[15px] font-semibold text-[#465E87] group-hover:text-[#1B2B48] transition-colors">
                        {addon.label}
                      </span>
                    </div>
                    <span className="text-[15px] font-extrabold text-[#1B2B48]">
                      ₹{addon.price}
                    </span>
                  </label>
                  
                  {/* Conditional Pickup Address Field */}
                  {addon.id === 'pickup' && addons[addon.id] && (
                    <div className="mt-4 ml-9 animate-in fade-in slide-in-from-top-2 duration-300">
                      {pickupAddress && !isEditingAddress ? (
                        <div className="flex justify-between items-start">
                          <div className="text-[13px] text-[#465E87] space-y-1 pr-4">
                            <p>Pickup: <span className="font-medium text-[#1B2B48]">{pickupAddress}</span></p>
                            <p>Drop: <span className="font-medium text-[#1B2B48]">{pickupAddress}</span></p>
                          </div>
                          <button 
                            onClick={() => setIsEditingAddress(true)}
                            className="text-[14px] font-bold text-[#1B2B48] hover:text-petoo-primary transition-colors shrink-0"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <div className="relative">
                            <div className="absolute top-3 left-3 text-gray-400">
                              <MapPin size={18} />
                            </div>
                            <textarea 
                              value={pickupAddress}
                              onChange={(e) => setPickupAddress(e.target.value)}
                              placeholder="Enter pickup & drop address..." 
                              className="w-full bg-white border border-gray-200 rounded-[12px] py-2.5 pl-10 pr-3 text-[14px] text-[#1B2B48] placeholder-gray-400 focus:outline-none focus:border-petoo-primary focus:ring-1 focus:ring-petoo-primary resize-none h-[80px]"
                            />
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <button 
                              onClick={() => setIsMapOpen(true)}
                              className="text-[13px] font-bold text-petoo-primary hover:text-petoo-primary/80 transition-colors flex items-center"
                            >
                              <MapPin size={14} className="mr-1" />
                              Choose on map
                            </button>
                            {pickupAddress && (
                              <button 
                                onClick={() => setIsEditingAddress(false)}
                                className="bg-[#1B2B48] text-white text-[12px] font-bold py-1.5 px-4 rounded-[8px]"
                              >
                                Save
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total & Button Block */}
          <div className="mt-8 pt-8 border-t border-gray-200/60 pb-8">
            <div className="flex justify-between items-end mb-6 px-1">
              <span className="text-[18px] font-extrabold text-[#1B2B48]">Total</span>
              <span className="text-[26px] font-extrabold text-[#1B2B48] leading-none">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <Button 
              onClick={() => navigate('/payment', { 
                state: { 
                  provider,
                  bookingData: { ...bookingData, specialRequirements },
                  bookingAmount: baseTotal, 
                  pickupFee: addonsTotal,
                  pickupAddress: addons['pickup'] ? pickupAddress : '',
                  nights,
                  totalAmount: finalTotal
                } 
              })}
              className="w-full py-4 text-[17px] font-extrabold rounded-[16px] shadow-lg shadow-petoo-primary/20 hover:scale-[1.01] transition-transform"
            >
              Proceed to Payment
            </Button>
          </div>

        </div>
      </div>
    </DashboardLayout>
    <MapSelectionModal 
      isOpen={isMapOpen} 
      onClose={() => setIsMapOpen(false)} 
      onConfirm={(address) => {
        setPickupAddress(address);
        setIsEditingAddress(false);
      }} 
    />
    </>
  );
};
