# Knowledge Graph Structure: Conceptual Nexus Model (CNM)

## Overview

The Discovery Engine's knowledge graph is implemented as a Conceptual Nexus Model (CNM), providing a structured representation of scientific knowledge about material cognition and embodied intelligence. The graph is built from markdown files that define nodes and their relationships, with a TypeScript implementation that processes these files into a graph structure.

## Core Data Structure

The graph is represented in TypeScript as:

```typescript
interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}

interface NodeObject {
  id: string;
  type: NodeType;
  origin?: 'wiki_section' | 'user_upload' | 'concept_design' | 'system_derived';
  status?: 'Hypothetical' | 'Proposed' | 'Validated' | 'Archived' | 'Identified';
  group?: number;
  value?: number;
  label?: string;
  description?: string;
  cssVector?: Partial<CSSVector>;
  sourceWikiSectionId?: string;
  sourceFileKey?: string;
  references?: string[];
  validationScore?: number;
  cognitionScore?: number;
  criticalityScore?: number;
  x?: number;
  y?: number;
  z?: number;
  fx?: number;
  fy?: number;
  fz?: number;
  color?: string;
}

interface LinkObject {
  source: string;
  target: string;
  type: EdgeType;
  value?: number;
  justification?: string;
}
```

## Node Types

The graph supports the following node types:

```typescript
type CoreNodeType =
  | 'Material' | 'Mechanism' | 'Method' | 'Phenomenon' | 'Application' | 'TheoreticalConcept'
  | 'KnowledgeGapNode' | 'KnowledgeArtifactNode' | 'SystemNode'
  | 'MetricNode' | 'ParameterNode' | 'EnergyTypeNode';

type CategoryNodeType =
  | 'Material_Category' | 'Mechanism_Category' | 'Method_Category'
  | 'Phenomenon_Category' | 'Application_Category' | 'TheoreticalConcept_Category';

type UserNodeType = 'Concept' | 'UserUploaded';

type NodeType = CoreNodeType | CategoryNodeType | UserNodeType | 'Documentation' | `${CoreNodeType}_Overview`;
```

## Edge Types

The graph supports the following edge types:

```typescript
type EdgeType =
  | 'categorizes' | 'cites-source' | 'concept-uses-component' | 'related-to' | 'interplay'
  | 'EnablesMechanismEdge' | 'ComposedOfMaterialEdge' | 'UtilizesMethodEdge' | 'ValidatedByEdge'
  | 'SuggestsKnowledgeGapEdge' | 'AddressesKnowledgeGapEdge' | 'ImplementsMechanismEdge'
  | 'RequiresEnergyEdge' | 'Defines' | 'PackagedInArtifactEdge';
```

## File Structure

The knowledge graph is implemented across multiple markdown files in the `DE/KG` directory:

1. `mechanisms.md`: Defines mechanism nodes and their relationships
2. `materials.md`: Defines material nodes and their relationships
3. `methods.md`: Defines method nodes and their relationships
4. `phenomena.md`: Defines phenomenon nodes and their relationships
5. `applications.md`: Defines application nodes and their relationships
6. `theoretical.md`: Defines theoretical concept nodes and their relationships
7. `css.md`: Contains core schema definitions and node type specifications
8. `vectors.md`: Defines vector representations of nodes
9. `AI-4.bib`: Contains publication references in BibTeX format

## Node Definition Format

Nodes are defined in markdown files using a structured format. For example, from `mechanisms.md`:

```markdown
### mechanical-transduction
*   **Mechanism ID:** `mechanical-transduction` (`[[./css.md#MechanismNode]](category=Sensing, energy_domain=Mechanical)`)
*   **Human-Readable Title:** Sensing Force and Shape
*   **Description:** Converts physical forces, pressures, strains, vibrations, or impacts into other signal forms...
*   **Physics/Primitives:** Piezoelectricity, piezoresistivity, triboelectricity...
*   **Enabling Materials:** `[[./materials.md#piezoresistive-composites]]`...
*   **Connections:** Triggers `[[#optical-response]]`, `[[#electrical-response]]`...
```

## Graph Building Process

The graph is built by the `buildCNMGraph` function in `src/utils/cnmBuilder.ts`, which:

1. Fetches and parses markdown files from the `KG` directory
2. Extracts nodes and their attributes from section headers and content
3. Processes cross-references to build edges between nodes
4. Constructs the final `GraphData` object with nodes and links

## Cross-References

The knowledge graph uses a markdown-based cross-reference system:

- Nodes are referenced using `[[./filename.md#node_id]]` syntax
- References can include attributes: `[[./css.md#MechanismNode]](category=Sensing)`
- Cross-references are processed to create edges in the graph

## Vector Representations

Nodes can have vector representations defined in `vectors.md`:

```typescript
interface CSSVector {
  // Vector representation of node properties
  // Used for similarity calculations and clustering
}
```

## Graph Visualization

The graph is visualized using a 3D force-directed graph implementation:

- Nodes are positioned in 3D space
- Physics simulation controls node placement
- Nodes can be colored and sized based on their properties
- Edges can be shown/hidden and styled based on type

## Graph Analysis

The graph supports various analysis algorithms:

1. Betweenness Centrality: Identifies important nodes in the network
2. Cluster Detection: Finds groups of related nodes
3. Gap Detection: Identifies potential research gaps
4. Vector Similarity: Calculates similarity between nodes

## Implementation Details

The graph is implemented in TypeScript with:

- React components for visualization
- Custom hooks for data management
- Utility functions for graph operations
- Type definitions for type safety
- Algorithm implementations for analysis

## Data Flow

1. Markdown files define the raw knowledge structure
2. `buildCNMGraph` processes files into `GraphData`
3. React components visualize and interact with the graph
4. Analysis algorithms process the graph data
5. Results are displayed in the UI

## References

All nodes can reference publications from `AI-4.bib` using BibTeX keys:

```markdown
*   **Example Citations:** `[yang_physical_2021]`, `[friston_free_2023]`
```

This ensures scientific validity and traceability of the knowledge graph.
