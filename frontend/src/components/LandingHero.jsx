import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingHero() {
  return (
    <div className="min-h-[calc(100vh-88px)] flex items-center relative">
      <div className="container mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center w-full">
        {/* Left Side: Entrepreneur Award */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <div className="py-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-snug">
              Entrepreneur Awards-2025
            </h2>
            <p className="mt-2 text-lg text-gray-700">Recognizing innovation and leadership.</p>
          </div>
        </div>

        {/* Right Side: Celebrating Milestones with Logos */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-8 py-8 md:ml-16">
          <h3 className="text-2xl font-bold text-gray-700">Celebrating Milestones</h3>
          <div className="flex gap-8 items-center">
            <img
              src="https://platinum.psgtech.ac.in/assets/images/LogoLaunch/75yearsLogo_PSGCollegeofTech.png"
              alt="Entrepreneur Award Image"
              className="h-24 md:h-32 w-auto"
              onError={(e) => { e.currentTarget.src = "https://placehold.co/150x100/e2e8f0/64748b?text=Entrepreneur"; }}
            />
            <img
              src="https://platinum.psgtech.ac.in/assets/images/LogoLaunch/100yearsLogo_PsgSonsCharities.png"
              alt="Celebrating Milestones Image"
              className="h-24 md:h-32 w-auto"
              onError={(e) => { e.currentTarget.src = "https://placehold.co/150x100/e2e8f0/64748b?text=Milestones"; }}
            />
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-center md:hidden animate-bounce">
        <span className="text-gray-600">Scroll for details</span>
        <svg className="w-6 h-6 text-gray-600 mx-auto mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );
}