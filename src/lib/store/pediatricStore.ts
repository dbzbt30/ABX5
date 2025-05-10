import { create } from 'zustand';

interface PediatricState {
  isEnabled: boolean;
  weight: number | null;
  ageGroup: 'neonate' | 'infant' | 'child' | 'adolescent' | null;
  setWeight: (weight: number | null) => void;
  setAgeGroup: (ageGroup: 'neonate' | 'infant' | 'child' | 'adolescent' | null) => void;
  togglePediatricMode: () => void;
}

export const usePediatricStore = create<PediatricState>((set) => ({
  isEnabled: false,
  weight: null,
  ageGroup: null,
  setWeight: (weight) => set({ weight }),
  setAgeGroup: (ageGroup) => set({ ageGroup }),
  togglePediatricMode: () => set((state) => ({ isEnabled: !state.isEnabled })),
})); 