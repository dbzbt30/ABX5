import { z } from 'zod';

export const AntibioticSchema = z.object({
  id: z.string(),
  name: z.string(),
  drugClass: z.string(),
  description: z.string().optional(),
  commonDosing: z.array(z.object({
    indication: z.string(),
    adult: z.object({
      standard: z.string(),
      renal: z.record(z.string(), z.string()).optional(),
      obesity: z.string().optional(),
    }),
  })),
  sideEffects: z.array(z.string()).default([]),
  monitoring: z.array(z.string()).default([]),
  contraindications: z.array(z.string()).default([]),
  interactions: z.array(z.object({
    drug: z.string(),
    effect: z.string(),
    severity: z.enum(['mild', 'moderate', 'severe']),
  })).default([]),
  references: z.array(z.string()).default([]),
});

export type Antibiotic = z.infer<typeof AntibioticSchema>; 