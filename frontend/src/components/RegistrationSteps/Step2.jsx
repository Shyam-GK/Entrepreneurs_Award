import React from 'react';

export default function Step2({ data, handleChange, addArrayItem, removeArrayItem }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-center text-gray-700">Step 2: Innovation & IP</h3>

      <div>
        <label htmlFor="keyInnovations" className="block text-sm font-medium text-gray-700 mb-1">
          Briefly describe the key innovations introduced by your company:
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

      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Have you filed or been granted any Intellectual Property Rights (IPRs)?
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
          {(data.iprs || []).length > 0 ? (
            data.iprs.map((ipr, index) => (
              <div key={index} className="space-y-4 border p-4 rounded-lg">
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
                <button
                  type="button"
                  onClick={() => removeArrayItem('iprs', index)}
                  className="text-red-500 hover:underline"
                >
                  Remove IPR
                </button>
              </div>
            ))
          ) : (
            <p>No IPRs added yet.</p>
          )}
          <button
            type="button"
            onClick={() => addArrayItem('iprs')}
            className="mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Add IPR
          </button>
        </div>
      )}
    </div>
  );
}