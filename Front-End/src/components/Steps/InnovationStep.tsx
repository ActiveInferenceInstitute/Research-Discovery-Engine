/**
 * Innovation Step Component
 * 
 * Third step in the workflow - focuses on research trajectory planning
 * and protocol generation based on the synthesized pathways from the research paper.
 */

import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  Route, 
  Lightbulb, 
  FileText,
  Brain,
  FlaskConical,
  Zap,
  Activity,
  Target,
  CheckCircle,
  Download,
  Share,
  Settings
} from 'lucide-react';
import { TerminologyService } from '../../utils/terminology';

interface InnovationStepProps {
  onPrev: () => void;
  selectedGap: string | null;
  onSelectGap: (gap: string | null) => void;
  conceptDesignState: any;
  updateConceptDesignState: (update: any) => void;
}

// Research trajectory data based on the paper's nanowires example
const RESEARCH_TRAJECTORY = [
  {
    step: 1,
    concept: 'nanowires',
    type: 'Material',
    description: 'Starting material with network properties',
    details: 'Self-assembled networks with emergent electrical properties from wire-wire junctions',
    methods: ['drop-casting deposition', 'network topology analysis', 'electrical characterization'],
    timeline: '2-3 months'
  },
  {
    step: 2,
    concept: 'network-theory',
    type: 'Theory', 
    description: 'Mathematical framework for understanding emergent behavior',
    details: 'Percolation theory and network dynamics to model collective junction behavior',
    methods: ['graph theory analysis', 'percolation modeling', 'computational simulation'],
    timeline: '1-2 months'
  },
  {
    step: 3,
    concept: 'photodetection-qe',
    type: 'Phenomenon',
    description: 'Novel input modality for sensing',
    details: 'Quantum efficiency modeling for photosensitive nanowire networks',
    methods: ['optical characterization', 'QE measurements', 'spectral response analysis'],
    timeline: '3-4 months'
  },
  {
    step: 4,
    concept: 'silicon-si-and-porous-silicon-psi',
    type: 'Material',
    description: 'Implementation substrate with memory effects',
    details: 'Porous silicon nanograin networks with charge trapping and light modulation',
    methods: ['porous silicon fabrication', 'charge trapping analysis', 'optical modulation testing'],
    timeline: '4-5 months'
  },
  {
    step: 5,
    concept: 'neuromorphic-computing-hardware',
    type: 'Application',
    description: 'Target application with optical control',
    details: 'Photo-modulated neuromorphic device with synaptic plasticity',
    methods: ['device fabrication', 'synaptic testing', 'optical programming'],
    timeline: '6-8 months'
  }
];

const RESEARCH_PROTOCOLS = [
  {
    id: 'material-characterization',
    title: 'Material Characterization Protocol',
    description: 'Comprehensive analysis of nanowire network properties',
    steps: [
      'Network deposition via drop-casting',
      'SEM imaging for topology analysis', 
      'Electrical impedance spectroscopy',
      'Current-voltage characteristic measurement',
      'Network connectivity mapping'
    ],
    duration: '4-6 weeks',
    equipment: ['SEM', 'impedance analyzer', 'probe station', 'optical microscope']
  },
  {
    id: 'optical-modulation',
    title: 'Optical Modulation Protocol',
    description: 'Testing light-induced changes in network behavior',
    steps: [
      'Baseline electrical measurements',
      'Controlled light exposure setup',
      'Wavelength-dependent response testing',
      'Temporal dynamics characterization',
      'Reversibility and stability testing'
    ],
    duration: '6-8 weeks',
    equipment: ['laser sources', 'optical setup', 'photodetectors', 'function generator']
  },
  {
    id: 'neuromorphic-validation',
    title: 'Neuromorphic Validation Protocol',
    description: 'Demonstration of brain-inspired computing capabilities',
    steps: [
      'Synaptic plasticity emulation',
      'Learning rule implementation',
      'Pattern recognition testing',
      'Memory retention analysis',
      'Performance benchmarking'
    ],
    duration: '8-10 weeks',
    equipment: ['custom electronics', 'data acquisition system', 'stimulus generators']
  }
];

