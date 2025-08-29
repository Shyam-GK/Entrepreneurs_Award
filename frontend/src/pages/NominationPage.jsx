import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import NominationsModal from '../components/NominationsModal';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Fallback to localhost if env variable is not set

export default function NominationPage({ handleLogout }) {
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeEmail, setNomineeEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [nominations, setNominations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('accessToken');

      const res = await fetch(`${API}/nominations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nomineeName,
          nomineeEmail,
          relationship,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit nomination');
      }

      const newNomination = await res.json();
      setNominations([...nominations, newNomination]);

      alert(`Thank you for nominating ${nomineeName}!`);

      // Reset form
      setNomineeName('');
      setNomineeEmail('');
      setRelationship('');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting nomination:', error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-100 via-indigo-100 to-violet-100">
      <Navbar handleLogout={handleLogout} />

      <div className="text-center mt-4 p-3 bg-yellow-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> An email will be sent to the nominee with instructions to register. We recommend you also contact them to ensure they complete the application.
        </p>
      </div>

      <main className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl p-8 space-y-6 rounded-2xl shadow-lg form-container">
          <h1 className="text-3xl font-bold text-center text-gray-800">Nominate an Alumnus</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="nominator-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name of Nominee
              </label>
              <input
                id="nominator-name"
                type="text"
                required
                value={nomineeName}
                onChange={(e) => setNomineeName(e.target.value)}
                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the name of the person you are nominating"
              />
            </div>

            <div>
              <label htmlFor="nominator-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email of Nominee
              </label>
              <input
                id="nominator-email"
                type="email"
                required
                value={nomineeEmail}
                onChange={(e) => setNomineeEmail(e.target.value)}
                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter their email address"
              />
            </div>

            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
                Your Relationship to Nominee
              </label>
              <select
                id="relationship"
                required
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled className="py-2 px-3 rounded-md">Select your relationship</option>
                <option value="classmate" className="py-2 px-3 rounded-md">Classmate</option>
                <option value="junior" className="py-2 px-3 rounded-md">Junior</option>
                <option value="senior" className="py-2 px-3 rounded-md">Senior</option>
                <option value="batchmate" className="py-2 px-3 rounded-md">Batchmate</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-4 py-3 font-semibold text-white transition-transform duration-200 transform rounded-lg shadow-md submit-button hover:scale-105"
              >
                Submit Nomination
              </button>
            </div>
          </form>
        </div>
      </main>

      <NominationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nominations={nominations}
      />
    </div>
  );
}