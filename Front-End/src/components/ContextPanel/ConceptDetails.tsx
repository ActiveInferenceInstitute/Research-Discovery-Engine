// src/components/ContextPanel/ConceptDetails.tsx
import React from 'react';
import { ConceptDesignState, CSSVector } from '../../types';
import { Layers, Check, AlertCircle, Brain, Atom, GitMerge, FlaskConical, Loader } from 'lucide-react';

// Helper to render CSS fields recursively
const renderCssFields = (data: any, darkMode: boolean, path = '', level = 0): JSX.Element | null => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    if (Array.isArray(data) && data.length === 0) return <span className={`italic text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>(empty list)</span>;
    if (Array.isArray(data)) {
        return (
            <div className="flex flex-wrap gap-0.5">
                {data.map((item, index) => (
                    <span key={index} className={`px-1.5 py-0.5 rounded-full text-[10px] ${darkMode ? 'bg-slate-600 text-slate-200' : 'bg-slate-200 text-slate-700'}`}>
                        {String(item)}
                    </span>
                ))}
            </div>
        );
    }
    // Corrected line:
    if (data === undefined || data === null || data === '') {
        return <span className={`italic text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>(not set)</span>;
    }
    if (typeof data === 'boolean') return <span className={`text-xs ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{data ? 'Yes' : 'No'}</span>;
    return <span className={`text-xs ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{String(data)}</span>;
  }

  const keysToRender = path === '' ? Object.keys(data).filter(k => k !== 'meta') : Object.keys(data);

  return (
    <div className={`space-y-1 ${level > 0 ? 'pl-2 border-l border-dashed ' + (darkMode ? 'border-slate-600/70' : 'border-slate-300') : ''}`}>
      {keysToRender.map((key) => {
        const value = (data as any)[key];
        const currentPath = path ? `${path}.${key}` : key;
        const label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        if (typeof value === 'object' && value !== null && Object.keys(value).length === 0 && !Array.isArray(value)) {
            return (
                 <div key={currentPath} className="text-xs mt-0.5">
                    <h5 className={`font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{label}: <span className={`italic ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>(empty)</span></h5>
                 </div>
            );
        }

        return (
          <div key={currentPath} className="text-xs mt-0.5">
            <h5 className={`font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{label}:</h5>
            <div className={`${level > 0 ? 'pl-1.5' : 'pl-1'}`}>
                {renderCssFields(value, darkMode, currentPath, level + 1)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface ConceptDetailsProps {
  darkMode: boolean;
  designState: ConceptDesignState;
  onTriggerAgent: (action: string, payload?: any) => void;
}

const ConceptDetails: React.FC<ConceptDetailsProps> = ({ darkMode, designState, onTriggerAgent }) => {
    if (!designState || !designState.id) { // Basic check for designState itself
        return (
            <div className="p-4 flex flex-col items-center justify-center h-full">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
                <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Loading concept details...
                </p>
            </div>
        );
    }

    // Destructure after checking designState
    const { id, objective, status, components, cssVectorDraft, protocolOutline, targetKnowledgeGapIds } = designState;

    // Fallback for cssVectorDraft if it's not fully initialized yet (though useConceptDesign should handle it)
    const css = cssVectorDraft || { meta: { id: id } };

    const isDraftPopulated =
        (components?.materials && components.materials.length > 0) ||
        (components?.mechanisms && components.mechanisms.length > 0) ||
        (objective && objective.length > 3);

  return (
    <div className="p-3 sm:p-4 overflow-y-auto flex-grow scrollbar-thin">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md sm:text-lg font-bold flex items-center">
            <Atom size={18} className="mr-1.5 text-blue-500 dark:text-blue-400"/> {objective || id || 'New Concept'}
        </h3>
        <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border
            ${status === 'Hypothetical' ? 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-700/30 dark:text-yellow-200 dark:border-yellow-600' :
              status === 'Proposed' ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-700/30 dark:text-blue-200 dark:border-blue-600' :
              status === 'Validated' ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-700/30 dark:text-green-200 dark:border-green-600' :
              'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700/30 dark:text-gray-200 dark:border-gray-600'}`}>
            {status || 'N/A'}
        </span>
      </div>
      <p className={`text-xs font-mono mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        ID: {id}
      </p>

        {objective && (
             <div className={`mb-3 p-2 rounded-md border text-xs sm:text-sm ${darkMode ? 'border-slate-700 bg-slate-700/30' : 'border-slate-200 bg-slate-50'}`}>
                 <h4 className="text-[11px] font-semibold mb-0.5 text-slate-500 dark:text-slate-400 uppercase">Goal / Objective</h4>
                 <p className={`${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    {objective}
                 </p>
             </div>
        )}

       {components && (Object.keys(components.materials).length > 0 || Object.keys(components.mechanisms).length > 0) && (
         <div className={`mb-3 p-2 rounded-md border ${darkMode ? 'border-slate-700 bg-slate-700/30' : 'border-slate-200 bg-slate-50'}`}>
           <h4 className="text-[11px] font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase">Core Components</h4>
            {renderCssFields(components, darkMode)}
         </div>
       )}
       
       {/* Full CSS Vector Draft Preview */}
       {css && Object.keys(css).length > 1 && /* More than just meta */ (
         <div className={`mb-3 p-2 rounded-md border ${darkMode ? 'border-slate-700 bg-slate-700/30' : 'border-slate-200 bg-slate-50'}`}>
           <h4 className="text-[11px] font-semibold mb-1 text-slate-500 dark:text-slate-400 uppercase">Detailed Configuration (CSS Draft)</h4>
            {renderCssFields(css, darkMode)}
         </div>
       )}


       {protocolOutline && (
            <div className={`mb-3 p-2 rounded-md border ${darkMode ? 'border-slate-700 bg-slate-700/30' : 'border-slate-200 bg-slate-50'}`}>
                <h4 className="text-[11px] font-semibold mb-0.5 text-slate-500 dark:text-slate-400 uppercase">Protocol Outline</h4>
                <pre className={`text-xs whitespace-pre-wrap font-mono p-1 rounded ${darkMode ? "bg-slate-700/50" : "bg-slate-100"} max-h-28 overflow-y-auto`}>
                    {protocolOutline.substring(0, 500)}{protocolOutline.length > 500 ? '...' : ''}
                </pre>
            </div>
       )}
       {targetKnowledgeGapIds && targetKnowledgeGapIds.length > 0 && (
            <div className={`mb-3 p-2 rounded-md border ${darkMode ? 'border-slate-700 bg-slate-700/30' : 'border-slate-200 bg-slate-50'}`}>
                <h4 className="text-[11px] font-semibold mb-0.5 text-slate-500 dark:text-slate-400 uppercase">Targeted Knowledge Gaps</h4>
                <div className="flex flex-wrap gap-1 mt-0.5">
                {targetKnowledgeGapIds.map(gapId => (
                    <span key={gapId} className={`px-1.5 py-0.5 rounded-full text-[10px] ${darkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>{gapId}</span>
                ))}
                </div>
            </div>
       )}


        <div className={`mt-3 border-t pt-3 space-y-2 ${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
            <h4 className="text-xs font-semibold mb-1.5 text-slate-500 dark:text-slate-400 uppercase tracking-wider">Concept Actions</h4>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
                 <button
                    className={`w-full text-left p-1.5 rounded-md flex items-center space-x-1.5 
                                ${!isDraftPopulated || (status !== 'Proposed' && status !== 'Validated') ? 
                                    (darkMode ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed') :
                                    (darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white')
                                } transition-colors`}
                    onClick={() => isDraftPopulated && (status === 'Proposed' || status === 'Validated') && onTriggerAgent('generate-protocol-outline', { conceptDesign: designState })}
                    disabled={!isDraftPopulated || (status !== 'Proposed' && status !== 'Validated')}
                    title={!isDraftPopulated ? "Add core components/objective first" : (status !== 'Proposed' && status !== 'Validated') ? "Concept needs to be 'Proposed' or 'Validated'" : "Generate Experimental Protocol"}
                 >
                     <FlaskConical size={14} /> <span>Generate Protocol</span>
                 </button>
                  <button
                     className={`w-full text-left p-1.5 rounded-md flex items-center space-x-1.5 
                       ${status !== 'Validated' || !protocolOutline ? 
                        (darkMode ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed') :
                        (darkMode ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white')
                       } transition-colors`}
                     onClick={() => status === 'Validated' && protocolOutline && onTriggerAgent('package-knowledge-artifact', { finalDesign: designState })}
                     disabled={status !== 'Validated' || !protocolOutline}
                     title={status !== 'Validated' ? "Concept not validated" : !protocolOutline ? "Protocol outline missing" : "Package Knowledge Artifact"}
                  >
                      <Layers size={14} /> <span>Package Artifact</span>
                  </button>
                 <button
                    className={`w-full text-left p-1.5 rounded-md flex items-center space-x-1.5 ${darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-200 hover:bg-slate-300'} transition-colors`}
                     onClick={() => onTriggerAgent('check-consistency', { designToValidate: designState })}
                 >
                     <Check size={14} /> <span>Check Consistency</span>
                 </button>
                  <button
                     className={`w-full text-left p-1.5 rounded-md flex items-center space-x-1.5 ${darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-200 hover:bg-slate-300'} transition-colors`}
                      onClick={() => onTriggerAgent('find-analogies', { currentDesign: designState })}
                  >
                     <GitMerge size={14} /> <span>Find Analogies</span>
                 </button>
            </div>
        </div>
    </div>
  );
};

export default ConceptDetails;