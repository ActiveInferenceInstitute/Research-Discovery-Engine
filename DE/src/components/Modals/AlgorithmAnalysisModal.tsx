import React from 'react';
import { GraphData } from '../../types';
import { AlgorithmAnalysis } from '../AlgorithmAnalysis/AlgorithmAnalysis';

interface AlgorithmAnalysisModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  graph: GraphData;
}

const AlgorithmAnalysisModal: React.FC<AlgorithmAnalysisModalProps> = ({
  darkMode,
  isOpen,
  onClose,
  graph
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl mx-4 h-[80vh] overflow-hidden">
        <div className={`h-full rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Algorithm Analysis
            </h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 h-[calc(100%-4rem)] overflow-y-auto">
            <AlgorithmAnalysis
              graph={graph}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmAnalysisModal; 