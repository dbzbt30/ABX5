import { PediatricDosing } from '@/types/treatment';

interface CalculatePediatricDoseParams {
  weight: number;
  ageGroup: 'neonate' | 'infant' | 'child' | 'adolescent';
  pediatricDosing: PediatricDosing;
  adultDose: {
    dose: string;
    frequency: string;
  };
}

interface PediatricDoseResult {
  calculatedDose: number;
  frequency: string;
  isAboveAdultDose: boolean;
  maxDailyDose?: number;
  notes?: string[];
  warning?: string;
}

type DosingRules = {
  dosePerKg: number;
  frequency: string;
  maxDaily?: number;
  minWeight?: number;
  maxWeight?: number;
  notes?: string[];
};

export function calculatePediatricDose({
  weight,
  ageGroup,
  pediatricDosing,
  adultDose,
}: CalculatePediatricDoseParams): PediatricDoseResult {
  // Extract adult dose value (assuming format like "500 mg")
  const adultDoseValue = parseFloat(adultDose.dose.split(' ')[0]);
  const adultDoseUnit = adultDose.dose.split(' ')[1];

  // Use neonate dosing if applicable
  const dosing: DosingRules = ageGroup === 'neonate' && pediatricDosing.neonate
    ? {
        ...pediatricDosing.neonate,
        minWeight: pediatricDosing.minWeight,
        maxWeight: pediatricDosing.maxWeight,
      }
    : pediatricDosing;

  // Calculate base dose
  let calculatedDose = weight * dosing.dosePerKg;

  // Check weight limits if specified
  if (dosing.minWeight && weight < dosing.minWeight) {
    return {
      calculatedDose,
      frequency: dosing.frequency,
      isAboveAdultDose: false,
      warning: `Patient weight (${weight} kg) below minimum recommended weight (${dosing.minWeight} kg)`,
    };
  }

  if (dosing.maxWeight && weight > dosing.maxWeight) {
    return {
      calculatedDose,
      frequency: dosing.frequency,
      isAboveAdultDose: false,
      warning: `Patient weight (${weight} kg) above maximum recommended weight (${dosing.maxWeight} kg)`,
    };
  }

  // Apply maximum daily dose if specified
  if (dosing.maxDaily) {
    const dailyFrequency = parseInt(dosing.frequency.split('q')[1]);
    const dailyDose = calculatedDose * (24 / dailyFrequency);
    if (dailyDose > dosing.maxDaily) {
      calculatedDose = (dosing.maxDaily * dailyFrequency) / 24;
    }
  }

  // Check if calculated dose exceeds adult dose
  const isAboveAdultDose = calculatedDose > adultDoseValue;

  // Round to nearest practical dose (e.g., nearest 10mg)
  calculatedDose = Math.round(calculatedDose / 10) * 10;

  return {
    calculatedDose,
    frequency: dosing.frequency,
    isAboveAdultDose,
    maxDailyDose: dosing.maxDaily,
    notes: dosing.notes,
    warning: isAboveAdultDose ? 'Calculated dose exceeds adult dose - verify with pharmacy' : undefined,
  };
}

export function formatPediatricDose(result: PediatricDoseResult): string {
  return `${result.calculatedDose} mg ${result.frequency}${
    result.maxDailyDose ? ` (max ${result.maxDailyDose} mg/day)` : ''
  }${result.warning ? `\n⚠️ ${result.warning}` : ''}`;
} 