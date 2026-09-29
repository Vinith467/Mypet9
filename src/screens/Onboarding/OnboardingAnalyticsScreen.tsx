import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowLeft, BarChart3, Users, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OnboardingAnalyticsScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'parents' | 'partners'>('parents');
  const [parentsData, setParentsData] = useState<any[]>([]);
  const [partnersData, setPartnersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [parentsSnap, partnersSnap] = await Promise.all([
          getDocs(collection(db, 'field_leads_parents')),
          getDocs(collection(db, 'field_leads_caretakers'))
        ]);
        
        setParentsData(parentsSnap.docs.map(doc => doc.data()));
        setPartnersData(partnersSnap.docs.map(doc => doc.data()));
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateFrequencies = (data: any[], key: string) => {
    const counts: Record<string, number> = {};
    let totalRespondents = 0;

    data.forEach(item => {
      const val = item[key];
      let answered = false;

      if (Array.isArray(val) && val.length > 0) {
        val.forEach(v => {
          if (v !== 'Other') {
            counts[v] = (counts[v] || 0) + 1;
            answered = true;
          }
        });
      } else if (typeof val === 'string' && val.trim() !== '') {
        counts[val] = (counts[val] || 0) + 1;
        answered = true;
      } else if (typeof val === 'boolean') {
        const strVal = val ? 'Yes' : 'No';
        counts[strVal] = (counts[strVal] || 0) + 1;
        answered = true;
      }

      if (answered) {
        totalRespondents++;
      }
    });

    // If nobody answered, avoid division by zero
    const denominator = totalRespondents > 0 ? totalRespondents : 1;

    const result = Object.entries(counts)
      .map(([option, count]) => ({
        option,
        count,
        percentage: Math.round((count / denominator) * 100)
      }))
      .sort((a, b) => b.count - a.count); // Sort descending

    return { result, totalRespondents };
  };

  const ChartBlock = ({ title, dataKey, dataset }: { title: string, dataKey: string, dataset: any[] }) => {
    const { result, totalRespondents } = calculateFrequencies(dataset, dataKey);

    if (result.length === 0) return null;

    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-extrabold text-[#1B2B48]">{title}</h3>
          <span className="text-[12px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
            {totalRespondents} {totalRespondents === 1 ? 'response' : 'responses'}
          </span>
        </div>
        
        <div className="space-y-4">
          {result.map((item, index) => (
            <div key={item.option} className="relative">
              <div className="flex justify-between items-end mb-1 text-[13px]">
                <span className="font-medium text-[#465E87] pr-4">{item.option}</span>
                <span className="font-bold text-[#007672] shrink-0">{item.percentage}% <span className="text-gray-400 font-normal text-[11px]">({item.count})</span></span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#007672] h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const parentFields = [
    { key: 'problems', title: 'Biggest pet care problems' },
    { key: 'travelCare', title: 'What they do when traveling' },
    { key: 'biggestConcern', title: 'Biggest concern when leaving pet' },
    { key: 'badExperience', title: 'Had a bad experience?' },
    { key: 'usedBoarding', title: 'Used boarding before?' },
    { key: 'boardingProblems', title: 'Problems faced during boarding' },
    { key: 'updatesWanted', title: 'Updates wanted during stay' },
    { key: 'trustFactors', title: 'What builds trust in a platform' },
    { key: 'searchPlaces', title: 'Where they search for services' },
    { key: 'mostImportant', title: 'Most important factor when searching' },
  ];

  const partnerFields = [
    { key: 'heardAbout', title: 'How they heard about MyPet9' },
    { key: 'currentJob', title: 'Current Occupation' },
    { key: 'hasPets', title: 'Currently has pets?' },
    { key: 'caredForOtherPet', title: 'Cared for others\' pets?' },
    { key: 'providedHomestayBefore', title: 'Provided homestay before?' },
    { key: 'propertyType', title: 'Property Type' },
    { key: 'ownOrRent', title: 'Own or Rent' },
    { key: 'spaceAvailable', title: 'Space Available for Pets' },
    { key: 'balcony', title: 'Has Balcony?' },
    { key: 'garden', title: 'Has Garden/Open Space?' },
    { key: 'petProofed', title: 'Is Home Pet-Proofed?' },
    { key: 'facilitiesProvided', title: 'Facilities Provided' },
    { key: 'petsComfortableHosting', title: 'Pets Comfortable Hosting' },
    { key: 'multipleFamilies', title: 'Accept pets from multiple families?' },
    { key: 'servicesProvided', title: 'Services Provided' },
    { key: 'providePhotosVideos', title: 'Provide Photos/Videos?' },
    { key: 'provideDailyReport', title: 'Provide Daily Report?' },
    { key: 'availability', title: 'Availability' },
    { key: 'advanceNotice', title: 'Advance Notice Required' },
    { key: 'maxDuration', title: 'Maximum Hosting Duration' },
    { key: 'motivation', title: 'Motivation for Homestay' },
    { key: 'expectSupport', title: 'Expected Support from MyPet9' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm border-b">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-[#007672]" />
            <h1 className="text-[18px] font-extrabold text-[#1B2B48]">Analytics</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b sticky top-[60px] z-20 shadow-sm">
        <button 
          onClick={() => setActiveTab('parents')}
          className={`flex-1 py-3 text-[14px] font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${activeTab === 'parents' ? 'text-[#007672] border-[#007672] bg-[#F0F9F9]' : 'text-gray-500 border-transparent hover:bg-gray-50'}`}
        >
          <Users size={16} />
          Pet Parents
        </button>
        <button 
          onClick={() => setActiveTab('partners')}
          className={`flex-1 py-3 text-[14px] font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${activeTab === 'partners' ? 'text-[#007672] border-[#007672] bg-[#F0F9F9]' : 'text-gray-500 border-transparent hover:bg-gray-50'}`}
        >
          <Home size={16} />
          Partners
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3">
            <div className="w-8 h-8 border-4 border-[#007672] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">Crunching numbers...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'parents' ? (
              <>
                <div className="bg-[#1B2B48] text-white rounded-2xl p-5 mb-6 shadow-md flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-[13px] font-medium mb-1">Total Parent Responses</p>
                    <h2 className="text-3xl font-extrabold">{parentsData.length}</h2>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl">
                    <Users size={28} className="text-[#00A884]" />
                  </div>
                </div>

                {parentsData.length === 0 ? (
                  <p className="text-center text-gray-500 mt-10">No data collected yet.</p>
                ) : (
                  parentFields.map(field => (
                    <ChartBlock key={field.key} title={field.title} dataKey={field.key} dataset={parentsData} />
                  ))
                )}
              </>
            ) : (
              <>
                <div className="bg-[#1B2B48] text-white rounded-2xl p-5 mb-6 shadow-md flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-[13px] font-medium mb-1">Total Partner Responses</p>
                    <h2 className="text-3xl font-extrabold">{partnersData.length}</h2>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl">
                    <Home size={28} className="text-[#00A884]" />
                  </div>
                </div>

                {partnersData.length === 0 ? (
                  <p className="text-center text-gray-500 mt-10">No data collected yet.</p>
                ) : (
                  partnerFields.map(field => (
                    <ChartBlock key={field.key} title={field.title} dataKey={field.key} dataset={partnersData} />
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
