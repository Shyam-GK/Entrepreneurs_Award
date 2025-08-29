import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Fallback to localhost if env variable is not set

export default function LoginPage({ handleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || 'Invalid credentials. Please try again.');
      }

      const result = await response.json();
      console.log('Login response (full):', result); // Detailed debug
      localStorage.setItem('accessToken', result.access_token);

      // Determine role with multiple fallback checks
      const userRole = result.role || (result.user && result.user.role) || 'user';
      console.log('Detected role:', userRole); // Debug role
      handleLogin(); // Update parent auth state
      window.location.href = userRole === 'admin' ? '/admin' : '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for scrollToCriteria (no effect on login page)
  const scrollToCriteria = () => {};

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-200 via-cyan-300 to-blue-400">
      <LandingNavbar scrollToCriteria={scrollToCriteria} />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-lg form-container mx-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Sign in to manage your nominations</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                placeholder="Enter your password"
              />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
            {error && <p className="text-center text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-semibold text-white rounded-lg shadow-md submit-button"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}