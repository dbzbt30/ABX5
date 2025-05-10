'use client';

import React from 'react';
import { Treatment } from '@/types/condition';

export interface RegimenCardProps {
  scenario: string;
  regimen: Treatment;
}

export function RegimenCard({ scenario, regimen }: RegimenCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {scenario.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Regimen</h4>
          <p className="mt-1 text-gray-900">{regimen.regimen}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700">Dosing</h4>
          <p className="mt-1 text-gray-900">{regimen.dosing}</p>
        </div>
        
        {regimen.duration && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Duration</h4>
            <p className="mt-1 text-gray-900">{regimen.duration}</p>
          </div>
        )}
        
        {regimen.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Notes</h4>
            <p className="mt-1 text-gray-600">{regimen.notes}</p>
          </div>
        )}
        
        {regimen.alternatives && regimen.alternatives.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Alternatives</h4>
            <ul className="mt-1 list-disc list-inside text-gray-600">
              {regimen.alternatives.map((alt, idx) => (
                <li key={idx}>{alt}</li>
              ))}
            </ul>
          </div>
        )}
        
        {regimen.contraindications && regimen.contraindications.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-text-red-700">Contraindications</h4>
            <ul className="mt-1 list-disc list-inside text-red-600">
              {regimen.contraindications.map((contra, idx) => (
                <li key={idx}>{contra}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 