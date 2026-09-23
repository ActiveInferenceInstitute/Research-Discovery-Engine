// Renders a single CSS section (e.g., Context, Dynamics) containing multiple fields.

import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import CSSField from './CSSField';
import { CSSVector, AgentMessage, NodeObject } from '../../types';

interface CSSSectionProps {
  darkMode: boolean;
  sectionId: keyof CSSVector; // e.g., 'context'
  sectionLabel: string; // e.g., 'Context & Environment'
  sectionData: Partial<CSSVector[keyof CSSVector]>; // Data for this section
  fieldSuggestions: { [fieldPath: string]: AgentMessage[] }; // Suggestions for fields within this section
  onUpdateField: (fieldPath: string, value: any) => void;
  onAcceptSuggestion: (fieldPath: string, suggestionValue: any) => void;
  onTriggerAgent: (action: string, payload?: any) => void;
  cnmNodes: NodeObject[]; // All CNM nodes for lookup
}

const CSSSection: React.FC<CSSSectionProps> = ({
  darkMode,
  sectionId,
  sectionLabel,
  sectionData,
  fieldSuggestions,
  onUpdateField,
  onAcceptSuggestion,
  onTriggerAgent,
  cnmNodes
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded

  return (
    <div className={`rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
      <button
        className={`w-full p-3 flex items-center justify-between font-semibold ${
          darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
        } rounded-t-lg`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {isExpanded ? <ChevronDown size={18} className="mr-2" /> : <ChevronRight size={18} className="mr-2" />}
          <span>{sectionLabel}</span>
        </div>
         {/* Optional: Indicator for suggestions in this section */}
          {Object.keys(fieldSuggestions).length > 0 && (
              <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-blue-600'} text-white`}>
                 {Object.values(fieldSuggestions).flat().length} Suggestions
             </span>
          )}
      </button>
      {isExpanded && (
        <div className="p-4 border-t border-gray-600 space-y-4">
          {Object.entries(sectionData).map(([fieldKey, fieldValue]) => {
             const fieldPath = `${sectionId}.${fieldKey}`;
             const fieldSuggestionsForThis = fieldSuggestions[fieldPath] || [];

             // Simple check to avoid rendering functions etc.
              if (typeof fieldValue === 'function') return null;

             return (
                <CSSField
                   key={fieldPath}
                   darkMode={darkMode}
                   label={fieldKey.replace(/([A-Z])/g, ' $1').trim()} // Convert camelCase to Title Case
                   fieldPath={fieldPath}
                   value={fieldValue}
                   suggestions={fieldSuggestionsForThis}
                   onUpdate={onUpdateField}
                   onAcceptSuggestion={onAcceptSuggestion}
                   onTriggerAgent={onTriggerAgent}
                   cnmNodes={cnmNodes}
                 />
             );
          })}
        </div>
      )}
    </div>
  );
};

export default CSSSection;