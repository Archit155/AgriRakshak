import { useState, useEffect } from 'react';
import axios from 'axios';
import BannerSlider from '../components/BannerSlider';
import SchemeCard from '../components/SchemeCard';
import PlantDetection from '../components/PlantDetection';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, Filter, Loader2, Sparkles } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchSchemes();
  }, [category]);

  // Debounced search could be added here, implementing simple search for UI
  useEffect(() => {
    if(searchQuery.trim() !== '') {
      const timeout = setTimeout(() => fetchSearch(), 500);
      return () => clearTimeout(timeout);
    } else {
      fetchSchemes();
    }
  }, [searchQuery]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const url = category === 'all' 
        ? `${API_BASE}/schemes` 
        : `${API_BASE}/schemes/filter?category=${category}`;
      const res = await axios.get(url);
      
      let fetchedSchemes = res.data;
      
      // Personalization Engine sorting based on user interests
      if (user && user.interests && user.interests.length > 0 && category === 'all') {
        fetchedSchemes.sort((a, b) => {
          const aMatch = user.interests.includes(a.category.toLowerCase());
          const bMatch = user.interests.includes(b.category.toLowerCase());
          if (aMatch && !bMatch) return -1;
          if (!aMatch && bMatch) return 1;
          return 0; // maintain original order for non-matches
        });
      }
      
      setSchemes(fetchedSchemes);
    } catch (error) {
      console.error("Error fetching schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/schemes/search?q=${searchQuery}`);
      setSchemes(res.data);
    } catch (error) {
      console.error("Error searching schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BannerSlider />

      <PlantDetection />
      
      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-2xl mx-auto">
        <h2 className="text-center font-semibold text-gray-800 mb-4 text-lg">{t('findScheme')}</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-primary appearance-none placeholder-gray-400"
            />
          </div>
          <div className="relative w-full sm:w-48 shrink-0">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-primary appearance-none text-gray-700"
            >
              <option value="all">{t('allCategories')}</option>
              <option value="subsidy">{t('subsidy')}</option>
              <option value="insurance">{t('insurance')}</option>
              <option value="loan">{t('loan')}</option>
              <option value="soil">{t('soil')}</option>
            </select>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4 px-2 border-l-4 border-gov-primary flex items-center gap-2">
        {user ? t('recommendedForYou') : t('featuredSchemes')}
        {user && <Sparkles className="w-5 h-5 text-gov-secondary" />}
      </h2>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-gov-primary animate-spin" />
        </div>
      ) : schemes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {schemes.map((scheme, index) => {
            const isRecommended = user && user.interests?.includes(scheme.category.toLowerCase()) && category === 'all' && index < 2;
            return (
              <div key={scheme._id} className="relative">
                {isRecommended && (
                  <div className="absolute -top-3 -right-2 bg-gov-secondary text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1 rounded-full shadow z-10">
                    <Sparkles className="w-3 h-3" /> {t('match')}
                  </div>
                )}
                <SchemeCard scheme={scheme} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium text-lg">{t('noSchemes')}</p>
          <p className="text-sm text-gray-400 mt-1">{t('adjustFilters')}</p>
        </div>
      )}
    </div>
  );
}
