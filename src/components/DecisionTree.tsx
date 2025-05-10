import React, { useState } from 'react';
import { Condition } from '@/types/treatment';

interface DecisionTreeProps {
  condition: Condition;
  onTreatmentSelect: (treatmentKey: string) => void;
}

interface TreeNode {
  question: string;
  options: {
    text: string;
    next?: string;
    treatment?: string;
    criteria?: string[];
  }[];
}

export const DecisionTree: React.FC<DecisionTreeProps> = ({ condition, onTreatmentSelect }) => {
  const [currentNode, setCurrentNode] = useState<string>('initial');
  const [path, setPath] = useState<string[]>(['initial']);

  if (!condition.decisionTree) {
    return null;
  }

  const tree = condition.decisionTree as Record<string, TreeNode>;
  const node = tree[currentNode];

  const handleOptionSelect = (option: { text: string; next?: string; treatment?: string }) => {
    if (option.treatment) {
      onTreatmentSelect(option.treatment);
    } else if (option.next) {
      setCurrentNode(option.next);
      setPath([...path, option.next]);
    }
  };

  const handleBack = () => {
    if (path.length > 1) {
      const newPath = path.slice(0, -1);
      setPath(newPath);
      setCurrentNode(newPath[newPath.length - 1]);
    }
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{node.question}</h3>
        <div className="space-y-2">
          {node.options.map((option, index) => (
            <div key={index} className="space-y-2">
              <button
                onClick={() => handleOptionSelect(option)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">{option.text}</span>
                {option.criteria && (
                  <ul className="mt-2 ml-4 text-sm text-gray-600 list-disc">
                    {option.criteria.map((criterion, idx) => (
                      <li key={idx}>{criterion}</li>
                    ))}
                  </ul>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
      {path.length > 1 && (
        <button
          onClick={handleBack}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to previous question
        </button>
      )}
    </div>
  );
}; 