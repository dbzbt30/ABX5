'use client';

import React from 'react';
import { usePediatricStore } from '@/lib/store/pediatricStore';

export const PatientContext: React.FC = () => {
  const {
    isEnabled: isPediatricMode,
    weight,
    ageGroup,
    setWeight,
    setAgeGroup,
    togglePediatricMode,
  } = usePediatricStore();

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : null;
    setWeight(value);
  };

  const handleAgeGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'neonate' | 'infant' | 'child' | 'adolescent' | null;
    setAgeGroup(value);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Mode Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePediatricMode}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isPediatricMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isPediatricMode ? 'Pediatric Mode' : 'Adult Mode'}
            </button>
          </div>

          {/* Patient Parameters */}
          {isPediatricMode && (
            <div className="flex items-center space-x-4">
              {/* Weight Input */}
              <div className="flex items-center space-x-2">
                <label htmlFor="weight" className="text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  value={weight || ''}
                  onChange={handleWeightChange}
                  placeholder="Enter weight"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Age Group Select */}
              <div className="flex items-center space-x-2">
                <label htmlFor="ageGroup" className="text-sm font-medium text-gray-700">
                  Age Group
                </label>
                <select
                  id="ageGroup"
                  value={ageGroup || ''}
                  onChange={handleAgeGroupChange}
                  className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select age group</option>
                  <option value="neonate">Neonate (0-28 days)</option>
                  <option value="infant">Infant (1-12 months)</option>
                  <option value="child">Child (1-12 years)</option>
                  <option value="adolescent">Adolescent (12-18 years)</option>
                </select>
              </div>
            </div>
          )}

          {/* Warning Message */}
          {isPediatricMode && (!weight || !ageGroup) && (
            <div className="w-full text-sm text-yellow-600">
              ⚠️ Enter weight and age group to see pediatric doses. Adult doses shown as fallback.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 