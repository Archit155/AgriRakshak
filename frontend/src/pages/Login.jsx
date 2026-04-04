import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Sprout, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.token, res.data.user);
      
      if (!res.data.user.isOnboarded) {
        navigate('/onboarding');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        credential: credentialResponse.credential,
      });
      login(res.data.token, res.data.user);
      
      if (!res.data.user.isOnboarded) {
        navigate('/onboarding');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Google Login failed');
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    setError('Google Login was unsuccessful');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-8 h-8 text-gov-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-1">Login to access your farming dashboard</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gov-primary focus:outline-none"
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gov-primary focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-3 text-lg flex justify-center items-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b w-1/5 lg:w-1/4"></span>
          <a href="#" className="text-xs text-center text-gray-500 uppercase">or login with</a>
          <span className="border-b w-1/5 lg:w-1/4"></span>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </div>
        
        <p className="text-center mt-6 text-gray-600">
          Don't have an account? <Link to="/signup" className="text-gov-primary font-medium hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
