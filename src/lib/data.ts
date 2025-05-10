'use server';

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import * as yaml from 'js-yaml';
import { type Condition } from '@/types/condition';
import { AntibioticSchema, type Antibiotic } from '@/schema/antibiotic.schema';
import { stat } from 'fs/promises';

const DATA_DIR = join(process.cwd(), 'src', 'data');

export async function loadCondition(categoryId: string, conditionId: string): Promise<Condition> {
  const filePath = join(DATA_DIR, 'categories', categoryId, `${conditionId}.yml`);
  const fileContents = await readFile(filePath, 'utf8');
  const data = yaml.load(fileContents) as Condition;
  return data;
}

export async function loadAntibiotic(antibioticId: string): Promise<Antibiotic> {
  const filePath = join(DATA_DIR, 'antibiotics', `${antibioticId}.yml`);
  const fileContents = await readFile(filePath, 'utf8');
  const data = yaml.load(fileContents) as unknown;
  return AntibioticSchema.parse(data);
}

export async function getAllCategories(): Promise<string[]> {
  const categoriesDir = join(DATA_DIR, 'categories');
  try {
    const entries = await readdir(categoriesDir);
    const categories = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = join(categoriesDir, entry);
        const stats = await stat(fullPath);
        return { name: entry, isDirectory: stats.isDirectory() };
      })
    );
    return categories
      .filter(entry => entry.isDirectory)
      .map(entry => entry.name);
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

export async function getConditionsInCategory(categoryId: string): Promise<Condition[]> {
  const categoryDir = join(DATA_DIR, 'categories', categoryId);
  try {
    const files = await readdir(categoryDir);
    const conditions = await Promise.all(
      files
        .filter(file => file.endsWith('.yml'))
        .map(file => {
          const conditionId = file.replace('.yml', '');
          return loadCondition(categoryId, conditionId);
        })
    );
    return conditions;
  } catch (error) {
    console.error(`Error loading conditions for category ${categoryId}:`, error);
    return [];
  }
} 