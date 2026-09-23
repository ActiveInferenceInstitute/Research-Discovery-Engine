/**
 * Discovery Step Component
 * 
 * Second step in the workflow - focuses on AI-powered knowledge gap identification
 * and opportunity discovery, presenting findings as visualizations inspired by the research paper.
 */

import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  Map, 
  Target, 
  Zap,
  TrendingUp,
  Brain,
  FlaskConical,
  Activity,
  Settings,
  Eye,
  Filter
} from 'lucide-react';
import { GraphData } from '../../types';

interface DiscoveryStepProps {
  onNext: () => void;
  onPrev: () => void;
  graphData: GraphData | null;
  selectedCommunities: string[];
  onSelectCommunity: (communities: string[]) => void;
}

// Knowledge gaps data based on the research paper
const KNOWLEDGE_GAPS = [
  {
    id: 'nanowires-neuromorphic',
    from: 'nanowires',
    to: 'neuromorphic-computing-hardware',
    score: 6.8,
    sharedMechanisms: 5,
    category: 'Material → Application',
    description: 'Network properties of nanowires could enable novel neuromorphic architectures',
    potential: 'high',
    evidence: [
      'Shared resistance-switching behavior',
      'Network topology compatibility', 
      'Memristive junction properties',
      'Scalable fabrication methods',
      'Adaptive connectivity patterns'
    ]
  },
  {
    id: 'memristors-neuromorphic', 
    from: 'memristors',
    to: 'neuromorphic-computing-hardware',
    score: 6.5,
    sharedMechanisms: 4,
    category: 'Material → Application',
    description: 'Advanced memristor integration for brain-inspired computing',
    potential: 'high',
    evidence: [
      'Synaptic plasticity emulation',
      'Non-volatile memory behavior',
      'Low power operation',
      'CMOS compatibility'
    ]
  },
  {
    id: 'active-matter-control',
    from: 'active-matter-fluids', 
    to: 'active-matter-research-control',
    score: 6.2,
    sharedMechanisms: 6,
    category: 'Material → Application',
    description: 'Control mechanisms for active matter systems and collective behaviors',
    potential: 'medium',
    evidence: [
      'Self-organization principles',
      'Emergent collective behavior',
      'Energy dissipation patterns',
      'Feedback control mechanisms',
      'Swarm intelligence applications',
      'Programmable assembly'
    ]
  },
  {
    id: 'silicon-porous-neuromorphic',
    from: 'silicon-si-and-porous-silicon-psi',
    to: 'neuromorphic-computing-hardware', 
    score: 5.9,
    sharedMechanisms: 3,
    category: 'Material → Application',
    description: 'Porous silicon networks for memory and computation',
    potential: 'medium',
    evidence: [
      'Charge trapping mechanisms',
      'Photonic modulation capability',
      'CMOS process compatibility'
    ]
  },
  {
    id: 'nematic-biosensing',
    from: 'nematic-lcs',
    to: 'biosensing',
    score: 5.6,
    sharedMechanisms: 4,
    category: 'Material → Application', 
    description: 'Liquid crystal sensors for biological detection',
    potential: 'medium',
    evidence: [
      'Molecular ordering sensitivity',
      'Optical response properties',
      'Biocompatible interfaces',
      'Real-time detection capability'
    ]
  }
];

// Simulated heatmap data for knowledge gap visualization
const CATEGORY_MATRIX = [
  'Theory', 'Mechanism', 'Phenomenon', 'Material', 'Method', 'Application'
];

const generateHeatmapData = () => {
  const data = [];
  for (let i = 0; i < CATEGORY_MATRIX.length; i++) {
    for (let j = 0; j < CATEGORY_MATRIX.length; j++) {
      // Higher values for Material->Application and Theory->Application connections
      // as identified in the research paper
      let intensity = Math.random() * 0.6;
      
      if ((CATEGORY_MATRIX[i] === 'Material' && CATEGORY_MATRIX[j] === 'Application') ||
          (CATEGORY_MATRIX[i] === 'Theory' && CATEGORY_MATRIX[j] === 'Application')) {
        intensity = 0.7 + Math.random() * 0.3; // Higher intensity for these connections
      }
      
      data.push({
        row: i,
        col: j,
        fromCategory: CATEGORY_MATRIX[i],
        toCategory: CATEGORY_MATRIX[j],
        intensity,
        isHighPotential: intensity > 0.7
      });
    }
  }
  return data;
};

