import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SchemeDetails from './pages/SchemeDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import VoiceAssistant from './components/VoiceAssistant';
import TelegramButton from './components/TelegramButton';

function App() {
  return (
    <div className="min-h-screen relative pb-16">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scheme/:id" element={<SchemeDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </main>
      
      <footer className="bg-gray-900 text-white mt-12 py-10 px-4">
        <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-800 pb-8 mb-8">
          <div>
            <h4 className="font-bold text-lg mb-4 text-gov-secondary">Smart Krishi Sahayak</h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              A digital initiative by the Ministry of Agriculture & Farmers Welfare to provide real-time assistance and scheme access to over 100 million farmers nationwide.
            </p>
          </div>
          <div className="flex flex-col md:items-end">
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <div className="flex gap-4 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Contact Us</a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500">
          © 2026 Government of India. All rights reserved. Managed by National Informatics Centre.
        </div>
      </footer>

      <VoiceAssistant />
      <TelegramButton />
    </div>
  );
}

export default App;
