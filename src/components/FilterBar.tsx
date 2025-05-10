'use client';

import React, { useState, useEffect } from 'react';
import { FilterBarProps, AllergyFilter, SettingFilter, PopulationFilter, FilterState } from '../types/filters';

const FilterPill = ({ 
  label, 
  active, 
  onClick,
  shortcut
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void;
  shortcut?: string;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-2
      ${active 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
  >
    <span>{label}</span>
    {shortcut && !active && (
      <kbd className="hidden md:inline-block px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-gray-200 rounded">
        {shortcut}
      </kbd>
    )}
  </button>
);

const FilterSection = ({ 
  title, 
  options, 
  value, 
  onChange 
}: { 
  title: string;
  options: { label: string; value: string; shortcut?: string }[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      {value !== 'none' && value !== 'outpatient' && (
        <button
          onClick={() => onChange(title === 'Setting' ? 'outpatient' : 'none')}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Clear
        </button>
      )}
    </div>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <FilterPill
          key={option.value}
          label={option.label}
          active={value === option.value}
          onClick={() => onChange(option.value)}
          shortcut={option.shortcut}
        />
      ))}
    </div>
  </div>
);

const getActiveFilterCount = (filters: FilterState): number => {
  let count = 0;
  if (filters.allergy !== 'none') count++;
  if (filters.setting !== 'outpatient') count++;
  if (filters.population !== 'none') count++;
  return count;
};

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const allergyOptions = [
    { label: 'None', value: 'none' },
    { label: 'Penicillin', value: 'penicillin', shortcut: '⌘1' },
    { label: 'Cephalosporin', value: 'cephalosporin', shortcut: '⌘2' },
    { label: 'Beta-lactam', value: 'beta-lactam', shortcut: '⌘3' },
  ];

  const settingOptions = [
    { label: 'Outpatient', value: 'outpatient' },
    { label: 'Inpatient', value: 'inpatient', shortcut: '⌘I' },
    { label: 'ICU', value: 'icu', shortcut: '⌘U' },
  ];

  const populationOptions = [
    { label: 'None', value: 'none' },
    { label: 'Pregnancy', value: 'pregnancy', shortcut: '⌘P' },
    { label: 'Renal Impairment', value: 'renal-impairment', shortcut: '⌘R' },
    { label: 'Hepatic Impairment', value: 'hepatic-impairment', shortcut: '⌘H' },
    { label: 'Immunocompromised', value: 'immunocompromised', shortcut: '⌘M' },
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) return;
      
      const key = e.key.toLowerCase();
      switch(key) {
        case '1': onFilterChange({ allergy: 'penicillin' }); break;
        case '2': onFilterChange({ allergy: 'cephalosporin' }); break;
        case '3': onFilterChange({ allergy: 'beta-lactam' }); break;
        case 'i': onFilterChange({ setting: 'inpatient' }); break;
        case 'u': onFilterChange({ setting: 'icu' }); break;
        case 'p': onFilterChange({ population: 'pregnancy' }); break;
        case 'r': onFilterChange({ population: 'renal-impairment' }); break;
        case 'h': onFilterChange({ population: 'hepatic-impairment' }); break;
        case 'm': onFilterChange({ population: 'immunocompromised' }); break;
        case 'x': 
          if (e.shiftKey) {
            onFilterChange({ 
              allergy: 'none', 
              setting: 'outpatient', 
              population: 'none' 
            });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFilterChange]);

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <div className="p-4 bg-white rounded-lg shadow space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={() => onFilterChange({ 
              allergy: 'none', 
              setting: 'outpatient', 
              population: 'none' 
            })}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Clear all
            <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 text-xs font-semibold text-gray-500 bg-gray-200 rounded">
              ⇧⌘X
            </kbd>
          </button>
        )}
      </div>

      <FilterSection
        title="Allergies"
        options={allergyOptions}
        value={filters.allergy}
        onChange={(value) => onFilterChange({ allergy: value as AllergyFilter })}
      />
      
      <FilterSection
        title="Setting"
        options={settingOptions}
        value={filters.setting}
        onChange={(value) => onFilterChange({ setting: value as SettingFilter })}
      />
      
      <FilterSection
        title="Special Populations"
        options={populationOptions}
        value={filters.population}
        onChange={(value) => onFilterChange({ population: value as PopulationFilter })}
      />
    </div>
  );
}; 