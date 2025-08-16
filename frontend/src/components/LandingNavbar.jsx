import React, { useState } from "react";
import { Link } from 'react-router-dom';

export default function LandingNavbar({ scrollToCriteria }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full p-4 sm:p-5 shadow-md sticky top-0 z-20 bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 backdrop-blur-sm">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo and Title with fallback */}
        <div className="flex items-center gap-4">
          <img
            src="https://psgtech.edu/dept/ece/ieee/img/logo/psg.png"
            alt="PSG Main Logo"
            className="h-10 sm:h-12 w-auto"
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
          />
          <h1 className="text-lg md:text-xl font-bold text-gray-800">PSG College of Technology</h1>
        </div>

        {/* Desktop Menu - Hidden on small screens */}
        <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
          <Link to="/" className="header-logout-button text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors">Home</Link>
          <Link to="/login" className="header-logout-button text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors">Login</Link>
          <Link to="/signup" className="header-logout-button text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors">Sign Up</Link>
        </div>

        {/* Mobile Menu Button - Hidden on medium screens and up */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Dropdown) - Renders only when isOpen is true */}
      {isOpen && (
        <div className="md:hidden mt-4">
          <div className="flex flex-col items-center space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="w-full text-center header-logout-button text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors">Home</Link>
            <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center header-logout-button text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors">Login</Link>
            <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full text-center header-logout-button text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors">Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  );
}