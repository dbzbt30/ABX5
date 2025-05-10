export type AllergyFilter = 'penicillin' | 'cephalosporin' | 'beta-lactam' | 'none';

export type SettingFilter = 'outpatient' | 'inpatient' | 'icu';

export type PopulationFilter = 'pregnancy' | 'renal-impairment' | 'hepatic-impairment' | 'immunocompromised' | 'none';

export interface FilterState {
  allergy: AllergyFilter;
  setting: SettingFilter;
  population: PopulationFilter;
}

export interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
} 