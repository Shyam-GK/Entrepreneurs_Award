import React from 'react';

export default function Step2({ data, handleChange, addArrayItem, removeArrayItem }) {
  // Ensure at least one IPR block
  const iprs = data.hasIprs === 'true' && data.iprs && data.iprs.length > 0 ? data.iprs : [{}];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-center text-gray-700">Step 2: Innovation & IP</h3>

      <div>
        <label htmlFor="keyInnovations" className="block text-sm font-medium text-gray-700 mb-1">
          Briefly describe the key innovations introduced by your organization:
        </label>
        <textarea
          id="keyInnovations"
          name="keyInnovations"
          rows="4"
          required
          value={data.keyInnovations || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
        ></textarea>
      </div>

      <fieldset className="pt-4 border-t border-gray-200">
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Has your organization filed or been granted any Intellectual Property Rights (IPRs)?
        </legend>
        <div className="flex items-center gap-x-6">
          <div className="flex items-center">
            <input
              id="iprYes"
              name="hasIprs"
              type="radio"
              value="true"
              required
              checked={data.hasIprs === 'true'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="iprYes" className="ml-2 block text-sm text-gray-900">Yes</label>
          </div>
          <div className="flex items-center">
            <input
              id="iprNo"
              name="hasIprs"
              type="radio"
              value="false"
              checked={data.hasIprs === 'false'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="iprNo" className="ml-2 block text-sm text-gray-900">No</label>
          </div>
        </div>
      </fieldset>

      {data.hasIprs === 'true' && (
        <div className="space-y-6 pt-4 border-t border-gray-200 mt-6">
          <p className="text-sm font-medium text-gray-700">Provide details for each IPR:</p>
          {iprs.map((ipr, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-gray-700">IPR #{index + 1}</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type (e.g., Patent, Trademark):</label>
                <input
                  type="text"
                  name="type"
                  value={ipr.type || ''}
                  onChange={(e) => handleChange(e, 'iprs', index)}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                  placeholder="e.g., Patent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
                <input
                  type="text"
                  name="title"
                  value={ipr.title || ''}
                  onChange={(e) => handleChange(e, 'iprs', index)}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                  placeholder="e.g., Innovative Widget"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number:</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={ipr.registrationNumber || ''}
                  onChange={(e) => handleChange(e, 'iprs', index)}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                  placeholder="e.g., US1234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload IPR Certificate:</label>
                {ipr.file && (
                  <div className="mt-2 p-2 border border-green-200 bg-green-50 rounded-md text-sm">
                    <span className="font-medium text-green-800">Selected:</span> {ipr.file.name}
                    {ipr.file._isPlaceholder && (
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
                  onChange={(e) => handleChange(e, 'iprs', index)}
                  className="w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {iprs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('iprs', index)}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Remove IPR
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('iprs')}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Another IPR
          </button>
        </div>
      )}
    </div>
  );
}