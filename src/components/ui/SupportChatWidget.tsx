import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, PawPrint, ChevronLeft, Minus } from 'lucide-react';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  collection, doc, setDoc, addDoc, onSnapshot, 
  query, orderBy, serverTimestamp, updateDoc
} from 'firebase/firestore';

import { useLocation } from 'react-router-dom';

export const SupportChatWidget = () => {
  const { user, userData } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !isOpen) return;

    const chatDocRef = doc(db, 'support_chats', user.uid);
    const messagesRef = collection(chatDocRef, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

      // If user is reading, clear unreadUser count
      updateDoc(chatDocRef, { unreadUser: 0 }).catch(() => {});
    });

    return () => unsubscribe();
  }, [user, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const chatDocRef = doc(db, 'support_chats', user.uid);
    const messagesRef = collection(chatDocRef, 'messages');
    
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      // Upsert the main chat document
      await setDoc(chatDocRef, {
        userId: user.uid,
        userName: userData?.name || user.displayName || 'User',
        userEmail: user.email,
        lastMessage: messageText,
        updatedAt: serverTimestamp(),
        unreadAdmin: 1
      }, { merge: true });

      // Add the message
      await addDoc(messagesRef, {
        text: messageText,
        senderId: user.uid,
        createdAt: serverTimestamp(),
        read: false
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!user || userData?.type === 'admin') return null; // Admins have their own interface
  
  // Hide on caretaker booking details page so it doesn't overlap with the chat interface
  if (location.pathname.includes('/caretaker/bookings/')) return null;

  return (
    <>
      <AnimatePresence>
        {!isOpen && !isMinimized && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-24 lg:bottom-6 right-6 z-50 flex items-start"
          >
            <div className="relative">
              <button
                onClick={() => setIsOpen(true)}
                className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1B2B48] p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(251,191,36,0.3)] transition-all duration-300 block"
              >
                <MessageCircle size={28} className="drop-shadow-sm" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                className="absolute -top-1 -right-1 bg-[#1B2B48] text-white rounded-full p-1 shadow-md hover:bg-black transition-colors"
                title="Minimize Chat"
              >
                <Minus size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && isMinimized && (
          <motion.button
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-24 lg:bottom-6 right-0 z-50 bg-[#FBBF24] text-[#1B2B48] py-3 pl-2 pr-1 rounded-l-xl shadow-lg border border-r-0 border-yellow-500/30 hover:bg-[#F59E0B] transition-colors flex items-center"
            title="Restore Chat"
          >
            <ChevronLeft size={20} className="-ml-1" />
            <MessageCircle size={16} className="ml-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 lg:bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#1B2B48] p-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="bg-white/10 p-2 rounded-full">
                  <PawPrint size={20} className="text-[#FBBF24]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">MyPet9 Support</h3>
                  <p className="text-[10px] text-white/70">Typically replies in a few minutes</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#F8F9FA] space-y-3">
              <div className="text-center pb-4">
                <span className="text-[10px] bg-white border border-gray-100 px-3 py-1 rounded-full text-gray-500 font-medium shadow-sm">
                  Welcome to MyPet9 Support
                </span>
              </div>
              
              {messages.map((msg) => {
                const isMine = msg.senderId === user.uid;
                return (
                  <div key={msg.id} className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] shadow-sm leading-relaxed ${
                      isMine 
                        ? 'bg-[#FBBF24] text-[#1B2B48] rounded-tr-sm font-medium' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#FBBF24] focus:bg-white focus:ring-1 focus:ring-[#FBBF24] transition-all"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-[#1B2B48] text-[#FBBF24] p-2.5 rounded-full disabled:opacity-50 disabled:text-white/50 hover:bg-[#2A4065] transition-colors shadow-sm"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
