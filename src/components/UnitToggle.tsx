'use client';

import React from 'react';
import { useUnitStore } from '@/lib/store/unitStore';

export const UnitToggle: React.FC = () => {
  const { system, toggleSystem } = useUnitStore();

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-500">Units:</span>
      <button
        onClick={toggleSystem}
        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors relative"
      >
        <span
          className={`absolute inset-0 rounded-full transition-colors ${
            system === 'metric' ? 'bg-blue-100' : 'translate-x-full bg-green-100'
          }`}
        />
        <span className={`relative ${system === 'metric' ? 'text-blue-700' : 'text-gray-400'}`}>
          Metric
        </span>
        <span className="relative mx-2 text-gray-400">/</span>
        <span className={`relative ${system === 'imperial' ? 'text-green-700' : 'text-gray-400'}`}>
          Imperial
        </span>
        <kbd className="hidden md:inline-block ml-2 px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-gray-200 rounded">
          ⌘U
        </kbd>
      </button>
    </div>
  );
};

// Add keyboard shortcut handler
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      useUnitStore.getState().toggleSystem();
    }
  });
} 