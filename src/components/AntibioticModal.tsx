'use client';

import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Antibiotic, PaedsDosing } from '@/types/treatment';
import { usePediatricStore } from '@/lib/store/pediatricStore';
import { PediatricCalculator } from './PediatricCalculator';

interface AntibioticModalProps {
  isOpen: boolean;
  onClose: () => void;
  antibiotic: Antibiotic | null;
}

export const AntibioticModal: React.FC<AntibioticModalProps> = ({
  isOpen,
  onClose,
  antibiotic
}) => {
  const { isEnabled: isPediatricMode } = usePediatricStore();
  
  if (!antibiotic) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  <span>{antibiotic.name}</span>
                  {antibiotic.stewardshipTier && (
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      antibiotic.stewardshipTier === 'Core' ? 'bg-green-100 text-green-800' :
                      antibiotic.stewardshipTier === 'Watch' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {antibiotic.stewardshipTier}
                    </span>
                  )}
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  {/* Class */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Class</h4>
                    <p className="text-sm text-gray-600">{antibiotic.class}</p>
                  </div>

                  {/* Spectrum */}
                  {antibiotic.spectrum && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-700">Covers</h4>
                        <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                          {antibiotic.spectrum.plus.map((org, idx) => (
                            <li key={idx}>{org}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-700">Does Not Cover</h4>
                        <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                          {antibiotic.spectrum.minus.map((org, idx) => (
                            <li key={idx}>{org}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Dosing */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">
                      {isPediatricMode ? 'Pediatric Dosing' : 'Adult Dosing'}
                    </h4>
                    <div className="mt-2 space-y-2">
                      {isPediatricMode ? (
                        antibiotic.paeds ? (
                          Object.entries(antibiotic.paeds).map(([indication, dosing]) => (
                            <div key={indication} className="text-sm">
                              <span className="font-medium">{indication}:</span>
                              <PediatricCalculator 
                                indication={indication} 
                                dosing={dosing as PaedsDosing}
                              />
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-yellow-600">
                            No pediatric dosing information available. Please consult pediatric specialist.
                          </p>
                        )
                      ) : (
                        Object.entries(antibiotic.adult).map(([indication, dosing]) => (
                          <div key={indication} className="text-sm">
                            <span className="font-medium">{indication}:</span>
                            <span className="text-gray-600"> {dosing.dose} {dosing.route} {dosing.frequency}</span>
                            {dosing.duration && (
                              <span className="text-gray-600"> × {dosing.duration}</span>
                            )}
                            {dosing.notes && (
                              <ul className="mt-1 text-xs text-gray-500 list-disc list-inside">
                                {dosing.notes.map((note, idx) => (
                                  <li key={idx}>{note}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Adjustments */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Renal Adjustment</h4>
                      <p className="text-sm text-gray-600">
                        {antibiotic.renalAdjustment?.note || 'No adjustment needed'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Hepatic Adjustment</h4>
                      <p className="text-sm text-gray-600">{antibiotic.hepaticAdjustment || 'No adjustment needed'}</p>
                    </div>
                  </div>

                  {/* Adverse Effects & Monitoring */}
                  <div className="grid grid-cols-2 gap-4">
                    {antibiotic.adverseEffects && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Adverse Effects</h4>
                        <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                          {antibiotic.adverseEffects.map((effect, idx) => (
                            <li key={idx}>{effect}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {antibiotic.monitoring && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Monitoring</h4>
                        <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                          {antibiotic.monitoring.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Pregnancy Category</h4>
                      <p className="text-sm text-gray-600">{antibiotic.pregnancy || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Cost</h4>
                      <p className="text-sm text-gray-600">{antibiotic.cost || 'Not specified'}</p>
                    </div>
                  </div>

                  {/* References */}
                  {antibiotic.references && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700">References</h4>
                      <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                        {antibiotic.references.map((ref, idx) => (
                          <li key={idx}>{ref}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 