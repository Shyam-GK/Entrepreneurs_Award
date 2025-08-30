import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NominationPage from './pages/NominationPage';
import RegistrationPage from './pages/RegistrationPage';
import AdminDashboard from './pages/AdminDashboard';
import NomineeProfile from './pages/NomineeProfile';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('accessToken');
  };

  return (
    <HelmetProvider>
      <Router>
        <Helmet>
          <title>Entrepreneur Awards</title>
          <link rel="icon" type="image/png" href="/psg-logo.png" />
        </Helmet>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUpPage handleLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
    </HelmetProvider>
  );
}