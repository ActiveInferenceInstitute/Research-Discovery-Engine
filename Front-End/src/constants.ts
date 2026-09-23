// src/constants.ts
import { Brain, FlaskConical, Zap, Activity, Target, HelpCircle, BookOpen, Layers } from 'lucide-react';

// This config is for the KnowledgeBrowserSidebar's top-level categories.
export const WIKI_BROWSER_CONFIG = [
    { key: 'mechanisms', label: 'Mechanisms', icon: Brain, file: 'KG/mechanisms.md', indexSectionTitleSlug: "index-of-mechanisms"},
    { key: 'materials', label: 'Materials', icon: FlaskConical, file: 'KG/materials.md', indexSectionTitleSlug: "index-of-material-classes-specific-materials"},
    { key: 'methods', label: 'Methods', icon: Zap, file: 'KG/methods.md', indexSectionTitleSlug: "index-of-methods"},
    { key: 'phenomena', label: 'Phenomena', icon: Activity, file: 'KG/phenomena.md', indexSectionTitleSlug: "index-of-phenomena"},
    { key: 'applications', label: 'Applications', icon: Target, file: 'KG/applications.md', indexSectionTitleSlug: "index-of-applications"},
    { key: 'theoretical', label: 'Theory', icon: HelpCircle, file: 'KG/theoretical.md', indexSectionTitleSlug: "index-of-theoretical-concepts"},
    // css.md and process.md sections become Documentation nodes if parsed by cnmBuilder,
    // but are not top-level browsable categories in the KnowledgeBrowserSidebar itself.
    // However, if you want a general "Documentation" tab to browse these, it can be added.
    // For now, focusing on the core knowledge categories.
    // If you want to browse schema docs:
    { key: 'css', label: 'CNM Schema', icon: BookOpen, file: 'KG/css.md', indexSectionTitleSlug: "conceptual-nexus-model-cnm-core-schema-specification-css"},
    // process.md is an instruction, not usually browsed as a knowledge category:
    // { key: 'process', label: 'Discovery Process Docs', icon: Layers, file: 'process.md', indexSectionTitleSlug: "discovery-engine-process-for-creating-new-knowledge-system-protocol"},
];