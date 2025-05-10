'use client';

import React, { useState, useEffect } from 'react';
import { usePediatricStore } from '@/lib/store/pediatricStore';

interface PediatricDosing {
  ageMinMonths?: number;
  ageMaxDays?: number;
  dosePerKg: number;
  maxDaily: number;
  frequency: string;
  notes?: string[];
}

interface PediatricCalculatorProps {
  indication: string;
  dosing: PediatricDosing;
}

const FREQUENCY_MAP: { [key: string]: number } = {
  'q24h': 1,
  'q12h': 2,
  'q8h': 3,
  'q6h': 4,
  'div q24h': 1,
  'div q12h': 2,
  'div q8h': 3,
  'div q6h': 4
};

const WEIGHT_LIMITS = {
  MIN: 2, // kg
  MAX: 100 // kg
};

export const PediatricCalculator: React.FC<PediatricCalculatorProps> = ({
  indication,
  dosing
}) => {
  const { weight } = usePediatricStore();
  const [calculatedDose, setCalculatedDose] = useState<{
    perDose: number;
    timesPerDay: number;
    totalDaily: number;
    roundedDose: number;
    isMaxDoseExceeded: boolean;
    isWeightValid: boolean;
    isAgeValid: boolean;
  } | null>(null);

  useEffect(() => {
    if (!weight) {
      setCalculatedDose(null);
      return;
    }

    // Weight validation
    const isWeightValid = weight >= WEIGHT_LIMITS.MIN && weight <= WEIGHT_LIMITS.MAX;

    // Age validation (if specified)
    const isAgeValid = true; // This should be connected to a patient age input

    // Parse frequency
    const match = dosing.frequency.match(/q(\d+)h/);
    const timesPerDay = match ? FREQUENCY_MAP[match[0]] : 1;

    // Calculate total daily dose
    let totalDaily = weight * dosing.dosePerKg;
    const isMaxDoseExceeded = totalDaily > dosing.maxDaily;
    
    // Cap at max daily dose if specified
    if (dosing.maxDaily) {
      totalDaily = Math.min(totalDaily, dosing.maxDaily);
    }

    // Calculate per-dose amount
    const perDose = totalDaily / timesPerDay;

    // Round to nearest practical dose
    const roundedDose = roundDosePractically(perDose);

    setCalculatedDose({
      perDose,
      roundedDose,
      timesPerDay,
      totalDaily,
      isMaxDoseExceeded,
      isWeightValid,
      isAgeValid
    });
  }, [weight, dosing]);

  // Helper function to round doses to practical numbers
  const roundDosePractically = (dose: number): number => {
    if (dose >= 1000) {
      return Math.round(dose / 100) * 100; // Round to nearest 100mg if ≥1000mg
    } else if (dose >= 100) {
      return Math.round(dose / 25) * 25; // Round to nearest 25mg if ≥100mg
    } else {
      return Math.round(dose / 5) * 5; // Round to nearest 5mg if <100mg
    }
  };

  if (!weight) {
    return (
      <div className="text-sm text-yellow-600">
        Enter patient weight in kg to calculate dose
      </div>
    );
  }

  if (!calculatedDose) return null;

  return (
    <div className="mt-2 p-4 bg-blue-50 rounded-lg">
      <h4 className="text-sm font-medium text-blue-900">
        Calculated Dose for {indication}
      </h4>
      
      {/* Warnings */}
      {!calculatedDose.isWeightValid && (
        <div className="mt-1 text-sm text-red-600">
          ⚠️ Weight should be between {WEIGHT_LIMITS.MIN}-{WEIGHT_LIMITS.MAX} kg
        </div>
      )}
      {calculatedDose.isMaxDoseExceeded && (
        <div className="mt-1 text-sm text-yellow-600">
          ⚠️ Calculated dose exceeds maximum daily dose, adjusted accordingly
        </div>
      )}

      {/* Dose Information */}
      <div className="mt-2 space-y-2 text-sm">
        <p className="text-blue-800">
          <span className="font-medium">Recommended dose:</span> {calculatedDose.roundedDose} mg
          {calculatedDose.timesPerDay > 1 ? ` (${calculatedDose.timesPerDay}x daily)` : ' daily'}
        </p>
        <p className="text-blue-800">
          <span className="font-medium">Total daily:</span> {Math.round(calculatedDose.totalDaily)} mg
          ({Math.round(calculatedDose.totalDaily/weight)} mg/kg/day)
        </p>
        <p className="text-blue-800">
          <span className="font-medium">Administration:</span> Give{' '}
          {calculatedDose.roundedDose} mg every{' '}
          {24/calculatedDose.timesPerDay} hours
        </p>

        {/* Age Restrictions */}
        {dosing.ageMinMonths && (
          <p className="text-xs text-blue-700">
            ⚠️ Minimum age: {dosing.ageMinMonths} months
          </p>
        )}
        {dosing.ageMaxDays && (
          <p className="text-xs text-blue-700">
            ⚠️ Maximum age: {dosing.ageMaxDays} days
          </p>
        )}

        {/* Clinical Notes */}
        {dosing.notes && (
          <div className="mt-2">
            <p className="font-medium text-blue-900">Clinical Notes:</p>
            <ul className="list-disc list-inside text-blue-800">
              {dosing.notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}; 