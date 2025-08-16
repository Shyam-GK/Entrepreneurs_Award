import React from 'react';

export default function Step1({ data, handleChange }) {
  // --- Dynamic Year Generation for Dropdowns ---
  const passoutYears = [];
  for (let year = 2000; year >= 1955; year--) {
    passoutYears.push(year);
  }

  const establishmentYears = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1955; year--) {
    establishmentYears.push(year);
  }

  // --- Validate Date Format ---
  const validateDate = (value) => {
    if (!value) return false; // Required field
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value)) return false;
    const date = new Date(value);
    return !isNaN(date.getTime()) && date.getFullYear() >= 1900 && date.getFullYear() <= currentYear;
  };

  // --- Handle Date Change with Validation ---
  const handleDateChange = (e) => {
    const { value } = e.target;
    console.log(`Step1: registrationDate input changed to: ${value}`);
    if (value && !validateDate(value)) {
      console.warn(`Step1: Invalid date format for registrationDate: ${value}`);
      e.target.setCustomValidity('Please select a valid date (YYYY-MM-DD) between 1900 and today.');
    } else {
      e.target.setCustomValidity('');
    }
    handleChange(e);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-center text-gray-700">Step 1: Company Information</h3>

      {/* --- Personal & Founder Details --- */}
      <div>
        <label htmlFor="user-photo" className="block text-sm font-medium text-gray-700 mb-1">
          Upload Your Photograph:
        </label>
        {data.photo && (
          <div className="mt-2 p-2 border border-green-200 bg-green-50 rounded-md text-sm">
            <span className="font-medium text-green-800">Selected:</span> {data.photo.name}
            {data.photo._isPlaceholder && (
              <p className="text-xs text-orange-600 mt-1">
                You refreshed the page. Please re-select this file to confirm.
              </p>
            )}
          </div>
        )}
        <input
          type="file"
          id="user-photo"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className="w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label htmlFor="passoutYear" className="block text-sm font-medium text-gray-700 mb-1">
          Year of Passing:
        </label>
        <select
          id="passoutYear"
          name="passoutYear"
          value={data.passoutYear || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
        >
          <option value="" disabled>
            Select Year
          </option>
          {passoutYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Are you a founder or co-founder?
        </legend>
        <div className="flex items-center gap-x-6">
          <div className="flex items-center">
            <input
              type="radio"
              id="founder"
              name="founderType"
              value="Founder"
              checked={data.founderType === 'Founder'}
              onChange={handleChange}
              required
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="founder" className="ml-2">
              Founder
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="co-founder"
              name="founderType"
              value="Co-Founder"
              checked={data.founderType === 'Co-Founder'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="co-founder" className="ml-2">
              Co-Founder
            </label>
          </div>
        </div>
      </fieldset>

      {/* --- Company Details --- */}
      <div>
        <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">
          Name of the Company:
        </label>
        <input
          type="text"
          id="company-name"
          name="companyName"
          value={data.companyName || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="about-company" className="block text-sm font-medium text-gray-700 mb-1">
          About the Company (Brief Profile):
        </label>
        <textarea
          id="about-company"
          name="companyDescription"
          required
          rows="4"
          value={data.companyDescription || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
        ></textarea>
      </div>

      <div>
        <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-1">
          Company Website:
        </label>
        <input
          type="url"
          id="companyWebsite"
          name="companyWebsite"
          value={data.companyWebsite || ''}
          onChange={handleChange}
          required
          placeholder="https://example.com"
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="yearOfEstablishment" className="block text-sm font-medium text-gray-700 mb-1">
          Year of Establishment:
        </label>
        <select
          id="yearOfEstablishment"
          name="yearOfEstablishment"
          value={data.yearOfEstablishment || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
        >
          <option value="" disabled>
            Select Year
          </option>
          {establishmentYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="totalEmployees" className="block text-sm font-medium text-gray-700 mb-1">
          Total Employees:
        </label>
        <input
          type="number"
          id="totalEmployees"
          name="totalEmployees"
          value={data.totalEmployees || ''}
          onChange={handleChange}
          required
          placeholder="e.g., 150"
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="annualTurnover" className="block text-sm font-medium text-gray-700 mb-1">
          Annual Turnover (in Crores):
        </label>
        <input
          type="number"
          id="annualTurnover"
          name="annualTurnover"
          value={data.annualTurnover || ''}
          onChange={handleChange}
          required
          placeholder="e.g., 250"
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
        />
      </div>

      {/* --- Registration Details --- */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-gray-700 mb-2">Type of Entity:</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['Private Limited Company', 'Public Limited Company', 'Partnership Firm', 'LLP', 'Sole Proprietorship'].map(
            (type) => (
              <div key={type} className="flex items-center">
                <input
                  type="radio"
                  id={type.toLowerCase().replace(/ /g, '-')}
                  name="companyType"
                  value={type}
                  checked={data.companyType === type}
                  onChange={handleChange}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={type.toLowerCase().replace(/ /g, '-')} className="ml-2">
                  {type}
                </label>
              </div>
            )
          )}
          <div className="flex items-center col-span-1 sm:col-span-2">
            <input
              type="radio"
              id="other"
              name="companyType"
              value="Other"
              checked={data.companyType === 'Other'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="other" className="ml-2">Others:</label>
            {data.companyType === 'Other' && (
              <input
                type="text"
                name="companyTypeOther"
                value={data.companyTypeOther || ''}
                onChange={handleChange}
                className="ml-2 flex-grow px-2 py-1 rounded-md bg-white border border-gray-300"
              />
            )}
          </div>
        </div>
      </fieldset>

      <div>
        <label htmlFor="reg-number" className="block text-sm font-medium text-gray-700 mb-1">
          Company Registration Number (CIN / LLPIN / etc.):
        </label>
        <input
          type="text"
          id="reg-number"
          name="registrationNumber"
          value={data.registrationNumber || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="reg-date" className="block text-sm font-medium text-gray-700 mb-1">
          Date of Incorporation / Registration:
        </label>
        <input
          type="date"
          id="reg-date"
          name="registrationDate"
          value={data.registrationDate || ''}
          onChange={handleDateChange}
          required
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="reg-address" className="block text-sm font-medium text-gray-700 mb-1">
          Registered Address of the Company:
        </label>
        <textarea
          id="reg-address"
          name="registeredAddress"
          value={data.registeredAddress || ''}
          onChange={handleChange}
          required
          rows="3"
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
        ></textarea>
      </div>

      <div>
        <label htmlFor="reg-place" className="block text-sm font-medium text-gray-700 mb-1">
          Place of Registration (City, State, Country):
        </label>
        <input
          type="text"
          id="reg-place"
          name="registrationPlace"
          value={data.registrationPlace || ''}
          onChange={handleChange}
          placeholder="e.g., Coimbatore, Tamil Nadu, India"
          required
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="reg-cert" className="block text-sm font-medium text-gray-700 mb-1">
          Copy of Registration Certificate:
        </label>
        {data.registrationCertificate && (
          <div className="mt-2 p-2 border border-green-200 bg-green-50 rounded-md text-sm">
            <span className="font-medium text-green-800">Selected:</span> {data.registrationCertificate.name}
            {data.registrationCertificate._isPlaceholder && (
              <p className="text-xs text-orange-600 mt-1">
                You refreshed the page. Please re-select this file to confirm.
              </p>
            )}
          </div>
        )}
        <input
          type="file"
          id="reg-cert"
          name="registrationCertificate"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleChange}
          className="w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* --- Entrepreneur Type --- */}
      <fieldset className="pt-4 border-t border-gray-200">
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Are you a first-generation entrepreneur?
        </legend>
        <div className="flex items-center gap-x-6">
          <div className="flex items-center">
            <input
              type="radio"
              id="first-gen-yes"
              name="isFirstGeneration"
              value="true"
              checked={data.isFirstGeneration === 'true'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="first-gen-yes" className="ml-2">
              Yes
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="first-gen-no"
              name="isFirstGeneration"
              value="false"
              checked={data.isFirstGeneration === 'false'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="first-gen-no" className="ml-2">
              No
            </label>
          </div>
        </div>
      </fieldset>

      {data.isFirstGeneration === 'false' && (
        <div className="pt-4 border-t border-gray-200">
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Is your business entirely unrelated to your family’s existing business?
            </legend>
            <div className="flex items-center gap-x-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="unrelated-yes"
                  name="isUnrelatedToFamily"
                  value="true"
                  checked={data.isUnrelatedToFamily === 'true'}
                  onChange={handleChange}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="unrelated-yes" className="ml-2">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="unrelated-no"
                  name="isUnrelatedToFamily"
                  value="false"
                  checked={data.isUnrelatedToFamily === 'false'}
                  onChange={handleChange}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="unrelated-no" className="ml-2">
                  No
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
}
