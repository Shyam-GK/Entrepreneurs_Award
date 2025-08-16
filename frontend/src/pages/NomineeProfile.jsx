import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function NomineeProfile() {
  const { id } = useParams(); // Get nomineeId from route params
  const [profile, setProfile] = useState(null);
  const [nominators, setNominators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log('VITE_API_URL:', API); // Debug API URL

  useEffect(() => {
    fetchProfile();
    fetchNominators();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      console.log('Fetching profile for nominee ID:', id);
      const response = await axios.get(`${API}/admin/nominee-details/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setProfile(response.data);
      console.log('Profile data:', response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`Nominee with ID ${id} not found`);
      } else if (err.response?.status === 401) {
        setError('Unauthorized: Please log in again');
      } else {
        setError(err.message || 'Failed to fetch profile');
      }
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNominators = async () => {
    try {
      const response = await axios.get(`${API}/admin/nominee-details/${id}/nominators`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setNominators(response.data);
      console.log('Nominators data:', response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch nominators');
      console.error('Fetch nominators error:', err);
    }
  };

  const handleDownloadForm = async () => {
    try {
      const response = await axios.get(`${API}/admin/nominee-details/${id}/download-application`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${profile?.user?.name || 'form'}-application.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message || 'Failed to download form');
      console.error('Download form error:', err);
    }
  };

  const normalizeFilePath = (filePath) => {
    if (!filePath) return '';
    // Remove leading 'Uploads/' or 'uploads/' and ensure consistent path
    return filePath.replace(/^(Uploads|uploads)\//, '');
  };

  const handleDownloadFile = async (filePath) => {
    if (!filePath) {
      setError('No file available for download');
      return;
    }
    try {
      const normalizedPath = normalizeFilePath(filePath);
      const fullUrl = `${API}/uploads/${normalizedPath}`;
      console.log('Downloading file:', fullUrl);
      const response = await axios.get(fullUrl, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', normalizedPath.split('/').pop() || 'file');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.response?.status === 404 ? `File ${filePath} not found` : 'Failed to download file');
      console.error('Download file error:', err);
    }
  };

  const handleBack = () => {
    window.close(); // Close the tab
  };

  if (loading) return <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;
  if (!profile) return <p className="text-center">No profile data</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        {/* <button onClick={handleBack} className="mb-6 flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Close Tab
        </button> */}

        <div className="text-center mb-8">
          {profile.photo && profile.photo !== 'N/A' ? (
            <img
              src={`${API}/uploads/${normalizeFilePath(profile.photo)}`}
              alt={profile.user?.name || 'Unknown'}
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 shadow-md"
              onError={(e) => { e.target.src = '/placeholder.jpg'; console.error('Image load error:', profile.photo); }}
            />
          ) : (
            <img
              src="/placeholder.jpg"
              alt="No photo"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 shadow-md"
            />
          )}
          <div className="flex justify-center space-x-4">
            {profile.photo && profile.photo !== 'N/A' && (
              <button
                onClick={() => handleDownloadFile(profile.photo)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md"
              >
                <ArrowDownTrayIcon className="h-5 w-5 inline mr-2" /> Download Photo
              </button>
            )}
            <button
              onClick={handleDownloadForm}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md"
            >
              <ArrowDownTrayIcon className="h-5 w-5 inline mr-2" /> Download Form
            </button>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">{profile.user?.name || 'Unknown'}</h2>
          <p className="text-gray-600">{profile.user?.email || 'N/A'}</p>
          <p className="text-gray-600">{profile.user?.mobile || 'N/A'}</p>
          <p className="text-gray-600">{profile.companyName || 'N/A'}</p>
          <a href={profile.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {profile.companyWebsite || 'N/A'}
          </a>
        </div>

        <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Submitted Form</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Passout Year:</strong> {profile.passoutYear || 'N/A'}</p>
            <p><strong>Company Type:</strong> {profile.companyType || 'N/A'}</p>
            <p><strong>Registration Number:</strong> {profile.registrationNumber || 'N/A'}</p>
            <p><strong>Registration Date:</strong> {profile.registrationDate ? new Date(profile.registrationDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Registered Address:</strong> {profile.registeredAddress || 'N/A'}</p>
            <p><strong>Founder Type:</strong> {profile.founderType || 'N/A'}</p>
            <p><strong>Year Established:</strong> {profile.yearOfEstablishment || 'N/A'}</p>
            <p><strong>Total Employees:</strong> {profile.totalEmployees || 'N/A'}</p>
            <p><strong>Annual Turnover:</strong> {profile.annualTurnover ? `$${profile.annualTurnover.toLocaleString()}` : 'N/A'}</p>
            <p><strong>Business Domain:</strong> {profile.businessDomain || 'N/A'}</p>
            <p><strong>Key Innovations:</strong> {profile.keyInnovations || 'N/A'}</p>
            <p>
              <strong>Registration Certificate:</strong>
              {profile.registrationCertificate ? (
                <button
                  onClick={() => handleDownloadFile(profile.registrationCertificate)}
                  className="text-blue-500 hover:underline ml-2"
                >
                  View/Download
                </button>
              ) : 'N/A'}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Nominators (Count: {nominators.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Nominated On</th>
                </tr>
              </thead>
              <tbody>
                {nominators.map((nominator) => (
                  <tr key={nominator.id} className="hover:bg-gray-50">
                    <td className="border p-2">{nominator.name}</td>
                    <td className="border p-2">{nominator.email}</td>
                    <td className="border p-2">{new Date(nominator.nominatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Mergers</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Company</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Year</th>
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-left">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {profile.mergers.map((merger) => (
                  <tr key={merger.id} className="hover:bg-gray-50">
                    <td className="border p-2">{merger.mergerCompany || 'N/A'}</td>
                    <td className="border p-2">{merger.mergerType || 'N/A'}</td>
                    <td className="border p-2">{merger.mergerYear || 'N/A'}</td>
                    <td className="border p-2">{merger.mergerDescription || 'N/A'}</td>
                    <td className="border p-2">
                      {merger.filePath && (
                        <button
                          onClick={() => handleDownloadFile(merger.filePath)}
                          className="text-blue-500 hover:underline"
                        >
                          View/Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">IPRs</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Title</th>
                  <th className="border p-2 text-left">Registration Number</th>
                  <th className="border p-2 text-left">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {profile.iprs.map((ipr) => (
                  <tr key={ipr.id} className="hover:bg-gray-50">
                    <td className="border p-2">{ipr.type || 'N/A'}</td>
                    <td className="border p-2">{ipr.title || 'N/A'}</td>
                    <td className="border p-2">{ipr.registrationNumber || 'N/A'}</td>
                    <td className="border p-2">
                      {ipr.filePath && (
                        <button
                          onClick={() => handleDownloadFile(ipr.filePath)}
                          className="text-blue-500 hover:underline"
                        >
                          View/Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Awards</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Awarded By</th>
                  <th className="border p-2 text-left">Level</th>
                  <th className="border p-2 text-left">Category</th>
                  <th className="border p-2 text-left">Year</th>
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-left">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {profile.awards.map((award) => (
                  <tr key={award.id} className="hover:bg-gray-50">
                    <td className="border p-2">{award.name || 'N/A'}</td>
                    <td className="border p-2">{award.awardedBy || 'N/A'}</td>
                    <td className="border p-2">{award.level || 'N/A'}</td>
                    <td className="border p-2">{award.category || 'N/A'}</td>
                    <td className="border p-2">{award.yearReceived || 'N/A'}</td>
                    <td className="border p-2">{award.description || 'N/A'}</td>
                    <td className="border p-2">
                      {award.filePath && (
                        <button
                          onClick={() => handleDownloadFile(award.filePath)}
                          className="text-blue-500 hover:underline"
                        >
                          View/Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Collaborations</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Institution Name</th>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Duration</th>
                  <th className="border p-2 text-left">Outcomes</th>
                  <th className="border p-2 text-left">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {profile.collaborations.map((collab) => (
                  <tr key={collab.id} className="hover:bg-gray-50">
                    <td className="border p-2">{collab.institutionName || 'N/A'}</td>
                    <td className="border p-2">{collab.type || 'N/A'}</td>
                    <td className="border p-2">{collab.duration || 'N/A'}</td>
                    <td className="border p-2">{collab.outcomes || 'N/A'}</td>
                    <td className="border p-2">
                      {collab.filePath && (
                        <button
                          onClick={() => handleDownloadFile(collab.filePath)}
                          className="text-blue-500 hover:underline"
                        >
                          View/Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
