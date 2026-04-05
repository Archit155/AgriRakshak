import { Link, useNavigate } from 'react-router-dom';
import { Sprout, UserCircle, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gov-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-[1200px]">
        {/* Extreme Left / Middle side: Logo + Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-full">
              <Sprout className="w-6 h-6 text-gov-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">{t('appTitle')}</h1>
              <p className="text-[10px] uppercase tracking-wider text-green-100">{t('appSubtitle')}</p>
            </div>
            <div className="hidden lg:flex flex-col border-l border-white/20 pl-4">
              <span className="text-[10px] text-white/60 font-medium">Security Status</span>
              <span className="text-xs font-bold text-gov-secondary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gov-secondary rounded-full animate-pulse"></span>
                Our system trusts nothing by default.
              </span>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-gov-secondary transition">{t('home')}</Link>
            <a href="#" className="hover:text-gov-secondary transition">{t('about')}</a>
            <a href="#" className="hover:text-gov-secondary transition">{t('help')}</a>
          </div>
        </div>

        {/* Extreme Right: Login / Signup / Profile + Language */}
        <div className="flex items-center gap-4 text-sm font-medium">
          
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-white/10 px-2 py-1.5 rounded-md">
            <Globe className="w-4 h-4" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent border-none text-white text-sm outline-none cursor-pointer [&>option]:text-black"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-gov-secondary" />
                  <span className="font-semibold">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 hover:text-red-300 transition"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="hover:text-gov-secondary transition">{t('login')}</Link>
                <Link to="/signup" className="bg-white text-gov-primary px-4 py-1.5 rounded-full hover:bg-gray-100 transition shadow-sm font-semibold">{t('signup')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
