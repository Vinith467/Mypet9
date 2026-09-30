import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Bell, Phone } from 'lucide-react';

export const AdminWaitlist = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const q = query(collection(db, 'notify_requests'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const allRequests = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(allRequests);
    } catch (error) {
      console.error('Error fetching notify requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-400 font-bold">Loading waitlist...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B2B48] tracking-tight flex items-center gap-2">
            <Bell className="text-emerald-500" /> Waitlist / Notifications
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Users waiting for homestays to launch.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-bold text-sm border border-emerald-100">
          Total: {requests.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">WhatsApp Number</th>
                <th className="px-6 py-4">Feature Type</th>
                <th className="px-6 py-4">Requested At</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#1B2B48]">
                    +91 {req.whatsapp}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                      {req.type || 'homestays'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {formatDate(req.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={`https://wa.me/91${req.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-600 font-bold hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Phone size={14} /> Message
                    </a>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No waitlist requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
