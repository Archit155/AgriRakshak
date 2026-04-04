import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeft, FileText, CheckCircle, 
  Info, Loader2, Send 
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function SchemeDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const res = await axios.get(`${API_BASE}/schemes/${id}`);
        setScheme(res.data);
      } catch (error) {
        console.error("Error fetching scheme details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 text-gov-primary animate-spin" />
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold font-gray-800">{t('schemeNotFound')}</h2>
        <Link to="/" className="text-gov-primary hover:underline mt-4 inline-block">{t('returnHome')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gov-primary p-6 text-white relative">
        <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition font-medium text-sm">
          <ArrowLeft className="w-4 h-4" />
          {t('backToList')}
        </Link>
        <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold capitalize mb-3 border border-white/20 backdrop-blur-sm">
          {t(scheme.category.toLowerCase())}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{t(scheme.name)}</h1>
      </div>

      <div className="p-6 sm:p-8">
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
            <Info className="w-5 h-5 text-gov-secondary" />
            {t('aboutScheme')}
          </h2>
          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">{t(scheme.description)}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            {t('keyBenefits')}
          </h2>
          <p className="text-gray-700 leading-relaxed">{t(scheme.benefits)}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {t('eligibility')}
          </h2>
          <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg text-blue-900 border border-blue-100">{t(scheme.eligibility)}</p>
        </section>

        {scheme.documents && scheme.documents.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
              <FileText className="w-5 h-5 text-amber-600" />
              {t('requiredDocuments')}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              {scheme.documents.map((doc, index) => (
                <li key={index} className="text-gray-700">{t(doc)}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="pt-6 border-t mt-8 text-center flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary w-full sm:w-auto py-3 px-8 text-lg flex justify-center items-center gap-2">
            {t('applyNow')}
            <Send className="w-5 h-5" />
          </button>
          <button className="btn-accent w-full sm:w-auto py-3 px-8 text-lg">
            {t('findCenter')}
          </button>
        </div>
      </div>
    </div>
  );
}
