import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, PawPrint, Calendar, CheckCircle } from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const ServiceInquiryScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serviceId = queryParams.get('service') || 'other';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const serviceTitles: Record<string, { title: string, sub: string, iconColor: string, bg: string }> = {
    grooming: {
      title: 'Grooming',
      sub: 'Keep them clean, healthy and happy',
      iconColor: 'text-pink-500',
      bg: 'bg-pink-50'
    },
    transport: {
      title: 'Pickup & Drop Service',
      sub: 'Safe and comfortable travel for your pets',
      iconColor: 'text-cyan-500',
      bg: 'bg-cyan-50'
    },
    vet: {
      title: 'Veterinary Support',
      sub: 'Stay protected and healthy',
      iconColor: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    training: {
      title: 'Training',
      sub: 'Better behaviour for a happier life',
      iconColor: 'text-purple-500',
      bg: 'bg-purple-50'
    },
    breeding: {
      title: 'Breeding',
      sub: 'Responsible breeding for healthier, happier pets',
      iconColor: 'text-rose-500',
      bg: 'bg-rose-50'
    },
    other: {
      title: 'Service',
      sub: 'Coming soon',
      iconColor: 'text-[#007672]',
      bg: 'bg-[#E0F4F2]'
    }
  };

  const serviceData = serviceTitles[serviceId] || serviceTitles.other;

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  
  // Specific fields
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [specificDetails, setSpecificDetails] = useState('');
  const [preferredDate, setPreferredDate] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !city) {
      setError('Please fill all mandatory fields (*)');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'service_inquiries'), {
        serviceId,
        serviceName: serviceData.title,
        fullName,
        phone,
        email,
        city,
        petType,
        breed,
        specificDetails,
        preferredDate,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle className="w-20 h-20 text-[#007672] mb-6" />
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1B2B48] mb-3">Request Received!</h2>
        <p className="text-gray-500 font-medium mb-8 max-w-md">
          Thank you for showing interest in our {serviceData.title} service. Our team will contact you shortly to assist you directly.
        </p>
        <button onClick={() => navigate('/')} className="bg-[#007672] text-white px-8 py-3 rounded-full font-bold hover:bg-[#00605c] transition-colors">
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="bg-white p-4 flex items-center border-b border-gray-100 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-[#1B2B48] hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-extrabold text-[18px] text-[#1B2B48] ml-4">Service Details</h1>
      </div>

      <div className="w-full max-w-3xl mx-auto p-4 md:p-8 flex-1">
        <div className={`${serviceData.bg} rounded-3xl p-6 md:p-10 text-center mb-8 border border-white/50 shadow-sm relative overflow-hidden`}>
           <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
              <PawPrint size={100} className={serviceData.iconColor} />
           </div>
           <h2 className="text-[32px] md:text-[42px] font-black text-[#1B2B48] leading-tight mb-2 relative z-10">{serviceData.title}</h2>
           <p className={`font-bold ${serviceData.iconColor} text-[16px] md:text-[18px] mb-6 relative z-10`}>{serviceData.sub}</p>
           
           <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-left relative z-10 shadow-sm">
             <h3 className="font-bold text-[#1B2B48] text-[15px] mb-2 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#007672]"></span>
               Coming soon to our app!
             </h3>
             <p className="text-[#465E87] text-[13px] md:text-[14px] font-medium leading-relaxed">
               We are currently building the digital experience for this service. For now, please reach out to us directly by filling the form below, and our team will arrange this service for you manually.
             </p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h3 className="text-xl font-extrabold text-[#1B2B48] mb-6">Application Form</h3>
          
          {error && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672] focus:bg-white transition-colors" />
              </div>
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Mobile Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672] focus:bg-white transition-colors" />
              </div>
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Optional" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672] focus:bg-white transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">City/Location *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" required value={city} onChange={e => setCity(e.target.value)} placeholder="Your city" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672] focus:bg-white transition-colors" />
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-8" />
          <h4 className="text-[15px] font-bold text-[#1B2B48] mb-5">Service Requirements</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Pet Type</label>
              <select value={petType} onChange={e => setPetType(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672] focus:bg-white transition-colors">
                <option value="">Select pet type</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Breed / Age</label>
              <input type="text" value={breed} onChange={e => setBreed(e.target.value)} placeholder="e.g. Husky, 2 years" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672] focus:bg-white transition-colors" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">
                {serviceId === 'grooming' ? 'What grooming services do you need?' : 
                 serviceId === 'transport' ? 'Pickup and Drop Addresses' : 
                 serviceId === 'vet' ? 'Reason for Vet Support' : 
                 serviceId === 'training' ? 'Behavioral issues or Training goals' : 
                 serviceId === 'breeding' ? 'Looking for Stud or Dam? Any details?' : 
                 'Specific Requirements'}
              </label>
              <textarea 
                value={specificDetails} 
                onChange={e => setSpecificDetails(e.target.value)} 
                rows={3} 
                placeholder="Tell us what you are looking for..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672] focus:bg-white transition-colors resize-none" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-[#1B2B48] mb-1.5">Preferred Date (Optional)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="date" value={preferredDate} onChange={e => setPreferredDate(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#007672] focus:bg-white transition-colors text-gray-600" />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#1B2B48] text-white py-3.5 rounded-xl font-bold text-[15px] hover:bg-gray-800 transition-colors shadow-lg shadow-[#1B2B48]/20 disabled:opacity-70 flex items-center justify-center"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};
