import { Treatment, ConditionTreatment, CategoryTreatments } from '../types/treatment';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

interface LegacyTreatment {
  regimen: string;
  dosing: string;
  duration?: string;
  notes?: string | string[];
}

interface LegacyTreatmentLine {
  adult?: {
    [key: string]: LegacyTreatment;
  };
  pediatric?: {
    [key: string]: LegacyTreatment;
  };
}

function convertLegacyTreatment(treatment: LegacyTreatment, scenario: string): Treatment {
  return {
    id: generateTreatmentId(treatment.regimen),
    name: treatment.regimen,
    description: Array.isArray(treatment.notes) ? treatment.notes.join('. ') : treatment.notes || '',
    dosing: {
      adult: {
        standard: treatment.dosing,
        duration: treatment.duration,
        notes: Array.isArray(treatment.notes) ? treatment.notes : treatment.notes ? [treatment.notes] : []
      }
    }
  };
}

function convertLegacyTreatmentLine(line: LegacyTreatmentLine): Treatment[] {
  const treatments: Treatment[] = [];

  if (line.adult) {
    Object.entries(line.adult).forEach(([scenario, treatment]) => {
      treatments.push(convertLegacyTreatment(treatment, scenario));
    });
  }

  return treatments;
}

export function convertTreatmentData(jsData: any): CategoryTreatments[] {
  const categories: CategoryTreatments[] = [];
  
  // Handle both direct category data and wrapped data
  const categoryData = jsData.categories || (jsData.infectionsData && jsData.infectionsData.categories) || [];
  const treatmentsData = jsData.treatments || [];
  
  // Create a map of condition ID to treatments
  const treatmentMap = new Map<string, any[]>();
  
  // Process legacy treatment data
  if (Array.isArray(treatmentsData)) {
    treatmentsData.forEach((treatment: any) => {
      const conditionId = treatment.condition_id;
      if (!treatmentMap.has(conditionId)) {
        treatmentMap.set(conditionId, []);
      }
      
      // Convert first line treatments
      if (treatment.first_line) {
        const firstLineTreatments = convertLegacyTreatmentLine(treatment.first_line);
        treatmentMap.get(conditionId)!.push(...firstLineTreatments.map(t => ({ ...t, line: 'first' })));
      }
      
      // Convert second line treatments
      if (treatment.second_line) {
        const secondLineTreatments = convertLegacyTreatmentLine(treatment.second_line);
        treatmentMap.get(conditionId)!.push(...secondLineTreatments.map(t => ({ ...t, line: 'alternative' })));
      }
      
      // Convert third line treatments
      if (treatment.third_line) {
        const thirdLineTreatments = convertLegacyTreatmentLine(treatment.third_line);
        treatmentMap.get(conditionId)!.push(...thirdLineTreatments.map(t => ({ ...t, line: 'alternative' })));
      }
    });
  }
  
  // Process each category
  for (const category of categoryData) {
    const categoryTreatments: CategoryTreatments = {
      categoryId: category.id,
      empiricLogic: category.empiricLogic || '',
      treatments: []
    };

    // Process each condition in the category
    for (const condition of category.conditions || []) {
      const conditionTreatment: ConditionTreatment = {
        conditionId: condition.id,
        firstLine: [],
        notes: condition.notes || []
      };

      // Add treatments from the treatment map
      const conditionTreatments = treatmentMap.get(condition.id) || [];
      if (conditionTreatments.length > 0) {
        conditionTreatment.firstLine = conditionTreatments
          .filter(t => t.line === 'first')
          .map(treatment => ({
            id: treatment.id,
            name: treatment.name,
            description: treatment.description,
            drugClass: treatment.drugClass,
            dosing: treatment.dosing,
            contraindications: treatment.contraindications || [],
            sideEffects: treatment.sideEffects || [],
            monitoring: treatment.monitoring || [],
            references: treatment.references || []
          }));

        const alternativeTreatments = conditionTreatments.filter(t => t.line === 'alternative');
        if (alternativeTreatments.length > 0) {
          conditionTreatment.alternativeLine = alternativeTreatments.map(treatment => ({
            id: treatment.id,
            name: treatment.name,
            description: treatment.description,
            drugClass: treatment.drugClass,
            dosing: treatment.dosing,
            contraindications: treatment.contraindications || [],
            sideEffects: treatment.sideEffects || [],
            monitoring: treatment.monitoring || [],
            references: treatment.references || []
          }));
        }
      }

      categoryTreatments.treatments.push(conditionTreatment);
    }

    if (categoryTreatments.treatments.length > 0) {
      categories.push(categoryTreatments);
    }
  }

  return categories;
}

function generateTreatmentId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function saveTreatmentsToYaml(treatments: CategoryTreatments[], outputDir: string): void {
  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save each category's treatments to a separate YAML file
  treatments.forEach(category => {
    const filePath = path.join(outputDir, `${category.categoryId}-treatments.yaml`);
    const yamlContent = yaml.dump(category, {
      indent: 2,
      lineWidth: -1, // Prevent line wrapping
      noRefs: true // Prevent aliases
    });
    fs.writeFileSync(filePath, yamlContent, 'utf8');
  });
} 