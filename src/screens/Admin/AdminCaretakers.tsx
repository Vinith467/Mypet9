import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Search, PawPrint, Mail, Phone, Edit2, ShieldAlert, CheckCircle, X, MapPin, IndianRupee, UploadCloud, Trash2 } from 'lucide-react';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

export const AdminCaretakers = () => {
  const [caretakers, setCaretakers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit State
  const [editingCaretaker, setEditingCaretaker] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCaretakers();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    try {
      const files = Array.from(e.target.files);
      const newUrls = await Promise.all(files.map(f => uploadImageToCloudinary(f)));
      setEditForm({
        ...editForm,
        images: [...(editForm.images || []), ...newUrls].filter(url => url) // Filter out empty URLs just in case
      });
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image(s).");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchCaretakers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'caretakers'));
      setCaretakers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredCaretakers = caretakers.filter(c => {
    const search = searchQuery.toLowerCase();
    return (
      (c.name || c.fullName || '').toLowerCase().includes(search) ||
      (c.email || '').toLowerCase().includes(search)
    );
  });

  const handleEditClick = (caretaker: any) => {
    setEditingCaretaker(caretaker);
    setEditForm({
      name: caretaker.name || caretaker.fullName || '',
      email: caretaker.email || '',
      phone: caretaker.phone || '',
      bio: caretaker.bio || caretaker.about || '',
      price: caretaker.price || 0,
      address: caretaker.address || caretaker.city || '',
      status: caretaker.status || 'active',
      images: caretaker.images || (caretaker.photoURL ? [caretaker.photoURL] : [])
    });
  };

  const handleSave = async () => {
    if (!editingCaretaker) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'caretakers', editingCaretaker.id), editForm);
      setCaretakers(caretakers.map(c => c.id === editingCaretaker.id ? { ...c, ...editForm } : c));
      setEditingCaretaker(null);
    } catch (e) {
      console.error("Error updating caretaker:", e);
      alert("Failed to update caretaker profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuspend = async (caretaker: any) => {
    const newStatus = caretaker.status === 'suspended' ? 'active' : 'suspended';
    const confirmMsg = newStatus === 'suspended' 
      ? `Are you sure you want to suspend ${caretaker.name}? They will not appear in search results.`
      : `Reactivate ${caretaker.name}?`;
      
    if (!window.confirm(confirmMsg)) return;

    try {
      await updateDoc(doc(db, 'caretakers', caretaker.id), { status: newStatus });
      setCaretakers(caretakers.map(c => c.id === caretaker.id ? { ...c, status: newStatus } : c));
    } catch (e) {
      console.error("Error changing status:", e);
      alert("Failed to change status.");
    }
  };

  const handleDelete = async (caretaker: any) => {
    const confirmMsg = `WARNING: Are you absolutely sure you want to permanently delete ${caretaker.name || 'this caretaker'}? This will completely remove their data from the database and cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await deleteDoc(doc(db, 'caretakers', caretaker.id));
      setCaretakers(caretakers.filter(c => c.id !== caretaker.id));
    } catch (e) {
      console.error("Error deleting caretaker:", e);
      alert("Failed to delete caretaker.");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B2B48] tracking-tight flex items-center gap-3">
          Caretaker Management
        </h1>
        <p className="text-gray-500 text-sm font-medium mt-1">
          Full control over partner profiles, pricing, and platform access.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 flex-1 flex flex-col overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-gray-50 shrink-0">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search caretakers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#007672]/20 font-medium placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/80 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 shrink-0">
          <div className="col-span-4">Caretaker</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-2">Location & Price</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="p-12 text-center text-gray-400 font-bold">Loading caretakers...</div>
          ) : filteredCaretakers.length === 0 ? (
            <div className="p-12 text-center">
              <PawPrint size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm font-bold">No caretakers found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCaretakers.map(caretaker => (
                <div key={caretaker.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors items-center">
                  
                  {/* Name & Avatar */}
                  <div className="md:col-span-4 flex items-center space-x-3">
                    <img 
                      src={caretaker.images?.[0] || caretaker.photoURL || `https://ui-avatars.com/api/?name=${caretaker.name || 'C'}&background=E5E7EB&color=1B2B48`} 
                      alt="" 
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#1B2B48] truncate">{caretaker.name || caretaker.fullName || 'Unnamed'}</p>
                      <p className="text-xs text-gray-400 font-medium line-clamp-1">{caretaker.bio || caretaker.about || 'No bio provided'}</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="md:col-span-3 space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                      <Mail size={12} className="shrink-0" />
                      <span className="truncate">{caretaker.email}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                      <Phone size={12} className="shrink-0" />
                      <span>{caretaker.phone || '—'}</span>
                    </div>
                  </div>

                  {/* Location & Price */}
                  <div className="md:col-span-2 space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">{caretaker.address || caretaker.city || '—'}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-[#007672] font-bold">
                      <IndianRupee size={12} className="shrink-0" />
                      <span>{caretaker.price || '0'}/night</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-1">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      caretaker.status === 'suspended' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {caretaker.status === 'suspended' ? <ShieldAlert size={10} /> : <CheckCircle size={10} />}
                      <span>{caretaker.status || 'Active'}</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => handleEditClick(caretaker)}
                      className="p-2 text-gray-400 hover:text-[#007672] hover:bg-[#007672]/10 rounded-lg transition-colors"
                      title="Edit Profile"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleSuspend(caretaker)}
                      className={`p-2 rounded-lg transition-colors ${
                        caretaker.status === 'suspended' 
                          ? 'text-emerald-500 hover:bg-emerald-50' 
                          : 'text-red-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title={caretaker.status === 'suspended' ? "Reactivate" : "Suspend"}
                    >
                      <ShieldAlert size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(caretaker)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Permanently Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Edit Modal */}
      {editingCaretaker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative my-8 flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-xl font-extrabold text-[#1B2B48]">Edit Caretaker Profile</h2>
              <button onClick={() => setEditingCaretaker(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={editForm.name} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007672]/20 outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                  <input 
                    type="email" 
                    value={editForm.email} 
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007672]/20 outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                  <input 
                    type="text" 
                    value={editForm.phone} 
                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007672]/20 outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nightly Price (₹)</label>
                  <input 
                    type="number" 
                    value={editForm.price} 
                    onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007672]/20 outline-none text-sm font-bold text-[#007672]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location (Address)</label>
                <input 
                  type="text" 
                  value={editForm.address || ''} 
                  onChange={e => setEditForm({...editForm, address: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007672]/20 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">About / Bio</label>
                <textarea 
                  value={editForm.bio || ''} 
                  onChange={e => setEditForm({...editForm, bio: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007672]/20 outline-none text-sm font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Profile & Gallery Images</label>
                
                <div className="relative group rounded-xl border-2 border-dashed border-gray-300 hover:border-[#007672] bg-gray-50 transition-all p-6 text-center cursor-pointer mb-4">
                  <input 
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                    {isUploading ? (
                      <div className="w-8 h-8 rounded-full border-2 border-[#007672] border-t-transparent animate-spin mx-auto" />
                    ) : (
                      <UploadCloud size={32} className="text-gray-400 group-hover:text-[#007672] transition-colors" />
                    )}
                    <div>
                      <p className="text-sm font-bold text-[#1B2B48]">
                        {isUploading ? 'Uploading...' : 'Click or drag images here'}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">Supports multiple images (JPG, PNG)</p>
                    </div>
                  </div>
                </div>

                {editForm.images?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {editForm.images.map((url: string, index: number) => url ? (
                      <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              const newImages = editForm.images.filter((_: any, i: number) => i !== index);
                              setEditForm({...editForm, images: newImages});
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        {index === 0 && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-[#007672] text-white text-[10px] font-bold rounded shadow-sm">
                            Primary
                          </div>
                        )}
                      </div>
                    ) : null)}
                  </div>
                )}
              </div>

            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end space-x-3 shrink-0">
              <button 
                onClick={() => setEditingCaretaker(null)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-[#007672] hover:bg-[#00605c] transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
