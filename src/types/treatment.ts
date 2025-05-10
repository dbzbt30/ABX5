import { z } from 'zod';

// Constants for enums
const ROUTES = ['IV', 'IM', 'PO', 'PR'] as const;
export const STEWARDSHIP_TIERS = ['Core', 'Watch', 'Reserve'] as const;
const EVIDENCE_LEVELS = ['A', 'B', 'C'] as const;
const SETTINGS = ['outpatient', 'inpatient', 'icu'] as const;
const ALLERGIES = ['none', 'penicillin', 'cephalosporin', 'beta-lactam'] as const;
const POPULATIONS = ['none', 'pregnancy', 'renal-impairment', 'hepatic-impairment', 'immunocompromised'] as const;

// Base schemas for reusability
const DosingSchema = z.object({
  dose: z.string(),
  route: z.enum(ROUTES),
  frequency: z.string(),
  maxDose: z.string().optional(),
  notes: z.array(z.string()).optional(),
});

// Treatment-specific filter conditions
export const TreatmentFilterSchema = z.object({
  applicable: z.object({
    allergies: z.array(z.enum(ALLERGIES)),
    setting: z.array(z.enum(SETTINGS)),
    populations: z.array(z.enum(POPULATIONS)),
  }),
});

export interface PediatricDosing {
  dosePerKg: number;
  frequency: string;
  maxDaily?: number;
  minWeight?: number;
  maxWeight?: number;
  notes?: string[];
  source?: string;
  neonate?: {
    dosePerKg: number;
    frequency: string;
    maxDaily?: number;
    minAge?: number;
    maxAge?: number;
    notes?: string[];
  };
}

export interface AdultDosing {
  dose: string;
  route: string;
  frequency: string;
  duration?: string;
  maxDose?: string;
  notes?: string[];
}

export interface PaedsDosing {
  ageMinMonths?: number;
  ageMaxDays?: number;
  dosePerKg: number;
  maxDaily: number;
  frequency: string;
  notes?: string[];
}

export interface Antibiotic {
  id: string;
  name: string;
  class: string;
  spectrum?: {
    plus: string[];
    minus: string[];
  };
  stewardshipTier?: typeof STEWARDSHIP_TIERS[number];
  adult: Record<string, AdultDosing>;
  paeds?: Record<string, PaedsDosing>;
  renalAdjustment?: {
    note: string;
    table?: Array<{
      crcl: string;
      dose: string;
      frequency: string;
    }>;
  };
  hepaticAdjustment?: string;
  pkpd?: {
    halfLife?: string;
    vd?: string;
  };
  adverseEffects?: string[];
  monitoring?: string[];
  pregnancy?: string;
  cost?: '$' | '$$' | '$$$';
  references?: string[];
  lastUpdated?: string;
}

// Treatment regimen schema
export interface Regimen {
  regimen: string;
  route: 'IV' | 'IM' | 'PO' | 'PR';
  dosing: string;
  duration?: string;
  notes?: string[];
  monitoring?: string[];
  setting?: string;
  populations?: string[];
}

export const RegimenSchema = z.object({
  regimen: z.string(),
  route: z.enum(['IV', 'IM', 'PO', 'PR']),
  dosing: z.string(),
  duration: z.string().optional(),
  notes: z.array(z.string()).optional(),
  monitoring: z.array(z.string()).optional(),
  setting: z.string().optional(),
  populations: z.array(z.string()).optional(),
});

// Treatment line schema
export const TreatmentLineSchema = z.object({
  adult: z.record(z.string(), RegimenSchema),
  pediatric: z.record(z.string(), RegimenSchema).optional(),
});

// Complete condition treatment schema
export interface TreeNode {
  question: string;
  options: {
    text: string;
    next?: string;
    treatment?: string;
    criteria?: string[];
  }[];
}

export interface DecisionTree {
  [key: string]: TreeNode;
}

export const ConditionSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  epidemiology: z.object({
    incidence: z.string().optional(),
    commonPathogens: z.array(z.string()).optional(),
  }).optional(),
  diagnosticPearls: z.array(z.string()).optional(),
  filters: TreatmentFilterSchema,
  empiricLogic: z.string(),
  decisionTree: z.record(z.object({
    question: z.string(),
    options: z.array(z.object({
      text: z.string(),
      next: z.string().optional(),
      treatment: z.string().optional(),
      criteria: z.array(z.string()).optional(),
    })),
  })).optional(),
  treatmentLines: z.object({
    first_line: TreatmentLineSchema,
    second_line: TreatmentLineSchema.optional(),
    third_line: TreatmentLineSchema.optional(),
  }),
  patientInstructions: z.object({
    general: z.array(z.string()).optional(),
    purulent: z.array(z.string()).optional(),
    followUp: z.record(z.array(z.string())).optional(),
    wound_care: z.array(z.string()).optional(),
    stepdown_guidance: z.array(z.string()).optional(),
  }).optional(),
  references: z.array(z.string()),
  lastUpdated: z.string(),
});

