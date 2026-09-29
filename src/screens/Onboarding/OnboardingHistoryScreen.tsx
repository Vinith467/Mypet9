import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ArrowLeft, User, Phone, Mail, MapPin, X, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const OnboardingHistoryScreen = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const [activeTab, setActiveTab] = useState<'parents' | 'partners'>('parents');

  useEffect(() => {
    const collectionName = activeTab === 'parents' ? 'field_leads_parents' : 'field_leads_caretakers';
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParents(data);
    });
    return () => unsubscribe();
  }, [activeTab]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getInitials = (name: string) => {
    return (name || 'U').substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#111B21] text-[#E9EDEF] flex flex-col font-sans">
      
      {/* Header (WhatsApp Dark Mode Style) */}
      <div className="bg-[#202C33] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-[#AEBAC1] hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[19px] font-semibold">Saved Leads</h1>
        </div>
        <button 
          onClick={() => navigate('/join/analytics')}
          className="text-[#AEBAC1] hover:text-[#00A884] transition-colors"
          title="View Analytics"
        >
          <BarChart3 size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#202C33] border-b border-[#222D34] sticky top-[52px] z-20">
        <button 
          onClick={() => setActiveTab('parents')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'parents' ? 'text-[#00A884] border-[#00A884]' : 'text-[#8696A0] border-transparent hover:text-white'}`}
        >
          Pet Parents
        </button>
        <button 
          onClick={() => setActiveTab('partners')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'partners' ? 'text-[#00A884] border-[#00A884]' : 'text-[#8696A0] border-transparent hover:text-white'}`}
        >
          Homestay Partners
        </button>
      </div>

      {/* Leads List */}
      <div className="flex-1 overflow-y-auto">
        {parents.length === 0 ? (
          <div className="flex items-center justify-center h-[50vh] text-[#8696A0] text-sm">
            No leads saved yet.
          </div>
        ) : (
          parents.map((parent) => (
            <div 
              key={parent.id}
              onClick={() => setSelectedLead(parent)}
              className="flex items-center gap-4 px-4 py-3 hover:bg-[#202C33] cursor-pointer transition-colors border-b border-[#222D34]"
            >
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-[#00A884] to-[#008069] rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden shadow-sm">
                {getInitials(parent.parentName || parent.fullName)}
              </div>
              
              {/* Contact Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h2 className="text-[17px] text-[#E9EDEF] truncate font-normal leading-tight">
                    {parent.parentName || parent.fullName || 'Unknown'}
                  </h2>
                  <span className="text-[12px] text-[#8696A0] shrink-0 ml-2">
                    {formatDate(parent.createdAt)}
                  </span>
                </div>
                <p className="text-[14px] text-[#8696A0] truncate">
                  {parent.mobile || 'No number'} {parent.petName ? `• Pet: ${parent.petName}` : ''} {parent.area ? `• ${parent.area}` : ''}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lead Details Modal */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-[#111B21] flex flex-col"
          >
            <div className="bg-[#202C33] px-4 py-3 flex items-center gap-4 shadow-md sticky top-0 z-10">
              <button onClick={() => setSelectedLead(null)} className="text-[#AEBAC1] hover:text-white transition-colors">
                <ArrowLeft size={24} />
              </button>
              <div className="flex-1 flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00A884] to-[#008069] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {getInitials(selectedLead.parentName || selectedLead.fullName)}
                </div>
                <h1 className="text-[17px] font-semibold truncate">{selectedLead.parentName || selectedLead.fullName || 'Details'}</h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              <div className="bg-[#202C33] rounded-xl p-4 shadow-sm">
                <h3 className="text-[#00A884] text-[14px] font-medium mb-3 uppercase tracking-wider">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User size={20} className="text-[#8696A0] mt-0.5" />
                    <div>
                      <p className="text-[#E9EDEF] text-[16px]">{selectedLead.parentName || selectedLead.fullName}</p>
                      <p className="text-[#8696A0] text-[13px]">Name</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-[#8696A0] mt-0.5" />
                    <div>
                      <p className="text-[#E9EDEF] text-[16px]">{selectedLead.mobile}</p>
                      <p className="text-[#8696A0] text-[13px]">Mobile Number</p>
                    </div>
                  </div>
                  {selectedLead.email && (
                    <div className="flex items-start gap-3">
                      <Mail size={20} className="text-[#8696A0] mt-0.5" />
                      <div>
                        <p className="text-[#E9EDEF] text-[16px]">{selectedLead.email}</p>
                        <p className="text-[#8696A0] text-[13px]">Email ID</p>
                      </div>
                    </div>
                  )}
                  {selectedLead.address && (
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-[#8696A0] mt-0.5" />
                      <div>
                        <p className="text-[#E9EDEF] text-[16px]">{selectedLead.address}</p>
                        <p className="text-[#8696A0] text-[13px]">Address</p>
                      </div>
                    </div>
                  )}
                  {selectedLead.area && (
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-[#8696A0] mt-0.5" />
                      <div>
                        <p className="text-[#E9EDEF] text-[16px]">{selectedLead.area}</p>
                        <p className="text-[#8696A0] text-[13px]">Area</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Key-Value Rendering for Responses */}
              <div className="bg-[#202C33] rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-[#00A884] text-[14px] font-medium mb-1 uppercase tracking-wider">Responses</h3>
                
                {Object.entries(selectedLead)
                  .filter(([key, val]) => {
                    const hiddenKeys = ['id', 'createdAt', 'parentName', 'fullName', 'mobile', 'email', 'address', 'area'];
                    if (hiddenKeys.includes(key)) return false;
                    if (key.startsWith('other')) return false; // Handled inline if we wanted, but we'll just show them as raw for simplicity, or we can just render everything.
                    if (!val || (Array.isArray(val) && val.length === 0)) return false;
                    return true;
                  })
                  .map(([key, val]) => {
                    let displayVal = val;
                    if (Array.isArray(val)) {
                      displayVal = val.join(', ');
                    } else if (typeof val === 'boolean') {
                      displayVal = val ? 'Yes' : 'No';
                    }

                    // Format key to be readable
                    const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                    return (
                      <div key={key} className="pb-3 border-b border-[#222D34] last:border-0 last:pb-0">
                        <p className="text-[#8696A0] text-[13px] mb-1">{formattedKey}</p>
                        <p className="text-[#E9EDEF] text-[15px]">{displayVal as string}</p>
                      </div>
                    );
                  })}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
