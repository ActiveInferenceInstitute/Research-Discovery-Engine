// src/components/GraphVisualization/GraphVisualization.tsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import ForceGraph3D, { NodeObject as FGNodeObject, LinkObject as FGLinkObject } from '3d-force-graph';
import SpriteText from 'three-spritetext';
import * as THREE from 'three';
import * as d3 from 'd3';
import { cloneDeep } from 'lodash';
import { GraphData, NodeObject, LinkObject as CNMLinkObject, ConceptDesignState, NodeType, EdgeType } from '../../types';
import { getNeighbors } from '../../utils/graphUtils';

interface GraphNode extends FGNodeObject, NodeObject {}
interface GraphLink extends FGLinkObject {
  source: string | GraphNode;
  target: string | GraphNode;
  type?: CNMLinkObject['type'];
}

const NODE_TYPE_COLORS: Record<NodeType | 'Default', string> = {
  'Mechanism': '#8A2BE2', 
  'Mechanism_Category': '#9370DB', 
  'Material': '#2E8B57', 
  'Material_Category': '#3CB371', 
  'Method': '#FF8C00', 
  'Method_Category': '#FFA07A', 
  'Phenomenon': '#DC143C', 
  'Phenomenon_Category': '#FF6347', 
  'Application': '#4682B4', 
  'Application_Category': '#B0C4DE', 
  'TheoreticalConcept': '#DB7093', 
  'TheoreticalConcept_Category': '#FFB6C1', 
  'KnowledgeGapNode': '#FFD700', 
  'KnowledgeArtifactNode': '#00CED1', 
  'SystemNode': '#20B2AA', 
  'MetricNode': '#7FFF00', 
  'ParameterNode': '#ADFF2F', 
  'EnergyTypeNode': '#FF4500', 
  'Concept': '#FF1493', 
  'UserUploaded': '#00FA9A', 
  'Documentation': '#D3D3D3', 
  'Default': '#A9A9A9', 
};
const LINK_TYPE_COLORS: Record<EdgeType | 'Default', string> = {
  'categorizes': '#A9A9A9',       
  'cites-source': '#6495ED',      
  'concept-uses-component': '#32CD32',     
  'related-to': '#90EE90',       
  'interplay': '#FFD700',  
  'EnablesMechanismEdge': '#48D1CC', 
  'ComposedOfMaterialEdge': '#F08080', 
  'UtilizesMethodEdge': '#DA70D6', 
  'ValidatedByEdge': '#87CEEB', 
  'SuggestsKnowledgeGapEdge': '#FFA500',       
  'AddressesKnowledgeGapEdge': '#3CB371', 
  'ImplementsMechanismEdge': '#BA55D3', 
  'RequiresEnergyEdge': '#FF69B4', 
  'Defines': '#AFEEEE', 
  'PackagedInArtifactEdge': '#E0FFFF',       
  'Default': '#708090',          
};
const WIKI_SOURCES_FOR_GV_GROUPING = [ 
    { typePrefix: 'Material', group: 1 }, { typePrefix: 'Mechanism', group: 2 },
    { typePrefix: 'Phenomenon', group: 3 }, { typePrefix: 'Documentation', group: 4 }, 
    { typePrefix: 'Concept', group: 5 }, { typePrefix: 'Method', group: 6 },
    { typePrefix: 'Application', group: 7 }, { typePrefix: 'TheoreticalConcept', group: 8 },
    { typePrefix: 'KnowledgeGapNode', group: 11 }, { typePrefix: 'KnowledgeArtifactNode', group: 12 },
    { typePrefix: 'SystemNode', group: 13 }
];

interface GraphVisualizationProps {
  data: GraphData;
  darkMode: boolean;
  searchQuery: string;
  onNodeSelect: (node: NodeObject | null, sectionSlug?: string) => void;
  showLabels: boolean;
  showLinks: boolean;
  enablePhysics: boolean;
  showParticles: boolean;
  selectedNodeId: string | null;
  conceptDesignState: ConceptDesignState;
  onFilterComplete?: (filteredNodeCount: number, filteredLinkCount: number) => void;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  data, darkMode, searchQuery, onNodeSelect,
  showLabels, showLinks, enablePhysics, showParticles,
  selectedNodeId, conceptDesignState,
  onFilterComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [graphError, setGraphError] = useState<string | null>(null);
  const [isGraphInitialized, setIsGraphInitialized] = useState(false);

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [neighborNodes, setNeighborNodes] = useState(new Set<string>());
  const [neighborLinks, setNeighborLinks] = useState(new Set<GraphLink>());

