import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface GuidelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  guidelines: {
    alternatives?: string[];
    recommendations?: string[];
    notes?: string[];
  };
}

export const GuidelineModal: React.FC<GuidelineModalProps> = ({
  isOpen,
  onClose,
  title,
  guidelines,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-2xl w-full mx-auto shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {guidelines.alternatives && guidelines.alternatives.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Alternative Options</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {guidelines.alternatives.map((alt, idx) => (
                    <li key={idx}>{alt}</li>
                  ))}
                </ul>
              </div>
            )}

            {guidelines.recommendations && guidelines.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {guidelines.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {guidelines.notes && guidelines.notes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Notes</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {guidelines.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 rounded-b-lg">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 