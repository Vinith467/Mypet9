import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Home, Heart, Headset, ArrowRight, Home as HomeIcon, Scissors, Car, Stethoscope, GraduationCap, Users as UsersIcon, PawPrint } from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavbar';

export const HomeServicesScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      id: 'boarding',
      title: 'Home Stay\n& Boarding',
      subtitle: 'A home away from\nhome for your pets',
      icon: HomeIcon,
      image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=400&q=80',
      color: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-500',
      route: '/boarding'
    },
    {
      id: 'grooming',
      title: 'Grooming',
      subtitle: 'Keep them clean,\nhealthy and happy',
      icon: Scissors,
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=400&q=80',
      color: 'bg-pink-50',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-500',
      route: '/coming-soon'
    },
    {
      id: 'transport',
      title: 'Pickup &\nDrop Service',
      subtitle: 'Safe and comfortable\ntravel for your pets',
      icon: Car,
      image: 'https://images.unsplash.com/photo-1537151608804-ea6f11cc3389?auto=format&fit=crop&w=400&q=80',
      color: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      route: '/coming-soon'
    },
    {
      id: 'vet',
      title: 'Veterinary Support',
      subtitle: 'Stay protected\nand healthy',
      icon: Stethoscope,
      image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80',
      color: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-500',
      route: '/coming-soon'
    },
    {
      id: 'training',
      title: 'Training',
      subtitle: 'Better behaviour\nfor a happier life',
      icon: GraduationCap,
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80',
      color: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      route: '/coming-soon'
    },
    {
      id: 'breeding',
      title: 'Breeding',
      subtitle: 'Responsible breeding\nfor healthier, happier\npets',
      icon: UsersIcon,
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80',
      color: 'bg-rose-50',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-500',
      route: '/coming-soon'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans overflow-x-hidden pb-24">
      <TopNavbar currentLocationStr="" />

      <main className="w-full">
        {/* Hero Section */}
        <div className="w-full relative cursor-pointer" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>
          {/* Desktop Banner */}
          <img 
            src="/A Husky and Kitten Pastel Banner.png" 
            alt="Trusted Pet Care When You're Away" 
            className="hidden md:block w-full h-auto object-cover"
          />
          {/* Mobile Banner */}
          <img 
            src="/mobile - Trusted Pet Care, Happy Companions.png" 
            alt="Trusted Pet Care When You're Away" 
            className="md:hidden w-full h-auto object-cover"
          />
        </div>

        {/* Trust Badges */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-12 relative z-20">
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-x-0 md:divide-x divide-gray-100">
              
              <div className="flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 rounded-full bg-[#E5F5F4] flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-[#007672]" strokeWidth={2.5} />
                </div>
                <h3 className="font-extrabold text-[#1B2B48] text-[13px] md:text-[15px] leading-tight">Verified<br/>Partners</h3>
              </div>

              <div className="flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 rounded-full bg-[#E5F5F4] flex items-center justify-center mb-3">
                  <Home className="w-6 h-6 text-[#007672]" strokeWidth={2.5} />
                </div>
                <h3 className="font-extrabold text-[#1B2B48] text-[13px] md:text-[15px] leading-tight">Safe &<br/>Home-like Care</h3>
              </div>

              <div className="flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 rounded-full bg-[#FFF0F4] flex items-center justify-center mb-3">
                  <Heart className="w-6 h-6 text-[#FF4B4B]" strokeWidth={2.5} />
                </div>
                <h3 className="font-extrabold text-[#1B2B48] text-[13px] md:text-[15px] leading-tight">Loving & Experienced<br/>Caretakers</h3>
              </div>

              <div className="flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 rounded-full bg-[#FFF5E5] flex items-center justify-center mb-3">
                  <Headset className="w-6 h-6 text-[#FF9800]" strokeWidth={2.5} />
                </div>
                <h3 className="font-extrabold text-[#1B2B48] text-[13px] md:text-[15px] leading-tight">24/7<br/>Support</h3>
              </div>

            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-[28px] md:text-[36px] font-extrabold text-[#1B2B48] tracking-tight mb-1 flex items-center gap-2">
                Our Pet Services
                <PawPrint className="text-[#A2E3E0] w-8 h-8 md:w-10 md:h-10 transform -rotate-12" fill="currentColor" />
              </h2>
              <p className="text-[#465E87] text-[15px] md:text-[17px] font-medium">Everything your pet needs, all in one place</p>
            </div>
            <button className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-[#E5F5F4] text-[#007672] rounded-full font-bold hover:bg-[#D0EFED] transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service) => (
              <div 
                key={service.id}
                onClick={() => navigate(service.route)}
                className={`${service.color} rounded-[24px] overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative flex flex-col h-[280px] md:h-[320px]`}
              >
                {/* Image taking top ~60% */}
                <div className="h-[55%] relative overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Icon badge over image */}
                  <div className={`absolute top-4 left-4 w-10 h-10 ${service.iconBg} rounded-xl flex items-center justify-center shadow-sm z-10`}>
                    <service.icon className={`w-5 h-5 ${service.iconColor}`} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Content taking bottom ~45% */}
                <div className="p-5 flex-1 flex flex-col justify-between relative bg-gradient-to-b from-transparent to-white/40">
                  <div>
                    <h3 className="text-[18px] md:text-[22px] font-extrabold text-[#1B2B48] leading-tight whitespace-pre-line mb-1">
                      {service.title}
                    </h3>
                    <p className="text-[13px] md:text-[14px] text-[#465E87] font-medium leading-snug whitespace-pre-line">
                      {service.subtitle}
                    </p>
                  </div>
                  
                  {/* Arrow Button */}
                  <div className={`absolute bottom-5 right-5 w-8 h-8 rounded-full ${service.iconColor.replace('text-', 'bg-')} text-white flex items-center justify-center shadow-md transform group-hover:translate-x-1 transition-transform`}>
                    <ArrowRight className="w-4 h-4" strokeWidth={3} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View All Button */}
          <button className="md:hidden mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E5F5F4] text-[#007672] rounded-xl font-bold active:scale-[0.98] transition-transform">
            View All Services <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </main>
    </div>
  );
};
