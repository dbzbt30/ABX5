'use client';

import React, { useState } from 'react';
import { Condition, ActiveFilters, filterRegimens, Regimen, Antibiotic } from '@/types/treatment';
import { useUnitStore } from '@/lib/store/unitStore';
import { usePediatricStore } from '@/lib/store/pediatricStore';
import { AntibioticModal } from './AntibioticModal';
import { findAntibiotic } from '@/lib/utils/antibioticNormalizer';
import { PediatricToggle } from './PediatricToggle';
import { GuidelineModal } from './GuidelineModal';
import { DecisionTree } from './DecisionTree';

interface TreatmentSelectorProps {
  condition: Condition;
  antibiotics: Record<string, Antibiotic>;
}

export const TreatmentSelector: React.FC<TreatmentSelectorProps> = ({ condition, antibiotics }) => {
  // State for active filters
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    treatmentLine: 'first_line',
    setting: condition.filters?.applicable?.setting?.[0] || 'outpatient'
  });

  // State for antibiotic modal
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<Antibiotic | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for guideline modal
  const [guidelineModal, setGuidelineModal] = useState<{
    isOpen: boolean;
    title: string;
    guidelines: {
      alternatives?: string[];
      recommendations?: string[];
      notes?: string[];
    };
  }>({
    isOpen: false,
    title: '',
    guidelines: {},
  });

  // Add state for selected treatment from decision tree
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);

  // Get unit conversion function
  const { formatDosage } = useUnitStore();

  // Get pediatric mode state
  const { isEnabled: isPediatricMode } = usePediatricStore();

  // Ensure condition and treatmentLines exist
  if (!condition || !condition.treatmentLines) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800">
          Treatment data is not available. Please try again later.
        </p>
      </div>
    );
  }

  // Get current treatment line
  const currentTreatmentLine = condition.treatmentLines?.[activeFilters.treatmentLine];
  if (!currentTreatmentLine) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800">
          No treatments available for the selected line. Please try another treatment line.
        </p>
      </div>
    );
  }

  // Get age-appropriate regimens
  const regimens = isPediatricMode ? currentTreatmentLine.pediatric : currentTreatmentLine.adult;
  if (!regimens || Object.keys(regimens).length === 0) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800">
          No {isPediatricMode ? 'pediatric' : 'adult'} treatments available for this condition. Please consult with a specialist.
        </p>
      </div>
    );
  }

  // Filter regimens based on current filters (only setting)
  const filteredRegimens = Object.entries(regimens).reduce((acc, [key, regimen]) => {
    // Check if the regimen matches the current setting filter
    const matchesSetting = (
      // Match if regimen has no setting restriction
      !regimen.setting ||
      // Match if regimen setting matches active filter
      regimen.setting === activeFilters.setting ||
      // Match if scenario name includes the setting
      key.toLowerCase().includes(activeFilters.setting.toLowerCase()) ||
      // Match if it's a combination that should be available in all settings
      (key.toLowerCase().includes('combination') && !key.toLowerCase().includes('setting_specific'))
    );
    
    if (matchesSetting) {
      acc[key] = regimen;
    }
    return acc;
  }, {} as Record<string, Regimen>);

  // Treatment line options
  const treatmentLines = [
    { id: 'first_line', label: 'First Line' },
    ...(condition.treatmentLines.second_line ? [{ id: 'second_line', label: 'Second Line' }] : []),
    ...(condition.treatmentLines.third_line ? [{ id: 'third_line', label: 'Third Line' }] : []),
  ];

  // Handle antibiotic click
  const handleAntibioticClick = (antibioticName: string) => {
    const antibiotic = findAntibiotic(antibioticName, antibiotics);
    if (antibiotic) {
      setSelectedAntibiotic(antibiotic);
      setIsModalOpen(true);
    } else {
      console.warn(`Could not load data for antibiotic: ${antibioticName}`);
    }
  };

  // Handle allergy click
  const handleAllergyClick = (allergy: string) => {
    let guidelines = {};
    
    if (allergy === 'penicillin') {
      guidelines = {
        alternatives: [
          'Macrolides (e.g., Azithromycin)',
          'Fluoroquinolones (e.g., Levofloxacin)',
          'Tetracyclines (e.g., Doxycycline)',
        ],
        recommendations: [
          'Consider skin testing to confirm true penicillin allergy',
          'Many patients with reported penicillin allergy can safely receive cephalosporins',
        ],
        notes: [
          'Cross-reactivity with cephalosporins is lower than previously thought (~2%)',
          'Document the nature of the allergic reaction (e.g., rash vs. anaphylaxis)',
        ],
      };
    } else if (allergy === 'cephalosporin') {
      guidelines = {
        alternatives: [
          'Fluoroquinolones (e.g., Levofloxacin)',
          'Macrolides (e.g., Azithromycin)',
          'Carbapenems (e.g., Meropenem)',
        ],
        recommendations: [
          'Evaluate cross-reactivity risk with other beta-lactams',
          'Consider allergy consultation for severe reactions',
        ],
        notes: [
          'Cross-reactivity patterns vary by generation of cephalosporin',
          'Document specific cephalosporin causing the reaction',
        ],
      };
    }

    setGuidelineModal({
      isOpen: true,
      title: `${allergy} Allergy Guidelines`,
      guidelines,
    });
  };

  // Handle population click
  const handlePopulationClick = (population: string) => {
    let guidelines = {};
    
    if (population === 'pregnancy') {
      guidelines = {
        recommendations: [
          'Prefer FDA Category A/B medications when possible',
          'Consider risk vs. benefit for each trimester',
          'Adjust dosing based on pregnancy-related physiological changes',
        ],
        notes: [
          'Document gestational age when making treatment decisions',
          'Consider consulting with OB/GYN for complex cases',
        ],
      };
    } else if (population === 'renal-impairment') {
      guidelines = {
        recommendations: [
          'Calculate and document creatinine clearance',
          'Adjust dosing based on renal function',
          'Monitor renal function during therapy',
        ],
        notes: [
          'Consider nephrology consultation for complex cases',
          'Regular monitoring of drug levels may be required',
        ],
      };
    } else if (population === 'immunocompromised') {
      guidelines = {
        recommendations: [
          'Consider broader spectrum empiric therapy',
          'Lower threshold for hospitalization',
          'Monitor closely for treatment response',
        ],
        notes: [
          'Document type and degree of immunosuppression',
          'Consider infectious disease consultation',
        ],
      };
    }

    setGuidelineModal({
      isOpen: true,
      title: `${population.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Guidelines`,
      guidelines,
    });
  };

  // Split combination antibiotics
  const renderAntibioticButtons = (regimen: string) => {
    return regimen.split('+').map((antibiotic, idx) => {
      const name = antibiotic.trim();
      return (
        <button
          key={idx}
          onClick={() => handleAntibioticClick(name)}
          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {name}
        </button>
      );
    });
  };

  // Default filter values
  const defaultFilters = {
    setting: ['outpatient']
  };

  // Get applicable filters with fallback
  const applicableFilters = condition.filters?.applicable || defaultFilters;

  // Handle treatment selection from decision tree
  const handleTreatmentSelect = (treatmentKey: string) => {
    // Set the treatment line based on where the treatment exists
    let foundTreatmentLine = 'first_line';
    let foundSetting = 'outpatient';

    // Search through treatment lines to find the treatment
    Object.entries(condition.treatmentLines).forEach(([line, treatments]) => {
      const adultTreatments = treatments.adult || {};
      const pediatricTreatments = treatments.pediatric || {};
      
      if (Object.keys(adultTreatments).includes(treatmentKey) || 
          Object.keys(pediatricTreatments).includes(treatmentKey)) {
        foundTreatmentLine = line;
        
        // Try to determine the setting from the treatment key or regimen setting
        const treatment = adultTreatments[treatmentKey] || pediatricTreatments[treatmentKey];
        if (treatment?.setting) {
          foundSetting = treatment.setting;
        } else if (treatmentKey.includes('inpatient')) {
          foundSetting = 'inpatient';
        } else if (treatmentKey.includes('icu')) {
          foundSetting = 'icu';
        }
      }
    });

    setActiveFilters({
      treatmentLine: foundTreatmentLine as 'first_line' | 'second_line' | 'third_line',
      setting: foundSetting
    });
    setSelectedTreatment(treatmentKey);

    // Scroll the selected treatment into view
    setTimeout(() => {
      const element = document.getElementById(`treatment-${treatmentKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Show decision tree if available */}
      {condition.decisionTree && (
        <DecisionTree
          condition={condition}
          onTreatmentSelect={handleTreatmentSelect}
        />
      )}

      {/* Filter controls */}
      <div className="space-y-4">
        {/* Pediatric toggle */}
        <PediatricToggle />
        {/* Treatment line selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Treatment Line:</span>
          <div className="flex space-x-2">
            {treatmentLines.map(line => (
              <button
                key={line.id}
                onClick={() => setActiveFilters(prev => ({ ...prev, treatmentLine: line.id as any }))}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeFilters.treatmentLine === line.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {line.label}
              </button>
            ))}
          </div>
        </div>

        {/* Setting selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Setting:</span>
          <div className="flex space-x-2">
            {condition.filters?.applicable?.setting?.map(setting => (
              <button
                key={setting}
                onClick={() => setActiveFilters(prev => ({ ...prev, setting }))}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeFilters.setting === setting
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {setting.charAt(0).toUpperCase() + setting.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Allergy and population filters */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Allergies:</span>
          {condition.filters?.applicable?.allergies?.map((allergy) => (
            <button
              key={allergy}
              onClick={() => handleAllergyClick(allergy)}
              className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Special Populations:</span>
          {condition.filters?.applicable?.populations?.map((population) => (
            <button
              key={population}
              onClick={() => handlePopulationClick(population)}
              className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              {population.charAt(0).toUpperCase() + population.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Treatment regimens */}
      <div className="space-y-4">
        {Object.entries(filteredRegimens).map(([scenario, regimen]) => (
          <div
            key={scenario}
            id={`treatment-${scenario}`}
            className={`p-4 rounded-lg border ${
              selectedTreatment === scenario
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                : 'border-gray-200 bg-white'
            }`}
          >
            <h3 className="font-medium text-gray-900 mb-2">
              {scenario.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Regimen: </span>
                {renderAntibioticButtons(regimen.regimen)}
              </p>
              <p>
                <span className="font-medium">Route: </span>
                {regimen.route}
              </p>
              <p>
                <span className="font-medium">Dosing: </span>
                {formatDosage(regimen.dosing)}
              </p>
              {regimen.duration && (
                <p>
                  <span className="font-medium">Duration: </span>
                  {regimen.duration}
                </p>
              )}
              {regimen.notes && regimen.notes.length > 0 && (
                <div>
                  <span className="font-medium">Notes:</span>
                  <ul className="list-disc list-inside ml-2">
                    {regimen.notes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
              {regimen.monitoring && regimen.monitoring.length > 0 && (
                <div>
                  <span className="font-medium">Monitoring:</span>
                  <ul className="list-disc list-inside ml-2">
                    {regimen.monitoring.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Patient instructions if available */}
      {condition.patientInstructions && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Patient Instructions</h3>

          {/* Collapsible: General Instructions */}
          {condition.patientInstructions.general && (
            <CollapsibleSection title="General Instructions">
              <ul className="list-disc list-inside space-y-1">
                {condition.patientInstructions.general.map((instruction, index) => (
                  <li key={index} className="text-gray-600">{instruction}</li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {/* Collapsible: Wound Care */}
          {condition.patientInstructions.wound_care && (
            <CollapsibleSection title="Wound Care">
              <ul className="list-disc list-inside space-y-1">
                {condition.patientInstructions.wound_care.map((instruction, index) => (
                  <li key={index} className="text-gray-600">{instruction}</li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {/* Collapsible: Stepdown Guidance */}
          {condition.patientInstructions.stepdown_guidance && (
            <CollapsibleSection title="Stepdown Guidance">
              <ul className="list-disc list-inside space-y-1">
                {condition.patientInstructions.stepdown_guidance.map((instruction, index) => (
                  <li key={index} className="text-gray-600">{instruction}</li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {/* Collapsible: Follow-up Instructions */}
          {condition.patientInstructions.followUp && (
            <CollapsibleSection title="Follow-up Instructions">
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(condition.patientInstructions.followUp).map(([key, instructions]) => (
                  <li key={key} className="text-gray-600">
                    {key}:
                    <ul className="list-disc list-inside ml-4">
                      {Array.isArray(instructions) ? instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      )) : (
                        <li>{String(instructions)}</li>
                      )}
                    </ul>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}
        </div>
      )}

      {/* Modals */}
      <AntibioticModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        antibiotic={selectedAntibiotic}
      />
      <GuidelineModal
        isOpen={guidelineModal.isOpen}
        onClose={() => setGuidelineModal(prev => ({ ...prev, isOpen: false }))}
        title={guidelineModal.title}
        guidelines={guidelineModal.guidelines}
      />
    </div>
  );
};

// CollapsibleSection component
const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border rounded-lg">
      <button
        type="button"
        className="w-full flex justify-between items-center px-4 py-2 text-left font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {open && <div className="px-4 py-2 bg-white">{children}</div>}
    </div>
  );
}; 