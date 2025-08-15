import React from 'react';

export default function NominationsModal({ isOpen, onClose, nominations }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-4xl bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Your Nominations</h2>
                    <button
                        onClick={onClose}
                        className="text-2xl font-bold text-gray-600 hover:text-gray-900"
                    >
                        &times;
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-gray-200/60">
                            <tr>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider text-center">Name</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-700 uppercase tracking-wider text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/80">
                            {nominations.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="text-center py-8 text-gray-500">
                                        No nominations done yet.
                                    </td>
                                </tr>
                            ) : (
                                nominations.map((nominee, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-800 text-center">{nominee.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-200 text-yellow-800">
                                                {nominee.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
