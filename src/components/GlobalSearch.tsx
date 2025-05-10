'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { findAntibiotic, getCanonicalName } from '@/lib/utils/antibioticNormalizer';

interface SearchResult {
  type: 'antibiotic' | 'condition';
  id: string;
  name: string;
  category?: string;
  description?: string;
}

export const GlobalSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search function
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setIsLoading(true);
    setIsOpen(true);

    if (term.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch all conditions and antibiotics
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term }),
      });

      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setSearchTerm('');
    
    if (result.type === 'condition') {
      router.push(`/category/${result.category}/${result.id}`);
    } else {
      // Handle antibiotic view
      router.push(`/antibiotic/${result.id}`);
    }
  };

  return (
    <div ref={searchRef} className="relative max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search conditions or antibiotics (e.g. CAP, vanc, pip-tazo)"
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Search Results */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((result, index) => (
                <li
                  key={`${result.type}-${result.id}-${index}`}
                  onClick={() => handleResultClick(result)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      result.type === 'condition' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {result.type === 'condition' ? 'Condition' : 'Antibiotic'}
                    </span>
                    <span className="ml-2 font-medium">{result.name}</span>
                  </div>
                  {result.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{result.description}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : searchTerm.length > 0 ? (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}; 