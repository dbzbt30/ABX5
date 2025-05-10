'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface PatientEducationProps {
  condition: string;
  isPediatric: boolean;
}

export const PatientEducation: React.FC<PatientEducationProps> = ({ condition, isPediatric }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const capInstructions = {
    general: [
      'Complete the full course of antibiotics as prescribed',
      'Rest and stay well-hydrated',
      'Use fever reducers (acetaminophen/ibuprofen) as needed',
      'Stop smoking and avoid secondhand smoke',
    ],
    followUp: [
      'Schedule follow-up in 48-72 hours if outpatient',
      'Return immediately if breathing becomes more difficult',
      'Return if fever persists beyond 48-72 hours of antibiotics',
      'Chest X-ray follow-up in 6-8 weeks for adults >50 years',
    ],
    redFlags: [
      'Difficulty breathing or shortness of breath',
      'Chest pain',
      'High fever (>39.4°C/103°F)',
      'Coughing up blood',
      'Confusion or severe drowsiness',
    ],
    pediatricSpecific: [
      'Monitor breathing rate and effort closely',
      'Ensure adequate fluid intake',
      'Keep track of wet diapers/urine output',
      'Position upright or semi-upright for comfort',
    ],
    expectedRecovery: [
      'Fever should improve within 48-72 hours',
      'Cough may persist for 2-4 weeks',
      'Full recovery typically takes 4-6 weeks',
      'Return to work/school when fever-free for 24 hours',
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <h2 className="text-2xl font-bold">Patient Instructions</h2>
        {isExpanded ? (
          <ChevronUpIcon className="h-6 w-6 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">General Instructions</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {capInstructions.general.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>

          {isPediatric && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Special Instructions for Children</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="list-disc pl-5 space-y-1">
                  {capInstructions.pediatricSpecific.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Return to Hospital If:</h3>
            <div className="bg-red-50 p-4 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {capInstructions.redFlags.map((flag, index) => (
                  <li key={index} className="text-red-700">{flag}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Follow-up Instructions</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {capInstructions.followUp.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Expected Recovery Timeline</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {capInstructions.expectedRecovery.map((timeline, index) => (
                  <li key={index}>{timeline}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              Download PDF Instructions
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
              Email to Patient
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 