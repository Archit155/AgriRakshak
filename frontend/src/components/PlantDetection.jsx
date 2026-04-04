import { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PlantDetection() {
  const { t, language } = useLanguage();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Fake AI Data based on language
  const fakeResults = {
    en: {
      disease: 'Leaf Blight',
      cause: 'Fungal infection due to excess moisture',
      solution: ['Use recommended fungicide spray', 'Remove and burn affected leaves', 'Avoid overwatering']
    },
    hi: {
      disease: 'पत्तियों का झुलसा रोग (Leaf Blight)',
      cause: 'अत्यधिक नमी के कारण फंगल संक्रमण',
      solution: ['अनुशंसित फफूंदनाशक स्प्रे का प्रयोग करें', 'प्रभावित पत्तियों को हटाकर जला दें', 'अधिक पानी देने से बचें']
    },
    mr: {
      disease: 'पानांवरील करपा (Leaf Blight)',
      cause: 'जास्त ओलाव्यामुळे बुरशीजन्य संसर्ग',
      solution: ['शिफारस केलेले बुरशीनाशक फवारा', 'प्रभावित पाने काढून जाळून टाका', 'जास्त पाणी देणे टाळा']
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = () => {
    if (!image) {
      setError(t('selectImageFirst'));
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate AI processing delay
    setTimeout(() => {
      // Random confidence between 75 and 98
      const confidence = Math.floor(Math.random() * (98 - 75 + 1)) + 75;
      
      setResult({
        ...fakeResults[language],
        confidence
      });
      setLoading(false);
    }, 2500); // 2.5 seconds loading
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-12 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6 px-2 border-l-4 border-gov-primary flex items-center gap-2">
        {t('checkCropHealth')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="flex flex-col gap-4">
          <label 
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          >
            {image ? (
              <img src={image} alt="Crop preview" className="h-full object-cover rounded-xl w-full" />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 text-gov-primary mb-3" />
                <p className="mb-2 text-sm text-gray-500 font-semibold">{t('uploadImage')}</p>
                <p className="text-xs text-gray-400">{t('fileFormatInfo')}</p>
              </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gov-primary hover:bg-green-700'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('analyzing')}
              </span>
            ) : (
              t('analyze')
            )}
          </button>
        </div>

        {/* Result Section */}
        <div className="flex flex-col justify-center">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-gray-200 mb-2" />
              <p>{t('uploadPhotoPrompt')}</p>
            </div>
          ) : (
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-inner">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="font-bold text-gray-700">{t('aiConfidence')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${result.confidence > 85 ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                  <span className={`font-bold ${result.confidence > 85 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {result.confidence}%
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-gray-600 min-w-[120px]">{t('diseaseName')}</span>
                  <span className="font-bold text-red-600">{result.disease}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-gray-600 min-w-[120px]">{t('cause')}</span>
                  <span className="text-gray-800">{result.cause}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-gray-600 min-w-[120px]">{t('solution')}</span>
                  <ul className="list-disc list-inside text-gray-800 marker:text-gov-primary">
                    {result.solution.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-xs flex items-start gap-2 border border-yellow-100">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-yellow-600" />
                <p>{t('disclaimer')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
