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
    <div className="flex flex-col min-h-screen">
      <LandingNavbar scrollToCriteria={scrollToCriteria} />
      <main className="flex-grow">
        <ErrorBoundary>
          <LandingHero />
        </ErrorBoundary>
        <div ref={criteriaRef}>
          <EligibilityCriteria />
        </div>
      </main>
      <Footer />
    </div>
  );
}