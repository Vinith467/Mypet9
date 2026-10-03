import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ArrowLeft, Save, Clock, User, Phone, Mail, MapPin, List, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';

interface InquiryEntry {
  id: string;
  timestamp: string;
  userType: 'Pet Parent' | 'Caretaker';
  name: string;
  contact: string;
  email: string;
  address: string;
  coordinates?: string;
  locationImage?: string;
  petCount: string;
  breed: string;
  remark: string;
}

export const InquiryFormScreen = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<InquiryEntry[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    userType: 'Pet Parent' as 'Pet Parent' | 'Caretaker',
    name: '',
    contact: '',
    email: '',
    address: '',
    coordinates: '',
    locationImage: '',
    petCount: '',
    breed: '',
    remark: ''
  });

  const [isLocating, setIsLocating] = useState(false);

  const captureLocation = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }));
          setIsLocating(false);
        },
        (error) => {
          console.error("Error capturing location:", error);
          alert('Could not capture location. Please ensure location services are enabled.');
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Compress image slightly for localStorage limit
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setFormData(prev => ({ ...prev, locationImage: dataUrl }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load entries from Firestore on mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const q = query(collection(db, 'inquiries'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedEntries: InquiryEntry[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedEntries.push({
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to readable string if necessary, else it's a string
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString() : data.timestamp
          } as InquiryEntry);
        });
        setEntries(fetchedEntries);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };
    
    fetchEntries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const entryData = {
        timestamp: new Date().toLocaleString(), // Keep as string for simplicity or use Timestamp.now()
        ...formData
      };

      const docRef = await addDoc(collection(db, 'inquiries'), entryData);
      
      const newEntry: InquiryEntry = {
        id: docRef.id,
        ...entryData
      } as InquiryEntry;

      setEntries(prev => [newEntry, ...prev]);
      
      // Clear form
    setFormData({
      userType: 'Pet Parent',
      name: '',
      contact: '',
      email: '',
      address: '',
      coordinates: '',
      locationImage: '',
      petCount: '',
      breed: '',
      remark: ''
    });
    
      alert('Entry saved successfully!');
    } catch (error) {
      console.error("Error saving entry:", error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearHistory = () => {
    // Disabled for production Firestore
    alert('Clearing history is disabled for the live database.');
  };

  const exportToExcel = () => {
    if (entries.length === 0) {
      alert("No entries to export!");
      return;
    }

    // CSV Headers
    const headers = ["Timestamp", "Type", "Name", "Contact", "Email", "Address", "Coordinates", "Pets", "Breed", "Remark"];
    
    // Convert entries to CSV rows
    const rows = entries.map(entry => {
      return [
        `"${entry.timestamp}"`,
        `"${entry.userType}"`,
        `"${entry.name.replace(/"/g, '""')}"`,
        `"${entry.contact}"`,
        `"${entry.email || ''}"`,
        `"${(entry.address || '').replace(/"/g, '""')}"`,
        `"${entry.coordinates || ''}"`,
        `"${(entry.petCount || '').replace(/"/g, '""')}"`,
        `"${(entry.breed || '').replace(/"/g, '""')}"`,
        `"${(entry.remark || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mypet9_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="min-h-full bg-[#FAFAFA] pb-24 lg:pb-12">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6">
          
          <div className="flex items-center space-x-3 mb-8">
            <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
              <ArrowLeft size={20} className="text-[#1B2B48]" />
            </button>
            <h1 className="text-2xl font-extrabold text-[#1B2B48]">Customer Inquiry Form</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#1B2B48] mb-6 flex items-center">
                <FileText className="mr-2 text-[#007672]" size={20} />
                New Entry
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userType: 'Pet Parent' }))}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${formData.userType === 'Pet Parent' ? 'bg-white text-[#007672] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Pet Parent
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userType: 'Caretaker' }))}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${formData.userType === 'Caretaker' ? 'bg-white text-[#007672] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Caretaker
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#007672] focus:ring-1 focus:ring-[#007672]" placeholder="Enter full name" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Contact No.</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input required type="tel" name="contact" value={formData.contact} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#007672] focus:ring-1 focus:ring-[#007672]" placeholder="Phone number" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email ID</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#007672] focus:ring-1 focus:ring-[#007672]" placeholder="Email address" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Address & Location</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#007672] focus:ring-1 focus:ring-[#007672]" placeholder="Full address" />
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button 
                        type="button" 
                        onClick={captureLocation}
                        disabled={isLocating}
                        className="flex-1 py-2.5 px-4 bg-[#E6FBF0] text-[#007672] border border-[#007672]/30 font-bold text-sm rounded-xl hover:bg-[#D1F4E0] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        <MapPin size={16} />
                        <span>{isLocating ? 'Locating...' : 'Capture GPS Coordinates'}</span>
                      </button>
                      <label className="flex-1 py-2.5 px-4 bg-gray-50 text-gray-700 border border-gray-200 font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center space-x-2">
                        <User size={16} /> {/* Placeholder icon for Image */}
                        <span>{formData.locationImage ? 'Image Captured' : 'Take Photo'}</span>
                        <input type="file" accept="image/*" capture="environment" onChange={handleImageCapture} className="hidden" />
                      </label>
                    </div>
                    
                    {formData.coordinates && (
                      <div className="text-xs text-green-600 font-medium">Captured: {formData.coordinates}</div>
                    )}
                    {formData.locationImage && (
                      <img src={formData.locationImage} alt="Location" className="h-20 w-auto rounded-lg border border-gray-200 object-cover" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">How many Dog/Cat?</label>
                    <input type="text" name="petCount" value={formData.petCount} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#007672] focus:ring-1 focus:ring-[#007672]" placeholder="e.g. 2 Dogs, 1 Cat" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Breed Name(s)</label>
                    <input type="text" name="breed" value={formData.breed} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#007672] focus:ring-1 focus:ring-[#007672]" placeholder="e.g. Husky, Persian" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Remark</label>
                  <textarea name="remark" value={formData.remark} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#007672] focus:ring-1 focus:ring-[#007672] resize-none" placeholder="Any additional notes..." />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-[#007672] text-white font-bold rounded-xl hover:bg-[#00605c] transition-colors flex items-center justify-center space-x-2 mt-4 shadow-sm disabled:opacity-50">
                  <Save size={18} />
                  <span>{isSubmitting ? 'Saving...' : 'Save Entry'}</span>
                </button>
              </form>
            </div>

            {/* History Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col max-h-[800px]">
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h2 className="text-lg font-bold text-[#1B2B48] flex items-center">
                  <List className="mr-2 text-[#007672]" size={20} />
                  Entry History
                </h2>
                {entries.length > 0 && (
                  <button onClick={exportToExcel} className="flex items-center space-x-1.5 text-sm font-bold text-[#007672] hover:bg-[#007672]/10 px-3 py-1.5 rounded-full transition-colors border border-[#007672]/20">
                    <Download size={16} />
                    <span>Export</span>
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {entries.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Clock size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-sm">No entries yet.</p>
                  </div>
                ) : (
                  entries.map((entry) => (
                    <div key={entry.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm relative group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-extrabold text-[#1B2B48]">{entry.name}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#007672]/10 text-[#007672]">
                            {entry.userType}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100">
                          {entry.timestamp}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs mt-3 text-gray-600">
                        <div><span className="font-bold text-gray-800">Phone:</span> {entry.contact}</div>
                        <div className="truncate"><span className="font-bold text-gray-800">Email:</span> {entry.email || '-'}</div>
                        <div className="col-span-2"><span className="font-bold text-gray-800">Address:</span> {entry.address || '-'}</div>
                        <div><span className="font-bold text-gray-800">Pets:</span> {entry.petCount || '-'}</div>
                        <div><span className="font-bold text-gray-800">Breed:</span> {entry.breed || '-'}</div>
                        {entry.remark && (
                          <div className="col-span-2 mt-1 bg-white p-2 rounded border border-gray-100">
                            <span className="font-bold text-gray-800 block mb-0.5">Remark:</span> 
                            {entry.remark}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
