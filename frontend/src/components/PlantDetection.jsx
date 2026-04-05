import { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, Sun, Target, Maximize, ShieldCheck, Bot, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

export default function PlantDetection() {
  const { t } = useLanguage();
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError(t('selectImageFirst'));
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data;
      
      setResult({
        disease: data.prediction,
        cause: "Analysis based on plant leaf visual indicators.",
        solution: data.guidance,
        confidence: data.confidence,
        intelligence: data.model_intelligence
      });
    } catch (err) {
      console.error("Inference Error:", err);
      setError("Analysis system encountered an issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 mt-12 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SparkleIcon className="w-6 h-6 text-gov-primary" />
          {t('checkCropHealth')}
        </h2>
        
        {/* Upload Tips Header */}
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full shrink-0">
            <Sun className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-700">{t('tipLighting')}</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full shrink-0">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-purple-700">{t('tipFocus')}</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full shrink-0">
            <Maximize className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-bold text-orange-700">{t('tipDistance')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Upload & Tips Area */}
        <div className="space-y-6">
          <motion.label 
            whileHover={{ scale: 0.99 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 hover:border-gov-primary transition-all overflow-hidden"
          >
            {image ? (
              <>
                <img src={image} alt="Crop preview" className="h-full object-cover w-full" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <p className="text-white font-bold">Change Image</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-gov-primary" />
                </div>
                <p className="text-gray-700 font-bold mb-1">{t('uploadImage')}</p>
                <p className="text-xs text-gray-400">{t('fileFormatInfo')}</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </motion.label>

          {/* Quick Tips Tooltip */}
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
            <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {t('uploadTipsTitle')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">{t('tipLighting')}</p>
                <p className="text-[11px] text-blue-600/80 leading-relaxed">{t('tipLightingDesc')}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">{t('tipFocus')}</p>
                <p className="text-[11px] text-blue-600/80 leading-relaxed">{t('tipFocusDesc')}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">{t('tipDistance')}</p>
                <p className="text-[11px] text-blue-600/80 leading-relaxed">{t('tipDistanceDesc')}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={loading || !image}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${loading || !image ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-gov-primary hover:bg-gov-primary-dark hover:shadow-gov-primary/30'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('analyzing')}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                {t('analyze')}
              </span>
            )}
          </button>
        </div>

        {/* Result Area */}
        <div className="relative">
          {!result ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50/30 border-2 border-dashed border-gray-100 rounded-3xl p-8 text-center">
              <Bot className="w-16 h-16 text-gray-200 mb-4" />
              <p className="font-medium max-w-[200px]">{t('uploadPhotoPrompt')}</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden h-full"
            >
              <div className="bg-gray-900 p-5 text-white flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Diagnosis Status</p>
                  <h3 className="text-lg font-bold flex items-center gap-2 text-green-400">
                    <ShieldCheck className="w-5 h-5" /> Detected
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('aiConfidence')}</p>
                  <p className="text-xl font-black text-white">{result.confidence}%</p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">{t('diseaseName')}</label>
                  <p className="text-2xl font-black text-gray-900 leading-tight">
                    {result.disease}
                  </p>
                </div>

                <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-50">
                   <label className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-2 block">{t('precautions')}</label>
                   <ul className="space-y-3">
                    {result.solution.map((step, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-blue-900/80 font-medium leading-relaxed">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-blue-600">{index + 1}</span>
                        </div>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                   <p className="text-[9px] text-gray-400 italic">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                   <p className="text-[9px] font-bold text-gray-400">MODEL: {result.intelligence}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-3xl"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 font-bold mb-4">{error}</p>
              <button onClick={() => setError(null)} className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-bold">Dismiss</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Additional decorative component
function SparkleIcon({ className }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3L4 4" />
      <path d="M19 3l1 1" />
      <path d="M5 21l-1-1" />
      <path d="M19 21l1-1" />
    </svg>
  );
}
