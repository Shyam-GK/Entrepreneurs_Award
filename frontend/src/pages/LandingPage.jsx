import React, { useRef } from 'react';
import LandingNavbar from '../components/LandingNavbar';
import LandingHero from '../components/LandingHero';
import EligibilityCriteria from '../components/EligibilityCriteria';
import Footer from '../components/Footer';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl text-red-600">Something went wrong.</h2>
          <p>{this.state.error?.message || 'Unknown error'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function LandingPage() {
  const criteriaRef = useRef(null);

  const scrollToCriteria = () => {
    criteriaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-teal-200 via-blue-300 to-indigo-300">
      <LandingNavbar scrollToCriteria={scrollToCriteria} />
      <main className="flex-grow">
        <ErrorBoundary>
          <div className="min-h-[calc(100vh-88px)] flex items-center justify-center">
            <LandingHero />
          </div>
        </ErrorBoundary>
        <div ref={criteriaRef} className="py-8">
          <EligibilityCriteria />
        </div>
      </main>
      <Footer />
    </div>
  );
}