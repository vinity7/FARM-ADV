import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Image as ImageIcon, User, Bot, Loader2, History, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import api, { getScans, saveScan } from '../lib/api';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  image?: string;
  timestamp: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user] = useState<any>(JSON.parse(localStorage.getItem('user') || '{}'));
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [scans, setScans] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat history from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const storageKey = storedUser.id ? `chat_history_${storedUser.id}` : 'chat_history';
    const history = localStorage.getItem(storageKey);
    
    if (history) {
      setMessages(JSON.parse(history).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    } else {
      // Initial welcome message
      const userLang = storedUser.language || 'english';
      const welcomeText = userLang === 'hindi' 
        ? `नमस्ते ${storedUser.name || 'किसान'}! मैं Farm-Ed AI हूँ, आपका कृषि सलाहकार। आप ${storedUser.district || 'भारत'}, ${storedUser.state || ''} से हैं। मैं आपकी कैसे मदद कर सकता हूँ?`
        : `Hello ${storedUser.name || 'Farmer'}! I am Farm-Ed AI, your agricultural advisor from ${storedUser.district || 'India'}, ${storedUser.state || ''}. How can I assist you today?`;
        
      setMessages([
        {
          id: '1',
          sender: 'ai',
          text: welcomeText,
          timestamp: new Date(),
        },
      ]);
    }
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const { data } = await getScans();
      setScans(data);
    } catch (err) {
      console.error('Failed to fetch scans');
    }
  };

  useEffect(() => {
    // Save to localStorage
    if (messages.length > 0) {
      const storageKey = user.id ? `chat_history_${user.id}` : 'chat_history';
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, user.id]);

  // Dropzone setup for images
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSendMessage('', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    noClick: true,
  });

  const handleSendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      image: image,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append('question', text || 'Analyze this image');
      formData.append('district', user.district || 'Maharashtra');
      
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append('image', blob, 'upload.jpg');
      }

      const { data } = await api.post('/query', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.advice,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // If there was an image, save it as a scan
      if (image) {
        await saveScan({
          imageUrl: image,
          diagnosis: data.advice.split('.')[0] || 'Analysis complete',
          recommendation: data.advice.substring(0, 100) + '...',
          status: 'detected'
        });
        fetchScans();
      }
    } catch (error: any) {
      toast.error('AI assistant is currently unavailable.');
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  // Add api import
  // (I'll need to add the import at the top)

  // Mock Voice Input (Web Speech API Wrapper)
  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success('Listening... [Speak in Malayalam/English]');
      // In real implementation: Setup SpeechRecognition and append transcript to input
      setTimeout(() => {
        setInput('ऊस शेतीसाठी कोणते खत वापरावे?'); // Mock Marathi input
        setIsListening(false);
        toast.success('Speech captured!');
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden" {...getRootProps()}>
      <input {...getInputProps()} />
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex-1">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">AI Farm Advisor</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Online | Supports Voice & Image</p>
        </div>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className={`p-2 rounded-xl transition-colors ${showHistory ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          title="Recent Scans"
        >
          <History size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* History Sidebar (Desktop) */}
        {showHistory && (
          <div className="w-64 border-r border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 overflow-y-auto hidden md:block">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Scans</h3>
              <AlertCircle size={14} className="text-slate-300" />
            </div>
            <div className="p-2 space-y-2">
              {scans.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">No scans yet. Upload a photo to start!</div>
              ) : (
                scans.map((scan) => (
                  <div key={scan._id} className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all cursor-pointer group">
                    <img src={scan.imageUrl} className="w-full h-24 object-cover rounded-lg mb-2" alt="Scan" />
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">{scan.diagnosis}</div>
                    <div className="text-[9px] text-slate-400 mt-1">{new Date(scan.createdAt).toLocaleDateString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl ${msg.sender === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}>
                {msg.image && (
                  <img src={msg.image} alt="Upload" className="max-w-xs rounded-lg mb-2 border border-white/20 shadow-sm" />
                )}
                {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                <span className={`text-[10px] mt-1 block ${msg.sender === 'user' ? 'text-green-100' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2 items-center text-slate-400 text-sm">
              <Loader2 size={16} className="animate-spin text-primary" />
              <span>AI is analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={open}
            className="p-2 text-slate-500 hover:text-primary dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ImageIcon size={20} />
          </button>
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-full transition-colors ${isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-slate-500 hover:text-primary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
          >
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={user.language === 'hindi' ? "एआई से पूछें या लक्षणों की जांच करें..." : "Ask AI or check symptoms..."}
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl outline-none text-sm text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="p-2 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

