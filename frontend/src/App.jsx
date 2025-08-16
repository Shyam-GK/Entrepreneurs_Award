import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all page components
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NominationPage from './pages/NominationPage';
import RegistrationPage from './pages/RegistrationPage';
import AdminDashboard from './pages/AdminDashboard';
import NomineeProfile from './pages/NomineeProfile'; // Import NomineeProfile

// Import the protected route utility component
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  // State to track if the user is logged in, initialized from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // useEffect to save the login state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  // Function to handle the login action
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Function to handle the logout action
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('accessToken'); // Clear token on logout
  };

  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        {/* These routes are accessible to everyone */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUpPage handleLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* --- Protected Routes --- */}
        {/* These routes are only accessible when isLoggedIn is true */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nominate"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <NominationPage handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <RegistrationPage handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AdminDashboard handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/nominee/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <NomineeProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
