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
      color: 'bg-orange-50/80',
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
      color: 'bg-pink-50/80',
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
      color: 'bg-cyan-50/80',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-500',
      route: '/coming-soon'
    },
    {
      id: 'vet',
      title: 'Veterinary\nSupport',
      subtitle: 'Stay protected\nand healthy',
      icon: Stethoscope,
      image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80',
      color: 'bg-emerald-50/80',
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
      color: 'bg-purple-50/80',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      route: '/coming-soon'
    },
    {
      id: 'breeding',
      title: 'Breeding',
      subtitle: 'Responsible breeding\nfor healthier, happier',
      icon: UsersIcon,
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80',
      color: 'bg-rose-50/80',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-500',
      route: '/coming-soon'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans overflow-x-hidden pb-12">
      <TopNavbar currentLocationStr="" />

      <main className="w-full">
        {/* Hero Section */}
        <div className="w-full relative flex items-center justify-center bg-[#FDFDFD]">
          {/* Hero Images */}
          <img 
            src="/A Husky and Kitten Pastel Banner.png" 
            alt="Banner Background" 
            className="hidden md:block w-full h-[220px] lg:h-[280px] object-cover object-[center_30%]"
          />
          <img 
            src="/mobile - Trusted Pet Care, Happy Companions.png" 
            alt="Banner Background" 
            className="md:hidden w-full h-[240px] object-cover object-center"
          />
          
          {/* Hero Overlay Text */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center pb-4 md:pb-8 px-6 md:px-16 lg:px-24">
            <div className="max-w-[60%] md:max-w-[50%] lg:max-w-[45%]">
              <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                <span className="text-[#007672] text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest">
                  A PET COMMUNITY
                </span>
              </div>
              <h1 className="text-[22px] md:text-[32px] lg:text-[40px] font-extrabold text-[#1B2B48] leading-[1.1] mb-2 md:mb-3 tracking-tight">
                Trusted Pet Care<br/>When You're Away
              </h1>
              <p className="text-[#465E87] text-[11px] md:text-[13px] font-medium leading-relaxed mb-4 md:mb-5 max-w-[400px] hidden sm:block">
                A loving community of pet parents and verified caretakers providing safe, caring and home-like experiences for your pets.
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                className="bg-[#007672] hover:bg-[#00605c] text-white px-5 md:px-6 py-2 md:py-2.5 rounded-full font-extrabold text-[12px] md:text-[14px] inline-flex items-center gap-2 transition-all shadow-lg shadow-[#007672]/30 active:scale-95 w-max"
              >
                Explore Services <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="max-w-[95%] xl:max-w-[85%] mx-auto px-4 relative z-20 -mt-10 md:-mt-12">
          <div className="bg-white rounded-[20px] md:rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 p-3 md:p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0 divide-x-0 md:divide-x divide-gray-100">
              
              <div className="flex flex-row md:flex-col items-center justify-start md:justify-center text-left md:text-center px-2 md:px-4 gap-2 md:gap-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1B2B48] flex items-center justify-center md:mb-2 shrink-0">
                  <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-extrabold text-[#1B2B48] text-[11px] md:text-[12px] leading-tight">Verified<br className="hidden md:block"/> Partners</h3>
              </div>

              <div className="flex flex-row md:flex-col items-center justify-start md:justify-center text-left md:text-center px-2 md:px-4 gap-2 md:gap-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1B2B48] flex items-center justify-center md:mb-2 shrink-0">
                  <Home className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-extrabold text-[#1B2B48] text-[11px] md:text-[12px] leading-tight">Safe &<br className="hidden md:block"/> Home-like Care</h3>
              </div>

              <div className="flex flex-row md:flex-col items-center justify-start md:justify-center text-left md:text-center px-2 md:px-4 gap-2 md:gap-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-pink-50 flex items-center justify-center md:mb-2 shrink-0">
                  <Heart className="w-4 h-4 text-pink-500" strokeWidth={2.5} />
                </div>
                <h3 className="font-extrabold text-[#1B2B48] text-[11px] md:text-[12px] leading-tight">Loving & Experienced<br className="hidden md:block"/> Caretakers</h3>
              </div>

              <div className="flex flex-row md:flex-col items-center justify-start md:justify-center text-left md:text-center px-2 md:px-4 gap-2 md:gap-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-50 flex items-center justify-center md:mb-2 shrink-0">
                  <Headset className="w-4 h-4 text-orange-500" strokeWidth={2.5} />
                </div>
                <h3 className="font-extrabold text-[#1B2B48] text-[11px] md:text-[12px] leading-tight">24/7<br className="hidden md:block"/> Support</h3>
              </div>

            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="max-w-[95%] xl:max-w-[95%] mx-auto px-4 mt-6 md:mt-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2">
            <div>
              <h2 className="text-[20px] md:text-[28px] font-extrabold text-[#1B2B48] tracking-tight mb-1 flex items-center gap-2">
                Our Pet Services
                <PawPrint className="text-[#A2E3E0] w-5 h-5 md:w-6 md:h-6 transform -rotate-12" fill="currentColor" />
              </h2>
              <p className="text-[#465E87] text-[12px] md:text-[14px] font-medium">Everything your pet needs, all in one place</p>
            </div>
            <button className="hidden md:flex items-center gap-1.5 px-4 py-1.5 bg-[#E5F5F4] text-[#007672] rounded-full font-bold text-[12px] hover:bg-[#D0EFED] transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Services Grid (6 columns on Desktop) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {services.map((service) => (
              <div 
                key={service.id}
                onClick={() => navigate(service.route)}
                className={`${service.color} rounded-[16px] md:rounded-[20px] overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative flex flex-col h-[180px] md:h-[200px] border border-white/50`}
              >
                {/* Image taking top 50% */}
                <div className="h-[50%] relative overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Icon badge over image */}
                  <div className={`absolute top-2 left-2 md:top-3 md:left-3 w-7 h-7 ${service.iconBg} rounded-lg flex items-center justify-center shadow-sm z-10`}>
                    <service.icon className={`w-3.5 h-3.5 ${service.iconColor}`} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Content taking bottom 50% */}
                <div className="p-3 flex-1 flex flex-col justify-between relative bg-gradient-to-b from-transparent to-white/60">
                  <div>
                    <h3 className="text-[12px] md:text-[13px] font-extrabold text-[#1B2B48] leading-[1.2] whitespace-pre-line mb-1">
                      {service.title}
                    </h3>
                    <p className="text-[9px] md:text-[10px] text-[#465E87] font-medium leading-[1.3] whitespace-pre-line line-clamp-2">
                      {service.subtitle}
                    </p>
                  </div>
                  
                  {/* Arrow Button */}
                  <div className={`absolute bottom-3 right-3 w-5 h-5 md:w-6 md:h-6 rounded-full ${service.iconColor.replace('text-', 'bg-')} text-white flex items-center justify-center shadow-md transform group-hover:translate-x-1 transition-transform`}>
                    <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={3} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View All Button */}
          <button className="md:hidden mt-5 w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E5F5F4] text-[#007672] rounded-xl font-bold text-[14px] active:scale-[0.98] transition-transform">
            View All Services <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </main>
    </div>
  );
};