const TYPE_COLORS = {
  Material: { bg: 'bg-blue-600', text: 'text-blue-300', light: 'bg-blue-900/30' },
  Theory: { bg: 'bg-purple-600', text: 'text-purple-300', light: 'bg-purple-900/30' },
  Phenomenon: { bg: 'bg-green-600', text: 'text-green-300', light: 'bg-green-900/30' },
  Application: { bg: 'bg-orange-600', text: 'text-orange-300', light: 'bg-orange-900/30' }
};

const InnovationStep: React.FC<InnovationStepProps> = ({
  onPrev,
  selectedGap,
  onSelectGap,
  conceptDesignState,
  updateConceptDesignState
}) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'trajectory' | 'protocols'>('trajectory');

  // Calculate total timeline
  const totalTimeline = useMemo(() => {
    const timelineMap: { [key: string]: number } = {
      '1-2 months': 1.5,
      '2-3 months': 2.5,
      '3-4 months': 3.5,
      '4-5 months': 4.5,
      '6-8 months': 7
    };
    
    const totalMonths = RESEARCH_TRAJECTORY.reduce((sum, step) => {
      return sum + (timelineMap[step.timeline] || 0);
    }, 0);
    
    return `${Math.floor(totalMonths)} months`;
  }, []);

  const renderTrajectoryStep = (step: typeof RESEARCH_TRAJECTORY[0], index: number) => {
    const colors = TYPE_COLORS[step.type as keyof typeof TYPE_COLORS];
    const isActive = activeStep === step.step;
    
    return (
      <div 
        key={step.step}
        className={`p-6 border rounded-xl cursor-pointer transition-all duration-200 ${
          isActive 
            ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/25' 
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
        }`}
        onClick={() => setActiveStep(isActive ? null : step.step)}
      >
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${colors.bg}`}>
            {step.step}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-white font-semibold text-lg">{step.concept}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${colors.light} ${colors.text}`}>
                {step.type}
              </span>
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                {step.timeline}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-2">{step.description}</p>
            
            {isActive && (
              <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Detailed Description</h4>
                  <p className="text-gray-300 text-sm">{step.details}</p>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Key Methods</h4>
                  <div className="flex flex-wrap gap-2">
                    {step.methods.map((method, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProtocolCard = (protocol: typeof RESEARCH_PROTOCOLS[0]) => {
    const isActive = activeProtocol === protocol.id;
    
    return (
      <div 
        key={protocol.id}
        className={`p-6 border rounded-xl cursor-pointer transition-all duration-200 ${
          isActive 
            ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/25' 
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
        }`}
        onClick={() => setActiveProtocol(isActive ? null : protocol.id)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg mb-2">{protocol.title}</h3>
            <p className="text-gray-300 text-sm mb-2">{protocol.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span className="bg-gray-700 px-2 py-1 rounded">Duration: {protocol.duration}</span>
              <span>{protocol.steps.length} steps</span>
            </div>
          </div>
          <FileText className="w-6 h-6 text-blue-400 flex-shrink-0" />
        </div>

        {isActive && (
          <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
            <div>
              <h4 className="text-white font-medium mb-3">Protocol Steps</h4>
              <div className="space-y-2">
                {protocol.steps.map((step, i) => (
                  <div key={i} className="flex items-center space-x-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                      {i + 1}
                    </div>
                    <span className="text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Required Equipment</h4>
              <div className="flex flex-wrap gap-2">
                {protocol.equipment.map((item, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Innovation Trajectory</h1>
        <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
          AI-synthesized multi-step research pathway from nanowires to photo-modulated neuromorphic hardware.
          This trajectory represents a plausible, mechanistically-grounded route to innovation.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">{RESEARCH_TRAJECTORY.length}</div>
          <div className="text-gray-300">Research Steps</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">{totalTimeline}</div>
          <div className="text-gray-300">Estimated Duration</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">{RESEARCH_PROTOCOLS.length}</div>
          <div className="text-gray-300">Validation Protocols</div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center">
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('trajectory')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'trajectory' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Route className="w-4 h-4 inline mr-2" />
            Research Trajectory
          </button>
          <button
            onClick={() => setViewMode('protocols')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'protocols' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Validation Protocols
          </button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'trajectory' ? (
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <Route className="w-6 h-6 mr-3 text-purple-400" />
            Synthesized Research Trajectory
          </h2>
          
          {/* Trajectory Visualization */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6 overflow-x-auto">
              {RESEARCH_TRAJECTORY.map((step, index) => (
                <React.Fragment key={step.step}>
                  <div className="flex flex-col items-center space-y-3 flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                      TYPE_COLORS[step.type as keyof typeof TYPE_COLORS].bg
                    }`}>
                      {step.step}
                    </div>
                    <div className="text-center max-w-24">
                      <div className="text-white font-medium text-sm mb-1">{step.concept}</div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        TYPE_COLORS[step.type as keyof typeof TYPE_COLORS].light
                      } ${TYPE_COLORS[step.type as keyof typeof TYPE_COLORS].text}`}>
                        {step.type}
                      </div>
                    </div>
                  </div>
                  {index < RESEARCH_TRAJECTORY.length - 1 && (
                    <ArrowRight className="w-8 h-8 text-gray-400 mx-4 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Detailed Steps */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Detailed Research Steps</h3>
            {RESEARCH_TRAJECTORY.map(renderTrajectoryStep)}
          </div>

          {/* Mechanistic Narrative */}
          <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h3 className="text-blue-400 font-semibold text-lg mb-3">Mechanistic Narrative</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                <strong>1. Network Foundation:</strong> Nanowires self-assemble into complex networks with emergent 
                electrical properties determined by wire-wire junctions and overall topology.
              </p>
              <p>
                <strong>2. Theoretical Grounding:</strong> Network theory provides mathematical tools to understand 
                collective behavior, including percolation, clustering, and dynamics on networks.
              </p>
              <p>
                <strong>3. Novel Input Mechanism:</strong> Photodetection introduces optical control, where photon 
                absorption modulates network conductance through charge carrier generation and transport.
              </p>
              <p>
                <strong>4. Material Implementation:</strong> Porous silicon combines the network concept with proven 
                semiconductor technology, enabling charge trapping and optical modulation.
              </p>
              <p>
                <strong>5. Application Realization:</strong> The final device integrates sensing and processing, 
                creating neuromorphic hardware with both electrical and optical programmability.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-green-400" />
            Validation Protocols
          </h2>
          <p className="text-gray-400 mb-6">
            Systematic experimental protocols to validate each stage of the research trajectory 
            and demonstrate the proposed capabilities.
          </p>
          
          <div className="space-y-4">
            {RESEARCH_PROTOCOLS.map(renderProtocolCard)}
          </div>

          {/* Protocol Generation Options */}
          <div className="mt-8 p-6 bg-green-900/20 border border-green-500/30 rounded-lg">
            <h3 className="text-green-400 font-semibold text-lg mb-3">Protocol Customization</h3>
            <p className="text-gray-300 text-sm mb-4">
              These protocols can be adapted based on available equipment, timeline constraints, 
              and specific research objectives.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Protocols</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Customize Timeline</span>
              </button>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors flex items-center space-x-2">
                <Share className="w-4 h-4" />
                <span>Share Trajectory</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-8">
        <button 
          onClick={onPrev}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovery</span>
        </button>
        
        <div className="flex space-x-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl flex items-center space-x-3 transition-colors text-lg font-medium shadow-lg hover:shadow-xl">
            <Lightbulb className="w-5 h-5" />
            <span>Generate Research Proposal</span>
          </button>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl flex items-center space-x-3 transition-colors text-lg font-medium shadow-lg hover:shadow-xl">
            <CheckCircle className="w-5 h-5" />
            <span>Begin Implementation</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-3">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <h3 className="text-green-400 font-semibold text-lg">Research Trajectory Complete</h3>
        </div>
        <p className="text-gray-300 text-sm mb-4">
          You have successfully navigated from field exploration through gap discovery to innovation planning. 
          The synthesized trajectory provides a concrete, mechanistically-grounded pathway from nanowires 
          to photo-modulated neuromorphic hardware.
        </p>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span className="flex items-center space-x-1">
            <Brain className="w-4 h-4" />
            <span>AI-Synthesized</span>
          </span>
          <span className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span>Evidence-Based</span>
          </span>
          <span className="flex items-center space-x-1">
            <Route className="w-4 h-4" />
            <span>Multi-Step Pathway</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default InnovationStep;