import React from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Condition, Antibiotic } from '@/types/treatment';
import { PatientEducation } from '@/components/PatientEducation';
import { StepDownGuidance } from '@/components/StepDownGuidance';
import { TreatmentSelector } from '@/components/TreatmentSelector';

interface PageProps {
  params: {
    id: string;
    conditionId: string;
  };
}

async function loadCondition(categoryId: string, conditionId: string): Promise<Condition> {
  const filePath = path.join(process.cwd(), 'src', 'data', 'categories', categoryId, `${conditionId}.yml`);
  const fileContents = await fs.readFile(filePath, 'utf8');
  return yaml.load(fileContents) as Condition;
}

async function loadAntibiotics(condition: Condition): Promise<Record<string, Antibiotic>> {
  const antibiotics: Record<string, Antibiotic> = {};
  
  // Helper function to extract antibiotic names from a regimen
  const extractAntibioticNames = (regimen: string): string[] => {
    return regimen.split('+').map(name => name.trim());
  };

  // Helper function to normalize antibiotic name for file lookup
  const normalizeForFile = (name: string): string => {
    return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  // Get all unique antibiotic names from all treatment lines
  const antibioticNames = new Set<string>();
  
  // Process first line treatments
  if (condition.treatmentLines?.first_line?.adult) {
    Object.values(condition.treatmentLines.first_line.adult).forEach(regimen => {
      extractAntibioticNames(regimen.regimen).forEach(name => antibioticNames.add(name));
    });
  }

  // Process second line treatments if they exist
  if (condition.treatmentLines?.second_line?.adult) {
    Object.values(condition.treatmentLines.second_line.adult).forEach(regimen => {
      extractAntibioticNames(regimen.regimen).forEach(name => antibioticNames.add(name));
    });
  }

  // Process third line treatments if they exist
  if (condition.treatmentLines?.third_line?.adult) {
    Object.values(condition.treatmentLines.third_line.adult).forEach(regimen => {
      extractAntibioticNames(regimen.regimen).forEach(name => antibioticNames.add(name));
    });
  }

  // Load each antibiotic's data
  for (const name of Array.from(antibioticNames)) {
    try {
      const normalizedName = normalizeForFile(name);
      const filePath = path.join(process.cwd(), 'src', 'data', 'antibiotics', `${normalizedName}.yml`);
      const fileContents = await fs.readFile(filePath, 'utf8');
      const antibioticData = yaml.load(fileContents) as Antibiotic;
      // Store under both the original name and normalized name for easier lookup
      antibiotics[name] = antibioticData;
      antibiotics[normalizedName] = antibioticData;
    } catch (error) {
      console.warn(`Could not load data for antibiotic: ${name}`);
    }
  }

  return antibiotics;
}

export default async function ConditionPage({ params }: PageProps) {
  const condition = await loadCondition(params.id, params.conditionId);
  const antibiotics = await loadAntibiotics(condition);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{condition.name}</h1>
      
      <div className="mb-8">
        <p className="text-gray-600">{condition.description}</p>
        {condition.empiricLogic && (
          <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
            <h2 className="font-semibold text-yellow-800">Empiric Therapy Logic</h2>
            <p className="mt-2 text-yellow-700">{condition.empiricLogic}</p>
          </div>
        )}
      </div>

      {condition.id === 'pneumonia-cap' && condition.diagnosticPearls && (
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Diagnostic Pearls</h2>
            <ul className="list-disc pl-5 space-y-2">
              {condition.diagnosticPearls.map((pearl, index) => (
                <li key={index}>{pearl}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mb-8">
        <TreatmentSelector condition={condition} antibiotics={antibiotics} />
      </div>

      {condition.id === 'pneumonia-cap' && (
        <>
          <div className="mb-8">
            <StepDownGuidance
              currentRegimen={{
                name: condition.treatmentLines?.first_line?.adult?.inpatient_moderate?.regimen || "Current IV Regimen",
                route: condition.treatmentLines?.first_line?.adult?.inpatient_moderate?.route || "IV",
                duration: condition.treatmentLines?.first_line?.adult?.inpatient_moderate?.duration || "5-7 days"
              }}
            />
          </div>

          <div className="mb-8">
            <PatientEducation condition={condition.id} isPediatric={false} />
          </div>
        </>
      )}

      {condition.references && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">References</h2>
          <ul className="list-disc pl-5 space-y-2">
            {condition.references.map((reference, index) => (
              <li key={index}>{reference}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 