import { useState, useEffect } from 'react';
import { CaretakerLayout } from '../../components/layout/CaretakerLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { 
  ChevronLeft,
  IndianRupee,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface EarningEntry {
  id: string;
  petName: string;
  ownerName: string;
  amount: number;
  date: string;
  service: string;
  status: 'completed' | 'pending' | 'processing';
}

export const CaretakerEarningsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<EarningEntry[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const earningsRef = collection(db, 'caretaker_applications', user.uid, 'earnings');
        const snapshot = await getDocs(earningsRef);
        
        const earningsData: EarningEntry[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as EarningEntry));

        setEarnings(earningsData);
        
        const completed = earningsData
          .filter(e => e.status === 'completed')
          .reduce((sum, e) => sum + e.amount, 0);
        const pending = earningsData
          .filter(e => e.status === 'pending' || e.status === 'processing')
          .reduce((sum, e) => sum + e.amount, 0);

        setTotalEarnings(completed);
        setPendingAmount(pending);
      } catch (error) {
        console.error("Error fetching earnings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [user]);

  const filteredEarnings = earnings.filter(e => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return e.status === 'completed';
    return e.status === 'pending' || e.status === 'processing';
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <CaretakerLayout>
      <div className="w-full flex flex-col bg-[#FAFAFA] min-h-screen font-quicksand pb-40 lg:pb-12 text-[#1B2B48]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 sticky top-0 bg-[#FAFAFA]/95 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center -ml-2 text-[#1B2B48] hover:bg-black/5 rounded-full transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <h1 className="text-xl font-extrabold tracking-tight">Earnings</h1>
          </div>
          <div className="w-10"></div>
        </div>

        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-petoo-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex-1 px-5 lg:px-8 pt-6 w-full flex flex-col max-w-3xl mx-auto">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-100"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Wallet size={16} className="text-emerald-600" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600/70 uppercase">Total Earned</span>
                </div>
                <p className="text-2xl font-extrabold text-emerald-700">₹{totalEarnings.toLocaleString()}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-100"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-amber-600" />
                  </div>
                  <span className="text-[11px] font-bold text-amber-600/70 uppercase">Pending</span>
                </div>
                <p className="text-2xl font-extrabold text-amber-700">₹{pendingAmount.toLocaleString()}</p>
              </motion.div>
            </div>

            {/* Filters */}
            <div className="flex space-x-2 mb-5">
              {(['all', 'completed', 'pending'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all capitalize ${
                    activeFilter === filter
                      ? 'bg-[#1B2B48] text-white'
                      : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Earnings List */}
            {filteredEarnings.length > 0 ? (
              <div className="flex flex-col space-y-3">
                {filteredEarnings.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-[14px] font-bold text-[#1B2B48]">{entry.petName}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{entry.ownerName} • {entry.service}</p>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">{entry.date}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-[16px] font-extrabold text-[#1B2B48]">₹{entry.amount}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 capitalize ${getStatusColor(entry.status)}`}>
                        {entry.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                <IndianRupee size={48} className="mb-3" />
                <p className="text-[15px] font-bold text-gray-400">No earnings yet</p>
                <p className="text-[12px] text-gray-400 font-medium mt-1">
                  Your earnings will appear here once you complete bookings
                </p>
              </div>
            )}

          </div>
        )}
      </div>
    </CaretakerLayout>
  );
};
