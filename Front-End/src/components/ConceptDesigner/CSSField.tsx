// Renders a single CSS field with input/selector and suggestions.

import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, AlertTriangle, Check, ExternalLink } from 'lucide-react';
import { NodeObject, AgentMessage } from '../../types';

interface CSSFieldProps {
  darkMode: boolean;
  label: string;
  fieldPath: string; // e.g., 'context.material_primary'
  value: any; // Current value of the field
  suggestions: AgentMessage[]; // Suggestions for this field
  onUpdate: (fieldPath: string, value: any) => void;
  onAcceptSuggestion: (fieldPath: string, suggestionValue: any) => void;
  onTriggerAgent: (action: string, payload?: any) => void; // For triggering field-specific agent actions
  cnmNodes: NodeObject[]; // All CNM nodes to find nodes by ID from suggestions
}

const CSSField: React.FC<CSSFieldProps> = ({
  darkMode,
  label,
  fieldPath,
  value,
  suggestions,
  onUpdate,
  onAcceptSuggestion,
  onTriggerAgent,
  cnmNodes
}) => {
  const [isEditing, setIsEditing] = useState(false); // To show dropdown/input
  const [manualInput, setManualInput] = useState(String(value || '')); // For text inputs

  useEffect(() => {
      setManualInput(String(value || '')); // Keep manual input synced with actual value
  }, [value]);


  const isArrayField = Array.isArray(value);
  const isBoolField = typeof value === 'boolean' || (value === 'Yes' || value === 'No'); // Crude check

  const getNodeById = (id: string) => cnmNodes.find(n => n.id === id);


  const renderValue = () => {
      if (isArrayField) {
          if (value.length === 0) return <span className="italic text-gray-500">Empty</span>;
           return (
               <div className="flex flex-wrap gap-1">
                   {value.map((item: any, index: number) => (
                       <span key={index} className={`px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} flex items-center space-x-1`}>
                          {String(item)}
                           {/* Optional: Add remove button for array items */}
                       </span>
                   ))}
               </div>
           );
      } else if (isBoolField) {
           return String(value === true || value === 'Yes' ? 'Yes' : (value === false || value === 'No' ? 'No' : 'Empty'));
      }
      return String(value || 'Empty');
  }

  const handleValueClick = () => {
      // For now, clicking value just toggles suggestions visibility or editing mode
      // A real implementation would open a searchable modal or dropdown populated by relevant CNM nodes
      setIsEditing(!isEditing);
      // Potentially trigger agent suggestions here if none exist yet for this field
      if (suggestions.length === 0) {
           onTriggerAgent('suggest-compatible', { field: fieldPath });
      }
  }

   const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
       setManualInput(e.target.value);
   }

   const handleManualInputBlur = () => {
       // Update the concept state when user finishes typing/selecting manually
        let finalValue: any = manualInput;
        if (isBoolField) finalValue = manualInput === 'Yes'; // Convert string Yes/No to boolean
         if (isArrayField) {
             // How to handle manual input for arrays? Maybe a dedicated input?
             // For now, assume manual input isn't ideal for arrays.
              return;
         }
       onUpdate(fieldPath, finalValue);
       setIsEditing(false); // Close input after update
   }


  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
          {/* Display Area */}
          {!isEditing ? (
               <div
                 className={`w-full p-2 pr-10 rounded-md flex items-center ${isArrayField ? 'block' : 'justify-between'} ${
                   darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                 } focus:outline-none focus:ring-2 cursor-pointer`}
                 onClick={handleValueClick}
               >
                 {renderValue()}
               </div>
          ) : (
              // Editing Area (Simplified: just a text input or select)
               isBoolField ? (
                  <select
                      value={String(value === true ? 'Yes' : value === false ? 'No' : '')}
                       onChange={handleManualInputChange}
                       onBlur={handleManualInputBlur} // Update on blur
                       className={`w-full p-2 pr-10 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                       autoFocus // Focus input when editing starts
                   >
                        <option value="">Select...</option>
                       <option value="Yes">Yes</option>
                       <option value="No">No</option>
                   </select>
               ) : (
                    <input
                       type="text" // Could be number, etc. based on schema
                       value={manualInput}
                       onChange={handleManualInputChange}
                        onBlur={handleManualInputBlur} // Update on blur
                       className={`w-full p-2 pr-10 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                        placeholder={`Enter ${label.toLowerCase()}...`}
                        autoFocus // Focus input when editing starts
                    />
               )
          )}


        {/* Suggestion/Action Button */}
        <button
          className={`absolute right-2 top-2 p-1 rounded-full ${
            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
          }`}
           title="Get AI suggestions"
           onClick={() => {
               // Trigger suggestion agent for this specific field
                onTriggerAgent('suggest-compatible', { field: fieldPath, currentConcept: value }); // Pass current value for context
                setIsEditing(true); // Optionally open editing view to show suggestions
           }}
        >
          <Brain size={16} />
        </button>
      </div>

      {/* Suggestions Area (Visible when suggestions available) */}
      {suggestions && suggestions.length > 0 && (
        <div className={`mt-2 p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} text-sm space-y-2`}>
             <h5 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Suggestions:</h5>
          {suggestions.map((suggestionMsg, index) => (
            <div
              key={suggestionMsg.id || index} // Use message ID as key
              className={`p-2 rounded-md ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}
            >
                 {/* Suggestion Content */}
                <div className="flex items-start mb-1">
                     {suggestionMsg.type === 'opportunity' && <Sparkles size={14} className="text-yellow-500 mr-1 flex-shrink-0" />}
                     {suggestionMsg.type === 'suggestion' && <Check size={14} className="text-blue-500 mr-1 flex-shrink-0" />}
                     {suggestionMsg.type === 'warning' && <AlertTriangle size={14} className="text-orange-500 mr-1 flex-shrink-0" />}
                     <div className="flex-grow">
                         <p>{suggestionMsg.content}</p>
                         {/* Optional: Render related nodes from suggestion message payload */}
                         {suggestionMsg.relatedNodeIds && suggestionMsg.relatedNodeIds.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                   {suggestionMsg.relatedNodeIds.map(nodeId => {
                                        const relatedNode = getNodeById(nodeId);
                                        return relatedNode ? (
                                             <button
                                                  key={nodeId}
                                                  className={`px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} flex items-center space-x-1`}
                                                  onClick={() => onSelectNode(relatedNode)} // Let user view suggested node
                                             >
                                                 {relatedNode.id} <ExternalLink size={10}/>
                                             </button>
                                         ) : null;
                                   })}
                              </div>
                          )}
                     </div>
                 </div>

                {/* Action Buttons (e.g., Use Suggestion) */}
                {suggestionMsg.action?.type === 'accept-suggestion' && (
                    <div className="mt-2 text-right">
                        <button
                           className={`px-3 py-1 rounded-md text-xs ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
                            onClick={() => {
                                // Assume payload has the value to use
                                onAcceptSuggestion(fieldPath, suggestionMsg.action.payload.value);
                                setIsEditing(false); // Close suggestions/editing after accepting
                            }}
                        >
                           Use Suggestion
                        </button>
                    </div>
                )}
                 {/* Handle other action types */}
                  {suggestionMsg.action?.type === 'trigger-agent' && (
                       <div className="mt-2 text-right">
                             <button
                                className={`px-3 py-1 rounded-md text-xs ${darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'} text-white transition-colors`}
                                onClick={() => onTriggerAgent(suggestionMsg.action!.payload.task, suggestionMsg.action!.payload)}
                             >
                                {suggestionMsg.content.includes('Generate') ? 'Generate Idea' : 'Trigger Action'}
                             </button>
                       </div>
                  )}
            </div>
          ))}
             {/* Button to clear suggestions for this field */}
             {suggestions.length > 0 && (
                 <div className="text-right mt-2">
                      <button
                          className={`text-xs underline ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`}
                           onClick={() => onTriggerAgent('clear-suggestions', { field: fieldPath })} // AgentConsole will handle this
                      >
                         Clear Suggestions
                     </button>
                 </div>
             )}
        </div>
      )}
    </div>
  );
};

export default CSSField;