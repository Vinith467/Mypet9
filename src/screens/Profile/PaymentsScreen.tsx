import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, Plus, CreditCard, Landmark, ArrowUpRight, ArrowDownLeft, ReceiptText } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion } from 'framer-motion';

const transactions = [
  { id: '1', title: 'Paid to The Happy Tails Home', date: '12 Sep 2026', amount: 1200, type: 'debit', category: 'boarding' },
  { id: '2', title: 'Added to Wallet', date: '10 Sep 2026', amount: 500, type: 'credit', category: 'topup' },
  { id: '3', title: 'Refund for Pet Taxi', date: '05 Sep 2026', amount: 250, type: 'credit', category: 'refund' },
  { id: '4', title: 'Paid to Paws & Play Retreat', date: '22 Aug 2026', amount: 3400, type: 'debit', category: 'boarding' },
];

export const PaymentsScreen = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#FAF9F5] pb-24 lg:pb-12 pt-6 lg:pt-10 px-5">
        <div className="max-w-2xl mx-auto w-full">
          
          {/* Header */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 hover:bg-gray-50 transition-colors mr-3 shadow-sm"
            >
              <ArrowLeft className="text-[#1B2B48]" size={20} />
            </button>
            <h1 className="text-[24px] font-extrabold text-[#1B2B48]">
              Payments
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col space-y-6"
          >
            {/* Wallet Card */}
            <div className="bg-gradient-to-br from-[#174F38] to-[#2B845D] rounded-[24px] p-6 text-white shadow-lg shadow-petoo-primary/20 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-1">
                  <Wallet size={20} className="text-white/80" />
                  <span className="text-[15px] font-medium text-white/90">Mypet9 Balance</span>
                </div>
                <div className="text-[40px] font-extrabold mb-6 leading-none">
                  ₹500.00
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 bg-white text-[#174F38] py-3 rounded-xl font-bold text-[15px] flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
                    <Plus size={18} />
                    <span>Add Money</span>
                  </button>
                  <button className="flex-1 bg-white/15 backdrop-blur-md text-white border border-white/20 py-3 rounded-xl font-bold text-[15px] hover:bg-white/20 transition-colors">
                    Withdraw
                  </button>
                </div>
              </div>
            </div>

            {/* Saved Payment Methods */}
            <div>
              <h2 className="text-[18px] font-extrabold text-[#1B2B48] mb-3 px-1">Payment Methods</h2>
              <div className="bg-white rounded-[20px] p-2 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Landmark size={20} />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[#1B2B48]">HDFC Bank UPI</p>
                      <p className="text-[13px] font-medium text-[#465E87]">omisha@hdfcbank</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-petoo-primary bg-petoo-primary flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[#1B2B48]">Visa ending in 4242</p>
                      <p className="text-[13px] font-medium text-[#465E87]">Expires 12/28</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-[18px] font-extrabold text-[#1B2B48]">Recent Transactions</h2>
                <button className="text-[14px] font-bold text-petoo-primary hover:underline">See All</button>
              </div>
              
              <div className="bg-white rounded-[20px] p-2 shadow-sm border border-gray-100 flex flex-col">
                {transactions.map((txn, index) => (
                  <div key={txn.id} className={`flex items-center justify-between p-4 ${index !== transactions.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        txn.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                      }`}>
                        {txn.category === 'boarding' ? <ReceiptText size={18} /> : 
                         txn.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-[#1B2B48] leading-snug">{txn.title}</p>
                        <p className="text-[13px] font-medium text-[#465E87]">{txn.date}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className={`text-[15px] font-extrabold ${txn.type === 'credit' ? 'text-green-600' : 'text-[#1B2B48]'}`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </DashboardLayout>
  );
};
