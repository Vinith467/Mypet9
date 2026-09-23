import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Crown, Gem, UserCircle, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

const services = [
  {
    id: 'athome',
    title: 'At-Home Boarding',
    description: "Care in a caretaker's home (verified & background checked)",
    price: '1,000',
    icon: UserCircle,
    image: '/service-athome.png'
  },
  {
    id: 'standard',
    title: 'Standard Boarding',
    description: 'Comfortable stay with loving caretakers',
    price: '1,200',
    icon: Home,
    image: '/service-standard.png'
  },
  {
    id: 'premium',
    title: 'Premium Boarding',
    description: 'More space, personal attention & daily updates',
    price: '1,800',
    icon: Crown,
    image: '/service-premium.png'
  },
  {
    id: 'luxury',
    title: 'Luxury Boarding',
    description: 'Premium home, 1:1 care, extra activities',
    price: '2,500',
    icon: Gem,
    image: '/service-luxury.png'
  }
];

export const ChooseServiceScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pet = location.state?.pet;

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col pt-6 lg:pt-10 space-y-8 lg:space-y-10 max-w-5xl mx-auto px-4 lg:px-8 pb-20">
        
        {/* Header */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-3 mb-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
            >
              <ArrowLeft size={22} className="text-[#1B2B48]" />
            </button>
            <h1 className="text-2xl lg:text-[32px] font-extrabold text-[#1B2B48] tracking-tight">
              Choose a Service
            </h1>
          </div>
          <p className="text-[15px] lg:text-[16px] font-medium text-[#465E87] ml-2 lg:ml-[52px] max-w-2xl leading-relaxed">
            Select the type of boarding you need. Each service offers a different level of care and personalisation tailored to your pet's needs.
          </p>
        </div>

        {/* Premium Service List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full">
          {services.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
                onClick={() => navigate('/boarding-details', { state: { pet, service: service.title } })} 
                className="relative flex flex-row w-full bg-white rounded-3xl group cursor-pointer border border-gray-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5 p-3"
              >
                {/* 1:1 Premium Image Frame */}
                <div className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-[20px] overflow-hidden shrink-0 bg-gray-50 shadow-inner">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                  

                </div>
                
                {/* Content Area */}
                <div className="flex flex-col flex-1 pl-4 justify-between py-1 lg:py-2">
                  
                  {/* Text */}
                  <div>
                    <h3 className="text-[#1B2B48] text-[16px] lg:text-xl font-extrabold tracking-tight mb-1 group-hover:text-petoo-primary transition-colors duration-300 line-clamp-1">
                      {service.title}
                    </h3>
                    <p className="text-[#465E87] text-[12px] lg:text-[14px] font-medium leading-snug line-clamp-2 pr-2">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Price & Action Row */}
                  <div className="flex items-end justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="text-[#465E87]/70 text-[10px] font-bold uppercase tracking-wider mb-0.5">Starting from</span>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-[#1B2B48] text-lg lg:text-2xl font-black tracking-tight leading-none">₹{service.price}</span>
                        <span className="text-[#465E87] text-[11px] lg:text-[13px] font-semibold">/ night</span>
                      </div>
                    </div>
                    
                    {/* Sleek Action Button */}
                    <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-50 border border-gray-100 text-[#1B2B48] group-hover:bg-petoo-primary group-hover:border-petoo-primary group-hover:text-white transition-all duration-300 shadow-sm shrink-0 mr-1 lg:mr-2">
                      <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </DashboardLayout>
  );
};
