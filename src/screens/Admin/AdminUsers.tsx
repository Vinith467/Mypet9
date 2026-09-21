import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Search, Users, PawPrint, Mail, Phone } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pet_parent' | 'caretaker'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.type === filter;
    const matchesSearch = !searchQuery ||
      (user.name || user.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const tabs = [
    { key: 'all' as const, label: 'All Users', count: users.length },
    { key: 'pet_parent' as const, label: 'Pet Parents', count: users.filter(u => u.type === 'pet_parent').length },
    { key: 'caretaker' as const, label: 'Caretakers', count: users.filter(u => u.type === 'caretaker').length },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B2B48] tracking-tight">Users</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Manage all registered pet parents and caretakers.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 text-sm font-bold transition-all border-b-2 ${
                filter === tab.key
                  ? 'border-[#174F38] text-[#174F38] bg-gray-50/50'
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/30'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                filter === tab.key ? 'bg-[#174F38]/10 text-[#174F38]' : 'bg-gray-100 text-gray-400'
              }`}>
                {tab.count}
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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#174F38]/20 focus:border-[#174F38]/30 font-medium placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Table Header (desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50/80 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">
          <div className="col-span-4">User</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Phone</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-1">Joined</div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-12 text-center text-gray-400 font-bold">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm font-bold">No users found.</p>
            </div>
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors items-center">
                {/* Name */}
                <div className="md:col-span-4 flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 ${
                    user.type === 'caretaker' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {(user.name || user.firstName || user.fullName || user.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-bold text-[#1B2B48] truncate">
                    {user.name || user.firstName || user.fullName || 'User (Applying)'}
                  </p>
                </div>
                {/* Email */}
                <div className="md:col-span-3 flex items-center space-x-1.5 md:space-x-0">
                  <Mail size={13} className="text-gray-300 md:hidden shrink-0" />
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                {/* Phone */}
                <div className="md:col-span-2 flex items-center space-x-1.5 md:space-x-0">
                  <Phone size={13} className="text-gray-300 md:hidden shrink-0" />
                  <p className="text-sm text-gray-500">{user.phone || '—'}</p>
                </div>
                {/* Type */}
                <div className="md:col-span-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    user.type === 'caretaker' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {user.type === 'caretaker' ? 'Caretaker' : 'Pet Parent'}
                  </span>
                </div>
                {/* Joined */}
                <div className="md:col-span-1">
                  <p className="text-[11px] text-gray-400 font-medium">
                    {user.createdAt ? new Date(user.createdAt.seconds ? user.createdAt.seconds * 1000 : user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
