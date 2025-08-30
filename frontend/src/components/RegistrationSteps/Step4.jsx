import React from 'react';

export default function Step4({ data, handleChange, addArrayItem, removeArrayItem }) {
  const currentYear = new Date().getFullYear();
  const awardYears = [];
  for (let year = currentYear; year >= 1950; year--) {
    awardYears.push(year);
  }

  // Ensure at least one award and collaboration block
  const awards = data.hasAwards === 'true' && data.awards && data.awards.length > 0 ? data.awards : [{}];
  const collaborations = data.hasCollaborations === 'true' && data.collaborations && data.collaborations.length > 0 ? data.collaborations : [{}];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-center text-gray-700">Step 4: Awards & Collaborations</h3>

      <fieldset className="pt-4 border-t border-gray-200">
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Has your organization established foreign collaborations or maintained an international presence?
        </legend>
        <div className="flex items-center gap-x-6">
          <div className="flex items-center">
            <input
              id="foreignYes"
              name="hasForeignPresence"
              type="radio"
              value="true"
              required
              checked={data.hasForeignPresence === 'true'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="foreignYes" className="ml-2 block text-sm text-gray-900">Yes</label>
          </div>
          <div className="flex items-center">
            <input
              id="foreignNo"
              name="hasForeignPresence"
              type="radio"
              value="false"
              checked={data.hasForeignPresence === 'false'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="foreignNo" className="ml-2 block text-sm text-gray-900">No</label>
          </div>
        </div>
      </fieldset>

      {data.hasForeignPresence === 'true' && (
        <div className="space-y-4 pt-4 border-t border-gray-200 mt-6">
          <label htmlFor="foreignDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Please describe the nature of your organization’s foreign collaborations or international presence:
          </label>
          <textarea
            id="foreignDescription"
            name="foreignDescription"
            value={data.foreignDescription || ''}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
          ></textarea>
        </div>
      )}

      <fieldset className="pt-4 border-t border-gray-200">
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Has your organization or the applicant received any notable awards, certifications, or recognitions?
        </legend>
        <div className="flex items-center gap-x-6">
          <div className="flex items-center">
            <input
              id="awardsYes"
              name="hasAwards"
              type="radio"
              value="true"
              required
              checked={data.hasAwards === 'true'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="awardsYes" className="ml-2 block text-sm text-gray-900">Yes</label>
          </div>
          <div className="flex items-center">
            <input
              id="awardsNo"
              name="hasAwards"
              type="radio"
              value="false"
              checked={data.hasAwards === 'false'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="awardsNo" className="ml-2 block text-sm text-gray-900">No</label>
          </div>
        </div>
      </fieldset>

      {data.hasAwards === 'true' && (
        <div className="space-y-6 pt-4 border-t border-gray-200 mt-6">
          <p className="text-sm font-medium text-gray-700">Provide details for each award:</p>
          {awards.map((award, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-gray-700">Award #{index + 1}</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Award Name:</label>
                <input
                  type="text"
                  name="name"
                  value={award.name || ''}
                  onChange={(e) => handleChange(e, 'awards', index)}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                  placeholder="e.g., Innovation Award"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Awarded By:</label>
                <input
                  type="text"
                  name="awardedBy"
                  value={award.awardedBy || ''}
                  onChange={(e) => handleChange(e, 'awards', index)}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                  placeholder="e.g., Industry Association"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level (e.g., National, International):</label>
                <input
                  type="text"
                  name="level"
                  value={award.level || ''}
                  onChange={(e) => handleChange(e, 'awards', index)}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                  placeholder="e.g., National"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
                <input
                  type="text"
                  name="category"
                  value={award.category || ''}
                  onChange={(e) => handleChange(e, 'awards', index)}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                  placeholder="e.g., Technology"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Received:</label>
                <select
                  name="yearReceived"
                  value={award.yearReceived || ''}
                  onChange={(e) => handleChange(e, 'awards', index)}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                >
                  <option value="" disabled>Select Year</option>
                  {awardYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                <textarea
                  name="description"
                  value={award.description || ''}
                  onChange={(e) => handleChange(e, 'awards', index)}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                  placeholder="Describe the award"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Award Certificate:(MAX 25MB)</label>
                {award.file && (
                  <div className="mt-2 p-2 border border-green-200 bg-green-50 rounded-md text-sm">
                    <span className="font-medium text-green-800">Selected:</span> {award.file.name}
                    {award.file._isPlaceholder && (
                      <p className="text-xs text-orange-600 mt-1">
                        You refreshed the page. Please re-select this file to confirm.
                      </p>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  name="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleChange(e, 'awards', index)}
                  className="w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {awards.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('awards', index)}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Remove Award
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('awards')}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Another Award
          </button>
        </div>
      )}

      <fieldset className="pt-4 border-t border-gray-200">
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Has your organization established any collaborations with other institutions?
        </legend>
        <div className="flex items-center gap-x-6">
          <div className="flex items-center">
            <input
              id="collabYes"
              name="hasCollaborations"
              type="radio"
              value="true"
              required
              checked={data.hasCollaborations === 'true'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="collabYes" className="ml-2 block text-sm text-gray-900">Yes</label>
          </div>
          <div className="flex items-center">
            <input
              id="collabNo"
              name="hasCollaborations"
              type="radio"
              value="false"
              checked={data.hasCollaborations === 'false'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="collabNo" className="ml-2 block text-sm text-gray-900">No</label>
          </div>
        </div>
      </fieldset>

      {data.hasCollaborations === 'true' && (
        <div className="space-y-6 pt-4 border-t border-gray-200 mt-6">
          <p className="text-sm font-medium text-gray-700">Provide details for each collaboration:</p>
          {collaborations.map((collab, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-gray-700">Collaboration #{index + 1}</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name:</label>
                <input
                  type="text"
                  name="institutionName"
                  value={collab.institutionName || ''}
                  onChange={(e) => handleChange(e, 'collaborations', index)}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                  placeholder="e.g., XYZ University"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type of Collaboration:</label>
                <input
                  type="text"
                  name="type"
                  value={collab.type || ''}
                  onChange={(e) => handleChange(e, 'collaborations', index)}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                  placeholder="e.g., Research Partnership"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration:</label>
                <input
                  type="text"
                  name="duration"
                  value={collab.duration || ''}
                  onChange={(e) => handleChange(e, 'collaborations', index)}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                  placeholder="e.g., 2020-2022"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outcomes:</label>
                <textarea
                  name="outcomes"
                  value={collab.outcomes || ''}
                  onChange={(e) => handleChange(e, 'collaborations', index)}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                  placeholder="Describe the outcomes of the collaboration"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Supporting Document:(MAX 25MB)</label>
                {collab.file && (
                  <div className="mt-2 p-2 border border-green-200 bg-green-50 rounded-md text-sm">
                    <span className="font-medium text-green-800">Selected:</span> {collab.file.name}
                    {collab.file._isPlaceholder && (
                      <p className="text-xs text-orange-600 mt-1">
                        You refreshed the page. Please re-select this file to confirm.
                      </p>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  name="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleChange(e, 'collaborations', index)}
                  className="w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {collaborations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('collaborations', index)}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Remove Collaboration
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('collaborations')}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Another Collaboration
          </button>
        </div>
      )}
    </div>
  );
}