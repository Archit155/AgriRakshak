import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Sprout, Shield, Wallet, BadgeIndianRupee } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SchemeCard({ scheme }) {
  const { t } = useLanguage();
  const getCategoryIcon = () => {
    switch(scheme.category?.toLowerCase()) {
      case 'insurance': return <Shield className="w-5 h-5 text-blue-500" />;
      case 'subsidy': return <BadgeIndianRupee className="w-5 h-5 text-green-600" />;
      case 'loan': return <Wallet className="w-5 h-5 text-orange-500" />;
      case 'soil': return <Sprout className="w-5 h-5 text-amber-700" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryStyle = () => {
    switch(scheme.category?.toLowerCase()) {
      case 'insurance': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'subsidy': return "bg-green-50 text-green-700 border-green-200";
      case 'loan': return "bg-orange-50 text-orange-700 border-orange-200";
      case 'soil': return "bg-amber-50 text-amber-800 border-amber-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border flex items-center gap-1.5 ${getCategoryStyle()}`}>
            {getCategoryIcon()}
            {t(scheme.category.toLowerCase())}
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{t(scheme.name)}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{t(scheme.benefits)}</p>
      </div>
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
        <Link 
          to={`/scheme/${scheme._id}`}
          className="flex justify-center items-center gap-2 w-full btn-primary"
        >
          {t('viewDetails')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
