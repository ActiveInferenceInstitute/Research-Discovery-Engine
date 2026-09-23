// src/components/ConceptDesigner/ConceptDesigner.tsx
import React, { useEffect, useState } from 'react';
import { Brain, FlaskConical, GitMerge, Check, Loader, Lightbulb, FileText, Layers, Target, AlertTriangle, Activity, HelpCircle, Zap as MethodIcon, Sparkles } from 'lucide-react';
// CSSSection might not be needed if we use a simpler UI for component selection
// import CSSSection from './CSSSection';
import { ConceptDesignState, AgentMessage, CSSVector, GraphData, NodeObject } from '../../types';

interface ConceptDesignerProps {
  darkMode: boolean;
  designState: ConceptDesignState;
  graphData: GraphData;
  onUpdateObjective: (objective: string) => void;
  onUpdateComponentSelection: (componentType: keyof ConceptDesignState['components'], selectedIds: string[]) => void;
  onUpdateCssField: (fieldPath: string, value: any) => void;
  onAcceptSuggestion: (fieldPath: string, suggestionValue: any) => void;
  onTriggerAgent: (action: string, payload?: any) => void;
  agentMessages: AgentMessage[];
}

const ConceptDesigner: React.FC<ConceptDesignerProps> = ({
  darkMode,
  designState,
  graphData,
  onUpdateObjective,
  onUpdateComponentSelection,
  onUpdateCssField,
  onAcceptSuggestion,
  onTriggerAgent,
  agentMessages,
}) => {
  const [localProtocolDraft, setLocalProtocolDraft] = useState<string | null>(designState.protocolOutline || null);
  const [isGeneratingProtocol, setIsGeneratingProtocol] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  useEffect(() => {
    setLocalProtocolDraft(designState.protocolOutline || null);
  }, [designState.protocolOutline]);

  useEffect(() => {
    const relevantMessages: string[] = [];
    agentMessages.forEach(msg => {
      if (msg.sourceAgent === 'Protocol Agent' && msg.type === 'info' && msg.content.includes('Protocol generation complete')) {
        setIsGeneratingProtocol(false);
        if (msg.action?.type === 'view-details' && msg.action.payload?.protocol) {
          setLocalProtocolDraft(msg.action.payload.protocol);
        }
      }
      if (msg.sourceAgent === 'ConceptAgent' && msg.type === 'info' && msg.content.includes('Concept summary generated')) {
        setIsGeneratingSummary(false);
      }
      if (msg.sourceAgent === 'Validation Agent' && (msg.type === 'warning' || msg.type === 'error')) { // Changed from Consistency Agent
        relevantMessages.push(msg.content);
      }
      if (msg.sourceAgent === 'Validation Agent' && msg.type === 'info' && msg.content.includes('appears consistent')) {
        relevantMessages.push(msg.content);
      }
    });
    setValidationMessages(relevantMessages);
  }, [agentMessages]);

  const handleSetObjective = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateObjective(e.target.value);
  };

  const createSelectHandler = (componentType: keyof ConceptDesignState['components'] | 'phenomena' | 'applications') => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    onUpdateComponentSelection(componentType as keyof ConceptDesignState['components'], selectedIds);
  };

  const availableMaterials = graphData.nodes.filter(n => n.type === 'Material' || n.type === 'Material_Category');
  const availableMechanisms = graphData.nodes.filter(n => n.type === 'Mechanism' || n.type === 'Mechanism_Category');
  const availableMethods = graphData.nodes.filter(n => n.type === 'Method' || n.type === 'Method_Category');
  const availablePhenomena = graphData.nodes.filter(n => n.type === 'Phenomenon' || n.type === 'Phenomenon_Category');
  const availableApplications = graphData.nodes.filter(n => n.type === 'Application' || n.type === 'Application_Category');
  const availableTheoretical = graphData.nodes.filter(n => n.type === 'TheoreticalConcept' || n.type === 'TheoreticalConcept_Category');


  const handleRequestComponentSuggestions = () => onTriggerAgent('suggest-compatible-components', { currentDesign: designState });
  const handleCheckConsistency = () => {
    setValidationMessages([]);
    onTriggerAgent('check-consistency', { designToValidate: designState });
  };
  const handleGenerateProtocolOutline = () => {
    if (designState.status !== 'Proposed' && designState.status !== 'Validated') {
        onTriggerAgent('add-message', { type: 'warning', sourceAgent: "Design Assistant", content: "Concept status must be 'Proposed' or 'Validated' before generating protocol."});
        return;
    }
    setIsGeneratingProtocol(true);
    onTriggerAgent('generate-protocol-outline', { conceptDesign: designState });
  };
  const handleGenerateConceptSummary = () => {
    setIsGeneratingSummary(true);
    onTriggerAgent('generate-concept-summary', { conceptDesign: designState });
  };
  const handlePackageArtifact = () => {
    if (designState.status !== 'Validated' || !designState.protocolOutline) {
        onTriggerAgent('add-message', { type: 'warning', sourceAgent: "Design Assistant", content: "Concept must be 'Validated' and have a protocol outline before packaging."});
        return;
    }
    onTriggerAgent('package-knowledge-artifact', { finalDesign: designState });
  };

  if (!designState || !designState.components || !designState.cssVectorDraft) {
    return ( <div className="flex items-center justify-center h-full"><Loader className="animate-spin h-10 w-10 text-blue-500" /><p className="ml-3">Loading Concept Designer...</p></div> );
  }

  return (
    <div className="flex-grow overflow-hidden flex h-full">
      <div className="flex-grow overflow-y-auto p-4 md:p-6 w-2/3 space-y-4 scrollbar-thin">
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center">
            <Lightbulb size={22} className="mr-2 text-yellow-400" /> Design New Knowledge Artifact
            </h2>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${designState.status === 'Hypothetical' ? 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-700/30 dark:text-yellow-200 dark:border-yellow-600' : designState.status === 'Proposed' ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-700/30 dark:text-blue-200 dark:border-blue-600' : designState.status === 'Validated' ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-700/30 dark:text-green-200 dark:border-green-600' : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700/30 dark:text-gray-200 dark:border-gray-600'}`}>
                Status: {designState.status || 'Empty'}
            </span>
        </div>

        <section>
          <label htmlFor="conceptObjective" className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-200">
            <Target size={16} className="inline mr-1.5 align-text-bottom"/>Concept Objective / Goal
          </label>
          <input id="conceptObjective" type="text" value={designState.objective || ''} onChange={handleSetObjective}
            className={`w-full p-2.5 rounded-md text-sm ${darkMode ? 'bg-slate-700 text-white placeholder-slate-400' : 'bg-slate-50 text-slate-900 placeholder-slate-500'} border ${darkMode ? 'border-slate-600 focus:border-blue-500' : 'border-slate-300 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500/50 outline-none transition-shadow`}
            placeholder="e.g., Energy-efficient physical reservoir computing"
          />
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold mb-1 text-slate-700 dark:text-slate-200 flex items-center">
            <Layers size={16} className="inline mr-1.5 align-text-bottom"/>Core Components (Select from CNM)
          </h3>
          <div>
            <label htmlFor="selectMechanisms" className="block text-xs font-medium mb-0.5 text-slate-500 dark:text-slate-400">Key Mechanisms</label>
            <select id="selectMechanisms" multiple value={designState.components.mechanisms || []} onChange={createSelectHandler('mechanisms')}
              className={`w-full p-2 rounded-md text-xs h-20 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'} border ${darkMode ? 'border-slate-600' : 'border-slate-300'} focus:ring-1 focus:ring-blue-500 outline-none`}>
              {availableMechanisms.map(node => <option key={node.id} value={node.id}>{node.label || node.id}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="selectMaterials" className="block text-xs font-medium mb-0.5 text-slate-500 dark:text-slate-400">Key Materials</label>
            <select id="selectMaterials" multiple value={designState.components.materials || []} onChange={createSelectHandler('materials')}
              className={`w-full p-2 rounded-md text-xs h-20 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'} border ${darkMode ? 'border-slate-600' : 'border-slate-300'} focus:ring-1 focus:ring-blue-500 outline-none`}>
              {availableMaterials.map(node => <option key={node.id} value={node.id}>{node.label || node.id}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="selectMethods" className="block text-xs font-medium mb-0.5 text-slate-500 dark:text-slate-400">Relevant Methods (for validation)</label>
            <select id="selectMethods" multiple value={designState.components.methods || []} onChange={createSelectHandler('methods')}
              className={`w-full p-2 rounded-md text-xs h-20 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'} border ${darkMode ? 'border-slate-600' : 'border-slate-300'} focus:ring-1 focus:ring-blue-500 outline-none`}>
              {availableMethods.map(node => <option key={node.id} value={node.id}>{node.label || node.id}</option>)}
            </select>
          </div>
           <div>
            <label htmlFor="selectPhenomena" className="block text-xs font-medium mb-0.5 text-slate-500 dark:text-slate-400">Target Phenomena / Behaviors</label>
            <select id="selectPhenomena" multiple value={designState.components.phenomena || []} onChange={createSelectHandler('phenomena')}
              className={`w-full p-2 rounded-md text-xs h-20 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'} border ${darkMode ? 'border-slate-600' : 'border-slate-300'} focus:ring-1 focus:ring-blue-500 outline-none`}>
              {availablePhenomena.map(node => <option key={node.id} value={node.id}>{node.label || node.id}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="selectApplications" className="block text-xs font-medium mb-0.5 text-slate-500 dark:text-slate-400">Target Applications</label>
            <select id="selectApplications" multiple value={designState.components.applications || []} onChange={createSelectHandler('applications')}
              className={`w-full p-2 rounded-md text-xs h-20 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'} border ${darkMode ? 'border-slate-600' : 'border-slate-300'} focus:ring-1 focus:ring-blue-500 outline-none`}>
              {availableApplications.map(node => <option key={node.id} value={node.id}>{node.label || node.id}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="selectTheoretical" className="block text-xs font-medium mb-0.5 text-slate-500 dark:text-slate-400">Underlying Theoretical Concepts</label>
            <select id="selectTheoretical" multiple value={designState.components.theoretical_concepts || []} onChange={createSelectHandler('theoretical_concepts')}
              className={`w-full p-2 rounded-md text-xs h-20 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-50 text-slate-900'} border ${darkMode ? 'border-slate-600' : 'border-slate-300'} focus:ring-1 focus:ring-blue-500 outline-none`}>
              {availableTheoretical.map(node => <option key={node.id} value={node.id}>{node.label || node.id}</option>)}
            </select>
          </div>
        </section>
      </div>

      <div className={`w-1/3 flex-shrink-0 overflow-y-auto p-3 md:p-4 border-l ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-gray-50'} space-y-4 scrollbar-thin`}>
          <h3 className="text-md font-semibold flex items-center text-slate-700 dark:text-slate-200">
              <Brain size={18} className="mr-1.5 text-blue-500 dark:text-blue-400"/> Agent Actions & Status
          </h3>
          <div className="space-y-1.5">
              <button onClick={handleRequestComponentSuggestions} className={`w-full py-1.5 px-2.5 rounded-md flex items-center justify-center space-x-1.5 text-xs font-medium ${darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-200 hover:bg-slate-300'} transition-colors`}>
                  <Sparkles size={14} /> <span>Suggest Components</span>
              </button>
              <button onClick={handleCheckConsistency} className={`w-full py-1.5 px-2.5 rounded-md flex items-center justify-center space-x-1.5 text-xs font-medium ${darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-slate-200 hover:bg-slate-300'} transition-colors`}>
                  <AlertTriangle size={14} /> <span>Check Consistency</span>
              </button>
          </div>

          {/* Corrected JSX for validation messages */}
          {validationMessages.length > 0 && (
            <div className={`p-2 rounded-md text-xs space-y-1 ${darkMode ? 'bg-slate-700/50 border border-slate-600' : 'bg-slate-100 border border-slate-200'}`}>
              <h4 className={`font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Consistency Check Results:</h4>
              {validationMessages.map((vMsg, idx) => (
                <p key={idx} className={`${vMsg.toLowerCase().includes("warning") || vMsg.toLowerCase().includes("conflict") ? "text-orange-500 dark:text-orange-400" : (darkMode? "text-slate-300" : "text-slate-600")}`}>- {vMsg}</p>
              ))}
            </div>
          )}
          
          <hr className={darkMode ? 'border-gray-600' : 'border-gray-300'} />

          <div>
              <h4 className="text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">Protocol Design</h4>
              {isGeneratingProtocol ? (
                <button className={`w-full py-1.5 px-2.5 rounded-md flex items-center justify-center space-x-1.5 font-medium text-xs ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} text-slate-500 cursor-not-allowed`} disabled>
                    <Loader size={14} className="animate-spin mr-1.5"/> Generating...
                </button>
              ) : (
                <button onClick={handleGenerateProtocolOutline}
                    disabled={designState.status !== 'Proposed' && designState.status !== 'Validated'}
                    className={`w-full py-1.5 px-2.5 rounded-md flex items-center justify-center space-x-1.5 text-xs font-medium ${
                        (designState.status === 'Proposed' || designState.status === 'Validated')
                        ? (darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white')
                        : (darkMode ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-slate-300 text-slate-500 cursor-not-allowed')
                    } transition-colors`}>
                    <FlaskConical size={14} /> <span>Gen. Protocol Outline</span>
                </button>
              )}
              {localProtocolDraft && (
                <div className={`mt-2 p-2 rounded-md ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} max-h-40 overflow-y-auto text-[11px]`}>
                    <h5 className={`text-xs font-semibold mb-0.5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Protocol Draft:</h5>
                    <pre className={`whitespace-pre-wrap font-mono ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{localProtocolDraft.substring(0, 300)}{localProtocolDraft.length > 300 ? '...' : ''}</pre>
                </div>
              )}
          </div>
          <hr className={darkMode ? 'border-gray-600' : 'border-gray-300'} />

          <div>
            <h4 className="text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">Artifact Generation</h4>
            {isGeneratingSummary ? (
                 <button className={`w-full py-1.5 px-2.5 rounded-md flex items-center justify-center space-x-1.5 font-medium text-xs ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} text-slate-500 cursor-not-allowed`} disabled>
                    <Loader size={14} className="animate-spin mr-1.5"/> Generating...
                 </button>
            ) : (
                <button onClick={handleGenerateConceptSummary}
                    disabled={!designState.objective && designState.components.materials.length === 0 && designState.components.mechanisms.length === 0}
                    className={`w-full py-1.5 px-2.5 rounded-md flex items-center justify-center space-x-1.5 text-xs font-medium mb-1.5 ${(!designState.objective && designState.components.materials.length === 0 && designState.components.mechanisms.length === 0) ? (darkMode ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-slate-300 text-slate-500 cursor-not-allowed') : (darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')} transition-colors`}>
                    <FileText size={14} /> <span>Gen. Concept Summary</span>
                </button>
            )}
            <button onClick={handlePackageArtifact}
                disabled={designState.status !== 'Validated' || !designState.protocolOutline}
                className={`w-full py-1.5 px-2.5 rounded-md flex items-center justify-center space-x-1.5 text-xs font-medium ${
                    (designState.status === 'Validated' && designState.protocolOutline)
                    ? (darkMode ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white')
                    : (darkMode ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-slate-300 text-slate-500 cursor-not-allowed')
                } transition-colors`}>
                <Layers size={14} /> <span>Package Artifact</span>
            </button>
          </div>
      </div>
    </div>
  );
};

export default ConceptDesigner;