  const safeData = useMemo(() => {
    if (!data || !data.nodes || !data.links) return { nodes: [], links: [] };
    const validNodes = data.nodes.filter(node => node && typeof node.id === 'string' && node.id.trim() !== '');
    const nodeIds = new Set(validNodes.map(n => n.id));
    const validLinks = data.links.filter(link => {
        const sourceId = typeof link.source === 'object' ? (link.source as NodeObject).id : String(link.source);
        const targetId = typeof link.target === 'object' ? (link.target as NodeObject).id : String(link.target);
        return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });
    return { nodes: validNodes, links: validLinks };
  }, [data]);


  const combinedGraphData = useMemo(() => {
    if (safeData.nodes.length === 0 && conceptDesignState.status === 'empty') {
      return { nodes: [], links: [] } as { nodes: GraphNode[], links: GraphLink[] };
    }
    let currentNodes = cloneDeep(safeData.nodes) as GraphNode[];
    let currentLinks = cloneDeep(safeData.links) as GraphLink[];

    if (conceptDesignState.status !== 'empty' && conceptDesignState.id) {
      const conceptNodeId = conceptDesignState.id;
      const conceptNodeLabel = conceptDesignState.objective || conceptNodeId;
      const existingNodeIndex = currentNodes.findIndex(n => n.id === conceptNodeId);
      
      const groupConfig = WIKI_SOURCES_FOR_GV_GROUPING.find(ws => ws.typePrefix === 'Concept');
      const nodeGroup = groupConfig ? groupConfig.group : 10; 

      const conceptGraphNode: GraphNode = {
        id: conceptNodeId, type: 'Concept', label: conceptNodeLabel,
        description: conceptDesignState.objective || 'Concept in Progress...',
        origin: 'concept_design', status: conceptDesignState.status,
        group: nodeGroup,
        cssVector: conceptDesignState.cssVectorDraft,
      };
      if (existingNodeIndex === -1) currentNodes.push(conceptGraphNode);
      else currentNodes[existingNodeIndex] = { ...currentNodes[existingNodeIndex], ...conceptGraphNode };
      
      const conceptLinksRaw: CNMLinkObject[] = [];
      const componentFields = ['materials', 'mechanisms', 'methods', 'theoretical_concepts'] as const;
      componentFields.forEach(field => {
        if (conceptDesignState.components[field]) {
          conceptDesignState.components[field]!.forEach(componentId => {
            if (currentNodes.some(n => n.id === componentId)) {
              conceptLinksRaw.push({ source: conceptNodeId, target: componentId, type: 'concept-uses-component' });
            }
          });
        }
      });
      currentLinks = currentLinks.filter(l => !((typeof l.source === 'object' ? (l.source as GraphNode).id : String(l.source)) === conceptNodeId && l.type === 'concept-uses-component'));
      currentLinks.push(...conceptLinksRaw.map(l => ({ ...l } as GraphLink)));
    }
    return { nodes: currentNodes, links: currentLinks };
  }, [safeData, conceptDesignState]);


  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return combinedGraphData;
    if (!combinedGraphData.nodes.length) return { nodes: [], links: [] };

    const lowerQuery = searchQuery.toLowerCase().trim();
    const matchingNodeIds = new Set<string>();
    combinedGraphData.nodes.forEach(node => {
      if ((node.id && String(node.id).toLowerCase().includes(lowerQuery)) ||
          (node.label && node.label.toLowerCase().includes(lowerQuery)) ||
          (node.description && node.description.toLowerCase().includes(lowerQuery))) {
        matchingNodeIds.add(String(node.id));
      }
    });

