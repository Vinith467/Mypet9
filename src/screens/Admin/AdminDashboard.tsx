import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, query, getDocs, doc, updateDoc, orderBy, where } from 'firebase/firestore';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, XCircle, Search, PawPrint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'caretaker_applications'),
        where('status', '==', filter)
      );
      const querySnapshot = await getDocs(q);
      const apps = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(apps);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const docRef = doc(db, 'caretaker_applications', id);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      // Refresh list
      fetchApplications();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6EE] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-[#174F38] p-3 rounded-xl">
              <PawPrint className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#1B2B48]">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm">Manage Caretaker Applications</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {['pending', 'approved', 'rejected'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                  filter === tab 
                    ? 'border-b-2 border-[#174F38] text-[#174F38] bg-gray-50' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p>No {filter} applications found.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {applications.map(app => (
                  <div key={app.id} className="border-2 border-gray-100 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-extrabold text-lg text-[#1B2B48]">{app.fullName}</h3>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                        <p><strong>Phone:</strong> {app.phone}</p>
                        <p><strong>Email:</strong> {app.email}</p>
                        <p><strong>Experience:</strong> {app.experience} years</p>
                        <p><strong>Max Pets:</strong> {app.maxPets}</p>
                        <p className="col-span-1 sm:col-span-2"><strong>Address:</strong> {app.address}</p>
                      </div>
                    </div>
                    
                    {app.status === 'pending' && (
                      <div className="flex space-x-3 shrink-0">
                        <Button 
                          onClick={() => updateStatus(app.id, 'rejected')}
                          className="bg-white text-red-600 border-2 border-red-100 hover:bg-red-50"
                        >
                          Reject
                        </Button>
                        <Button 
                          onClick={() => updateStatus(app.id, 'approved')}
                          className="bg-[#174F38] hover:bg-[#113a29] shadow-lg shadow-[#174F38]/20"
                        >
                          Approve Partner
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
