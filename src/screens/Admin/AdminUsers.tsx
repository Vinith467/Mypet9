import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Search, Users, PawPrint, Mail, Phone, Image as ImageIcon, X, Trash2 } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pet_parent' | 'caretaker'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [deletingUser, setDeletingUser] = useState<{id: string, type: string} | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersSnap, caretakersSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'caretakers'))
      ]);
      
      const caretakersMap = new Map();
      caretakersSnap.docs.forEach(d => {
        caretakersMap.set(d.id, d.data());
      });

      setUsers(usersSnap.docs.map(d => {
        const data = d.data();
        let photoURL = data.photoURL;
        if (!photoURL && data.type === 'caretaker') {
          const caretakerData = caretakersMap.get(d.id);
          if (caretakerData?.images?.length > 0) {
            photoURL = caretakerData.images[0];
          }
        }
        return { id: d.id, ...data, photoURL };
      }));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleUpdateImage = async () => {
    if (!editingUser) return;
    try {
      await updateDoc(doc(db, 'users', editingUser.id), {
        photoURL: newImageUrl
      });
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, photoURL: newImageUrl } : u));
      setEditingUser(null);
    } catch (e) {
      console.error("Error updating image:", e);
      alert("Failed to update image.");
    }
  };

  const confirmDeleteUser = async () => {
    if (!deletingUser) return;
    const { id: userId, type: userType } = deletingUser;
    
    try {
      // Delete from users collection
      await deleteDoc(doc(db, 'users', userId));
      
      // If caretaker, also delete from caretakers collection
      if (userType === 'caretaker') {
        await deleteDoc(doc(db, 'caretakers', userId));
      }
      
      setUsers(users.filter(u => u.id !== userId));
    } catch (e) {
      console.error("Error deleting user:", e);
      alert("Failed to delete user.");
    } finally {
      setDeletingUser(null);
    }
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
                  ? 'border-[#007672] text-[#007672] bg-gray-50/50'
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/30'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                filter === tab.key ? 'bg-[#007672]/10 text-[#007672]' : 'bg-gray-100 text-gray-400'
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
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#007672]/20 focus:border-[#007672]/30 font-medium placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Table Header (desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50/80 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100">
          <div className="col-span-4">User</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Phone</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Joined</div>
          <div className="col-span-1 text-right">Actions</div>
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
                  <div 
                    className="relative group cursor-pointer shrink-0" 
                    onClick={() => { setEditingUser(user); setNewImageUrl(user.photoURL || ''); }}
                    title="Click to edit profile image"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm ${
                        user.type === 'caretaker' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {(user.name || user.firstName || user.fullName || user.email || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ImageIcon size={16} className="text-white" />
                    </div>
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
                <div className="md:col-span-1">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap inline-block text-center ${
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
                {/* Actions */}
                <div className="md:col-span-1 flex justify-end">
                  <button 
                    onClick={() => setDeletingUser({id: user.id, type: user.type})}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Image Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
            <button onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-[#1B2B48] mb-4">Edit Profile Image</h2>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
              <input 
                type="text" 
                value={newImageUrl} 
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007672] outline-none"
              />
            </div>
            {newImageUrl && (
              <div className="mb-6 flex justify-center">
                <img src={newImageUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm" />
              </div>
            )}
            <button 
              onClick={handleUpdateImage}
              className="w-full bg-[#007672] hover:bg-[#00605c] text-white font-bold py-3 rounded-xl transition-colors"
            >
              Save Image
            </button>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-[#1B2B48] mb-2">Delete User?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to completely delete this user? This action cannot be undone and will erase all their data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingUser(null)}
                  className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
