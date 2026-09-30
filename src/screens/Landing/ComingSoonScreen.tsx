import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, ArrowRight, PawPrint, Headset } from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const ComingSoonScreen = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp || whatsapp.length < 10) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'notify_requests'), {
        whatsapp,
        type: 'homestays',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setTimeout(() => {
        setShowModal(false);
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 md:p-6 lg:p-8 flex flex-col font-sans overflow-x-hidden">
      
      {/* Giant 3D Card Container */}
      <div className="bg-white w-full max-w-[1100px] mx-auto rounded-none md:rounded-[2rem] shadow-none md:shadow-2xl md:border border-gray-100 overflow-hidden flex flex-col relative min-h-screen md:min-h-0 bg-white">
        
        {/* Top Nav */}
        <div className="fixed md:absolute top-0 left-0 w-full px-4 md:px-6 py-3 flex items-center bg-white/90 backdrop-blur-md md:bg-transparent z-50 shrink-0 border-b border-gray-100 md:border-none">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent md:bg-white/80 md:backdrop-blur-md md:shadow-sm hover:bg-gray-50 md:hover:bg-white transition-colors"
          >
            <ArrowLeft className="text-[#1B2B48]" size={24} />
          </button>
          <div className="flex items-center ml-1 md:ml-4 md:bg-white/80 md:backdrop-blur-md md:px-4 md:py-2 md:rounded-full md:shadow-sm">
            <PawPrint className="text-[#007672] w-5 h-5 mr-1.5" strokeWidth={2.5} />
            <span className="text-[#1B2B48] font-extrabold text-[20px] tracking-tight mt-0.5">mypet9</span>
          </div>
        </div>

        {/* Spacer for fixed nav on mobile */}
        <div className="h-[64px] md:hidden w-full shrink-0"></div>

        {/* Main Image - Mobile & Desktop */}
        <div className="w-full relative z-10">
          {/* Mobile Image */}
          <img 
            src="/coming soon mobile.jpg" 
            alt="Homestay Coming Soon" 
            className="w-full h-auto block md:hidden"
          />
          {/* Desktop Image */}
          <img 
            src="/coming soon desktop .jpg" 
            alt="Homestay Coming Soon" 
            className="w-full h-auto block hidden md:block"
          />
        </div>

        {/* --- MOBILE ONLY: "Be the First to Know" Section --- */}
        <div className="md:hidden w-full px-5 pt-4 pb-4 relative z-10 bg-white">
          <div className="bg-[#F0F9F9] rounded-[24px] p-5 relative overflow-hidden shadow-sm border border-[#E0F0F0]">
            
            <div className="absolute right-8 top-10 flex gap-1.5 transform rotate-12">
              <div className="w-1.5 h-3 bg-[#FFC107] rounded-full rotate-45" />
              <div className="w-1.5 h-3 bg-[#FFC107] rounded-full -mt-2" />
              <div className="w-1.5 h-3 bg-[#FFC107] rounded-full -rotate-45" />
            </div>

            <div className="flex items-start gap-4 mb-5 relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#E0F0F0] flex items-center justify-center shrink-0">
                <Bell className="text-[#007672]" size={24} strokeWidth={2.5} />
              </div>
              <div className="pt-0.5">
                <h3 className="text-[19px] font-extrabold text-[#1B2B48] leading-tight mb-1">
                  Be the First to Know
                </h3>
                <p className="text-[#465E87] text-[14px] leading-snug font-medium pr-10">
                  We're working hard to bring you trusted homestay options for your pets.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowModal(true)}
              className="w-full bg-[#007672] hover:bg-[#00605c] active:scale-[0.99] text-white font-extrabold text-[16px] py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#007672]/20 mb-3"
            >
              Notify Me
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>

            <button 
              onClick={() => navigate('/directly-reach-us')}
              className="w-full bg-[#004d49] hover:bg-[#003b38] text-white active:scale-[0.99] font-extrabold text-[16px] py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Headset className="w-5 h-5" strokeWidth={2.5} />
              <span>Directly Reach Us</span>
            </button>
          </div>
        </div>

        {/* --- MOBILE ONLY: Yellow Wavy Footer --- */}
        <div className="md:hidden w-full mt-auto relative overflow-hidden bg-white flex flex-col">
          <svg viewBox="0 0 1440 120" className="w-full h-auto block -mb-1" preserveAspectRatio="none">
            <path fill="#FCE986" fillOpacity="1" d="M0,64L60,53.3C120,43,240,21,360,26.7C480,32,600,64,720,69.3C840,75,960,53,1080,48C1200,43,1320,53,1380,58.7L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
          <div className="bg-[#FCE986] w-full pb-8 pt-2 px-6 relative z-10 flex justify-between items-center">
            <div className="pl-4 pb-2">
               <div className="text-[#007672]">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C9.243 2 7 4.243 7 7V9C7 11.757 9.243 14 12 14C14.757 14 17 11.757 17 9V7C17 4.243 14.757 2 12 2ZM7.5 17.5C6.119 17.5 5 18.619 5 20C5 21.381 6.119 22.5 7.5 22.5C8.881 22.5 10 21.381 10 20C10 18.619 8.881 17.5 7.5 17.5ZM16.5 17.5C15.119 17.5 14 18.619 14 20C14 21.381 15.119 22.5 16.5 22.5C17.881 22.5 19 21.381 19 20C19 18.619 17.881 17.5 16.5 17.5ZM3.5 10C2.119 10 1 11.119 1 12.5C1 13.881 2.119 15 3.5 15C4.881 15 6 13.881 6 12.5C6 11.119 4.881 10 3.5 10ZM20.5 10C19.119 10 18 11.119 18 12.5C18 13.881 19.119 15 20.5 15C21.881 15 23 13.881 23 12.5C23 11.119 21.881 10 20.5 10Z"/>
                  </svg>
               </div>
            </div>
            <div className="flex flex-col items-end transform -rotate-3 mr-2">
              <span className="font-extrabold text-[#004d49] text-[18px] leading-tight" style={{ fontFamily: 'cursive, sans-serif' }}>Happy Pets</span>
              <span className="font-extrabold text-[#004d49] text-[18px] leading-tight flex items-center gap-1" style={{ fontFamily: 'cursive, sans-serif' }}>
                Happier Lives <span className="text-[14px]">♡</span>
              </span>
            </div>
          </div>
        </div>

        {/* --- DESKTOP ONLY: Combined Footer Section --- */}
        <div className="hidden md:flex w-full relative flex-col z-20 pb-16 -mt-8 lg:-mt-12 flex-1">
          
          {/* Absolute Yellow Wavy Background */}
          <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
            <svg viewBox="0 0 1440 120" className="w-full h-auto block" preserveAspectRatio="none">
              <path fill="#FCE986" fillOpacity="1" d="M0,64L60,53.3C120,43,240,21,360,26.7C480,32,600,64,720,69.3C840,75,960,53,1080,48C1200,43,1320,53,1380,58.7L1440,64L1440,120L0,120Z"></path>
            </svg>
            <div className="bg-[#FCE986] w-full h-full -mt-1"></div>
          </div>

          {/* Foreground Content */}
          <div className="w-full px-8 lg:px-12 xl:px-16 relative z-10 flex justify-between items-start pt-[6%]">
            
            {/* Desktop "Be the First to Know" Card */}
            <div className="bg-[#F0F9F9] rounded-[20px] p-5 w-full max-w-[700px] shadow-sm border border-[#E0F0F0] relative flex flex-col xl:flex-row items-center justify-between gap-4 lg:gap-6 -mt-8">
              
              {/* Left side: Icon and Text */}
              <div className="flex items-center gap-4 w-full xl:w-[48%]">
                <div className="w-12 h-12 rounded-full bg-[#E0F0F0] flex items-center justify-center shrink-0">
                  <Bell className="text-[#007672]" size={24} strokeWidth={2.5} />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-[18px] lg:text-[20px] font-extrabold text-[#1B2B48] leading-tight mb-1">
                    Be the First to Know
                  </h3>
                  <p className="text-[#465E87] text-[13px] leading-snug font-medium">
                    We're working hard to bring you trusted homestay options for your pets.
                  </p>
                </div>
              </div>
              
              {/* Right side: Inline Input Form (WhatsApp) */}
              <div className="w-full xl:w-[52%] relative flex flex-col gap-2">
                 <form onSubmit={handleSubmit} className="flex gap-0 bg-white rounded-xl p-1 border border-gray-200 focus-within:border-[#007672] shadow-sm transition-colors relative">
                    <div className="flex-1 flex items-center px-3">
                      <span className="text-gray-500 font-bold mr-2 text-[14px]">+91</span>
                      <input
                         type="tel"
                         pattern="[0-9]{10}"
                         maxLength={10}
                         required
                         value={whatsapp}
                         onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                         className="w-full bg-transparent outline-none font-semibold text-[14px] text-[#1B2B48] placeholder:text-gray-400 placeholder:font-medium"
                         placeholder="Enter WhatsApp number"
                       />
                    </div>
                    <button 
                       type="submit"
                       disabled={isSubmitting || whatsapp.length < 10}
                       className="bg-[#007672] hover:bg-[#00605c] disabled:bg-gray-300 text-white font-extrabold text-[14px] px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap active:scale-95"
                     >
                       {isSubmitting ? (
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-5" />
                       ) : (
                         <>Notify Me <ArrowRight size={16} strokeWidth={2.5} /></>
                       )}
                     </button>
                 </form>

                 {/* Directly Reach Us Button */}
                 <button 
                   onClick={() => navigate('/directly-reach-us')}
                   className="w-full bg-[#004d49] hover:bg-[#003b38] text-white active:scale-95 font-extrabold text-[14px] py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                 >
                   <Headset className="w-4 h-4" strokeWidth={2.5} />
                   <span>Directly Reach Us</span>
                 </button>

                 {submitted && (
                    <div className="absolute -bottom-6 left-2 text-[#007672] font-extrabold text-[12px] flex items-center gap-1.5">
                       <div className="w-3.5 h-3.5 rounded-full bg-[#007672] text-white flex items-center justify-center text-[9px]">✓</div>
                       We'll notify you soon!
                    </div>
                 )}
              </div>
            </div>

            {/* Desktop Right Side Text & Paw Print */}
            <div className="flex items-center gap-6 pl-6 mt-4 xl:-mt-2">
              <div className="text-[#007672] opacity-80 border-b-2 border-dashed border-[#007672] w-16 xl:w-24 relative mb-4">
                 <div className="absolute left-1/2 -top-5 transform -translate-x-1/2">
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C9.243 2 7 4.243 7 7V9C7 11.757 9.243 14 12 14C14.757 14 17 11.757 17 9V7C17 4.243 14.757 2 12 2ZM7.5 17.5C6.119 17.5 5 18.619 5 20C5 21.381 6.119 22.5 7.5 22.5C8.881 22.5 10 21.381 10 20C10 18.619 8.881 17.5 7.5 17.5ZM16.5 17.5C15.119 17.5 14 18.619 14 20C14 21.381 15.119 22.5 16.5 22.5C17.881 22.5 19 21.381 19 20C19 18.619 17.881 17.5 16.5 17.5ZM3.5 10C2.119 10 1 11.119 1 12.5C1 13.881 2.119 15 3.5 15C4.881 15 6 13.881 6 12.5C6 11.119 4.881 10 3.5 10ZM20.5 10C19.119 10 18 11.119 18 12.5C18 13.881 19.119 15 20.5 15C21.881 15 23 13.881 23 12.5C23 11.119 21.881 10 20.5 10Z"/>
                    </svg>
                 </div>
              </div>
              <div className="flex flex-col items-start transform -rotate-3">
                <span className="font-extrabold text-[#004d49] text-[22px] xl:text-[28px] leading-tight" style={{ fontFamily: 'cursive, sans-serif' }}>Happy Pets</span>
                <span className="font-extrabold text-[#004d49] text-[22px] xl:text-[28px] leading-tight flex items-center gap-2" style={{ fontFamily: 'cursive, sans-serif' }}>
                  Happier Lives <span className="text-[20px] xl:text-[22px] opacity-80">♡</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-6 md:p-8 animate-in zoom-in-95 duration-200 shadow-2xl">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#E0F4F2] text-[#007672] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">We'll Notify You!</h3>
                <p className="text-gray-500 font-medium">Thank you. We'll send a WhatsApp message as soon as Homestays are available.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[20px] font-extrabold text-[#1B2B48]">Get Notified</h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 w-8 h-8 rounded-full flex items-center justify-center">
                    ✕
                  </button>
                </div>
                
                <p className="text-[#465E87] font-medium mb-6 text-[14px] leading-relaxed">
                  Homestays are launching very soon. Enter your WhatsApp number and we'll be the first to let you know!
                </p>

                <form onSubmit={handleSubmit}>
                  <label className="block text-[13px] font-bold text-[#1B2B48] mb-2">WhatsApp Number *</label>
                  <div className="flex mb-8">
                    <span className="inline-flex items-center px-4 bg-gray-50 border border-r-0 border-gray-200 text-gray-600 font-bold rounded-l-xl">
                      +91
                    </span>
                    <input
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 min-w-0 block w-full px-4 py-3.5 rounded-none rounded-r-xl border border-gray-200 focus:border-[#007672] focus:ring-[#007672] outline-none font-semibold text-[15px] text-[#1B2B48]"
                      placeholder="10-digit number"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting || whatsapp.length < 10}
                    className="w-full bg-[#007672] hover:bg-[#00605c] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-extrabold text-[16px] py-4 rounded-xl transition-colors shadow-lg shadow-[#007672]/20 flex justify-center items-center h-[56px] active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Confirm & Notify Me"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
