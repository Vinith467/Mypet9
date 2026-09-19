import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, Video, MoreVertical, Plus, Camera, Mic, Smile, Send, Paperclip } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const ChatScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  
  // Dummy messages
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I have started from the center.', sender: 'them', time: '09:00 AM' },
    { id: 2, text: 'Great, thanks for letting me know.', sender: 'me', time: '09:02 AM' },
    { id: 3, text: 'I should reach your location in about 10 minutes.', sender: 'them', time: '09:05 AM' },
    { id: 4, text: 'Perfect. I will bring Bruno down.', sender: 'me', time: '09:06 AM' },
    { id: 5, text: 'I am 5 mins away from your location.', sender: 'them', time: '09:12 AM' },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { 
        id: Date.now(), 
        text: message, 
        sender: 'me', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
      setMessage('');
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full h-[100dvh] lg:h-screen flex flex-col bg-[#F8F9FA]">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 flex items-center justify-between px-4 py-4 lg:py-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 mr-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-[#1B2B48]"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" 
                alt="Ravi" 
                className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-white shadow-sm"
              />
              <div className="absolute bottom-0 right-3 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-extrabold text-[#1B2B48]">Ravi</span>
              <span className="text-[13px] font-medium text-[#174F38]">Pet Care Executive</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#465E87] hover:bg-gray-50 transition-colors hidden sm:flex">
              <Video size={18} />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#465E87] hover:bg-gray-50 transition-colors">
              <Phone size={18} />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#465E87] hover:bg-gray-100 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="flex justify-center mb-8">
            <div className="bg-white px-4 py-1.5 rounded-full shadow-sm text-[12px] text-[#465E87] font-bold border border-gray-100">
              Today
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 max-w-3xl mx-auto w-full">
            {messages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] sm:max-w-[70%] rounded-[20px] px-5 py-3 shadow-sm relative group
                      ${isMe 
                        ? 'bg-[#174F38] text-white rounded-tr-sm' 
                        : 'bg-white text-[#1B2B48] border border-gray-100 rounded-tl-sm'
                      }
                    `}
                  >
                    <p className="text-[15px] leading-relaxed mb-1 pr-6 font-medium">{msg.text}</p>
                    <div className="flex justify-end items-center mt-1">
                      <span className={`text-[11px] font-medium ${isMe ? 'text-white/70' : 'text-[#465E87]/60'}`}>
                        {msg.time}
                      </span>
                      {isMe && (
                        <span className="ml-1.5 text-white">
                          <svg viewBox="0 0 18 18" width="16" height="16" className="fill-current opacity-90">
                            <path d="M17.394 5.035l-.57-.444a.434.434 0 00-.609.076l-6.39 8.198a.38.38 0 01-.577.039l-.427-.388a.381.381 0 00-.578.038l-.451.576a.497.497 0 00.043.645l1.575 1.51a.38.38 0 00.577-.039l7.483-9.602a.436.436 0 00-.076-.609zm-4.892 0l-.57-.444a.434.434 0 00-.609.076l-6.39 8.198a.38.38 0 01-.577.039l-2.614-2.556a.435.435 0 00-.614.007l-.505.516a.435.435 0 00.007.614l3.887 3.8a.38.38 0 00.577-.039l7.483-9.602a.435.435 0 00-.075-.609z"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-100 px-4 py-4 shrink-0 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <div className="max-w-3xl mx-auto flex items-end space-x-3">
            
            <button className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#465E87] hover:bg-gray-100 transition-colors flex-shrink-0">
              <Plus size={24} />
            </button>
            
            <div className="flex-1 bg-gray-50 rounded-[24px] min-h-[48px] flex items-end py-1.5 px-2 border border-gray-100 focus-within:border-[#174F38]/30 focus-within:bg-white focus-within:shadow-sm transition-all">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors hidden sm:block">
                <Smile size={22} />
              </button>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 max-h-[120px] bg-transparent resize-none outline-none px-3 py-2 text-[15px] text-[#1B2B48] placeholder-gray-400 font-medium"
                placeholder="Type your message..."
                rows={1}
              />
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                <Paperclip size={20} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors hidden sm:block">
                <Camera size={20} />
              </button>
            </div>

            {message.trim() ? (
              <button 
                onClick={handleSend}
                className="w-12 h-12 rounded-full bg-[#174F38] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#174F38]/90 transition-all shadow-[0_4px_12px_rgba(23,79,56,0.3)] hover:scale-105"
              >
                <Send size={20} className="ml-1" />
              </button>
            ) : (
              <button className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#174F38] flex-shrink-0 hover:bg-gray-100 transition-colors">
                <Mic size={22} />
              </button>
            )}
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
};
