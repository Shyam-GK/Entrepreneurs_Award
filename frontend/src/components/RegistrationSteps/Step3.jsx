import React from 'react';

const VALID_MERGER_TYPES = ['Merger', 'Acquisition', 'Partnership'];

export default function Step3({ data, handleChange, addArrayItem, removeArrayItem }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-center text-gray-700">Step 3: Merger & Acquisition</h3>

      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Has your company undergone any merger or acquisition involving a corporate or multinational company (MNC)?
        </legend>
        <div className="flex items-center gap-x-6">
          <div className="flex items-center">
            <input
              id="mergerYes"
              name="hasMergers"
              type="radio"
              value="true"
              required
              checked={data.hasMergers === 'true'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="mergerYes" className="ml-2 block text-sm text-gray-900">Yes</label>
          </div>
          <div className="flex items-center">
            <input
              id="mergerNo"
              name="hasMergers"
              type="radio"
              value="false"
              checked={data.hasMergers === 'false'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="mergerNo" className="ml-2 block text-sm text-gray-900">No</label>
          </div>
        </div>
      </fieldset>

      {data.hasMergers === 'true' && (
        <div className="space-y-6 pt-4 border-t border-gray-200 mt-6">
          <p className="text-sm font-medium text-gray-700">Provide details for each merger or acquisition:</p>
          {(data.mergers || []).length > 0 ? (
            data.mergers.map((merger, index) => (
              <div key={index} className="space-y-4 border p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700">Merger/Acquisition #{index + 1}</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name of the Corporate/MNC Involved:</label>
                  <input
                    type="text"
                    name="mergerCompany"
                    value={merger.mergerCompany || ''}
                    onChange={(e) => handleChange(e, 'mergers', index)}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                    placeholder="e.g., Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Merger Type:</label>
                  <select
                    name="mergerType"
                    value={merger.mergerType || ''}
                    onChange={(e) => handleChange(e, 'mergers', index)}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                  >
                    <option value="" disabled>Select Type</option>
                    {VALID_MERGER_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Merger Year:</label>
                  <input
                    type="number"
                    name="mergerYear"
                    value={merger.mergerYear || ''}
                    onChange={(e) => handleChange(e, 'mergers', index)}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                    placeholder="e.g., 2020"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description of the Deal:</label>
                  <textarea
                    name="mergerDescription"
                    value={merger.mergerDescription || ''}
                    onChange={(e) => handleChange(e, 'mergers', index)}
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
                    placeholder="Describe the merger or acquisition"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Supporting Document:</label>
                  {merger.file && (
                    <div className="mt-2 p-2 border border-green-200 bg-green-50 rounded-md text-sm">
                      <span className="font-medium text-green-800">Selected:</span> {merger.file.name}
                      {merger.file._isPlaceholder && (
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
                    onChange={(e) => handleChange(e, 'mergers', index)}
                    className="w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem('mergers', index)}
                  className="text-red-500 hover:underline"
                >
                  Remove Merger
                </button>
              </div>
            ))
          ) : (
            <p>No mergers added yet.</p>
          )}
          <button
            type="button"
            onClick={() => addArrayItem('mergers')}
            className="mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Add Merger
          </button>
        </div>
      )}
    </div>
  );
}