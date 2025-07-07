# Discovery Engine Frontend

## Overview
The frontend application for the Scientific Discovery Engine, featuring:
- **Step-by-step workflow**: Explore → Discover → Innovate  
- **Comprehensive terminology integration**: All terms from Discovery Engine research
- **Dual interface modes**: Guided workflow + classic knowledge graph view
- **Interactive definitions**: Click any term for detailed explanations

## Quick Start
\`\`\`bash
cd Front-End
npm install
npm run dev
\`\`\`

## Terminology Integration
This frontend incorporates **18 novel terms** and **9 borrowed concepts** from the Discovery Engine research framework:

### Novel Terms (Our Innovations)
- Conceptual Ecology
- Probabilistic Knowledge-Gap Engine  
- Causal Trajectory Synthesis
- CT-GIN Framework
- Active Inference Agents
- Conceptual Nexus Model (CNM)
- [... and more]

### Borrowed Terms (Established Concepts)
- Knowledge Graph
- Network Centrality
- Community Detection
- Co-occurrence Networks
- Graph Isomorphism Networks
- [... and more]

## Features
- **Interactive Term Definitions**: Click any terminology for detailed explanations
- **Contextual Integration**: Terms appear naturally within workflow steps
- **Related Concept Discovery**: Explore connections between terms
- **Search Integration**: Find concepts across communities and terminology
- **Evidence-Based Design**: UI reflects actual research findings

## Development
All terminology is centrally managed in `src/utils/terminology.ts` with data in `src/data/terminology.json`.