import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Plus, Camera, Mic, Smile, Send, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db, storage } from '../../config/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const ChatScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // bookingId
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!id) return;
    
    // Fetch booking details for header
    const fetchBooking = async () => {
      const bookingDoc = await getDoc(doc(db, 'bookings', id));
      if (bookingDoc.exists()) {
        setBookingDetails(bookingDoc.data());
      }
    };
    fetchBooking();

    // Listen to messages
    const q = query(
      collection(db, 'bookings', id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);

      // Mark unread messages from the other user as read
      if (user?.uid) {
        snapshot.docs.forEach(docSnap => {
          const data = docSnap.data();
          if (data.senderId !== user.uid && !data.read) {
            updateDoc(doc(db, 'bookings', id, 'messages', docSnap.id), {
              read: true
            }).catch(console.error);
          }
        });
      }
    });

    return () => unsubscribe();
  }, [id, user]);

  const handleSendText = async () => {
    if (message.trim() && user && id) {
      const textToSend = message.trim();
      setMessage(''); // Clear immediately for UX
      
      try {
        await addDoc(collection(db, 'bookings', id, 'messages'), {
          text: textToSend,
          type: 'text',
          senderId: user.uid,
          createdAt: serverTimestamp(),
          read: false
        });
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  const handleFileUpload = async (file: File | Blob, type: 'image' | 'video' | 'audio') => {
    if (!user || !id) return;
    setUploading(true);

    const fileExt = type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'webm';
    const fileName = `chats/${id}/${Date.now()}_${user.uid}.${fileExt}`;
    const storageRef = ref(storage, fileName);

    try {
      const uploadTask = await uploadBytesResumable(storageRef, file as any);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      await addDoc(collection(db, 'bookings', id, 'messages'), {
        text: type === 'audio' ? 'Voice Message' : type === 'video' ? 'Video' : 'Image',
        type: type,
        mediaUrl: downloadURL,
        senderId: user.uid,
        createdAt: serverTimestamp(),
        read: false
      });
    } catch (error) {
      console.error("Error uploading file: ", error);
      alert("Failed to send media. Please check if Firebase Storage is enabled and rules allow writes.");
    } finally {
      setUploading(false);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      handleFileUpload(file, isVideo ? 'video' : 'image');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          await handleFileUpload(audioBlob, 'audio');
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing mic: ", err);
        alert("Could not access microphone.");
      }
    }
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const caretakerName = bookingDetails?.caretakerName || 'Caretaker';
  const caretakerImage = bookingDetails?.caretakerImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(caretakerName)}&background=E5E7EB&color=1B2B48`;

  return (
    <>
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
                src={caretakerImage} 
                alt={caretakerName} 
                className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-white shadow-sm"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(caretakerName)}&background=E5E7EB&color=1B2B48`;
                }}
              />
              <div className="absolute bottom-0 right-3 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-extrabold text-[#1B2B48]">{caretakerName}</span>
              <span className="text-[13px] font-medium text-[#174F38]">Pet Care Executive</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
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
            {messages.length === 0 ? (
              <p className="text-center text-sm text-gray-400 mt-4">No messages yet. Send a message to start the conversation!</p>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.uid;
                const hasMedia = !!msg.mediaUrl;

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
                      {hasMedia ? (
                        msg.type === 'audio' ? (
                          <audio src={msg.mediaUrl} controls className="max-w-[220px] h-10 mt-1 mb-2" />
                        ) : msg.type === 'video' ? (
                          <video src={msg.mediaUrl} controls className="max-w-[220px] rounded-lg mt-1 mb-2" />
                        ) : (
                          <img src={msg.mediaUrl} alt="Media" className="max-w-[220px] rounded-lg mt-1 mb-2 object-cover cursor-pointer" onClick={() => window.open(msg.mediaUrl, '_blank')} />
                        )
                      ) : (
                        <p className="text-[15px] leading-relaxed mb-1 pr-6 font-medium whitespace-pre-wrap break-words">{msg.text}</p>
                      )}
                      
                      <div className="flex justify-end items-center mt-1">
                        <span className={`text-[11px] font-medium ${isMe ? 'text-white/70' : 'text-[#465E87]/60'}`}>
                          {formatMessageTime(msg.createdAt)}
                        </span>
                        {isMe && (
                          <span className="ml-1.5 text-white">
                            <svg viewBox="0 0 18 18" width="16" height="16" className={`fill-current opacity-90 ${msg.read ? 'text-[#3B82F6]' : 'text-white'}`}>
                              <path d="M17.394 5.035l-.57-.444a.434.434 0 00-.609.076l-6.39 8.198a.38.38 0 01-.577.039l-.427-.388a.381.381 0 00-.578.038l-.451.576a.497.497 0 00.043.645l1.575 1.51a.38.38 0 00.577-.039l7.483-9.602a.436.436 0 00-.076-.609zm-4.892 0l-.57-.444a.434.434 0 00-.609.076l-6.39 8.198a.38.38 0 01-.577.039l-2.614-2.556a.435.435 0 00-.614.007l-.505.516a.435.435 0 00.007.614l3.887 3.8a.38.38 0 00.577-.039l7.483-9.602a.435.435 0 00-.075-.609z"></path>
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {uploading && (
              <div className="flex justify-end">
                <div className="bg-[#174F38] text-white rounded-[20px] rounded-tr-sm px-5 py-3 shadow-sm flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span className="text-[13px] font-medium">Sending...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-100 px-4 py-4 shrink-0 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <div className="max-w-3xl mx-auto flex items-end space-x-3">
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,video/*"
              onChange={onFileSelect}
            />

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#465E87] hover:bg-gray-100 transition-colors flex-shrink-0" 
              title="Add attachment"
            >
              <Plus size={24} />
            </button>
            
            <div className={`flex-1 bg-gray-50 rounded-[24px] min-h-[48px] flex items-end py-1.5 px-2 border transition-all ${isRecording ? 'border-red-300 bg-red-50' : 'border-gray-100 focus-within:border-[#174F38]/30 focus-within:bg-white focus-within:shadow-sm'}`}>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors hidden sm:block">
                <Smile size={22} />
              </button>
              
              {isRecording ? (
                <div className="flex-1 flex items-center justify-center px-3 py-2 text-red-500 font-bold animate-pulse">
                  Recording Audio... (Click X to Send)
                </div>
              ) : (
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendText();
                    }
                  }}
                  className="flex-1 max-h-[120px] bg-transparent resize-none outline-none px-3 py-2 text-[15px] text-[#1B2B48] placeholder-gray-400 font-medium"
                  placeholder="Type your message..."
                  rows={1}
                />
              )}
              
              {!isRecording && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors" 
                  title="Send image"
                >
                  <Camera size={20} />
                </button>
              )}
            </div>

            {message.trim() && !isRecording ? (
              <button 
                onClick={handleSendText}
                className="w-12 h-12 rounded-full bg-[#174F38] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#174F38]/90 transition-all shadow-[0_4px_12px_rgba(23,79,56,0.3)] hover:scale-105"
              >
                <Send size={20} className="ml-1" />
              </button>
            ) : (
              <button 
                onClick={toggleRecording}
                className={`w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                  isRecording 
                  ? 'bg-red-500 border-red-600 text-white animate-bounce' 
                  : 'bg-gray-50 border-gray-100 text-[#174F38] hover:bg-gray-100'
                }`}
              >
                {isRecording ? <X size={22} /> : <Mic size={22} />}
              </button>
            )}
          </div>
        </div>
        
      </div>
    </>
  );
};
