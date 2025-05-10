import { create, StateCreator } from 'zustand';
import { FilterState } from '../../types/filters';

interface FilterStore extends FilterState {
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  allergy: 'none',
  setting: 'outpatient',
  population: 'none',
};

export const useFilterStore = create<FilterStore>((set: StateCreator<FilterStore>['set']) => ({
  ...DEFAULT_FILTERS,
  
  setFilter: (filter: Partial<FilterState>) => 
    set((state: FilterStore) => ({
      ...state,
      ...filter,
    })),
    
  resetFilters: () => 
    set(DEFAULT_FILTERS),
}));

// Helper to get URL-friendly filter state
export const getFilterParams = (filters: FilterState): URLSearchParams => {
  const params = new URLSearchParams();
  
  if (filters.allergy !== 'none') {
    params.set('allergy', filters.allergy);
  }
  
  if (filters.setting !== 'outpatient') {
    params.set('setting', filters.setting);
  }
  
  if (filters.population !== 'none') {
    params.set('population', filters.population);
  }
  
  return params;
};

// Helper to parse filter state from URL
export const parseFilterParams = (searchParams: URLSearchParams): Partial<FilterState> => {
  const filters: Partial<FilterState> = {};
  
  const allergy = searchParams.get('allergy');
  if (allergy) {
    filters.allergy = allergy as FilterState['allergy'];
  }
  
  const setting = searchParams.get('setting');
  if (setting) {
    filters.setting = setting as FilterState['setting'];
  }
  
  const population = searchParams.get('population');
  if (population) {
    filters.population = population as FilterState['population'];
  }
  
  return filters;
}; 