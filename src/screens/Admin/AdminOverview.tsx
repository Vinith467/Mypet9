import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { Users, ClipboardList, PawPrint, CalendarCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCaretakers: 0,
    pendingApps: 0,
    totalBookings: 0,
  });
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch users
      const usersSnap = await getDocs(collection(db, 'users'));
      const allUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const petParents = allUsers.filter((u: any) => u.type === 'pet_parent');
      const caretakers = allUsers.filter((u: any) => u.type === 'caretaker');

      // Fetch applications
      const appsSnap = await getDocs(collection(db, 'caretaker_applications'));
      const allApps = appsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const pendingApps = allApps.filter((a: any) => a.status === 'pending');

      setStats({
        totalUsers: allUsers.length,
        totalCaretakers: caretakers.length,
        pendingApps: pendingApps.length,
        totalBookings: 0, // placeholder
      });

      // Recent apps (last 5)
      setRecentApps(allApps.slice(0, 5));

      // Recent users (last 5)
      setRecentUsers(allUsers.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Caretakers', value: stats.totalCaretakers, icon: PawPrint, color: 'bg-emerald-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { label: 'Pending Apps', value: stats.pendingApps, icon: ClipboardList, color: 'bg-amber-500', lightColor: 'bg-amber-50', textColor: 'text-amber-600' },
    { label: 'Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-400 font-bold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B2B48] tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Welcome back! Here's what's happening with Mypet9.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`${card.lightColor} p-2.5 rounded-xl`}>
                <card.icon size={20} className={card.textColor} />
              </div>
              <TrendingUp size={14} className="text-emerald-400" />
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-[#1B2B48]">{card.value}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-extrabold text-[#1B2B48] text-sm">Recent Applications</h2>
            <button 
              onClick={() => navigate('/admin/applications')}
              className="flex items-center space-x-1 text-xs font-bold text-[#174F38] hover:underline"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentApps.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No applications yet.</div>
            ) : (
              recentApps.map((app: any) => (
                <div key={app.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-[#174F38]/10 rounded-full flex items-center justify-center text-[#174F38] font-extrabold text-sm">
                      {app.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1B2B48]">{app.fullName}</p>
                      <p className="text-[11px] text-gray-400">{app.email}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    app.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                    app.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-extrabold text-[#1B2B48] text-sm">Recent Users</h2>
            <button 
              onClick={() => navigate('/admin/users')}
              className="flex items-center space-x-1 text-xs font-bold text-[#174F38] hover:underline"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No users yet.</div>
            ) : (
              recentUsers.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-extrabold text-sm">
                      {(user.name || user.fullName || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1B2B48]">{user.name || user.fullName}</p>
                      <p className="text-[11px] text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    user.type === 'caretaker' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {user.type === 'caretaker' ? 'Caretaker' : 'Pet Parent'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