    let allRelevantNodeIds = new Set(matchingNodeIds);
    if (combinedGraphData.nodes.length > 0) {
        matchingNodeIds.forEach(id => {
            const { nodes: directNeighbors } = getNeighbors(combinedGraphData, id, 1);
            directNeighbors.forEach(n => allRelevantNodeIds.add(String(n.id)));
        });
    }
    const nodes = combinedGraphData.nodes.filter(node => allRelevantNodeIds.has(String(node.id)));
    const nodeIdsPresent = new Set(nodes.map(n => String(n.id)));
    const links = combinedGraphData.links.filter(link => {
      const sourceId = typeof link.source === 'object' ? String((link.source as GraphNode).id) : String(link.source);
      const targetId = typeof link.target === 'object' ? String((link.target as GraphNode).id) : String(link.target);
      return nodeIdsPresent.has(sourceId) && nodeIdsPresent.has(targetId);
    });
    return { nodes, links };
  }, [combinedGraphData, searchQuery]);

  // THIS useEffect is critical for avoiding the setState-in-render warning in App.tsx
  useEffect(() => {
    if (onFilterComplete && filteredData) {
        onFilterComplete(filteredData.nodes.length, filteredData.links.length);
    }
  }, [filteredData, onFilterComplete]); // Call ONLY when filteredData or onFilterComplete changes


  // Initialize the 3D force graph
  useEffect(() => { 
    if (!containerRef.current || graphRef.current) return;
    
    try {
      console.log("[GraphVisualization] Initializing 3D force graph...");
      const graph = ForceGraph3D()
        .width(containerRef.current.clientWidth)
        .height(containerRef.current.clientHeight)
        .enableNodeDrag(true)
        .showNavInfo(false)
        .onNodeClick((node: FGNodeObject | null) => {
            if (!node) {
                onNodeSelect(null);
                setNeighborNodes(new Set());
                setNeighborLinks(new Set());
                return;
            }
            const appNode = node as GraphNode;
            const distance = 150;
            const nodePos = { x: appNode.x || 0, y: appNode.y || 0, z: appNode.z || 0 };
            const cameraLookAt = {x: nodePos.x, y: nodePos.y, z: nodePos.z};
            const cameraPosition = {
                x: nodePos.x + distance * (Math.random() * 0.6 + 0.4) * (Math.random() > 0.5 ? 1: -1),
                y: nodePos.y + distance * (Math.random() * 0.2 + 0.1),
                z: nodePos.z + distance * (Math.random() * 0.6 + 0.4) * (Math.random() > 0.5 ? 1: -1)
            };
            graphRef.current.cameraPosition(cameraPosition, cameraLookAt, 1000);
            onNodeSelect(appNode);
        })
        .onNodeHover((node: FGNodeObject | null) => {
            const appNode = node as GraphNode | null;
            setHoveredNodeId(appNode ? String(appNode.id) : null);

            if (appNode && combinedGraphData.nodes.length > 0) {
                const { nodes: neighbors, links: connectingLinks } = getNeighbors(combinedGraphData, String(appNode.id), 1);
                setNeighborNodes(new Set(Array.from(neighbors).map(n => String(n.id))));
                setNeighborLinks(new Set(Array.from(connectingLinks) as GraphLink[]));
            } else {
                setNeighborNodes(new Set());
                setNeighborLinks(new Set());
            }
            if (containerRef.current) {
                 containerRef.current.style.cursor = node ? 'pointer' : 'default';
            }
        })
        .onBackgroundClick(() => {
            onNodeSelect(null);
            setHoveredNodeId(null);
            setNeighborNodes(new Set());
            setNeighborLinks(new Set());
        });

      graphRef.current = graph;
      graphRef.current(containerRef.current);
      setIsGraphInitialized(true);
      setGraphError(null);
      
      const handleResize = () => { 
        if (containerRef.current && graphRef.current) { 
          graphRef.current.width(containerRef.current.clientWidth).height(containerRef.current.clientHeight); 
        }
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (graphRef.current) {
          graphRef.current._destructor();
          graphRef.current = null;
        }
      };
    } catch (error) {
      console.error("[GraphVisualization] Error initializing 3D Force Graph:", error);
      setGraphError(error instanceof Error ? error.message : "Failed to initialize graph visualization");
      setIsGraphInitialized(false);
    }
  }, [containerRef.current]); // Re-run when container is ready


  // Update graph data and styling
  useEffect(() => { 
    if (!graphRef.current || !isGraphInitialized || !filteredData.nodes) {
      console.log("[GraphVisualization] Skipping graph update - not ready:", {
        hasGraph: !!graphRef.current,
        isInitialized: isGraphInitialized,
        hasNodes: !!filteredData.nodes
      });
      return;
    }

    try {
      console.log("[GraphVisualization] Updating graph data...");
      graphRef.current.graphData(filteredData);

      graphRef.current
          .backgroundColor(darkMode ? '#1A202C' : '#F7FAFC')
          .nodeVal((node: GraphNode) => {
              let baseSize = node.type?.includes('_Category') ? 6 : 10;
              if (node.type === 'Concept' || node.origin === 'concept_design') baseSize = 14;
              if (node.status === 'Hypothetical' || node.status === 'Proposed') baseSize *= 1.1;
              if (String(node.id) === selectedNodeId) return baseSize * 1.5;
              if (hoveredNodeId === String(node.id)) return baseSize * 1.3;
              if (neighborNodes.has(String(node.id))) return baseSize * 1.1;
              return baseSize;
           })
          .nodeThreeObject((objNode: FGNodeObject) => {
              const node = objNode as GraphNode;
              const isSelected = selectedNodeId === String(node.id);
              const isHovered = hoveredNodeId === String(node.id);
              const isDirectNeighbor = neighborNodes.has(String(node.id)) && (hoveredNodeId !== null || selectedNodeId !== null);
              const isContextActive = hoveredNodeId !== null || selectedNodeId !== null;
              const isDimmed = isContextActive && !isSelected && !isHovered && !isDirectNeighbor;
              const baseColorHex = node.color || NODE_TYPE_COLORS[node.type || 'Default'] || NODE_TYPE_COLORS['Default'];
              let finalColor = new THREE.Color(baseColorHex);

              if (showLabels || isSelected || isHovered) {
                  const sprite = new SpriteText(node.label || String(node.id));
                  sprite.color = isSelected || isHovered ? (darkMode ? '#000000' : '#FFFFFF') : (darkMode ? '#E2E8F0' : '#2D3748');
                  sprite.textHeight = isSelected ? 7 : isHovered ? 6 : 4;
                  let bgColorHex = baseColorHex;
                  if (isSelected) bgColorHex = '#F6E05E'; 
                  else if (isHovered) bgColorHex = '#ED64A6'; 
                  sprite.backgroundColor = new THREE.Color(bgColorHex).getStyle();
                  sprite.padding = isSelected ? 1.5 : isHovered ? 1 : 0.5; 
                  sprite.borderRadius = 2;
                  sprite.material.opacity = isDimmed ? 0.3 : 1.0;
                  sprite.material.depthWrite = false; 
                  sprite.material.transparent = true;
                  return sprite;
              } else {
                  const geometrySize = Math.max(0.5, (graphRef.current.nodeVal()(node) as number) * 0.45); 
                  let geometry: THREE.BufferGeometry = new THREE.SphereGeometry(geometrySize, 16, 8); 
                  const sphereMaterial = new THREE.MeshLambertMaterial({
                      color: finalColor, transparent: true,
                      opacity: isDimmed ? 0.1 : (isDirectNeighbor ? 0.9 : 0.75)
                  });
                  return new THREE.Mesh(geometry, sphereMaterial);
              }
          })
          .nodeThreeObjectExtend(true)
          .linkVisibility(showLinks)
          .linkWidth((link: GraphLink) => (neighborLinks.has(link) ? 2 : 0.7))
          .linkColor((link: GraphLink) => { 
              const defaultColor = darkMode ? '#4A5568' : '#A0AEC0'; 
              const typeColor = LINK_TYPE_COLORS[link.type || 'Default'] || defaultColor;
              return neighborLinks.has(link) ? (darkMode ? '#FACC15' : '#D97706') : typeColor; 
          })
          .linkMaterial((link: GraphLink) => {
              const isHighlighted = neighborLinks.has(link);
              const isDimmed = (hoveredNodeId !== null || selectedNodeId !== null) && !isHighlighted;
              const color = isHighlighted ? (darkMode ? '#FACC15' : '#D97706') : (LINK_TYPE_COLORS[link.type || 'Default'] || (darkMode ? '#4A5568' : '#A0AEC0'));
              return new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: isDimmed ? 0.08 : (isHighlighted ? 0.9 : 0.45) });
          })
          .linkDirectionalParticles(showParticles ? (link: GraphLink) => neighborLinks.has(link) ? 3 : 0 : 0)
          .linkDirectionalParticleWidth(1.5)
          .linkDirectionalParticleColor((_link: GraphLink) => (darkMode ? '#FFFFFF':'#000000'));

      if (enablePhysics) {
          graphRef.current.resumeAnimation();
          if (d3 && graphRef.current.d3Force) { 
              graphRef.current.d3Force('link', d3.forceLink().id((d:any) => d.id).distance((link: any) => link.type === 'categorizes' ? 80 : 150).strength(0.02));
              graphRef.current.d3Force('charge', d3.forceManyBody().strength(-120).distanceMax(350));
              graphRef.current.d3Force('center', d3.forceCenter(0,0,0).strength(0.003));
          }
          graphRef.current.d3AlphaDecay(0.0228); 
          graphRef.current.cooldownTime(10000); 
      } else {
          graphRef.current.pauseAnimation();
          filteredData.nodes.forEach((node: GraphNode) => {
              if(node.x !== undefined && node.fx === undefined) { node.fx = node.x; node.fy = node.y; node.fz = node.z; }
          });
      }

      if (selectedNodeId) {
          const node = filteredData.nodes.find(n => String(n.id) === selectedNodeId);
          if (node) {
              const currentLookAt = graphRef.current.cameraPosition().lookAt;
              if (!currentLookAt || Math.abs(currentLookAt.x - (node.x||0)) > 1 || Math.abs(currentLookAt.y - (node.y||0)) > 1) {
                  const distance = 150;
                  const nodePos = { x: node.x || 0, y: node.y || 0, z: node.z || 0 };
                  const cameraLookAt = {x: nodePos.x, y: nodePos.y, z: nodePos.z};
                  const cameraPosition = {
                      x: nodePos.x + distance * (Math.random() * 0.6 + 0.4) * (Math.random() > 0.5 ? 1: -1),
                      y: nodePos.y + distance * (Math.random() * 0.2 + 0.1),
                      z: nodePos.z + distance * (Math.random() * 0.6 + 0.4) * (Math.random() > 0.5 ? 1: -1)
                  };
                  graphRef.current.cameraPosition(cameraPosition, cameraLookAt, 700);
              }
          }
      } else if (!hoveredNodeId && graphRef.current.cameraPosition().lookAt && (graphRef.current.cameraPosition().lookAt.x !==0 || graphRef.current.cameraPosition().lookAt.y !==0 || graphRef.current.cameraPosition().lookAt.z !==0 )) { 
        // Optional: Reset camera to a default overview if nothing is selected or hovered
        // graphRef.current.cameraPosition({ x: 0, y: 0, z: 300 }, {x:0,y:0,z:0}, 700); 
      }
    } catch (error) {
      console.error("[GraphVisualization] Error updating graph:", error);
      setGraphError(error instanceof Error ? error.message : "Failed to update graph visualization");
    }
  }, [filteredData, darkMode, showLabels, showLinks, enablePhysics, showParticles, selectedNodeId, hoveredNodeId, neighborNodes, neighborLinks, isGraphInitialized]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {graphError && (
        <div className={`absolute inset-0 flex items-center justify-center ${darkMode ? 'bg-slate-900/90 text-red-300' : 'bg-slate-50/90 text-red-700'}`}>
          <div className="text-center p-4">
            <div className="text-xl font-semibold mb-2">Graph Visualization Error</div>
            <div>{graphError}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphVisualization;