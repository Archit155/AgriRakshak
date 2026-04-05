import { useState, useRef, useEffect } from 'react';
import { Mic, X, Loader2, PlayCircle, StopCircle, Bot, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { RetellWebClient } from 'retell-client-js-sdk';
import axios from 'axios';

// Initialize the Retell Client outside the component to persist session
const retellClient = new RetellWebClient();
const BACKEND_URL = 'http://localhost:5000';

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // These are kept for UI slots even if real-time audio is primary
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  // Handle SDK events
  useEffect(() => {
    retellClient.on('call_started', () => {
      console.log('Voice call started');
      setIsListening(true);
      setIsProcessing(false);
      setError(null);
    });

    retellClient.on('call_ended', () => {
      console.log('Voice call ended');
      setIsListening(false);
      setIsProcessing(false);
    });

    retellClient.on('error', (err) => {
      console.error('Retell error:', err);
      setError('Connection error. Please try again.');
      setIsListening(false);
      setIsProcessing(false);
    });

    // Clean up
    return () => {
      // In a real app, you might want to stop the call here if it's running
      // retellClient.stopCall();
    };
  }, []);

  const startCall = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // SECURITY REQUIREMENT: Our system trusts nothing by default.
      // We fetch a secure single-use token from our backend.
      const response = await axios.post(`${BACKEND_URL}/api/voice/web-call`, {
        agent_id: 'agent_c645b41efc5e49cddf3cc089c9'
      });

      if (response.data && response.data.access_token) {
        await retellClient.startCall({
          accessToken: response.data.access_token,
        });
      } else {
        throw new Error('Failed to get access token');
      }
    } catch (err) {
      console.error('Start call error:', err);
      setError('Unable to reach the voice server.');
      setIsProcessing(false);
    }
  };

  const stopCall = async () => {
    try {
      await retellClient.stopCall();
      setIsListening(false);
    } catch (err) {
      console.error('Stop call error:', err);
    }
  };

  const handleClose = () => {
    if (isListening) stopCall();
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-4 sm:right-6 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-0 w-[340px] border border-gray-100 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gov-primary px-5 py-4 flex justify-between items-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
              <h3 className="font-bold flex items-center gap-3 relative z-10">
                <div className={`p-1.5 rounded-lg ${isListening ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                {t('voiceAssistantTitle')}
              </h3>
              <button onClick={handleClose} className="text-white/80 hover:bg-white/20 p-2 rounded-full transition-all relative z-10">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1 min-h-[260px] flex flex-col bg-slate-50/50">
              
              {/* Interaction Status Area */}
              <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                
                {/* Real-time Visualization Mock */}
                {isListening && (
                  <div className="absolute bottom-0 left-0 w-full h-1 flex gap-1 px-1">
                    {[1,2,3,4,5,6,1,2,3,4].map((i, idx) => (
                      <motion.div 
                        key={idx}
                        animate={{ height: [4, Math.random() * 20 + 10, 4] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: idx * 0.05 }}
                        className="flex-1 bg-gov-primary/30 rounded-t-full"
                      />
                    ))}
                  </div>
                )}

                {!isListening && !isProcessing && !error && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gov-primary/5 rounded-full flex items-center justify-center mx-auto mb-2">
                       <Mic className="w-8 h-8 text-gov-primary opacity-40" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">{t('tapToSpeak')}</p>
                      <p className="text-xs text-gray-500 mt-1 max-w-[180px] mx-auto">Ask me about insurance, loans, or crop health.</p>
                    </div>
                  </div>
                )}
                
                {isProcessing && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <Loader2 className="w-10 h-10 text-gov-primary animate-spin" />
                      <div className="absolute inset-0 bg-gov-primary/10 rounded-full blur-xl animate-pulse"></div>
                    </div>
                    <p className="text-sm font-semibold text-gov-primary">{t('processing')}...</p>
                  </div>
                )}

                {isListening && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gov-primary/10 animate-ping absolute inset-0"></div>
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-gov-primary/30 animate-spin-slow absolute inset-0"></div>
                      <div className="w-20 h-20 rounded-full bg-white shadow-inner flex items-center justify-center relative">
                         <Bot className="w-10 h-10 text-gov-primary" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gov-primary font-bold animate-pulse uppercase tracking-widest text-xs">AI Agent Active</p>
                      <p className="text-sm text-gray-600 mt-1">Speaking with Krishi Sahayak...</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex flex-col items-center gap-2 text-red-500">
                    <AlertCircle className="w-10 h-10" />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={startCall} className="text-xs underline mt-2 text-red-600 font-bold uppercase">Try Again</button>
                  </div>
                )}
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mb-4 px-3 py-1 bg-gray-100 rounded-lg self-center">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                 <p className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">SECURE VOICE CHANNEL ENCRYPTED</p>
              </div>

              {/* Control Center */}
              <div className="flex justify-center items-center relative py-2">
                <button
                  onClick={isListening ? stopCall : startCall}
                  disabled={isProcessing}
                  className={`
                    relative group flex items-center justify-center w-20 h-20 rounded-full text-white shadow-xl transition-all duration-500 transform
                    ${isListening 
                      ? 'bg-red-500 hover:bg-red-600 scale-110 active:scale-100' 
                      : 'bg-gradient-to-br from-gov-primary to-gov-primary-dark hover:shadow-gov-primary/40'
                    }
                    ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
                  `}
                >
                  {isListening && (
                    <div className="absolute inset-0 rounded-full bg-red-400 group-hover:animate-ping opacity-30"></div>
                  )}
                  {isListening ? <StopCircle className="w-9 h-9 relative z-10" /> : <Mic className="w-9 h-9 relative z-10" />}
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Our system trusts nothing by default</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 p-5 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-110 z-50 flex items-center justify-center overflow-hidden
          ${isOpen ? 'bg-white text-gov-primary border-2 border-gov-primary' : 'bg-gov-primary text-white border-0'}
        `}
        aria-label={t('voiceAssistantTitle')}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
             <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
               <X className="w-6 h-6" />
             </motion.div>
          ) : (
            <motion.div key="mic" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="relative">
               <Mic className="w-7 h-7" />
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 bg-white/20 rounded-full blur-md"
               />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
