import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Fallback to localhost if env variable is not set

export default function NomineeDetails({ nominee, onBack }) {
  const [nominators, setNominators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [details, setDetails] = useState(null);
  const [showApplication, setShowApplication] = useState(false);

  useEffect(() => {
    fetchNominators();
    fetchDetails();
  }, [nominee.id]);

  const fetchNominators = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/admin/nominees/${nominee.id}/nominators`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setNominators(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch nominators');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async () => {
    try {
      const response = await axios.get(`${API}/admin/nominees/${nominee.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setDetails(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch nominee details');
    }
  };

  const handleDownloadApplication = async () => {
    try {
      const response = await axios.get(`${API}/admin/nominees/${nominee.id}/download-application`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${nominee.fullName}-application.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.message || 'Failed to download application');
    }
  };

  const handleViewApplication = () => {
    setShowApplication(!showApplication);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <button onClick={onBack} className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to List
        </button>

        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <img
            src={nominee.photo ? `${API}${nominee.photo}` : 'https://via.placeholder.com/150'}
            alt={nominee.fullName}
            className="w-32 h-32 rounded-full shadow-lg object-cover border-4 border-indigo-600"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-2">{nominee.fullName || 'N/A'}</h1>
        <p className="text-center text-gray-600 mb-8">{nominee.email}</p>

        {/* Error Message */}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Application Form */}
            <div className="bg-indigo-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-indigo-800 mb-4">Application Form</h2>
              <div className="flex justify-between">
                <button
                  onClick={handleViewApplication}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-all"
                >
                  {showApplication ? 'Hide Form' : 'View Form'}
                </button>
                <button
                  onClick={handleDownloadApplication}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition-all"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Download PDF
                </button>
              </div>
              {showApplication && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300">
                  <p><strong>Passout Year:</strong> {nominee.passoutYear || 'N/A'}</p>
                  <p><strong>Company Name:</strong> {nominee.companyName || 'N/A'}</p>
                  <p><strong>Company Type:</strong> {nominee.companyType || 'N/A'}</p>
                  <p><strong>Company Website:</strong> {nominee.companyWebsite || 'N/A'}</p>
                  <p><strong>Registration Number:</strong> {nominee.registrationNumber || 'N/A'}</p>
                  <p><strong>Registration Date:</strong> {nominee.registrationDate || 'N/A'}</p>
                  <p><strong>Registered Address:</strong> {nominee.registeredAddress || 'N/A'}</p>
                  <p><strong>Registration Place:</strong> {nominee.registrationPlace || 'N/A'}</p>
                  <p><strong>Founder Type:</strong> {nominee.founderType || 'N/A'}</p>
                  <p><strong>Company Description:</strong> {nominee.companyDescription || 'N/A'}</p>
                  <p><strong>Year of Establishment:</strong> {nominee.yearOfEstablishment || 'N/A'}</p>
                  <p><strong>Total Employees:</strong> {nominee.totalEmployees || 'N/A'}</p>
                  <p><strong>Annual Turnover:</strong> {nominee.annualTurnover || 'N/A'}</p>
                  <p><strong>Business Domain:</strong> {nominee.businessDomain || 'N/A'}</p>
                  <p><strong>Key Innovations:</strong> {nominee.keyInnovations || 'N/A'}</p>
                  <p><strong>First Generation:</strong> {nominee.isFirstGeneration ? 'Yes' : 'No'}</p>
                  <p><strong>Unrelated to Family:</strong> {nominee.isUnrelatedToFamily ? 'Yes' : 'No'}</p>
                  <p><strong>Has IPRs:</strong> {nominee.hasIprs ? 'Yes' : 'No'}</p>
                  <p><strong>Has Mergers:</strong> {nominee.hasMergers ? 'Yes' : 'No'}</p>
                  <p><strong>Has Collaborations:</strong> {nominee.hasCollaborations ? 'Yes' : 'No'}</p>
                  <p><strong>Has Awards:</strong> {nominee.hasAwards ? 'Yes' : 'No'}</p>
                  <p><strong>Has Foreign Presence:</strong> {nominee.hasForeignPresence ? 'Yes' : 'No'}</p>
                  <p><strong>Has Sustainability:</strong> {nominee.hasSustainability ? 'Yes' : 'No'}</p>
                  <p><strong>IPR Description:</strong> {nominee.iprDescription || 'N/A'}</p>
                  <p><strong>Foreign Description:</strong> {nominee.foreignDescription || 'N/A'}</p>
                  <p><strong>Sustainability Description:</strong> {nominee.sustainabilityDescription || 'N/A'}</p>
                  <p><strong>Ethics Description:</strong> {nominee.ethicsDescription || 'N/A'}</p>
                </div>
              )}
            </div>

            {/* Nominators */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Nominators ({nominators.length})</h2>
              {nominators.length > 0 ? (
                <ul className="space-y-3">
                  {nominators.map((nominator) => (
                    <li key={nominator.id} className="p-3 bg-white rounded-lg shadow-sm">
                      <p><strong>Name:</strong> {nominator.fullName || 'N/A'}</p>
                      <p><strong>Email:</strong> {nominator.email}</p>
                      <p><strong>Nominated On:</strong> {new Date(nominator.nominatedOn).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No nominators yet.</p>
              )}
            </div>

            {/* Uploaded Files and Details */}
            <div className="lg:col-span-2 bg-green-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Uploaded Files and Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Awards */}
                <div>
                  <h3 className="text-lg font-medium text-green-700 mb-2">Awards</h3>
                  {details?.awards?.map((award, index) => (
                    <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                      <p><strong>Name:</strong> {award.name || 'N/A'}</p>
                      <p><strong>Awarded By:</strong> {award.awardedBy || 'N/A'}</p>
                      <p><strong>Year:</strong> {award.yearReceived || 'N/A'}</p>
                      <p><strong>Description:</strong> {award.description || 'N/A'}</p>
                      {award.filePath && (
                        <a href={`${API}${award.filePath}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          View PDF
                        </a>
                      )}
                    </div>
                  )) || <p className="text-gray-500">No awards.</p>}
                </div>

                {/* IPRs */}
                <div>
                  <h3 className="text-lg font-medium text-green-700 mb-2">IPRs</h3>
                  {details?.iprs?.map((ipr, index) => (
                    <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                      <p><strong>Type:</strong> {ipr.type || 'N/A'}</p>
                      <p><strong>Title:</strong> {ipr.title || 'N/A'}</p>
                      <p><strong>Registration Number:</strong> {ipr.registrationNumber || 'N/A'}</p>
                      {ipr.filePath && (
                        <a href={`${API}${ipr.filePath}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          View PDF
                        </a>
                      )}
                    </div>
                  )) || <p className="text-gray-500">No IPRs.</p>}
                </div>

                {/* Mergers */}
                <div>
                  <h3 className="text-lg font-medium text-green-700 mb-2">Mergers</h3>
                  {details?.mergers?.map((merger, index) => (
                    <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                      <p><strong>Company:</strong> {merger.mergerCompany || 'N/A'}</p>
                      <p><strong>Type:</strong> {merger.mergerType || 'N/A'}</p>
                      <p><strong>Year:</strong> {merger.mergerYear || 'N/A'}</p>
                      <p><strong>Description:</strong> {merger.mergerDescription || 'N/A'}</p>
                      {merger.filePath && (
                        <a href={`${API}${merger.filePath}` } target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          View PDF
                        </a>
                      )}
                    </div>
                  )) || <p className="text-gray-500">No mergers.</p>}
                </div>

                {/* Collaborations */}
                <div>
                  <h3 className="text-lg font-medium text-green-700 mb-2">Collaborations</h3>
                  {details?.collaborations?.map((collab, index) => (
                    <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                      <p><strong>Institution:</strong> {collab.institutionName || 'N/A'}</p>
                      <p><strong>Type:</strong> {collab.type || 'N/A'}</p>
                      <p><strong>Duration:</strong> {collab.duration || 'N/A'}</p>
                      <p><strong>Outcomes:</strong> {collab.outcomes || 'N/A'}</p>
                      {collab.filePath && (
                        <a href={`${API}${collab.filePath}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          View PDF
                        </a>
                      )}
                    </div>
                  )) || <p className="text-gray-500">No collaborations.</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
