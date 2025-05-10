import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { NextResponse } from 'next/server';
import { findAntibiotic, getCanonicalName } from '@/lib/utils/antibioticNormalizer';

// Helper function to normalize text for searching
const normalizeText = (text: string): string => {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
};

// Helper function to check if text matches search term
const textMatches = (text: string, searchTerm: string): boolean => {
  const normalizedText = normalizeText(text);
  const normalizedTerm = normalizeText(searchTerm);
  return normalizedText.includes(normalizedTerm);
};

export async function POST(request: Request) {
  try {
    const { term } = await request.json();
    const results = [];

    // Search antibiotics
    const antibioticsDir = path.join(process.cwd(), 'src', 'data', 'antibiotics');
    const antibioticFiles = await fs.readdir(antibioticsDir);
    
    for (const file of antibioticFiles) {
      if (file.endsWith('.yml')) {
        const filePath = path.join(antibioticsDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const antibiotic = yaml.load(content) as any;

        // Check if antibiotic matches search term
        const matches = [
          antibiotic.name,
          antibiotic.class,
          ...(antibiotic.spectrum?.plus || []),
          ...(antibiotic.spectrum?.minus || []),
        ].some(text => text && textMatches(text, term));

        // Also check synonyms
        const canonicalName = getCanonicalName(term);
        const isMatch = matches || (canonicalName && canonicalName === antibiotic.id);

        if (isMatch) {
          results.push({
            type: 'antibiotic',
            id: antibiotic.id,
            name: antibiotic.name,
            description: `${antibiotic.class} - ${antibiotic.stewardshipTier || 'No tier'}`
          });
        }
      }
    }

    // Search conditions
    const categoriesDir = path.join(process.cwd(), 'src', 'data', 'categories');
    const categories = await fs.readdir(categoriesDir);
    
    for (const category of categories) {
      if (category === '.DS_Store') continue;
      
      const categoryPath = path.join(categoriesDir, category);
      const stat = await fs.stat(categoryPath);
      
      if (stat.isDirectory()) {
        const conditionFiles = await fs.readdir(categoryPath);
        
        for (const file of conditionFiles) {
          if (file.endsWith('.yml')) {
            const filePath = path.join(categoryPath, file);
            const content = await fs.readFile(filePath, 'utf8');
            const condition = yaml.load(content) as any;

            // Check if condition matches search term
            const matches = [
              condition.name,
              condition.description,
              ...(condition.tags || []),
              ...(condition.epidemiology?.commonPathogens || [])
            ].some(text => text && textMatches(text, term));

            if (matches) {
              results.push({
                type: 'condition',
                id: condition.id,
                category,
                name: condition.name,
                description: condition.description
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
} 