const DiscoveryStep: React.FC<DiscoveryStepProps> = ({
  onNext,
  onPrev,
  graphData,
  selectedCommunities,
  onSelectCommunity
}) => {
  const [selectedGap, setSelectedGap] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'gaps'>('heatmap');
  const [filterPotential, setFilterPotential] = useState<'all' | 'high' | 'medium'>('all');

  // Generate heatmap data
  const heatmapData = useMemo(() => generateHeatmapData(), []);

  // Filter knowledge gaps based on selected filter
  const filteredGaps = useMemo(() => {
    if (filterPotential === 'all') return KNOWLEDGE_GAPS;
    return KNOWLEDGE_GAPS.filter(gap => gap.potential === filterPotential);
  }, [filterPotential]);

  const renderHeatmapCell = (cell: any, index: number) => {
    const cellSize = 60; // Size in pixels
    const color = cell.isHighPotential 
      ? `rgba(239, 68, 68, ${cell.intensity})` // Red for high potential
      : cell.intensity > 0.5 
        ? `rgba(245, 158, 11, ${cell.intensity})` // Orange for medium
        : `rgba(59, 130, 246, ${cell.intensity})`; // Blue for low

    return (
      <div
        key={index}
        className="relative group cursor-pointer transition-all duration-200 hover:scale-105"
        style={{
          width: cellSize,
          height: cellSize,
          backgroundColor: color,
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        title={`${cell.fromCategory} → ${cell.toCategory}: ${(cell.intensity * 10).toFixed(1)}/10`}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        
        {/* High potential indicator */}
        {cell.isHighPotential && (
          <div className="absolute top-1 right-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        )}
      </div>
    );
  };

  const renderKnowledgeGapCard = (gap: typeof KNOWLEDGE_GAPS[0]) => (
    <div 
      key={gap.id}
      className={`p-6 border rounded-xl cursor-pointer transition-all duration-200 ${
        selectedGap === gap.id 
          ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/25' 
          : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
      }`}
      onClick={() => setSelectedGap(selectedGap === gap.id ? null : gap.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-white font-semibold text-lg">
              {gap.from} → {gap.to}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              gap.potential === 'high' 
                ? 'bg-red-600 text-white' 
                : 'bg-orange-600 text-white'
            }`}>
              {gap.potential} potential
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
            <span className="bg-gray-700 px-2 py-1 rounded">Score: {gap.score}</span>
            <span>{gap.sharedMechanisms} shared mechanisms</span>
            <span className="text-blue-400">{gap.category}</span>
          </div>
          <p className="text-gray-300 text-sm">{gap.description}</p>
        </div>
        <Target className="w-6 h-6 text-red-400 flex-shrink-0" />
      </div>

      {selectedGap === gap.id && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-white font-medium mb-3">Supporting Evidence:</h4>
          <div className="space-y-2">
            {gap.evidence.map((evidence, i) => (
              <div 
                key={i}
                className="flex items-center space-x-2 text-sm text-gray-300"
              >
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                <span>{evidence}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-300">
              This connection is predicted based on network topology analysis and shared mechanistic neighbors. 
              The high score indicates strong potential for novel integration.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Knowledge Gap Discovery</h1>
        <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
          AI-powered analysis reveals high-potential connections between materials and applications
          that haven't been explored yet. These represent fertile ground for innovation.
        </p>
      </div>

      {/* View Toggle and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'heatmap' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Map className="w-4 h-4 inline mr-2" />
            Gap Atlas
          </button>
          <button
            onClick={() => setViewMode('gaps')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'gaps' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Top Gaps
          </button>
        </div>

        {viewMode === 'gaps' && (
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterPotential}
              onChange={(e) => setFilterPotential(e.target.value as any)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Potential</option>
              <option value="high">High Potential</option>
              <option value="medium">Medium Potential</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Content */}
      {viewMode === 'heatmap' ? (
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <Map className="w-6 h-6 mr-3 text-orange-400" />
            Knowledge Gap Atlas
          </h2>
          <p className="text-gray-400 mb-6">
            Heatmap showing the density of high-potential, undiscovered connections between concept categories.
            Darker cells indicate higher opportunity scores.
          </p>
          
          {/* Category Labels */}
          <div className="flex justify-center mb-4">
            <div className="grid grid-cols-7 gap-1">
              <div></div> {/* Empty corner */}
              {CATEGORY_MATRIX.map(category => (
                <div key={category} className="text-xs text-center text-gray-400 p-2 w-16">
                  {category}
                </div>
              ))}
              
              {/* Heatmap Grid */}
              {CATEGORY_MATRIX.map((rowCategory, rowIndex) => (
                <React.Fragment key={rowCategory}>
                  <div className="text-xs text-right text-gray-400 p-2 w-16 flex items-center justify-end">
                    {rowCategory}
                  </div>
                  {heatmapData
                    .filter(cell => cell.row === rowIndex)
                    .map((cell, cellIndex) => renderHeatmapCell(cell, cellIndex))
                  }
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-sm text-gray-400">Low Potential</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-400">Medium Potential</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-sm text-gray-400">High Potential</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h3 className="text-blue-400 font-medium mb-2">Key Insight</h3>
            <p className="text-gray-300 text-sm">
              The most fertile ground for innovation lies at the interface of <strong>Materials ↔ Applications</strong> and{' '}
              <strong>Theories ↔ Applications</strong>. These connections represent the translation of fundamental science 
              into practical technologies.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3 text-red-400" />
            Top Predicted Knowledge Gaps
          </h2>
          <p className="text-gray-400 mb-6">
            Ranked list of the most promising unexplored connections, scored by shared mechanisms 
            and network topology analysis.
          </p>
          
          <div className="space-y-4">
            {filteredGaps.map(renderKnowledgeGapCard)}
          </div>

          {filteredGaps.length === 0 && (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No gaps match the selected filter criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8">
        <button 
          onClick={onPrev}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exploration</span>
        </button>
        
        <button 
          onClick={onNext}
          disabled={!selectedGap}
          className={`px-8 py-4 rounded-xl flex items-center space-x-3 transition-colors text-lg font-medium shadow-lg ${
            selectedGap 
              ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Plan Research Path</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DiscoveryStep;