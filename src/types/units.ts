export type UnitSystem = 'metric' | 'imperial';

export interface UnitPreferences {
  system: UnitSystem;
  weightUnit: 'kg' | 'lb';
  heightUnit: 'cm' | 'in';
}

export interface UnitConversion {
  fromValue: number;
  fromUnit: string;
  toUnit: string;
  toValue: number;
}

// Common conversion factors
export const CONVERSION_FACTORS = {
  KG_TO_LB: 2.20462,
  LB_TO_KG: 0.453592,
  CM_TO_IN: 0.393701,
  IN_TO_CM: 2.54,
} as const;

// Regex patterns for unit matching
export const UNIT_PATTERNS = {
  WEIGHT: /(\d+(?:\.\d+)?)\s*(mg\/kg|mg\/lb)/gi,
  HEIGHT: /(\d+(?:\.\d+)?)\s*(cm|in)/gi,
} as const; 