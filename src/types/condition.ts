export interface Treatment {
  regimen: string;
  dosing: string;
  duration?: string;
  notes?: string;
  alternatives?: string[];
  contraindications?: string[];
}

export interface TreatmentLine {
  adult: Record<string, Treatment>;
  settings: string[];
  populations?: string[];
}

export interface Condition {
  id: string;
  name: string;
  category: string;
  description?: string;
  notes: string[];
  references: string[];
  first_line: TreatmentLine;
  second_line?: TreatmentLine;
  third_line?: TreatmentLine;
  lastUpdated: string;
} 