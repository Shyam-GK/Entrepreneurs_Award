import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import NomineeProfile from './NomineeProfile';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminDashboard({ handleLogout }) {
  const [nominees, setNominees] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log('VITE_API_URL:', API); // Debug API URL

  useEffect(() => {
    fetchNominees();
  }, [searchEmail]);

  const fetchNominees = async () => {
    setLoading(true);
    try {
      console.log('Fetching nominees with email filter:', searchEmail);
      const response = await axios.get(`${API}/admin/nominee-details`, {
        params: { email: searchEmail },
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setNominees(response.data);
      console.log('Fetched Nominees:', response.data);
      console.log('Nominee IDs:', response.data.map(n => n.id));
    } catch (err) {
      setError(err.message || 'Failed to fetch nominees');
      console.error('Fetch nominees error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNominee = (nomineeId) => {
    console.log('Selected Nominee ID:', nomineeId);
    setSelectedNominee(nomineeId);
  };

  const handleBack = () => {
    setSelectedNominee(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-800">Admin Dashboard - Nominees</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : selectedNominee ? (
          <NomineeProfile nomineeId={selectedNominee} onBack={handleBack} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Mobile</th>
                  <th className="border p-2 text-left">Company</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {nominees.map((nominee) => (
                  <tr key={nominee.id} className="hover:bg-gray-50">
                    <td className="border p-2">{nominee.id}</td>
                    <td className="border p-2">{nominee.user?.name || 'N/A'}</td>
                    <td className="border p-2">{nominee.user?.email || 'N/A'}</td>
                    <td className="border p-2">{nominee.user?.mobile || 'N/A'}</td>
                    <td className="border p-2">{nominee.companyName || 'N/A'}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleSelectNominee(nominee.id)}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
