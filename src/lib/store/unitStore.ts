import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UnitSystem, UnitPreferences, CONVERSION_FACTORS } from '@/types/units';

interface UnitStore extends UnitPreferences {
  toggleSystem: () => void;
  convertWeight: (value: number, fromUnit: 'kg' | 'lb') => number;
  formatDosage: (text: string) => string;
}

const DEFAULT_PREFERENCES: UnitPreferences = {
  system: 'metric',
  weightUnit: 'kg',
  heightUnit: 'cm',
};

export const useUnitStore = create<UnitStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PREFERENCES,

      toggleSystem: () => {
        set((state) => {
          const newSystem = state.system === 'metric' ? 'imperial' : 'metric';
          return {
            system: newSystem,
            weightUnit: newSystem === 'metric' ? 'kg' : 'lb',
            heightUnit: newSystem === 'metric' ? 'cm' : 'in',
          };
        });
      },

      convertWeight: (value: number, fromUnit: 'kg' | 'lb'): number => {
        const { system } = get();
        if (fromUnit === 'kg' && system === 'imperial') {
          return +(value * CONVERSION_FACTORS.KG_TO_LB).toFixed(1);
        }
        if (fromUnit === 'lb' && system === 'metric') {
          return +(value * CONVERSION_FACTORS.LB_TO_KG).toFixed(1);
        }
        return value;
      },

      formatDosage: (text: string): string => {
        const { system } = get();
        if (!text) return text;

        // Replace weight-based dosing
        return text.replace(
          /(\d+(?:\.\d+)?)\s*(mg\/kg|mg\/lb)/gi,
          (match, value, unit) => {
            const numValue = parseFloat(value);
            if (system === 'metric' && unit.toLowerCase() === 'mg/lb') {
              const kgValue = numValue / CONVERSION_FACTORS.KG_TO_LB;
              return `${kgValue.toFixed(1)} mg/kg`;
            }
            if (system === 'imperial' && unit.toLowerCase() === 'mg/kg') {
              const lbValue = numValue * CONVERSION_FACTORS.KG_TO_LB;
              return `${lbValue.toFixed(1)} mg/lb`;
            }
            return match;
          }
        );
      },
    }),
    {
      name: 'unit-preferences',
    }
  )
); 