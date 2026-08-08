/**
 * Main Application Component - Discovery Engine (Step-by-Step Workflow)
 * 
 * Redesigned to provide a cleaner, more intuitive workflow that guides users
 * through the discovery process step by step, hiding complexity until needed.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  AlertCircle, 
  Loader, 
  ArrowRight, 
  ArrowLeft,
  Brain, 
  FlaskConical, 
  Zap, 
  Activity, 
  Target, 
  HelpCircle, 
  BookOpen,
  Eye,
  Compass,
  Lightbulb,
  Settings,
  Menu,
  X as CloseIcon
} from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import GraphVisualization from './components/GraphVisualization/GraphVisualization';
import GraphControls from './components/GraphVisualization/GraphControls';
import ConceptDesigner from './components/ConceptDesigner/ConceptDesigner';
import AgentConsole from './components/AgentConsole/AgentConsole';
import PDFUploader from './components/Modals/PDFUploader';
import ContextPanel from './components/ContextPanel/ContextPanel';
import KnowledgeBrowserSidebar from './components/KnowledgeBrowserSidebar';
import BreadcrumbPanel from './components/BreadcrumbPanel';
import ErrorBoundary from './components/ErrorBoundary';
import LLMResultModal from './components/Modals/LLMResultModal';

// New step components
import FieldExplorationStep from './components/Steps/FieldExplorationStep';
import DiscoveryStep from './components/Steps/DiscoveryStep';
import InnovationStep from './components/Steps/InnovationStep';

// Hooks and utilities
import { useAppState } from './hooks/useAppState';
import { slugify } from './utils/markdownParser';

/**
 * Discovery workflow steps
 */
export type DiscoveryStepType = 'explore' | 'discover' | 'innovate' | 'classic';

export const DISCOVERY_STEPS = [
  { 
    key: 'explore' as DiscoveryStepType, 
    label: 'Explore', 
    icon: Eye,
    title: 'Field Exploration',
    description: 'Discover research communities and innovation archetypes'
  },
  { 
    key: 'discover' as DiscoveryStepType, 
    label: 'Discover', 
    icon: Compass,
    title: 'Knowledge Gap Discovery', 
    description: 'AI-powered identification of research opportunities'
  },
  { 
    key: 'innovate' as DiscoveryStepType, 
    label: 'Innovate', 
    icon: Lightbulb,
    title: 'Innovation Trajectory',
    description: 'Synthesize multi-step research pathways'
  }
];

/**
 * Configuration for the knowledge browser sidebar (for classic mode)
 */
export const WIKI_BROWSER_CONFIG = [
  { key: 'mechanisms', label: 'Mechanisms', icon: Brain, file: 'KG/mechanisms.md', indexSectionTitleSlug: "index-of-mechanisms"},
  { key: 'materials', label: 'Materials', icon: FlaskConical, file: 'KG/materials.md', indexSectionTitleSlug: "index-of-material-classes-specific-materials"},
  { key: 'methods', label: 'Methods', icon: Zap, file: 'KG/methods.md', indexSectionTitleSlug: "index-of-methods"},
  { key: 'phenomena', label: 'Phenomena', icon: Activity, file: 'KG/phenomena.md', indexSectionTitleSlug: "index-of-phenomena"},
  { key: 'applications', label: 'Applications', icon: Target, file: 'KG/applications.md', indexSectionTitleSlug: "index-of-applications"},
  { key: 'theoretical', label: 'Theory', icon: HelpCircle, file: 'KG/theoretical.md', indexSectionTitleSlug: "index-of-theoretical-concepts"},
  { key: 'css', label: 'Schema (CSS)', icon: BookOpen, file: 'KG/css.md', indexSectionTitleSlug: "conceptual-nexus-model-cnm-core-schema-specification-css"},
];

/**
 * Main App Component with improved step-by-step workflow
 */
function App() {
  return <div>HELLO NEW UI</div>;
}

export default App;