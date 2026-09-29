import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowLeft, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { ChatScreen } from './ChatScreen';

const ChatItem = ({ chat, onSelect, isSelected }: { chat: any, onSelect: () => void, isSelected: boolean }) => {
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
      onClick={onSelect}
      className={`w-full flex items-center p-4 rounded-[16px] transition-all text-left border ${
        isSelected 
          ? 'bg-gray-50 border-[#71b6af] shadow-sm' 
          : 'bg-white border-gray-100 shadow-sm hover:bg-gray-50'
      }`}
    >
      <div className="relative shrink-0">
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
      <div className="ml-4 flex-1 min-w-0 overflow-hidden">
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
        <ChevronRight className="text-gray-300 lg:hidden" size={20} />
      </div>
    </button>
  );
};

export const MessagesListScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'bookings'),
      where('petParentId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as any)).filter((b: any) => b.status === 'accepted' || b.status === 'ongoing');
      
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

  // Auto-select the first chat on desktop if none selected
  useEffect(() => {
    if (activeChats.length > 0 && !selectedChatId && window.innerWidth >= 1024) {
      setSelectedChatId(activeChats[0].id);
    }
  }, [activeChats, selectedChatId]);

  const handleChatSelect = (id: string) => {
    if (window.innerWidth >= 1024) {
      setSelectedChatId(id);
    } else {
      navigate(`/chat/${id}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full h-full lg:py-6 lg:px-8 bg-[#F8F9FA]">
        <div className="w-full h-full flex flex-col lg:flex-row max-w-6xl mx-auto bg-white lg:rounded-[24px] lg:shadow-[0_4px_24px_rgba(0,0,0,0.04)] lg:border lg:border-gray-100 overflow-hidden lg:h-[calc(100vh-120px)]">
          
          {/* Left Pane: Chat List */}
          <div className="w-full lg:w-[380px] lg:border-r border-gray-100 flex flex-col h-full bg-[#F8F9FA] lg:bg-white shrink-0">
            {/* Header */}
            <div className="px-5 pt-8 lg:pt-6 lg:px-6 shrink-0 bg-white lg:bg-transparent pb-4 lg:pb-0 z-10 lg:border-none shadow-sm lg:shadow-none">
              <div className="flex items-center mb-0">
                <button 
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors mr-3 lg:hidden"
                >
                  <ArrowLeft className="text-[#1B2B48]" size={24} />
                </button>
                <h1 className="text-[22px] font-extrabold text-[#1B2B48]">Messages</h1>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-5 lg:px-4 py-4 lg:py-6 pb-24 lg:pb-6">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007672]"></div>
                </div>
              ) : activeChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare size={28} className="text-gray-300" />
                  </div>
                  <h3 className="text-[17px] font-extrabold text-[#1B2B48] mb-2">
                    No Messages Yet
                  </h3>
                  <p className="text-[#465E87] text-[13px] font-medium leading-relaxed">
                    When you have an active booking, your chat will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeChats.map(chat => (
                    <ChatItem 
                      key={chat.id} 
                      chat={chat} 
                      isSelected={selectedChatId === chat.id}
                      onSelect={() => handleChatSelect(chat.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Pane: Chat Window (Desktop Only) */}
          <div className="hidden lg:flex flex-1 flex-col h-full bg-[#F8F9FA] relative">
            {selectedChatId ? (
              <ChatScreen embeddedChatId={selectedChatId} key={selectedChatId} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-[#F0F2F5]">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                  <MessageSquare size={40} className="text-[#007672]/30" />
                </div>
                <h2 className="text-[20px] font-extrabold text-[#1B2B48] mb-2">MyPet9 Messages</h2>
                <p className="text-[14px] font-medium text-[#465E87]">Select a conversation from the left to start chatting</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
};
