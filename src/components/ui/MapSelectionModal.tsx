import { X, MapPin, Search, LocateFixed } from 'lucide-react';
import { Button } from './Button';

interface MapSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: string) => void;
}

export const MapSelectionModal = ({ isOpen, onClose, onConfirm }: MapSelectionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex flex-col justify-end lg:justify-center lg:items-center bg-[#1B2B48]/40 backdrop-blur-[2px]">
      <div className="bg-white w-full lg:w-[600px] h-[85dvh] lg:h-[600px] rounded-t-[24px] lg:rounded-[24px] overflow-hidden flex flex-col animate-in slide-in-from-bottom-full lg:slide-in-from-bottom-8 duration-300 shadow-2xl">
        
        {/* Header */}
        <div className="px-5 py-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-[18px] font-extrabold text-[#1B2B48]">Select Location</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Map Area Simulation */}
        <div className="flex-1 relative bg-[#E5E3DF] overflow-hidden">
          {/* Interactive OpenStreetMap iframe to simulate real map experience */}
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src="https://www.openstreetmap.org/export/embed.html?bbox=77.625%2C12.972%2C77.655%2C12.985&layer=mapnik"
            className="w-full h-[calc(100%+50px)] -mt-[25px] mix-blend-multiply opacity-80"
            style={{ border: 0, filter: 'grayscale(0.1) contrast(1.1)' }}
          />
          
          {/* Floating Search Bar */}
          <div className="absolute top-4 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-3/4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center space-x-3">
              <Search size={20} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for area, street name..." 
                className="w-full bg-transparent border-none focus:outline-none text-[15px] font-medium text-[#1B2B48] placeholder-gray-400"
              />
            </div>
          </div>

          {/* Floating Locate Me Button */}
          <div className="absolute bottom-6 right-4">
            <button className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-petoo-primary hover:bg-gray-50 transition-colors">
              <LocateFixed size={22} />
            </button>
          </div>

          {/* Center Pin (Absolute Center, unaffected by iframe scroll) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative -mt-10 animate-bounce">
              {/* Custom Pin resembling ride-hailing apps */}
              <div className="w-10 h-10 bg-petoo-primary rounded-full flex items-center justify-center shadow-md relative z-10">
                 <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div className="w-0.5 h-6 bg-petoo-primary mx-auto -mt-1 relative z-0 shadow-sm" />
              <div className="w-2 h-2 bg-[#1B2B48] rounded-full mx-auto -mt-1" />
              
              <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-5 h-1.5 bg-black/20 rounded-full blur-[2px]" />
            </div>
          </div>
          
          {/* Tooltip */}
          <div className="absolute top-[85px] left-1/2 -translate-x-1/2 bg-[#1B2B48] px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 pointer-events-none">
            <span className="text-[13px] font-bold text-white">Move map to adjust</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-5 bg-white border-t border-gray-100 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="mb-5">
            <p className="text-[12px] font-semibold text-gray-400 mb-1">SELECTED ADDRESS</p>
            <p className="text-[15px] font-extrabold text-[#1B2B48] flex items-start leading-tight">
              <MapPin size={18} className="text-petoo-primary mr-2 shrink-0 mt-0.5" />
              123 Indiranagar Double Road, Binnamangala, Stage 1, Indiranagar, Bengaluru
            </p>
          </div>
          <Button 
            className="w-full py-4 text-[16px] font-extrabold rounded-[14px] shadow-lg shadow-petoo-primary/20"
            onClick={() => {
              onConfirm("123 Indiranagar Double Road, Binnamangala, Stage 1, Indiranagar, Bengaluru, 560038");
              onClose();
            }}
          >
            Confirm Location
          </Button>
        </div>

      </div>
    </div>
  );
};
