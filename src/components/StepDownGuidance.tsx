'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface StepDownCriteria {
  category: string;
  criteria: string[];
}

interface StepDownGuidanceProps {
  currentRegimen: {
    name: string;
    route: string;
    duration: string;
  };
}

export const StepDownGuidance: React.FC<StepDownGuidanceProps> = ({ currentRegimen }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const clinicalStability: StepDownCriteria[] = [
    {
      category: 'Vital Signs',
      criteria: [
        'Temperature ≤37.8°C',
        'Heart rate ≤100/min',
        'Respiratory rate ≤24/min',
        'Systolic BP ≥90 mmHg',
        'O2 saturation ≥90% on room air',
      ],
    },
    {
      category: 'Mental Status',
      criteria: [
        'Return to baseline mental status',
        'Able to take oral medications',
      ],
    },
    {
      category: 'Nutrition/GI',
      criteria: [
        'Tolerating oral intake',
        'No nausea/vomiting',
      ],
    },
  ];

  const ivToOralCriteria = [
    'Patient meets clinical stability criteria for 24-48 hours',
    'No contraindications to oral intake',
    'No surgery planned within 24 hours',
    'No severe sepsis/shock',
    'Adequate oral absorption expected',
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <h2 className="text-2xl font-bold">Step-Down Therapy Guidance</h2>
        {isExpanded ? (
          <ChevronUpIcon className="h-6 w-6 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Clinical Stability Criteria</h3>
            <div className="space-y-4">
              {clinicalStability.map((category, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">{category.category}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {category.criteria.map((criterion, idx) => (
                      <li key={idx}>{criterion}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">IV to Oral Conversion Criteria</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {ivToOralCriteria.map((criterion, index) => (
                  <li key={index}>{criterion}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Recommended Step-Down Options</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="space-y-2">
                <p><span className="font-medium">First Choice:</span> Switch to oral equivalent if available</p>
                <p><span className="font-medium">Alternative:</span> Switch to appropriate oral alternative based on susceptibilities</p>
                <p className="text-sm text-gray-600 mt-2">Note: Consider local resistance patterns and patient-specific factors when selecting step-down therapy</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 