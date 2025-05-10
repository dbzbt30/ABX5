import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import yaml from 'js-yaml';
import { Condition } from '@/types/treatment';

interface PageProps {
  params: {
    id: string;
  };
}

async function loadConditions(categoryId: string): Promise<Condition[]> {
  const categoryPath = path.join(process.cwd(), 'src', 'data', 'categories', categoryId);
  const conditions: Condition[] = [];

  try {
    const files = await fs.readdir(categoryPath);
    
    for (const file of files) {
      if (file.endsWith('.yml')) {
        const filePath = path.join(categoryPath, file);
        const fileContents = await fs.readFile(filePath, 'utf8');
        const condition = yaml.load(fileContents) as Condition;
        conditions.push(condition);
      }
    }
  } catch (error) {
    console.error(`Error loading conditions for category ${categoryId}:`, error);
  }

  return conditions;
}

export default async function CategoryPage({ params }: PageProps) {
  const conditions = await loadConditions(params.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 capitalize">{params.id.replace(/-/g, ' ')}</h1>
        <p className="mt-2 text-base text-gray-600">
          Select a condition to view treatment guidelines
        </p>
      </div>

      <div className="space-y-4">
        {conditions.map((condition) => (
          <Link
            key={condition.id}
            href={`/category/${params.id}/${condition.id}`}
            className="block bg-white hover:bg-gray-50 p-6 transition-colors duration-200"
          >
            <h2 className="text-xl font-light text-gray-900 group-hover:text-blue-600">
              {condition.name}
            </h2>
            {condition.description && (
              <p className="mt-1 text-sm text-gray-500">
                {condition.description}
              </p>
            )}
            {condition.tags && condition.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {condition.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 text-xs text-gray-500 bg-gray-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
} 