import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Tractor, Store, Landmark, ShieldCheck, Sun, Wallet, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Onboarding() {
  const { user, fetchUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [role, setRole] = useState('');
  const [interests, setInterests] = useState([]);

  if (!user) return <Navigate to="/login" />;
  if (user.isOnboarded) return <Navigate to="/" />;

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(prev => prev.filter(i => i !== interest));
    } else {
      setInterests(prev => [...prev, interest]);
    }
  };

  const submitOnboarding = async () => {
    if (!role) return;
    setLoading(true);
    try {
      await axios.put('http://localhost:5000/api/auth/onboarding', { role, interests });
      await fetchUser(); // Updates context with isOnboarded = true
      navigate('/');
    } catch (error) {
      console.error("Error saving onboarding details", error);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { id: 'farmer_small', label: t('roleFarmerSmall'), icon: <User className="w-8 h-8" /> },
    { id: 'farmer_large', label: t('roleFarmerLarge'), icon: <Tractor className="w-8 h-8" /> },
    { id: 'dealer', label: t('roleDealer'), icon: <Store className="w-8 h-8" /> },
  ];

  const interestOptions = [
    { id: 'loan', label: t('interestLoan'), icon: <Landmark className="w-6 h-6 text-orange-500" /> },
    { id: 'insurance', label: t('interestInsurance'), icon: <ShieldCheck className="w-6 h-6 text-blue-500" /> },
    { id: 'subsidy', label: t('interestSubsidy'), icon: <Wallet className="w-6 h-6 text-green-500" /> },
    { id: 'soil', label: t('interestSoil'), icon: <Sun className="w-6 h-6 text-amber-500" /> },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Step Indicator */}
        <div className="bg-gray-50 border-b border-gray-100 flex p-4 justify-between items-center">
          <div className="flex gap-2">
            <div className={`h-2 rounded-full w-12 transition-colors ${step >= 1 ? 'bg-gov-primary' : 'bg-gray-200'}`} />
            <div className={`h-2 rounded-full w-12 transition-colors ${step >= 2 ? 'bg-gov-primary' : 'bg-gray-200'}`} />
          </div>
          <span className="text-sm font-medium text-gray-500">{t('step')} {step} of 2</span>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">{t('onboardingTitle')}</h2>
              <p className="text-gray-500 text-center mb-8">{t('onboardingSubtitle')}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {roleOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setRole(opt.id)}
                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition ${
                      role === opt.id ? 'border-gov-primary bg-green-50 text-gov-primary' : 'border-gray-200 hover:border-gov-primary/30 text-gray-600'
                    }`}
                  >
                    <div className="mb-3">{opt.icon}</div>
                    <span className="font-semibold text-center leading-tight">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setStep(2)} 
                  disabled={!role}
                  className={`py-3 px-8 rounded-lg font-semibold transition ${role ? 'bg-gov-primary text-white hover:bg-gov-primary-dark shadow' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  {t('nextStep')}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">{t('interestsTitle')}</h2>
              <p className="text-gray-500 text-center mb-8">{t('interestsSubtitle')}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {interestOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => toggleInterest(opt.id)}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl transition text-left ${
                      interests.includes(opt.id) ? 'border-gov-primary bg-green-50' : 'border-gray-200 hover:border-gov-primary/30'
                    }`}
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                      {opt.icon}
                    </div>
                    <span className="font-semibold text-gray-800">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button onClick={() => setStep(1)} className="text-gray-500 font-medium hover:text-gray-800">
                  {t('back')}
                </button>
                <button 
                  onClick={submitOnboarding}
                  disabled={loading}
                  className="bg-gov-secondary text-white py-3 px-8 rounded-lg font-semibold hover:bg-orange-600 shadow transition flex gap-2 items-center"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('completeSetup')}
                </button>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
