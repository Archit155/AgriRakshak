import { MessageCircle } from 'lucide-react';

export default function TelegramButton() {
  const handleTelegramClick = (e) => {
    e.preventDefault();

    const botUsername = 'KrishiNetra';
    const deepLink = `tg://resolve?domain=${botUsername}`;
    const fallbackUrl = `https://t.me/${botUsername}`;

    // Attempt to open deep link
    window.location.href = deepLink;

    // Fallback to web link if app didn't open
    const timeoutId = setTimeout(() => {
      window.open(fallbackUrl, '_blank');
    }, 1500);

    // Prevent fallback if app opens successfully
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(timeoutId);
        cleanup();
      }
    };

    const handleBlur = () => {
      clearTimeout(timeoutId);
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
  };

  return (
    <button
      onClick={handleTelegramClick}
      className="fixed bottom-6 left-6 bg-[#0088cc] text-white p-4 rounded-full shadow-xl hover:bg-[#007ab8] transition-transform hover:scale-105 z-50 flex items-center justify-center border-none outline-none cursor-pointer"
      aria-label="Get help on Telegram"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
