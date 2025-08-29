import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StepIndicator from '../components/StepIndicator';
import Step1 from '../components/RegistrationSteps/Step1';
import Step2 from '../components/RegistrationSteps/Step2';
import Step3 from '../components/RegistrationSteps/Step3';
import Step4 from '../components/RegistrationSteps/Step4';
import Step5 from '../components/RegistrationSteps/Step5';
import ConfirmationModal from '../components/ConfirmationModal';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Valid enum values (must match backend DTOs and database schema)
const VALID_AWARD_LEVELS = ['National', 'International', 'Industry'];
const VALID_IPR_TYPES = ['Patent', 'Trademark', 'Copyright'];
const VALID_MERGER_TYPES = ['Merger', 'Acquisition', 'Partnership'];
const VALID_COLLABORATION_TYPES = ['Academic', 'Industry', 'Government'];

/** Safely decode JWT payload (base64url) */
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** POST JSON with Bearer auth */
async function postJson(url, body, token, refreshTokenFn) {
  let currentToken = token;
  try {
    console.log('Sending request to:', url, 'with token:', currentToken);
    console.log('Request body:', JSON.stringify(body, null, 2));
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(body),
    });
    if (res.status === 401) {
      console.log('Received 401, attempting to refresh token');
      try {
        currentToken = await refreshTokenFn();
        console.log('Retrying with new token:', currentToken);
        const retryRes = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify(body),
        });
        if (!retryRes.ok) {
          const text = await retryRes.text().catch(() => '');
          throw new Error(text || `Request failed: ${retryRes.status}`);
        }
        const ct = retryRes.headers.get('content-type') || '';
        return ct.includes('application/json') ? retryRes.json() : retryRes.text();
      } catch (refreshErr) {
        throw new Error('Session expired. Please log in again.');
      }
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Request failed: ${res.status}`);
    }
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
  } catch (err) {
    console.error('postJson error:', err.message);
    throw err;
  }
}

/** POST FormData with Bearer auth */
async function postForm(url, formData, token, refreshTokenFn) {
  let currentToken = token;
  try {
    console.log('Sending FormData request to:', url, 'with token:', currentToken);
    for (const [key, value] of formData.entries()) {
      console.log(`FormData entry: ${key}=${value instanceof File ? value.name : value}`);
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${currentToken}` },
      body: formData,
    });
    if (res.status === 401) {
      console.log('Received 401, attempting to refresh token');
      try {
        currentToken = await refreshTokenFn();
        console.log('Retrying with new token:', currentToken);
        const retryRes = await fetch(url, {
          method: 'POST',
          headers: { Authorization: `Bearer ${currentToken}` },
          body: formData,
        });
        if (!retryRes.ok) {
          const text = await retryRes.text().catch(() => '');
          throw new Error(text || `Upload failed: ${retryRes.status}`);
        }
        const ct = retryRes.headers.get('content-type') || '';
        return ct.includes('application/json') ? retryRes.json() : retryRes.text();
      } catch (refreshErr) {
        throw new Error('Session expired. Please log in again.');
      }
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Upload failed: ${res.status}`);
    }
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
  } catch (err) {
    console.error('postForm error:', err.message);
    throw err;
  }
}

export default function RegistrationPage({ handleLogout }) {
  const navigate = useNavigate();

  // Persistent UI state
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = sessionStorage.getItem('registrationStep');
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  const [completedStep, setCompletedStep] = useState(() => {
    const savedCompleted = sessionStorage.getItem('completedStep');
    return savedCompleted ? parseInt(savedCompleted, 10) : 1;
  });

  const [formData, setFormData] = useState(() => {
    const savedData = sessionStorage.getItem('formData');
    return savedData
      ? JSON.parse(savedData)
      : {
          awards: [],
          iprs: [],
          mergers: [],
          collaborations: [],
          founderType: 'Founder',
          graduationDetails: [], // Initialize graduationDetails
        };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Refresh token function
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('No refresh token available');
      throw new Error('No refresh token available');
    }
    try {
      console.log('Attempting to refresh token with refreshToken:', refreshToken);
      const response = await fetch(`${API}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error('Refresh token request failed:', text || response.status);
        throw new Error(text || 'Failed to refresh token');
      }
      const data = await response.json();
      console.log('Refresh token response:', data);
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      return data.accessToken;
    } catch (err) {
      console.error('Refresh token error:', err.message);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw err;
    }
  };

  // Check for authentication and token validity
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('No access token found, redirecting to login');
      setError('Please log in to continue.');
      navigate('/login');
      return;
    }
    const payload = decodeJwtPayload(token);
    console.log('Token payload:', payload);
    if (payload && payload.exp && payload.exp * 1000 < Date.now()) {
      console.log('Token expired, attempting refresh');
      (async () => {
        try {
          await refreshAccessToken();
        } catch (err) {
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      })();
    }
  }, [navigate]);

  // Persist step + form to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('registrationStep', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    sessionStorage.setItem('completedStep', completedStep.toString());
  }, [completedStep]);

  useEffect(() => {
    const serializable = {};
    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        serializable[key] = formData[key].map((item) => {
          const serializedItem = { ...item };
          if (item.file instanceof File) {
            serializedItem.file = {
              _isPlaceholder: true,
              name: item.file.name,
              size: item.file.size,
              type: item.file.type,
            };
          }
          return serializedItem;
        });
      } else if (formData[key] instanceof File) {
        serializable[key] = {
          _isPlaceholder: true,
          name: formData[key].name,
          size: formData[key].size,
          type: formData[key].type,
        };
      } else {
        serializable[key] = formData[key];
      }
    }
    sessionStorage.setItem('formData', JSON.stringify(serializable));
  }, [formData]);

  // Warn on leave if there is data
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const hasData = Object.keys(formData).length > 0;
      if (hasData) {
        event.preventDefault();
        event.returnValue = 'Are you sure you want to leave? Your changes will be lost.';
      }
    };
    const hasData = Object.keys(formData).length > 0;
    if (hasData) window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData]);

  // Clear storage when navigating away
  useEffect(() => {
    const handlePageHide = (event) => {
      if (!event.persisted) {
        sessionStorage.removeItem('formData');
        sessionStorage.removeItem('registrationStep');
        sessionStorage.removeItem('completedStep');
      }
    };
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, []);

  const totalSteps = 5;

  // Handle form input changes
  const handleChange = (e, arrayField, index) => {
    const { name, value, type, checked, files } = e.target;
    console.log(`handleChange: name=${name}, value=${value}, type=${type}, arrayField=${arrayField}, index=${index}`);
    if (arrayField && index !== undefined) {
      setFormData((prev) => {
        const newArray = [...(prev[arrayField] || [])];
        newArray[index] = {
          ...newArray[index],
          [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value,
        };
        console.log(`Updated ${arrayField}[${index}]:`, newArray[index]);
        return { ...prev, [arrayField]: newArray };
      });
    } else {
      const newValue = type === 'file' ? files[0] : type === 'checkbox' ? checked : value;
      setFormData((prev) => {
        const updated = { ...prev, [name]: newValue };
        console.log(`Updated formData.${name}:`, newValue);
        return updated;
      });
    }
  };

  // Add a new item to an array field
  const addArrayItem = (arrayField) => {
    setFormData((prev) => ({
      ...prev,
      [arrayField]: [...(prev[arrayField] || []), {}],
    }));
  };

  // Remove an item from an array field
  const removeArrayItem = (arrayField, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayField]: prev[arrayField].filter((_, i) => i !== index),
    }));
  };

  // Navigation between steps
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setCompletedStep(Math.max(completedStep, currentStep + 1));
      console.log('Advancing to step:', currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      console.log('Going back to step:', currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    console.log('Navigating to step:', step);
  };

  // Build and normalize profile payload
  const buildProfilePayload = () => {
    const keys = [
      'passoutYear',
      'companyName',
      'companyType',
      'companyWebsite',
      'registrationNumber',
      'registrationDate',
      'registeredAddress',
      'registrationPlace',
      'founderType',
      'companyDescription',
      'yearOfEstablishment',
      'totalEmployees',
      'annualTurnover',
      'businessDomain',
      'keyInnovations',
      'isFirstGeneration',
      'isUnrelatedToFamily',
      'hasIprs',
      'hasMergers',
      'hasCollaborations',
      'hasAwards',
      'hasForeignPresence',
      'hasSustainability',
      'iprDescription',
      'foreignDescription',
      'sustainabilityDescription',
      'ethicsDescription',
    ];

    const raw = {};
    keys.forEach((k) => {
      let v = formData[k];
      if (k === 'companyType' && formData.companyType === 'Other') {
        v = formData.companyTypeOther || formData.companyType;
      }
      if (k === 'founderType' && v) {
        v = v === 'Founder' || v === 'Co-Founder' ? v : 'Founder';
      }
      if (k === 'registrationDate') {
        if (!v) {
          console.error('registrationDate is empty');
          setError('Registration date is required. Please select a valid date using the date picker.');
          return {};
        }
        try {
          const date = new Date(v);
          if (isNaN(date.getTime())) {
            console.error(`Invalid date format for registrationDate: ${v}`);
            setError('Invalid registration date format. Please select a valid date (YYYY-MM-DD).');
            return {};
          }
          v = v; // Keep as YYYY-MM-DD string
          console.log(`Processed registrationDate as YYYY-MM-DD string: ${v}`);
        } catch (err) {
          console.error(`Error parsing registrationDate: ${v}`, err);
          setError('Error parsing registration date. Please select a valid date using the date picker.');
          return {};
        }
      }
      if (v !== undefined && !(v instanceof File)) raw[k] = v;
    });

    const intFields = ['passoutYear', 'yearOfEstablishment', 'totalEmployees'];
    const numFields = ['annualTurnover'];
    const boolFields = [
      'isFirstGeneration',
      'isUnrelatedToFamily',
      'hasIprs',
      'hasMergers',
      'hasCollaborations',
      'hasAwards',
      'hasForeignPresence',
      'hasSustainability',
    ];

    intFields.forEach((k) => {
      if (raw[k] === '' || raw[k] === null || raw[k] === undefined) {
        delete raw[k];
      } else {
        const n = parseInt(raw[k], 10);
        if (!isNaN(n)) raw[k] = n;
        else delete raw[k];
      }
    });

    numFields.forEach((k) => {
      if (raw[k] === '' || raw[k] === null || raw[k] === undefined) {
        delete raw[k];
      } else {
        const n = parseFloat(raw[k]);
        if (!isNaN(n)) raw[k] = n;
        else delete raw[k];
      }
    });

    boolFields.forEach((k) => {
      if (raw[k] === 'true') raw[k] = true;
      else if (raw[k] === 'false') raw[k] = false;
      else if (raw[k] !== undefined) raw[k] = !!raw[k];
      else delete raw[k];
    });

    console.log('Built profile payload:', JSON.stringify(raw, null, 2));
    if (!raw.founderType) {
      console.error('founderType is missing in payload, defaulting to Founder');
      raw.founderType = 'Founder';
    }
    return raw;
  };

  // Validate and normalize array field DTOs
  const validateAndNormalizeDto = (item, fieldName) => {
    const dto = { ...item };
    if (fieldName === 'awards' && dto.level) {
      if (!VALID_AWARD_LEVELS.includes(dto.level)) {
        console.warn(`Invalid level: ${dto.level}, defaulting to ${VALID_AWARD_LEVELS[0]}`);
        dto.level = VALID_AWARD_LEVELS[0];
      }
      if (dto.yearReceived) {
        dto.yearReceived = parseInt(dto.yearReceived, 10);
        if (isNaN(dto.yearReceived)) delete dto.yearReceived;
      }
    }
    if (fieldName === 'iprs' && dto.type) {
      if (!VALID_IPR_TYPES.includes(dto.type)) {
        console.warn(`Invalid type: ${dto.type}, defaulting to ${VALID_IPR_TYPES[0]}`);
        dto.type = VALID_IPR_TYPES[0];
      }
    }
    if (fieldName === 'mergers' && dto.mergerType) {
      if (!VALID_MERGER_TYPES.includes(dto.mergerType)) {
        console.warn(`Invalid mergerType: ${dto.mergerType}, defaulting to ${VALID_MERGER_TYPES[0]}`);
        dto.mergerType = VALID_MERGER_TYPES[0];
      }
      if (dto.mergerYear) {
        dto.mergerYear = parseInt(dto.mergerYear, 10);
        if (isNaN(dto.mergerYear)) delete dto.mergerYear;
      }
    }
    if (fieldName === 'collaborations' && dto.type) {
      if (!VALID_COLLABORATION_TYPES.includes(dto.type)) {
        console.warn(`Invalid type: ${dto.type}, defaulting to ${VALID_COLLABORATION_TYPES[0]}`);
        dto.type = VALID_COLLABORATION_TYPES[0];
      }
    }
    if (fieldName === 'graduationDetails' && dto.graduationYear) {
      dto.graduationYear = parseInt(dto.graduationYear, 10);
      if (isNaN(dto.graduationYear)) delete dto.graduationYear;
    }
    return dto;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    // Validate registrationDate before submission
    const registrationDate = formData.registrationDate;
    if (!registrationDate) {
      console.error('registrationDate is empty');
      setError('Registration date is required. Please select a valid date using the date picker.');
      setSubmitting(false);
      setIsModalOpen(false);
      return;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(registrationDate)) {
      console.error(`Invalid registrationDate format: ${registrationDate}`);
      setError('Invalid registration date format. Please select a valid date (YYYY-MM-DD).');
      setSubmitting(false);
      setIsModalOpen(false);
      return;
    }
    const date = new Date(registrationDate);
    if (isNaN(date.getTime())) {
      console.error(`Invalid registrationDate value: ${registrationDate}`);
      setError('Invalid registration date. Please select a valid date using the date picker.');
      setSubmitting(false);
      setIsModalOpen(false);
      return;
    }
    if (date.getFullYear() < 1900 || date.getFullYear() > new Date().getFullYear()) {
      console.error(`registrationDate out of range: ${registrationDate}`);
      setError('Registration date must be between 1900 and today.');
      setSubmitting(false);
      setIsModalOpen(false);
      return;
    }

    // Validate graduationDetails
    const validGraduationDetails = (formData.graduationDetails || []).filter(
      (item) => item.degree && item.institution && item.graduationYear
    );
    if (validGraduationDetails.length > 0) {
      console.log('Valid graduationDetails:', validGraduationDetails);
    } else if (formData.graduationDetails && formData.graduationDetails.length > 0) {
      console.error('Some graduation details are incomplete');
      setError('Please ensure all graduation details have degree, institution, and year filled.');
      setSubmitting(false);
      setIsModalOpen(false);
      return;
    }

    try {
      let token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found during submission');
        throw new Error('No access token found. Please log in.');
      }
      console.log('Starting submission with token:', token);
      const payload = decodeJwtPayload(token);
      console.log('Token payload:', payload);
      if (!payload) {
        console.error('Invalid token format');
        throw new Error('Invalid access token format');
      }
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        console.log('Token expired, attempting refresh');
        token = await refreshAccessToken();
        console.log('New token after refresh:', token);
      }
      const userId = payload.id || payload.sub || payload.userId;
      if (!userId) {
        console.error('No user ID found in token payload:', payload);
        throw new Error('Invalid access token: No user ID found');
      }

      // Log full formData before submission
      console.log('Form data before submission:', JSON.stringify(formData, null, 2));

      // Step 1: Upload profile data
      console.log('Submitting profile data for user:', userId);
      const profilePayload = buildProfilePayload();
      if (Object.keys(profilePayload).length === 0 && profilePayload.constructor === Object) {
        console.error('Profile payload is empty due to validation errors');
        throw new Error('Failed to build profile payload. Please check your input data.');
      }
      console.log('Profile payload being sent:', JSON.stringify(profilePayload, null, 2));
      try {
        await postJson(`${API}/nominee-details/${userId}/profile`, profilePayload, token, refreshAccessToken);
      } catch (err) {
        console.error('Profile submission failed:', err.message);
        throw new Error(
          'Profile submission failed: Please ensure all required fields, including a valid registration date, are filled correctly and try again. If the issue persists, please contact support.'
        );
      }

      // Step 2: Upload graduation details
      if (validGraduationDetails.length > 0) {
        console.log('Submitting graduation details:', JSON.stringify(validGraduationDetails, null, 2));
        const graduationDtos = validGraduationDetails.map((item) => validateAndNormalizeDto(item, 'graduationDetails'));
        try {
          await postJson(
            `${API}/nominee-details/${userId}/graduation-details`,
            { dtos: graduationDtos },
            token,
            refreshAccessToken
          );
        } catch (err) {
          console.error('Graduation details submission failed:', err.message);
          throw new Error(`Graduation details submission failed: ${err.message}`);
        }
      }

      // Step 3: Upload files (photo, registrationCertificate)
      const fileFields = [
        { name: 'photo', type: 'photo' },
        { name: 'registrationCertificate', type: 'registration' },
      ];
      for (const { name, type } of fileFields) {
        if (formData[name] instanceof File) {
          console.log(`Uploading file for ${type}:`, formData[name].name);
          const form = new FormData();
          form.append('files', formData[name]);
          try {
            await postForm(`${API}/nominee-details/${userId}/upload/${type}`, form, token, refreshAccessToken);
          } catch (err) {
            console.error(`File upload failed for ${type}:`, err.message);
            throw new Error(`File upload failed for ${type}: ${err.message}`);
          }
        }
      }

      // Step 4: Upload array-based data with files (awards, iprs, mergers, collaborations)
      const arrayFields = [
        { name: 'awards', endpoint: 'awards' },
        { name: 'iprs', endpoint: 'iprs' },
        { name: 'mergers', endpoint: 'mergers' },
        { name: 'collaborations', endpoint: 'collaborations' },
      ];

      for (const { name, endpoint } of arrayFields) {
        const items = (formData[name] || []).filter(
          (item) => item.file instanceof File || Object.keys(item).some((k) => k !== 'file' && item[k])
        );
        if (items.length > 0) {
          console.log(`Submitting ${name} data:`, JSON.stringify(items, null, 2));
          const form = new FormData();
          const dtos = items.map((item, index) => {
            if (item.file instanceof File) {
              console.log(`Including file in ${name} at index ${index}:`, item.file.name);
              form.append('files', item.file);
            }
            const dto = validateAndNormalizeDto(item, name);
            return dto;
          });
          if (dtos.length > 0) {
            console.log(`Sending ${name} DTOs:`, JSON.stringify(dtos, null, 2));
            form.append('dtos', JSON.stringify(dtos));
            try {
              await postForm(`${API}/nominee-details/${userId}/${endpoint}`, form, token, refreshAccessToken);
            } catch (err) {
              console.error(`Submission failed for ${name}:`, err.message);
              throw new Error(`Submission failed for ${name}: ${err.message}`);
            }
          }
        }
      }

      // Clear session storage and navigate
      console.log('Submission successful, clearing session storage');
      sessionStorage.removeItem('formData');
      sessionStorage.removeItem('registrationStep');
      sessionStorage.removeItem('completedStep');
      navigate('/dashboard');
    } catch (err) {
      console.error('Submission error:', err.message);
      let errorMessage = err.message || 'An error occurred during submission.';
      try {
        const parsedError = JSON.parse(err.message);
        if (parsedError.message) {
          errorMessage = Array.isArray(parsedError.message)
            ? parsedError.message.join(', ')
            : parsedError.message;
          if (parsedError.message.includes('registrationDate must be a Date instance')) {
            errorMessage =
              'The server is unable to process the registration date. Please ensure a valid date is selected and try again. If the issue persists, please contact support.';
          }
        }
      } catch {
        // Not a JSON error, use raw message
      }
      setError(errorMessage);
      if (
        err.message.includes('Session expired') ||
        err.message.includes('Invalid access token') ||
        err.message.includes('No access token') ||
        err.message.includes('No refresh token')
      ) {
        console.log('Token-related error, redirecting to login');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      }
    } finally {
      setSubmitting(false);
      setIsModalOpen(false);
    }
  };

  // Confirm submission
  const confirmSubmit = () => {
    setIsModalOpen(true);
  };

  // Render current step
  const renderStep = () => {
    const props = { data: formData, handleChange, addArrayItem, removeArrayItem };
    switch (currentStep) {
      case 1:
        return <Step1 {...props} />;
      case 2:
        return <Step2 {...props} />;
      case 3:
        return <Step3 {...props} />;
      case 4:
        return <Step4 {...props} />;
      case 5:
        return <Step5 {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar handleLogout={handleLogout} />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Entrepreneur Award Registration</h2>
        <StepIndicator
          currentStep={currentStep}
          completedStep={completedStep}
          totalSteps={totalSteps}
          onStepClick={goToStep}
        />
        <div className="bg-white shadow-md rounded-lg p-6">
          {renderStep()}
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <div className="mt-6 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Previous
              </button>
            )}
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={confirmSubmit}
                disabled={submitting}
                className={`ml-auto bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg ${
                  submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSubmit}
          message="Are you sure you want to submit your application? You cannot edit it after submission."
        />
      </div>
    </div>
  );
}
