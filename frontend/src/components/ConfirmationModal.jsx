import React from 'react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) {
        return null;
    }

    return (
        // These classes create the dimmed, blurred background effect
        <div
            className="fixed inset-0 bg-opacity backdrop-blura flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-8 rounded-lg shadow-xl text-center w-11/12 max-w-md"
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
            >
                <h3 className="text-xl font-bold mb-4">Confirm Submission</h3>
                <p className="text-gray-700 mb-6">Are you sure you want to submit? Changes cannot be made later.</p>
                <div className="flex justify-center gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="nav-button text-white font-bold py-2 px-6 rounded-lg cursor-pointer"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}