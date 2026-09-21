import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, doc, addDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Search, Send, User, MessageCircle } from 'lucide-react';

const formatRelativeTime = (date: Date) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const daysDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDifference === 0) {
    const hoursDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60));
    if (hoursDifference === 0) {
      const minutesDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60));
      return rtf.format(minutesDifference, 'minute');
    }
    return rtf.format(hoursDifference, 'hour');
  }
  return rtf.format(daysDifference, 'day');
};

export const AdminSupport = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chats list
  useEffect(() => {
    const q = query(collection(db, 'support_chats'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatsData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch active chat messages
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, 'support_chats', activeChatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

      // Clear admin unread count
      updateDoc(doc(db, 'support_chats', activeChatId), { unreadAdmin: 0 }).catch(() => {});
    });

    return () => unsubscribe();
  }, [activeChatId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;

    const chatDocRef = doc(db, 'support_chats', activeChatId);
    const messagesRef = collection(chatDocRef, 'messages');
    
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      await setDoc(chatDocRef, {
        lastMessage: messageText,
        updatedAt: serverTimestamp(),
        unreadUser: 1
      }, { merge: true });

      await addDoc(messagesRef, {
        text: messageText,
        senderId: 'admin',
        createdAt: serverTimestamp(),
        read: false
      });
    } catch (err) {
      console.error("Error sending admin message:", err);
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    chat.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="h-full flex flex-col lg:flex-row bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mx-4 lg:mx-8 mb-8 mt-4 lg:mt-8">
      
      {/* Sidebar: Chat List */}
      <div className={`w-full lg:w-[350px] flex-shrink-0 flex flex-col border-r border-gray-100 ${activeChatId ? 'hidden lg:flex' : 'flex'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#1B2B48] mb-4">Support Chats</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24] transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No conversations found.
            </div>
          ) : (
            filteredChats.map(chat => (
              <button 
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start space-x-3 ${activeChatId === chat.id ? 'bg-orange-50/50' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-[#1B2B48]/5 flex items-center justify-center shrink-0">
                  <User size={20} className="text-[#1B2B48]/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-sm text-[#1B2B48] truncate pr-2">{chat.userName || 'Unknown User'}</h3>
                    {chat.updatedAt && (
                      <span className="text-[10px] text-gray-400 shrink-0 capitalize">
                        {formatRelativeTime(chat.updatedAt.toDate())}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unreadAdmin > 0 && (
                  <div className="shrink-0 w-5 h-5 rounded-full bg-[#FBBF24] flex items-center justify-center text-[10px] font-bold text-[#1B2B48]">
                    {chat.unreadAdmin}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-[#F8F9FB] ${!activeChatId ? 'hidden lg:flex' : 'flex'}`}>
        {activeChatId && activeChat ? (
          <>
            {/* Active Chat Header */}
            <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                  onClick={() => setActiveChatId(null)}
                >
                  <Search size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-[#FBBF24]/20 flex items-center justify-center">
                  <User size={20} className="text-[#FBBF24]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1B2B48]">{activeChat.userName || 'Unknown User'}</h3>
                  <p className="text-xs text-gray-500">{activeChat.userEmail}</p>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
              <div className="text-center pb-4">
                <span className="text-[10px] bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-500 font-medium">
                  Support chat started
                </span>
              </div>

              {messages.map((msg) => {
                const isAdmin = msg.senderId === 'admin';
                return (
                  <div key={msg.id} className={`flex w-full ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] lg:max-w-[60%] rounded-2xl px-4 py-2.5 text-[14px] shadow-sm leading-relaxed ${
                      isAdmin 
                        ? 'bg-[#1B2B48] text-white rounded-tr-sm font-medium' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSend} className="flex items-center space-x-3 max-w-4xl mx-auto">
                <input 
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a reply to the user..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24] transition-all"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-[#FBBF24] text-[#1B2B48] p-3 rounded-full disabled:opacity-50 disabled:grayscale hover:bg-[#F59E0B] transition-colors shadow-sm"
                >
                  <Send size={20} className="ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageCircle size={48} className="mb-4 text-gray-200" />
            <p className="font-medium text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
      
    </div>
  );
};
