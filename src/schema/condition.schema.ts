import { z } from 'zod';

export const RegimenSchema = z.object({
  regimen: z.string(),
  dosing: z.string(),
  duration: z.string().optional(),
  notes: z.string().optional(),
  alternatives: z.array(z.string()).optional(),
  contraindications: z.array(z.string()).optional(),
});

export const TreatmentLineSchema = z.object({
  adult: z.record(z.string(), RegimenSchema),
  settings: z.array(z.enum(['outpatient', 'inpatient', 'icu'])).default(['outpatient']),
  populations: z.array(z.string()).optional(),
});

export const ConditionSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().optional(),
  notes: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]),
  first_line: TreatmentLineSchema,
  second_line: TreatmentLineSchema.optional(),
  third_line: TreatmentLineSchema.optional(),
  lastUpdated: z.string().datetime(),
});

export type Regimen = z.infer<typeof RegimenSchema>;
export type TreatmentLine = z.infer<typeof TreatmentLineSchema>;
export type Condition = z.infer<typeof ConditionSchema>; 