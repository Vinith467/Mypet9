import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, query, getDocs, doc, updateDoc, where } from 'firebase/firestore';
import { Button } from '../../components/ui/Button';
import { Search, PawPrint, CheckCircle2, XCircle, Clock, Eye, X, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const AdminApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const snap = await getDocs(collection(db, 'caretaker_applications'));
      const all = snap.docs.map(d => d.data());
      setCounts({
        pending: all.filter(a => a.status === 'pending').length,
        approved: all.filter(a => a.status === 'approved').length,
        rejected: all.filter(a => a.status === 'rejected').length,
      });
    } catch (e) { console.error(e); }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'caretaker_applications'),
        where('status', '==', filter)
      );
      const snap = await getDocs(q);
      setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'caretaker_applications', id), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      fetchApplications();
      fetchCounts();
      setSelectedApp(null);
    } catch (e) {
      console.error(e);
      alert('Failed to update status.');
    }
  };

  const filteredApps = applications.filter(app =>
    !searchQuery ||
    app.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.phone?.includes(searchQuery) ||
    app.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { key: 'pending' as const, label: 'Pending', icon: Clock, color: 'text-amber-600' },
    { key: 'approved' as const, label: 'Approved', icon: CheckCircle2, color: 'text-emerald-600' },
    { key: 'rejected' as const, label: 'Rejected', icon: XCircle, color: 'text-red-500' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B2B48] tracking-tight">Applications</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Review and manage caretaker applications.</p>
      </div>

      {/* Tabs + Search */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 text-sm font-bold transition-all border-b-2 ${
                filter === tab.key
                  ? `border-[#174F38] text-[#174F38] bg-gray-50/50`
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/30'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                filter === tab.key ? 'bg-[#174F38]/10 text-[#174F38]' : 'bg-gray-100 text-gray-400'
              }`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-50">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#174F38]/20 focus:border-[#174F38]/30 font-medium placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-12 text-center text-gray-400 font-bold">Loading...</div>
          ) : filteredApps.length === 0 ? (
            <div className="p-12 text-center">
              <Search size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm font-bold">No {filter} applications found.</p>
            </div>
          ) : (
            filteredApps.map(app => (
              <div key={app.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedApp(app)}>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-[#174F38]/10 rounded-full flex items-center justify-center text-[#174F38] font-extrabold text-sm shrink-0">
                    {app.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1B2B48]">{app.fullName}</p>
                    <p className="text-[12px] text-gray-400">{app.email} · {app.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  {app.status === 'pending' && (
                    <div className="hidden sm:flex items-center space-x-2">
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(app.id, 'rejected'); }} className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors">
                        Reject
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(app.id, 'approved'); }} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#174F38] hover:bg-[#113a29] transition-colors">
                        Approve
                      </button>
                    </div>
                  )}
                  <Eye size={16} className="text-gray-300" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-lg text-[#1B2B48]">Application Details</h3>
                <button onClick={() => setSelectedApp(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-14 h-14 bg-[#174F38]/10 rounded-full flex items-center justify-center text-[#174F38] font-extrabold text-xl">
                    {selectedApp.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-extrabold text-[#1B2B48] text-lg">{selectedApp.fullName}</p>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      selectedApp.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      selectedApp.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {selectedApp.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Mail size={16} className="text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-600 truncate">{selectedApp.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Phone size={16} className="text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-600">{selectedApp.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Briefcase size={16} className="text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-600">{selectedApp.experience} years experience</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <PawPrint size={16} className="text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-600">Max {selectedApp.maxPets} pets</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{selectedApp.address}</span>
                </div>

                {selectedApp.acceptedPets?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Accepted Pets</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.acceptedPets.map((pet: string) => (
                        <span key={pet} className="px-3 py-1 bg-[#174F38]/10 text-[#174F38] text-xs font-bold rounded-full">{pet}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApp.services?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Services</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.services.map((s: string) => (
                        <span key={s} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedApp.status === 'pending' && (
                <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => updateStatus(selectedApp.id, 'rejected')}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => updateStatus(selectedApp.id, 'approved')}
                    className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-[#174F38] hover:bg-[#113a29] transition-colors shadow-sm"
                  >
                    Approve Partner
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
