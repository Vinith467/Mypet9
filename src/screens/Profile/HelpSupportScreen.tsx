import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Mail, Phone, ChevronDown } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How do I cancel my booking?",
    answer: "You can cancel your booking up to 24 hours before the check-in time for a full refund. Go to the 'Bookings' tab, select your active booking, and tap 'Cancel'."
  },
  {
    question: "What if my pet gets sick during boarding?",
    answer: "All our caretakers are trained to handle emergencies. In case of illness, they will immediately contact you and the emergency vet clinic listed on your profile."
  },
  {
    question: "How are caretakers verified?",
    answer: "We perform a strict background check, in-person home inspection, and require government ID verification before any caretaker is approved on Mypet9."
  },
  {
    question: "When will my refund be processed?",
    answer: "Refunds for cancelled bookings or pet taxi rides are processed instantly to your Mypet9 Wallet, or within 5-7 business days if refunded directly to your bank account."
  }
];

export const HelpSupportScreen = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#FAF9F5] pb-24 lg:pb-12 pt-6 lg:pt-10 px-5">
        <div className="max-w-2xl mx-auto w-full">
          
          {/* Header */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 hover:bg-gray-50 transition-colors mr-3 shadow-sm"
            >
              <ArrowLeft className="text-[#1B2B48]" size={20} />
            </button>
            <h1 className="text-[24px] font-extrabold text-[#1B2B48]">
              Help & Support
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-8"
          >
            {/* Contact Options */}
            <div>
              <h2 className="text-[18px] font-extrabold text-[#1B2B48] mb-3 px-1">Contact Us</h2>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center justify-center p-4 bg-white rounded-[20px] shadow-sm border border-gray-100 hover:border-petoo-primary/30 hover:bg-green-50/30 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                    <MessageSquare size={20} className="text-blue-600" />
                  </div>
                  <span className="text-[13px] font-bold text-[#1B2B48]">Chat</span>
                </button>
                
                <button className="flex flex-col items-center justify-center p-4 bg-white rounded-[20px] shadow-sm border border-gray-100 hover:border-petoo-primary/30 hover:bg-green-50/30 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2 group-hover:bg-green-100 transition-colors">
                    <Phone size={20} className="text-green-600" />
                  </div>
                  <span className="text-[13px] font-bold text-[#1B2B48]">Call Us</span>
                </button>
                
                <button className="flex flex-col items-center justify-center p-4 bg-white rounded-[20px] shadow-sm border border-gray-100 hover:border-petoo-primary/30 hover:bg-green-50/30 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-2 group-hover:bg-purple-100 transition-colors">
                    <Mail size={20} className="text-purple-600" />
                  </div>
                  <span className="text-[13px] font-bold text-[#1B2B48]">Email</span>
                </button>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-[18px] font-extrabold text-[#1B2B48] mb-3 px-1">Frequently Asked Questions</h2>
              <div className="bg-white rounded-[20px] p-2 shadow-sm border border-gray-100 flex flex-col">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div 
                      key={index} 
                      className={`border-b border-gray-50 last:border-0 overflow-hidden transition-colors ${isOpen ? 'bg-gray-50/50 rounded-xl' : ''}`}
                    >
                      <button 
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                      >
                        <span className={`text-[15px] font-bold pr-4 ${isOpen ? 'text-petoo-primary' : 'text-[#1B2B48]'}`}>
                          {faq.question}
                        </span>
                        <ChevronDown 
                          size={18} 
                          className={`text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-petoo-primary' : ''}`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-4 pb-4 pt-1 text-[14px] leading-relaxed text-[#465E87] font-medium">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </DashboardLayout>
  );
};
