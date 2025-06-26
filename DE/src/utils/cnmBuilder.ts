// src/utils/cnmBuilder.ts
import { GraphData, NodeObject, LinkObject, ParsedSection, NodeType, EdgeType } from '../types';
// CORRECTED: Ensure extractReferences is imported alongside other exports from markdownParser
import { parseMarkdownToStructuredDocument, slugify as importedSlugify, ParserOutput, extractReferences } from './markdownParser';

const slugify = importedSlugify;

// Removed extractReferencesInternal as we will use the one from markdownParser

export async function buildCNMGraph(): Promise<GraphData> {
  console.log("[CNMBuilder] STARTING GRAPH BUILD (V13 - Using imported extractReferences).");
  const nodesMap = new Map<string, NodeObject>();
  const linksMap = new Map<string, LinkObject>();
  const allReferencedCitationKeys = new Set<string>();
  let errorOccurred = false;

  const fetchAndParse = async (filePath: string): Promise<{ fileKey: string, parsedDoc: ParserOutput | null }> => {
      try {
          const fetchPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
          const fileKey = filePath.split('/').pop()?.replace('.md', '') || 'unknown_file';
          const response = await fetch(fetchPath);
          if (!response.ok) {
              if (response.status === 404) { console.warn(`[CNMBuilder fetch] 404: ${fetchPath} for fileKey ${fileKey}`); return { fileKey, parsedDoc: null }; }
              throw new Error(`Fetch error ${response.status} for ${fetchPath}`);
          }
          const markdown = await response.text();
          if (!markdown?.trim()) { console.warn(`[CNMBuilder fetch] Empty content for ${fileKey}`); return { fileKey, parsedDoc: { sections: [] } }; }
          const parsedDocOutput = parseMarkdownToStructuredDocument(markdown, fileKey); // This itself calls extractReferences internally for sections
          return { fileKey, parsedDoc: parsedDocOutput };
      } catch (e) {
          console.error(`[CNMBuilder fetchAndParse] CRITICAL ERROR for ${filePath}:`, e); errorOccurred = true;
          return { fileKey: filePath.split('/').pop()?.replace('.md', '') || 'error_file', parsedDoc: null };
      }
  };

  const WIKI_SOURCES_FOR_NODES = [
      { name: 'mechanisms', file: 'KG/mechanisms.md', typePrefix: 'Mechanism', group: 2, isSchemaDef: false },
      { name: 'materials', file: 'KG/materials.md', typePrefix: 'Material', group: 1, isSchemaDef: false },
      { name: 'methods', file: 'KG/methods.md', typePrefix: 'Method', group: 6, isSchemaDef: false },
      { name: 'phenomena', file: 'KG/phenomena.md', typePrefix: 'Phenomenon', group: 3, isSchemaDef: false },
      { name: 'applications', file: 'KG/applications.md', typePrefix: 'Application', group: 7, isSchemaDef: false },
      { name: 'theoretical', file: 'KG/theoretical.md', typePrefix: 'TheoreticalConcept', group: 8, isSchemaDef: false },
      { name: 'css', file: 'KG/css.md', typePrefix: 'Documentation', group: 9, isSchemaDef: true },
  ];

  const loadedDocs = await Promise.all( WIKI_SOURCES_FOR_NODES.map(source => fetchAndParse(source.file)) );

  console.log("[CNMBuilder] Pass 1: Creating Nodes from ALL Parsed MD Sections...");

  const processParsedDocumentToNodes = (
    docOutput: ParserOutput | null,
    config: typeof WIKI_SOURCES_FOR_NODES[number]
  ) => {
    if (!docOutput) return;
    const { typePrefix, group, name: currentFileKey, isSchemaDef } = config;
    
    if (!isSchemaDef && docOutput.documentTitle && docOutput.preambleContent) {
        const docNodeId = slugify(currentFileKey); 
        if (!nodesMap.has(docNodeId)) {
            nodesMap.set(docNodeId, {
                id: docNodeId,
                type: `${typePrefix}_Overview` as NodeType,
                group,
                label: docOutput.documentTitle || currentFileKey,
                description: docOutput.preambleContent,
                sourceFileKey: currentFileKey,
                sourceWikiSectionId: docNodeId, 
                references: extractReferences(docOutput.preambleContent), // Use imported extractReferences
                origin: 'wiki_section', 
            });
            // Add preamble references to the global set as well
            (extractReferences(docOutput.preambleContent) || []).forEach(refKey => allReferencedCitationKeys.add(refKey));
        }
    }
    
    const processSectionsRecursively = (
        currentSections: ParsedSection[],
        conf: typeof WIKI_SOURCES_FOR_NODES[number]
    ) => {
        if (!currentSections) return;
        const { typePrefix: localTypePrefix, group: localGroup, name: localFileKey, isSchemaDef: localIsSchemaDef } = conf;

        currentSections.forEach(section => {
            const nodeId = section.id; 
            const displayLabel = section.title;
            let createThisNode = true;

            if (localIsSchemaDef) {
                if (localFileKey === 'css') {
                    if (section.level === 1 && section.id === 'conceptual-nexus-model-cnm-core-schema-specification-css') { /* Main CSS doc node */ }
                    else if (section.level === 3 && section.parentPath && 
                             (section.parentPath.endsWith('node-types') || section.parentPath.endsWith('edge-types') ||
                              section.parentPath.includes('index-of-node-types/node-types') || 
                              section.parentPath.includes('index-of-edge-types/edge-types') )) {
                        /* Node for schema definition */
                    } else if (section.title.toLowerCase().startsWith("index of")){ 
                        createThisNode = false;
                    }
                    else { createThisNode = false; }
                } else { createThisNode = false; } 
            } else { 
                if (section.level === 1 && (displayLabel.toLowerCase().startsWith("index of") || displayLabel.toLowerCase().includes("table of contents"))) {
                    createThisNode = false; 
                } else if (section.level === 0) { 
                    createThisNode = false;
                }
            }
            
            if (!createThisNode) {
                processSectionsRecursively(section.subsections, conf); 
                return;
            }

            if (!nodeId || !displayLabel) {
                processSectionsRecursively(section.subsections, conf);
                return;
            }

            let nodeType: NodeType = localTypePrefix as NodeType;
            if (localIsSchemaDef && localFileKey === 'css') {
                nodeType = 'Documentation'; 
            } else if (!localIsSchemaDef) {
                const primaryKgFiles = ['mechanisms', 'materials', 'methods', 'phenomena', 'applications', 'theoretical'];
                if (primaryKgFiles.includes(localFileKey) && section.level === 2 ){
                    nodeType = `${localTypePrefix}_Category` as NodeType;
                }
            }

            const description = section.content;
            // References are already extracted by parseMarkdownToStructuredDocument and are in section.references
            const referencesFromSection = section.references || [];
            referencesFromSection.forEach(refKey => allReferencedCitationKeys.add(refKey));

            if (!nodesMap.has(nodeId)) {
                nodesMap.set(nodeId, {
                    id: nodeId, type: nodeType, group: localGroup, label: displayLabel,
                    description: description || `*No detailed description available for ${displayLabel}.*`, 
                    sourceWikiSectionId: nodeId, 
                    sourceFileKey: localFileKey,
                    references: referencesFromSection, origin: 'wiki_section',
                });
            } else { 
                const existingNode = nodesMap.get(nodeId)!;
                if (existingNode.description && description && existingNode.description !== description && !existingNode.description.includes(description.substring(0, Math.min(20, description.length)))) {
                    // console.warn(`[CNMBuilder Pass1] Node ID ${nodeId} (from ${localFileKey}) content conflict/merge. Keeping first encountered title: "${existingNode.label}". New title was: "${displayLabel}"`);
                }
                existingNode.references = Array.from(new Set([...(existingNode.references || []), ...referencesFromSection]));
                 if (nodeType.includes("_Category") && !existingNode.type.includes("_Category")) {
                    existingNode.type = nodeType;
                } else if (nodeType === "Documentation" && existingNode.type !== "Documentation" && !existingNode.type.includes("_Category")) {
                    // Keep existing specific type
                } else if (!nodeType.includes("_Category") && existingNode.type !== nodeType && existingNode.type === "Documentation"){
                     existingNode.type = nodeType; 
                }
            }
            processSectionsRecursively(section.subsections, conf);
        });
    };
    
    if (docOutput && docOutput.sections) {
        processSectionsRecursively(docOutput.sections, config);
    }
  };
  
  loadedDocs.forEach(docResult => {
    const config = WIKI_SOURCES_FOR_NODES.find(c => c.name === docResult.fileKey);
    if (config && docResult.parsedDoc) {
      processParsedDocumentToNodes(docResult.parsedDoc, config);
    } else if (!docResult.parsedDoc) {
      // console.warn(`[CNMBuilder Pass1] No parsed document for ${docResult.fileKey}.md`);
    }
  });
  
  console.log(`[CNMBuilder] Pass 1 complete. Nodes created: ${nodesMap.size}`);
  
  console.log("[CNMBuilder Pass 2] Creating Links from Wiki Content...");
  nodesMap.forEach(sourceNode => {
    if (sourceNode.description) {
      const wikiLinkRegexG = /\[\[((?:[^#|\]]*?)(?:\.md)?(?:#[^|\]]+?)?|[^|\]]+?)(?:\|([^\]]+))?\]\]/g;
      let match;
      while ((match = wikiLinkRegexG.exec(sourceNode.description)) !== null) {
        const fullTargetPathRaw = match[1].trim(); 
        let targetNodeIdSlug: string | undefined;
  
        if (fullTargetPathRaw.includes('.md#')) { 
          targetNodeIdSlug = slugify(fullTargetPathRaw.split('.md#')[1]);
        } else if (fullTargetPathRaw.startsWith('#')) { 
          targetNodeIdSlug = slugify(fullTargetPathRaw.substring(1));
        } else if (fullTargetPathRaw.includes('#')) { 
            targetNodeIdSlug = slugify(fullTargetPathRaw.split('#')[1]);
        } else { 
          const potentialSlug = slugify(fullTargetPathRaw.replace(/\.md$/, ''));
          if (nodesMap.has(potentialSlug)) {
            targetNodeIdSlug = potentialSlug;
          } else {
            if (nodesMap.has(fullTargetPathRaw.replace(/\.md$/, ''))) {
                targetNodeIdSlug = fullTargetPathRaw.replace(/\.md$/, '');
            }
          }
        }
  
        if (targetNodeIdSlug && nodesMap.has(targetNodeIdSlug)) {
          if (sourceNode.id !== targetNodeIdSlug) {
            const linkKey = `${sourceNode.id}__related-to__${targetNodeIdSlug}`;
            if (!linksMap.has(linkKey)) {
              linksMap.set(linkKey, {
                source: sourceNode.id,
                target: targetNodeIdSlug,
                type: 'related-to', 
              });
            }
          }
        } else if (targetNodeIdSlug) {
          const sourceConfig = WIKI_SOURCES_FOR_NODES.find(ws => ws.name === sourceNode.sourceFileKey);
          const sourceIsSchema = sourceConfig?.isSchemaDef || false;
          let abstractConceptName = fullTargetPathRaw.includes('#') ? fullTargetPathRaw.split('#').pop()! : fullTargetPathRaw;
          abstractConceptName = abstractConceptName.replace(/\.md$/, '').trim();
          const targetIsAbstractType = /^[A-Z][a-zA-Z\s()/-]*Node$/.test(abstractConceptName) || /^[A-Z][a-zA-Z\s()/-]*Edge$/.test(abstractConceptName);
  
          if (!(sourceIsSchema && targetIsAbstractType)) {
            //  console.warn(`[CNMBuilder Pass2] WikiLink target slug '${targetNodeIdSlug}' (from link '[[${match[0]}]]' in '${sourceNode.id}') not found in nodesMap. Original target: "${fullTargetPathRaw}" AbstractName: "${abstractConceptName}" IsAbstract: ${targetIsAbstractType}`);
          }
        }
      }
    }
  });
  
  const finalNodes = Array.from(nodesMap.values());
  const finalLinksArray = Array.from(linksMap.values());
  
  console.log("[CNMBuilder FINAL] Node Count:", finalNodes.length, "Link Count:", finalLinksArray.length);
  if (errorOccurred) console.error("[CNMBuilder FINAL] Errors occurred during build process.");
  
  const typeSummary: Record<string, number> = {};
  finalNodes.forEach(n => { typeSummary[n.type] = (typeSummary[n.type] || 0) + 1; });
  console.log("[CNMBuilder FINAL] Node Type Summary:", typeSummary);
  
  return { nodes: finalNodes, links: finalLinksArray.filter(link => nodesMap.has(link.source as string) && nodesMap.has(link.target as string)) };
}