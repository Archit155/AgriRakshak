import { useState, useRef, useEffect } from 'react';
import { Mic, X, Loader2, PlayCircle, StopCircle, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Auto-stop when user pauses
      recognitionRef.current.interimResults = true;
    }
    
    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Update recognition language dynamically
  useEffect(() => {
    if (recognitionRef.current) {
      const langMap = {
        en: 'en-IN',
        hi: 'hi-IN',
        mr: 'mr-IN'
      };
      recognitionRef.current.lang = langMap[language] || 'en-IN';
    }
  }, [language]);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    // INTERRUPTION LOGIC: 
    // 1. Immediately kill any ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // 2. Clear any pending AI thinking timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setTranscript('');
    setAiResponse('');
    setIsProcessing(false);
    setIsListening(true);
    
    recognitionRef.current.start();

    // Final transcript buffer to ensure we catch the very last words
    let transcriptBuffer = '';

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcriptBuffer += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(transcriptBuffer + interimTranscript);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      // Auto-trigger the response as soon as speech ends
      const textToProcess = transcriptBuffer.trim();
      if (textToProcess.length > 0) {
        simulateRetellCall(textToProcess);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setIsProcessing(false);
    };
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Simulate call to Retell AI Agent
  const simulateRetellCall = (userText) => {
    setIsProcessing(true);
    setAiResponse(''); // Clear old response for real-time feel
    
    // Clear any previous timeout just in case
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // ---------------------------------------------------------
    // RETELL AI CONFIGURATION (Active IDs)
    // Agent ID: agent_c645b41efc5e49cddf3cc089c9
    // LLM ID:   llm_6d57f6823fe0e64a0e66f8f1c131
    // ---------------------------------------------------------

    timeoutRef.current = setTimeout(() => {
      let mockReply = '';
      const textLower = userText.toLowerCase();

      // Dynamic Response Generator with increased intelligence
      const getResponse = (lang) => {
        const variants = {
          en: {
            insurance: [
              "The Pradhan Mantri Fasal Bima Yojana (PMFBY) is designed to protect you from crop loss due to weather. You can find it in the Insurance category.",
              "If you are worried about your harvest, the Government's Crop Insurance scheme offers low premium rates for small farmers.",
              "I recommend looking at PMFBY. It provides comprehensive coverage from sowing to post-harvest."
            ],
            money: [
              "Under the PM-KISAN Samman Nidhi, you are eligible for ₹6,000 every year as direct support to your bank account.",
              "For immediate financial help, the Kisan Credit Card (KCC) provides low-interest loans for your seeds and fertilizers.",
              "There are several subsidy and loan options available. The PM-KISAN scheme is the most popular for direct income support."
            ],
            soil: [
              "A Soil Health Card tells you exactly how much fertilizer your crops need, which saves you money and improves yield.",
              "The Soil Health Scheme is very helpful for sustainable farming. It provides a detailed report on your land's health.",
              "I suggest checking the Soil Health section to learn about optimizing your nutrients."
            ],
            greeting: [
              "Namaste! I am your Smart Krishi assistant. I can help you with information on insurance, loans, and subsidies. What can I do for you?",
              "Welcome! How is your crop doing today? I can help you find government support for your farm.",
              "Hello! If you're looking for help with farming schemes, just ask me about insurance, PM-KISAN, or soil testing."
            ],
            fallback: [
              "I'm here to help with your farming needs. Could you tell me more? For example, are you looking for 'insurance' or 'financial support'?",
              "I didn't quite catch that specific detail, but I can assist with PM-KISAN, PMFBY, and Soil Health. Which one interests you?",
              "I'm a growing AI assistant. Could you try asking about 'crop health', 'loans', or 'subsidies'?"
            ]
          },
          hi: {
            insurance: [
              "प्रधानमंत्री फसल बीमा योजना (PMFBY) प्राकृतिक आपदाओं से आपके नुकसान की भरपाई के लिए सबसे बढ़िया योजना है।",
              "अपनी फसल की सुरक्षा के लिए, मैं आपको 'बीमा' श्रेणी में जाकर प्रधानमंत्री फसल बीमा योजना देखने की सलाह देता हूँ।",
              "सरकार की बीमा योजना PMFBY बुवाई से लेकर कटाई तक का जोखिम कवर करती है। इसका लाभ ज़रूर उठाएं।"
            ],
            money: [
              "प्रधानमंत्री किसान सम्मान निधि (PM-KISAN) के तहत आपको हर साल ₹6,000 की सरकारी मदद सीधे बैंक खाते में मिलती है।",
              "खेती के खर्चों के लिए आप 'किसान क्रेडिट कार्ड' (KCC) के ज़रिए बहुत कम ब्याज पर लोन ले सकते हैं।",
              "अगर आप आर्थिक मदद ढूंढ रहे हैं, तो PM-KISAN योजना सबसे अच्छी है। इसमें सालाना ₹6,000 की सहायता दी जाती है।"
            ],
            soil: [
              "मृदा स्वास्थ्य कार्ड (Soil Health Card) से आपको पता चलेगा कि आपकी ज़मीन के लिए कितनी खाद सही है। इससे आपकी बचत भी होगी और पैदावार भी बढ़ेगी।",
              "मिट्टी की जाँच के लिए सरकार की मृदा स्वास्थ्य योजना बहुत उपयोगी है। इससे आप अपनी ज़मीन की उर्वरता बढ़ा सकते हैं।",
              "अपनी ज़मीन की सेहत सुधारने के लिए मृदा स्वास्थ्य कार्ड ज़रूर बनवाएं। यह आपको सही खाद के उपयोग की जानकारी देता है।"
            ],
            greeting: [
              "नमस्ते! मैं आपका स्मार्ट कृषि सहायक हूँ। मैं आपको सरकारी योजनाओं, लोन और बीमा के बारे में जानकारी दे सकता हूँ। मैं आपकी क्या मदद करूँ?",
              "प्रणाम! आपकी फसल कैसी है? मैं आपको खेती के लिए सरकारी सहायता और सब्सिडी खोजने में मदद कर सकता हूँ।",
              "राम राम! अगर आप सरकारी योजनाओं के बारे में जानना चाहते हैं, तो मुझसे बीमा, पीएम-किसान या मिट्टी की जाँच के बारे में पूछें।"
            ],
            fallback: [
              "मैं आपकी खेती से जुड़ी ज़रूरतों में मदद के लिए यहाँ हूँ। क्या आप 'बीमा' या 'आर्थिक सहायता' के बारे में जानना चाहते हैं?",
              "क्षमा करें, मैं इसे पूरी तरह समझ नहीं पाया। पर मैं आपको पीएम-किसान, बीमा और मिट्टी की जाँच में मदद कर सकता हूँ। आप क्या जानना चाहेंगे?",
              "मैं अभी सीख रहा हूँ। क्या आप 'फसल बीमा', 'लोन' या 'सब्सिडी' के बारे में कुछ पूछना चाहेंगे?"
            ]
          },
          mr: {
             insurance: [
              "नैसर्गिक आपत्तींपासून तुमच्या पिकाच्या संरक्षणासाठी प्रधानमंत्री पीक विमा योजना (PMFBY) सर्वोत्तम आहे.",
              "पीक नुकसानीच्या कव्हरसाठी, आपण 'विमा' श्रेणी तपासावी अशी मी शिफारस करतो.",
              "सरकारचे विमा धोरण, PMFBY, पेरणीपासून काढणीपर्यंतचा जोखीम कव्हर करते."
            ],
            money: [
              "PM-KISAN योजना तुमच्या शेतीची गरज पूर्ण करण्यासाठी वर्षाला ₹6,000 थेट तुमच्या बँक खात्यात जमा करते.",
              "खेतीसाठी पैशांची गरज असल्यास, किसान क्रेडिट कार्ड (KCC) द्वारे कमी व्याजात कर्ज मिळू शकते.",
              "आर्थिक मदतीसाठी PM-KISAN सन्मान निधी ही एक अत्यंत महत्त्वाची योजना आहे."
            ],
            soil: [
              "मृदा आरोग्य कार्ड योजना तुम्हाला तुमच्या जमिनीला कोणत्या खताची गरज आहे हे अचूकपणे सांगते, ज्यामुळे खर्च कमी होतो.",
              "जमिनीचा कस वाढवण्यासाठी मृदा आरोग्य योजना खूप उपयुक्त आहे. यामुळे तुमचे उत्पादन वाढण्यास मदत होईल.",
              "तुमच्या जमिनीच्या आरोग्याबद्दल माहिती घेण्यासाठी मृदा आरोग्य कार्ड नक्की बनवा."
            ],
            greeting: [
              "नमस्कार! मी तुमचा कृषी AI सहाय्यक आहे. मी तुम्हाला विमा, कर्ज आणि अनुदानाबद्दल माहिती देऊ शकतो. मी तुमची काय मदत करू शकतो?",
              "राम राम! तुमची पिके कशी आहेत? मी तुम्हाला शेतीसाठी सरकारी मदत शोधण्यात मदत करू शकतो.",
              "स्वागत आहे! तुम्हाला कोणत्या योजनेबद्दल माहिती हवी आहे? विमा, पीएम-किसान की मृदा आरोग्य?"
            ],
            fallback: [
              "मी आपल्याला मदत करण्यासाठी येथे आहे. आपल्याला पिकाचा 'विमा' हवा आहे की 'आर्थिक मदत'?",
              "मला ते नीट समजले नाही. पण मी आपल्याला पीक विमा आणि कर्जाबद्दल सांगू शकतो. आपल्याला कशाबद्दल जाणून घ्यायचे आहे?",
              "मी हळूहळू शिकत आहे. कृपया 'विमा', 'कर्ज' किंवा 'अनुदान' याबद्दल काही विचारू शकाल का?"
            ]
          }
        };

        const l = variants[lang] || variants.en;
        
        // Clean transcript and match keywords more robustly
        const inputRaw = userText.trim();
        
        // GREETING MATCH (Better pattern matching)
        if (/(hello|hi|hey|namaste|pranam|ram ram|namaskar|नमस्ते|नमस्कार|प्रणाम|राम राम|स्वागत|हाय|हॅलो)/i.test(inputRaw)) {
          return l.greeting;
        }

        if (textLower.includes('insurance') || textLower.includes('बीमा') || textLower.includes('विमा') || textLower.includes('pmfby')) return l.insurance;
        if (textLower.includes('money') || textLower.includes('पैसा') || textLower.includes('kisan') || textLower.includes('loan') || textLower.includes('कर्ज') || textLower.includes('हप्ता')) return l.money;
        if (textLower.includes('soil') || textLower.includes('मिट्टी') || textLower.includes('fertilizer') || textLower.includes('खाद') || textLower.includes('माती') || textLower.includes('खत') || textLower.includes('हेल्थ')) return l.soil;
        
        return l.fallback;
      };

      const possibleReplies = getResponse(language);
      mockReply = possibleReplies[Math.floor(Math.random() * possibleReplies.length)];

      setAiResponse(mockReply);
      setIsProcessing(false);
      speakResponse(mockReply);

    }, 800); 
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      
      const langMap = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };
      utterance.lang = langMap[language] || 'en-IN';
      
      // Optional: adjust rate and pitch to sound more authoritative but friendly
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClose = () => {
    if (isListening) stopListening();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
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
            className="fixed bottom-24 right-4 sm:right-6 bg-white rounded-2xl shadow-2xl p-0 w-[340px] border border-gray-200 z-50 overflow-hidden flex flex-col"
          >
            <div className="bg-gov-primary px-4 py-3 flex justify-between items-center text-white">
              <h3 className="font-semibold flex items-center gap-2">
                <Bot className="w-5 h-5 text-green-200" />
                {t('voiceAssistantTitle')}
              </h3>
              <button onClick={handleClose} className="text-white/80 hover:bg-white/20 p-1.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex-1 min-h-[220px] flex flex-col">
              
              {/* Transcript Area */}
              <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4 overflow-y-auto max-h-[140px]">
                {!transcript && !aiResponse && !isProcessing && (
                  <div className="text-center text-gray-400 h-full flex flex-col items-center justify-center space-y-2">
                    <Mic className="w-8 h-8 opacity-50" />
                    <p className="text-sm">{t('tapToSpeak')}...</p>
                  </div>
                )}
                
                {transcript && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 font-medium mb-1">You:</p>
                    <p className="text-gray-800 text-lg leading-snug">{transcript}</p>
                  </div>
                )}
                
                {isProcessing && (
                  <div className="flex items-center gap-2 text-gov-primary mt-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p className="text-sm font-medium">{t('processing')}</p>
                  </div>
                )}

                {aiResponse && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <p className="text-sm text-gov-secondary font-bold mb-1">{t('aiResponse')}:</p>
                    <p className="text-gray-800 text-base">{aiResponse}</p>
                  </motion.div>
                )}
              </div>

              {/* Controls Area */}
              <div className="flex justify-center items-center mt-auto">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`
                    relative flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg transition-all duration-300
                    ${isListening ? 'bg-red-500 hover:bg-red-600 scale-110' : 'bg-gov-primary hover:bg-gov-primary-dark'}
                  `}
                >
                  {isListening && (
                    <span className="absolute w-full h-full rounded-full bg-red-400 animate-ping opacity-75"></span>
                  )}
                  {isListening ? <StopCircle className="w-8 h-8 relative z-10" /> : <Mic className="w-8 h-8 relative z-10" />}
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3 font-medium uppercase tracking-wider">
                {isListening ? t('listening') : 'Retell Agent ID: c645...'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gov-primary text-white p-[18px] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:bg-gov-primary-dark transition-all hover:scale-105 z-50 flex items-center justify-center"
        aria-label={t('voiceAssistantTitle')}
      >
        <Mic className="w-6 h-6" />
      </button>
    </>
  );
}
