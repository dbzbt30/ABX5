import React from 'react';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { GlobalSearch } from '@/components/GlobalSearch';

const quickAccessConditions = [
  { id: 'pneumonia-cap', name: 'Community Acquired Pneumonia', category: 'respiratory' },
  { id: 'uti-cystitis', name: 'Acute Uncomplicated Cystitis', category: 'gu' },
  { id: 'skin-cellulitis', name: 'Cellulitis', category: 'skin' },
  { id: 'osteomyelitis', name: 'Osteomyelitis', category: 'bone' },
  { id: 'endocarditis', name: 'Infective Endocarditis', category: 'cardio' },
  { id: 'neutropenic-fever', name: 'Neutropenic Fever', category: 'sepsis' },
  { id: 'gonorrhea', name: 'Gonorrhea', category: 'sti' },
  { id: 'septic-arthritis', name: 'Septic Arthritis', category: 'bone' },
  { id: 'pid', name: 'Pelvic Inflammatory Disease', category: 'sti' },
  { id: 'prostatitis', name: 'Prostatitis', category: 'gu' },
];

const categories = [
  { id: 'cns', name: 'Central Nervous System (CNS)' },
  { id: 'respiratory', name: 'Respiratory' },
  { id: 'gu', name: 'Genitourinary (GU)' },
  { id: 'skin', name: 'Skin & Soft Tissue' },
  { id: 'gi', name: 'Gastrointestinal (GI)' },
  { id: 'bone', name: 'Bone & Joint' },
  { id: 'cardio', name: 'Cardiovascular' },
  { id: 'sti', name: 'Obs/Gyne & STIs' },
  { id: 'sepsis', name: 'Sepsis' },
];

// Icons for each category
const categoryIcons: Record<string, React.ReactNode> = {
  respiratory: (
    <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  bone: (
    <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  skin: (
    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  ),
  // Add more icons for other categories
};

async function getCategories(): Promise<string[]> {
  const categoriesPath = path.join(process.cwd(), 'src', 'data', 'categories');
  try {
    const categories = await fs.readdir(categoriesPath);
    return categories.filter(category => {
      const categoryPath = path.join(categoriesPath, category);
      return fs.stat(categoryPath).then(stats => stats.isDirectory());
    });
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Antibiotic Guide
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for conditions or antibiotics to find evidence-based treatment guidelines
          </p>
        </div>

        {/* Global Search */}
        <div className="mb-12">
          <GlobalSearch />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <a
            href="/category/respiratory"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Respiratory</h3>
            <p className="text-gray-600">CAP, HAP, Bronchitis, and more</p>
          </a>
          <a
            href="/category/skin"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Skin & Soft Tissue</h3>
            <p className="text-gray-600">Cellulitis, Abscess, Surgical Site Infections</p>
          </a>
          <a
            href="/category/bone"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bone & Joint</h3>
            <p className="text-gray-600">Osteomyelitis, Septic Arthritis</p>
          </a>
        </div>

        {/* Features */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Evidence-Based</h3>
              <p className="mt-2 text-gray-600">Guidelines based on latest clinical evidence</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Quick Access</h3>
              <p className="mt-2 text-gray-600">Fast search with common drug names</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Smart Filters</h3>
              <p className="mt-2 text-gray-600">Filter by allergies, setting & more</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 