// Export types
export type TreatmentLine = z.infer<typeof TreatmentLineSchema>;
export type Condition = z.infer<typeof ConditionSchema>;
export type TreatmentFilter = z.infer<typeof TreatmentFilterSchema>;

// Helper type for active filters
export interface ActiveFilters {
  treatmentLine: 'first_line' | 'second_line' | 'third_line';
  setting: string;
}

// Helper function for treatment filtering
export const filterRegimens = (
  treatmentLine: TreatmentLine,
  activeFilters: Omit<ActiveFilters, 'treatmentLine'>
): Record<string, Regimen> => {
  const result: Record<string, Regimen> = {};
  
  // Get the regimens to filter (either adult or pediatric)
  const regimens = treatmentLine.pediatric && Object.keys(treatmentLine.pediatric).length > 0 
    ? treatmentLine.pediatric 
    : treatmentLine.adult;
    
  if (!regimens) return result;

  Object.entries(regimens).forEach(([scenario, regimen]) => {
    // Check if scenario matches active filters
    const matchesSetting = scenario.includes(activeFilters.setting) ||
      (!scenario.includes('outpatient') && !scenario.includes('inpatient') && 
       !scenario.includes('icu'));

    if (matchesSetting) {
      result[scenario] = regimen;
    }
  });

  return result;
};

// Zod schema for validation
export const PediatricDosingSchema = z.object({
  dosePerKg: z.number(),
  frequency: z.string(),
  maxDaily: z.number().optional(),
  minWeight: z.number().optional(),
  maxWeight: z.number().optional(),
  notes: z.array(z.string()).optional(),
  source: z.string().optional(),
  neonate: z.object({
    dosePerKg: z.number(),
    frequency: z.string(),
    maxDaily: z.number().optional(),
    minAge: z.number().optional(),
    maxAge: z.number().optional(),
    notes: z.array(z.string()).optional(),
  }).optional(),
});

export const AntibioticSchema = z.object({
  id: z.string(),
  name: z.string(),
  class: z.string(),
  spectrum: z.object({
    plus: z.array(z.string()),
    minus: z.array(z.string()),
  }).optional(),
  stewardshipTier: z.enum(STEWARDSHIP_TIERS).optional(),
  adult: z.record(z.object({
    dose: z.string(),
    route: z.string(),
    frequency: z.string(),
    duration: z.string().optional(),
    maxDose: z.string().optional(),
    notes: z.array(z.string()).optional(),
  })),
  paeds: z.record(PediatricDosingSchema).optional(),
  renalAdjustment: z.object({
    note: z.string(),
    table: z.array(z.object({
      crcl: z.string(),
      dose: z.string(),
      frequency: z.string(),
    })).optional(),
  }).optional(),
  hepaticAdjustment: z.string().optional(),
  pkpd: z.object({
    halfLife: z.string(),
    vd: z.string(),
  }).optional(),
  adverseEffects: z.array(z.string()).optional(),
  monitoring: z.array(z.string()).optional(),
  pregnancy: z.string().optional(),
  cost: z.enum(['$', '$$', '$$$']).optional(),
  references: z.array(z.string()).optional(),
  lastUpdated: z.string().optional(),
});

/**
 * Example usage:
 * 
 * // 1. Define a condition treatment
 * const pneumonia: ConditionTreatment = {
 *   id: 'cap',
 *   name: 'Community Acquired Pneumonia',
 *   category: 'respiratory',
 *   first_line: {
 *     regimens: [{
 *       id: 'standard',
 *       name: 'Standard CAP Treatment',
 *       antibiotics: [{
 *         name: 'Amoxicillin',
 *         route: 'PO',
 *         dosing: '1000mg',
 *         frequency: 'q8h'
 *       }],
 *       filters: {
 *         allergies: ['none'],
 *         setting: ['outpatient'],
 *         populations: ['none']
 *       }
 *     }]
 *   }
 * };
 * 
 * // 2. Filter regimens
 * const activeFilters = {
 *   allergies: ['none'],
 *   setting: 'outpatient',
 *   populations: ['none']
 * };
 * 
 * const filteredRegimens = filterRegimens(pneumonia.first_line.regimens, activeFilters);
 */ 