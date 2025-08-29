import React from 'react';

export default function Step5({ data, handleChange }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-center text-gray-700">Step 5: Sustainability & Ethics</h3>

      <fieldset className="pt-4 border-t border-gray-200">
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Does your organization follow any sustainability practices or contribute to environmental, social, or economic development?
        </legend>
        <div className="flex items-center gap-x-6">
          <div className="flex items-center">
            <input
              id="sustainabilityYes"
              name="hasSustainability"
              type="radio"
              value="true"
              required
              checked={data.hasSustainability === 'true'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="sustainabilityYes" className="ml-2 block text-sm text-gray-900">Yes</label>
          </div>
          <div className="flex items-center">
            <input
              id="sustainabilityNo"
              name="hasSustainability"
              type="radio"
              value="false"
              checked={data.hasSustainability === 'false'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="sustainabilityNo" className="ml-2 block text-sm text-gray-900">No</label>
          </div>
        </div>
      </fieldset>

      {data.hasSustainability === 'true' && (
        <div>
          <label htmlFor="sustainabilityDescription" className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
          <textarea
            id="sustainabilityDescription"
            name="sustainabilityDescription"
            rows="4"
            value={data.sustainabilityDescription || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
          ></textarea>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <label htmlFor="ethicsDescription" className="block text-sm font-medium text-gray-700 mb-1">
          Briefly describe how your organization ensures ethical business operations and legal compliance:
        </label>
        <textarea
          id="ethicsDescription"
          name="ethicsDescription"
          rows="4"
          required
          value={data.ethicsDescription || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
        ></textarea>
      </div>

      <fieldset className="pt-4 border-t border-gray-200">
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          Does your organization have a Code of Professional Conduct (CPC)?
        </legend>
        <div className="flex items-center gap-x-6">
          <div className="flex items-center">
            <input
              id="cpcYes"
              name="hasCpc"
              type="radio"
              value="true"
              required
              checked={data.hasCpc === 'true'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="cpcYes" className="ml-2 block text-sm text-gray-900">Yes</label>
          </div>
          <div className="flex items-center">
            <input
              id="cpcNo"
              name="hasCpc"
              type="radio"
              value="false"
              checked={data.hasCpc === 'false'}
              onChange={handleChange}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="cpcNo" className="ml-2 block text-sm text-gray-900">No</label>
          </div>
        </div>
      </fieldset>

      {data.hasCpc === 'true' && (
        <div>
          <label htmlFor="cpcDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Describe your organization’s Code of Professional Conduct:
          </label>
          <textarea
            id="cpcDescription"
            name="cpcDescription"
            rows="4"
            value={data.cpcDescription || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300"
          ></textarea>
        </div>
      )}
    </div>
  );
}