import { Antibiotic } from '@/types/treatment';

// Antibiotic synonyms mapping
const antibioticSynonyms: Record<string, string[]> = {
  'piperacillin-tazobactam': ['pip-tazo', 'zosyn', 'piptazo', 'tazocin'],
  'trimethoprim-sulfamethoxazole': ['tmp-smx', 'bactrim', 'co-trimoxazole', 'septra'],
  'amoxicillin-clavulanate': ['augmentin', 'co-amoxiclav', 'amox-clav'],
  'ampicillin-sulbactam': ['unasyn'],
  'ceftriaxone': ['rocephin'],
  'vancomycin': ['vanc'],
  'piperacillin': ['pip'],
  'gentamicin': ['gent'],
  'clindamycin': ['clinda'],
  'metronidazole': ['flagyl', 'metro'],
  'azithromycin': ['zithromax', 'azith'],
  'ciprofloxacin': ['cipro'],
  'levofloxacin': ['levo', 'levaquin'],
  'meropenem': ['merrem', 'mero'],
  'cefazolin': ['ancef', 'kefzol'],
  'cefepime': ['maxipime'],
  'doxycycline': ['doxy'],
};

// Normalize a string for comparison
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
};

// Get all possible variations of an antibiotic name
const getAntibioticVariations = (name: string): string[] => {
  const normalized = normalizeString(name);
  const variations = new Set([name.toLowerCase()]);

  // Add normalized version
  variations.add(normalized);

  // Add hyphenated version if applicable
  const hyphenated = name.toLowerCase().replace(/\s+/g, '-');
  variations.add(hyphenated);

  // Add synonyms if they exist
  for (const [key, synonyms] of Object.entries(antibioticSynonyms)) {
    if (normalized === normalizeString(key)) {
      synonyms.forEach(syn => variations.add(syn));
    }
    // Also check if the input is a synonym
    if (synonyms.some(syn => normalizeString(syn) === normalized)) {
      variations.add(key);
      synonyms.forEach(syn => variations.add(syn));
    }
  }

  return Array.from(variations);
};

// Find an antibiotic by name or synonym
export const findAntibiotic = (
  searchTerm: string,
  antibiotics: Record<string, Antibiotic>
): Antibiotic | null => {
  // Handle combination antibiotics
  if (searchTerm.includes('+')) {
    // Try to find the first antibiotic in the combination
    const firstAntibiotic = searchTerm.split('+')[0].trim();
    return findAntibiotic(firstAntibiotic, antibiotics);
  }

  const normalizedSearch = normalizeString(searchTerm);
  const variations = getAntibioticVariations(searchTerm);

  // First try exact matches
  for (const [name, antibiotic] of Object.entries(antibiotics)) {
    if (variations.includes(name.toLowerCase())) {
      return antibiotic;
    }
  }

  // Then try fuzzy matches
  for (const [name, antibiotic] of Object.entries(antibiotics)) {
    const antibioticVariations = getAntibioticVariations(name);
    if (antibioticVariations.some(variation => 
      variation.includes(normalizedSearch) || normalizedSearch.includes(variation)
    )) {
      return antibiotic;
    }
  }

  // Try matching without case or special characters
  const strippedSearch = searchTerm.toLowerCase().replace(/[^a-z]/g, '');
  for (const [name, antibiotic] of Object.entries(antibiotics)) {
    const strippedName = name.toLowerCase().replace(/[^a-z]/g, '');
    if (strippedName === strippedSearch) {
      return antibiotic;
    }
  }

  return null;
};

// Get the canonical name for an antibiotic
export const getCanonicalName = (searchTerm: string): string | null => {
  const normalized = normalizeString(searchTerm);
  
  // Check direct matches in synonyms
  for (const [canonical, synonyms] of Object.entries(antibioticSynonyms)) {
    if (normalized === normalizeString(canonical)) {
      return canonical;
    }
    if (synonyms.some(syn => normalizeString(syn) === normalized)) {
      return canonical;
    }
  }

  return null;
}; 