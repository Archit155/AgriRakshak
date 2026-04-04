import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BannerSlider() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const mockSchemes = {
    en: [
      {
        title: "PM-KISAN",
        benefit: "₹6000/year income support for your family",
        color: "from-green-600 to-green-800",
        btn: "Learn More"
      },
      {
        title: "Pradhan Mantri Fasal Bima Yojana",
        benefit: "Protect your crops against natural calamities",
        color: "from-orange-500 to-orange-700",
        btn: "Learn More"
      },
      {
        title: "Soil Health Card",
        benefit: "Know your soil, increase your yield",
        color: "from-blue-600 to-blue-800",
        btn: "Learn More"
      }
    ],
    hi: [
      {
        title: "पीएम-किसान (PM-KISAN)",
        benefit: "आपके परिवार के लिए ₹6000/वर्ष आय सहायता",
        color: "from-green-600 to-green-800",
        btn: "और जानें"
      },
      {
        title: "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
        benefit: "प्राकृतिक आपदाओं से अपनी फसलों को बचाएं",
        color: "from-orange-500 to-orange-700",
        btn: "और जानें"
      },
      {
        title: "मृदा स्वास्थ्य कार्ड (Soil Health Card)",
        benefit: "अपनी मिट्टी को जानें, अपनी उपज बढ़ाएं",
        color: "from-blue-600 to-blue-800",
        btn: "और जानें"
      }
    ],
    mr: [
      {
        title: "पीएम-किसान (PM-KISAN)",
        benefit: "तुमच्या कुटुंबासाठी ₹6000/वर्ष उत्पन्न आधार",
        color: "from-green-600 to-green-800",
        btn: "अधिक जाणून घ्या"
      },
      {
        title: "प्रधानमंत्री पीक विमा योजना (PMFBY)",
        benefit: "नैसर्गिक आपत्तींपासून आपल्या पिकांचे संरक्षण करा",
        color: "from-orange-500 to-orange-700",
        btn: "अधिक जाणून घ्या"
      },
      {
        title: "मृदा आरोग्य कार्ड (Soil Health Card)",
        benefit: "आपली माती जाणून घ्या, उत्पादन वाढवा",
        color: "from-blue-600 to-blue-800",
        btn: "अधिक जाणून घ्या"
      }
    ]
  };

  const schemes = mockSchemes[language] || mockSchemes['en'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % schemes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [schemes.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % schemes.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? schemes.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden shadow-lg mb-8">
      {schemes.map((scheme, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 flex flex-col justify-center items-center text-center p-6 bg-gradient-to-r ${scheme.color} text-white ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{scheme.title}</h2>
          <p className="text-sm sm:text-lg mb-4 text-white/90">{scheme.benefit}</p>
          <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-100 transition">
            {scheme.btn}
          </button>
        </div>
      ))}
      
      {/* Controls */}
      <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition">
        <ChevronRight className="w-6 h-6" />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {schemes.map((_, idx) => (
          <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
}
