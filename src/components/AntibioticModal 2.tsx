'use client';

import { motion } from 'framer-motion';

// This would come from your data layer
const antibioticData = {
  amoxicillin: {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    class: 'Aminopenicillin',
    spectrum: {
      plus: ['Streptococcus spp.', 'H. influenzae', 'E. coli', 'Proteus mirabilis'],
      minus: ['MRSA', 'Pseudomonas', 'Beta-lactamase producers']
    },
    stewardshipTier: 'Core',
    adultDosing: {
      cap: {
        dose: '1000mg',
        route: 'PO',
        frequency: 'q8h',
        maxDose: '3000mg/day',
        notes: ['Take with food to improve absorption']
      }
    },
    renalAdjustment: {
      note: 'Reduce dose in severe renal impairment (CrCl <30)'
    },
    hepaticAdjustment: 'No adjustment needed',
    adverseEffects: [
      'Diarrhea',
      'Rash',
      'Nausea',
      'C. difficile infection'
    ],
    monitoring: [
      'Clinical response',
      'Rash or allergic reactions'
    ],
    pregnancy: 'Category B - Generally considered safe',
    cost: '$',
    references: [
      'Sanford Guide 2024',
      'Local Antibiogram'
    ]
  }
};

interface AntibioticModalProps {
  antibioticId: string;
  onClose: () => void;
}

export const AntibioticModal: React.FC<AntibioticModalProps> = ({
  antibioticId,
  onClose
}) => {
  const antibiotic = antibioticData[antibioticId.toLowerCase() as keyof typeof antibioticData];

  if (!antibiotic) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{antibiotic.name}</h2>
              <p className="text-gray-500">{antibiotic.class}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Spectrum */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Spectrum of Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2">Covers</h4>
                <ul className="space-y-1">
                  {antibiotic.spectrum.plus.map((org) => (
                    <li key={org} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      {org}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-700 mb-2">Does Not Cover</h4>
                <ul className="space-y-1">
                  {antibiotic.spectrum.minus.map((org) => (
                    <li key={org} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                      {org}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Dosing */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Adult Dosing</h3>
            {Object.entries(antibiotic.adultDosing).map(([indication, dosing]) => (
              <div key={indication} className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {indication.toUpperCase()}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Dose:</span> {dosing.dose}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Route:</span> {dosing.route}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Frequency:</span> {dosing.frequency}
                  </p>
                  {dosing.maxDose && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Max Dose:</span> {dosing.maxDose}
                    </p>
                  )}
                  {dosing.notes && (
                    <ul className="mt-2 space-y-1">
                      {dosing.notes.map((note, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          • {note}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Adjustments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Renal Adjustment</h3>
              <p className="text-sm text-gray-600">{antibiotic.renalAdjustment.note}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Hepatic Adjustment</h3>
              <p className="text-sm text-gray-600">{antibiotic.hepaticAdjustment}</p>
            </div>
          </div>

          {/* Side Effects & Monitoring */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Adverse Effects</h3>
              <ul className="space-y-2">
                {antibiotic.adverseEffects.map((effect) => (
                  <li key={effect} className="text-sm text-gray-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2" />
                    {effect}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Monitoring</h3>
              <ul className="space-y-2">
                {antibiotic.monitoring.map((item) => (
                  <li key={item} className="text-sm text-gray-600 flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Pregnancy</h3>
              <p className="text-sm text-gray-600">{antibiotic.pregnancy}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Cost</h3>
              <p className="text-sm text-gray-600">{antibiotic.cost}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Stewardship</h3>
              <p className="text-sm text-gray-600">{antibiotic.stewardshipTier}</p>
            </div>
          </div>

          {/* References */}
          <div className="pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-900 mb-2">References</h3>
            <ul className="space-y-1">
              {antibiotic.references.map((ref) => (
                <li key={ref} className="text-sm text-gray-600">
                  • {ref}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 