import React, { useState, useEffect } from 'react';
import { AdminApplications } from './AdminApplications';
import { db } from '../../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ClipboardList, Users, PawPrint, MessageSquare, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const GenericFormViewer = ({ collectionName, title, emptyMessage }: { collectionName: string, title: string, emptyMessage: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(collection(db, collectionName));
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // sort by createdAt descending if exists
        docs.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds || a.createdAt || 0;
          const timeB = b.createdAt?.seconds || b.createdAt || 0;
          return timeB - timeA;
        });
        setData(docs);
      } catch (e) {
        console.error("Error fetching", collectionName, e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [collectionName]);

  if (loading) {
    return <div className="p-12 text-center text-gray-400 font-bold">Loading {title}...</div>;
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <ClipboardList size={40} className="mx-auto mb-3 text-gray-200" />
        <p className="text-gray-400 text-sm font-bold">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {data.map((item) => (
        <div key={item.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div 
            className="px-6 py-4 flex items-center justify-between cursor-pointer bg-gray-50/50 hover:bg-gray-50"
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
          >
            <div>
              <h3 className="font-bold text-[#1B2B48]">{item.name || item.firstName || item.fullName || 'Anonymous'}</h3>
              <p className="text-sm text-gray-500 font-medium">{item.email || item.phone || 'No contact provided'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-400 font-bold">
                {item.createdAt 
                  ? new Date(item.createdAt.seconds ? item.createdAt.seconds * 1000 : item.createdAt).toLocaleDateString()
                  : ''}
              </span>
              {expandedId === item.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </div>
          </div>
          
          {expandedId === item.id && (
            <div className="px-6 py-4 border-t border-gray-100 bg-white grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 overflow-x-auto">
              {Object.entries(item).filter(([key]) => key !== 'id').map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <p className="text-sm font-medium text-gray-800 break-words">
                    {typeof value === 'object' && value !== null 
                      ? (value as any).seconds ? new Date((value as any).seconds * 1000).toLocaleString() : JSON.stringify(value)
                      : String(value)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const AdminForms = () => {
  const [activeTab, setActiveTab] = useState('kyc');

  const tabs = [
    { id: 'kyc', label: 'Caretaker KYC', icon: ClipboardList },
    { id: 'parent_leads', label: 'Pet Parent Leads', icon: Users },
    { id: 'partner_leads', label: 'Partner Leads', icon: PawPrint },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'service_inquiries', label: 'Service Inquiries', icon: Calendar },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B2B48] tracking-tight">Forms & Applications</h1>
        <p className="text-gray-500 text-sm font-medium mt-1">Manage all form submissions from across the platform.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#007672] text-[#007672] bg-gray-50/50'
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/30'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#FAFAFA]">
          {activeTab === 'kyc' && (
            <div className="p-0">
              <AdminApplications />
            </div>
          )}
          {activeTab === 'parent_leads' && (
            <GenericFormViewer 
              collectionName="field_leads_parents" 
              title="Pet Parent Leads" 
              emptyMessage="No pet parent leads found." 
            />
          )}
          {activeTab === 'partner_leads' && (
            <GenericFormViewer 
              collectionName="field_leads_caretakers" 
              title="Partner Leads" 
              emptyMessage="No partner leads found." 
            />
          )}
          {activeTab === 'inquiries' && (
            <GenericFormViewer 
              collectionName="inquiries" 
              title="Inquiries" 
              emptyMessage="No inquiries found." 
            />
          )}
          {activeTab === 'service_inquiries' && (
            <GenericFormViewer 
              collectionName="service_inquiries" 
              title="Service Inquiries" 
              emptyMessage="No service inquiries found." 
            />
          )}
        </div>
      </div>
    </div>
  );
};
