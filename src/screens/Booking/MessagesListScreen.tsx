import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowLeft, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';

const ChatItem = ({ chat }: { chat: any }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessage, setLastMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'bookings', chat.id, 'messages'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let unread = 0;
      let lastMsgText = '';

      if (!snapshot.empty) {
        lastMsgText = snapshot.docs[0].data().text;
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.senderId !== user.uid && !data.read) {
            unread++;
          }
        });
      }

      setUnreadCount(unread);
      setLastMessage(lastMsgText);
    });

    return () => unsubscribe();
  }, [chat.id, user]);

  return (
    <button
      onClick={() => navigate(`/chat/${chat.id}`)}
      className="w-full flex items-center bg-white p-4 rounded-[16px] shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="relative">
        <img 
          src={chat.caretakerImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.caretakerName || "Caretaker")}&background=E5E7EB&color=1B2B48`} 
          alt={chat.caretakerName}
          className="w-14 h-14 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.caretakerName || "Caretaker")}&background=E5E7EB&color=1B2B48`;
          }}
        />
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
      </div>
      <div className="ml-4 flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <h3 className={`font-extrabold text-[16px] truncate ${unreadCount > 0 ? 'text-[#1B2B48]' : 'text-[#1B2B48]'}`}>{chat.caretakerName}</h3>
          <span className="text-[12px] font-medium text-gray-400 shrink-0 capitalize">{chat.status}</span>
        </div>
        <p className={`text-[13px] truncate ${unreadCount > 0 ? 'font-bold text-[#1B2B48]' : 'font-medium text-[#465E87]'}`}>
          {lastMessage || `Tap to chat about ${chat.petName || 'your pet'}'s stay`}
        </p>
      </div>
      <div className="flex items-center ml-2 shrink-0">
        {unreadCount > 0 && (
          <div className="bg-[#10B981] text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full mr-2">
            {unreadCount}
          </div>
        )}
        <ChevronRight className="text-gray-300" size={20} />
      </div>
    </button>
  );
};

export const MessagesListScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Since we don't have a dedicated "chats" collection that maps well yet,
    // we use the bookings to represent active chat threads.
    const q = query(
      collection(db, 'bookings'),
      where('petParentId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as any)).filter((b: any) => b.status === 'accepted' || b.status === 'ongoing');
      
      // Sort by createdAt descending
      chats.sort((a: any, b: any) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      setActiveChats(chats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-h-full bg-[#F8F9FA] pb-24 lg:pb-12 pt-8 lg:pt-12 px-5">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors mr-3 lg:hidden"
            >
              <ArrowLeft className="text-[#1B2B48]" size={24} />
            </button>
            <h1 className="text-[22px] font-extrabold text-[#1B2B48]">Messages</h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2B48]"></div>
            </div>
          ) : activeChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={32} className="text-gray-300" />
              </div>
              <h3 className="text-[18px] font-extrabold text-[#1B2B48] mb-2">
                No Messages Yet
              </h3>
              <p className="text-[#465E87] text-[14px] font-medium max-w-[280px]">
                When you have an active or confirmed booking, your chat with the caretaker will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeChats.map(chat => (
                <ChatItem key={chat.id} chat={chat} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
