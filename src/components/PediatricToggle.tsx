'use client';

import React from 'react';
import { usePediatricStore } from '@/lib/store/pediatricStore';

export const PediatricToggle: React.FC = () => {
  const { isEnabled, togglePediatricMode, weight, setWeight } = usePediatricStore();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <button
          onClick={togglePediatricMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isEnabled ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </button>
        <span className="ml-3 text-sm font-medium text-gray-900">
          Pediatric Mode
        </span>
      </div>
      {isEnabled && (
        <div className="flex items-center space-x-2">
          <label htmlFor="weight" className="text-sm font-medium text-gray-700">
            Weight (kg):
          </label>
          <input
            type="number"
            id="weight"
            value={weight || ''}
            onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : null)}
            className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="kg"
          />
        </div>
      )}
    </div>
  );
}; 