// src/utils/parseNodeData.ts
import { NodeObject } from '../types';
import { slugify, extractReferences } from './markdownParser';

export const preprocessMarkdownForDisplayUtil = (content: string, currentFileKey?: string, allNodes?: NodeObject[]): string => {
    if (typeof content !== 'string' || !content) return "";
    let processed = content;

    // Regex to find [[...]] optionally surrounded by backticks, capturing inner content
    // Group 1: Optional opening backtick(s)
    // Group 2: The core link part: [[TARGET_INFO]]
    // Group 3: The TARGET_INFO itself (e.g., ./file.md#Section or #Section or node-id)
    // Group 4: Optional display text (after |)
    // Group 5: Optional closing backtick(s)
    const wikiLinkRegex = /(`*)(\[\[((?:[^#|\]`]*?)(?:\.md)?(?:#[^|\]`]+?)?|[^|\]`]+?)(?:\|([^\]`]+))?\]\])(`*)/g;

    processed = processed.replace(wikiLinkRegex, (match, _openTicks, _fullLinkPattern, fullTargetPath, displayTextInput, _closeTicks) => {
        const targetPath = fullTargetPath.trim();
        let displayText = displayTextInput?.trim() || targetPath;
        
        // Humanize display text if it's the same as the target path
        if (displayText === targetPath.replace(/\.md$/, '').replace(/^#/, '')) {
            const targetPartForDisplay = targetPath.includes('#') ? targetPath.split('#').pop()! : targetPath;
            const humanized = targetPartForDisplay.replace(/\.md$/, '').replace(/-/g, ' ').replace(/`/g, ''); // Also remove backticks from display text part
            displayText = humanized.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            if (displayText.length === 0 && targetPath) displayText = targetPath.replace(/`/g, '');
        } else {
            displayText = displayText.replace(/`/g, ''); // Clean display text from any backticks
        }


        let href = `#BROKEN_LINK__${slugify(targetPath.replace(/`/g, ''))}`; // Slugify cleaned target

        // Clean targetPath from backticks before further processing
        const cleanedTargetPath = targetPath.replace(/`/g, '');

        if (cleanedTargetPath.includes('.md#')) {
            const parts = cleanedTargetPath.split('.md#');
            const fileKey = parts[0].replace(/^\.\//, '');
            const sectionSlug = slugify(parts[1]);
            href = `##WIKI_NAV__${fileKey}__${sectionSlug}`;
        } else if (cleanedTargetPath.startsWith('#')) {
            const sectionSlug = slugify(cleanedTargetPath.substring(1));
            href = `#INTRA_CONTENT__${sectionSlug}`; 
        } else if (cleanedTargetPath.includes('#')) { 
            const parts = cleanedTargetPath.split('#');
            const fileKey = parts[0];
            const sectionSlug = slugify(parts[1]);
            href = `##WIKI_NAV__${fileKey}__${sectionSlug}`;
        } else { 
            const nodeIdOrFileKey = cleanedTargetPath.replace(/\.md$/, '');
            const slugifiedAttempt = slugify(nodeIdOrFileKey);
            const targetNode = allNodes?.find(n => n.id === slugifiedAttempt || n.id === nodeIdOrFileKey || n.label === nodeIdOrFileKey);
            if (targetNode) {
                 href = `#NODE__${targetNode.id}`;
            } else {
                 href = `##WIKI_NAV__${nodeIdOrFileKey}__`; 
            }
        }
        return `[${displayText || "link"}](${href})`;
    });

    // Improved regex to better match citation keys like [author_year_title]
    const citationRegex = /(?<![`[![#<A-Za-z0-9\-_~])\[([a-zA-Z0-9_-]+(?:_\d{4}(?:[a-zA-Z0-9_-]*)?)?)\](?![(#\]])/g;
    processed = processed.replace(citationRegex, (match, key) => {
        // Create a proper citation link that will open the publication file
        return `[${key}](#CITATION__${key})`;
    });
    return processed;
};

export interface ParsedNodeDetails {
  title: string;
  humanReadableTitle?: string;
  idForDisplay?: string;
  description: string;
  mainDescription?: string;
  input: string;
  output: string;
  processPrimitives: string;
  roleConnections: string;
  theoreticalConceptsText: string;
  methodsUsedText: string;
  linksConnectionsContent: string;
  exampleCitations: Array<{ key: string; originalMatch: string }>;
  relatedToTextItems: string[]; // These are pre-processed markdown strings ready for <ReactMarkdown>
  attributes: Array<{ key: string; value: string }>;
}

export const parseNodeDetails = (node: NodeObject, allNodes: NodeObject[]): ParsedNodeDetails => {
  const details: ParsedNodeDetails = {
    title: node.label || node.id,
    humanReadableTitle: undefined,
    idForDisplay: node.id,
    description: '',
    mainDescription: '',
    input: '',
    output: '',
    processPrimitives: '',
    roleConnections: '',
    theoreticalConceptsText: '',
    methodsUsedText: '',
    linksConnectionsContent: '',
    exampleCitations: [],
    relatedToTextItems: [],
    attributes: [],
  };

  if (!node.description) {
    details.mainDescription = preprocessMarkdownForDisplayUtil(`*No detailed description available for ${node.label || node.id}.*`, node.sourceFileKey, allNodes);
    return details;
  }

  const lines = node.description.split('\n');
  let activeKeyTarget: keyof ParsedNodeDetails | 'generic_attribute' | null = null;
  let activeRawKeyName: string | null = null;
  let accumulatingContent: string[] = [];
  let generalProseAccumulator: string[] = [];
  let firstKeyEncountered = false;

  const KNOWN_KEYS_MAP: { [keyLowercase: string]: keyof ParsedNodeDetails } = {
    'human-readable title': 'humanReadableTitle',
    'description': 'description',
    'summary': 'description',
    'input': 'input', // Catches "Input:", "Input / Properties:"
    'key properties': 'input',
    'physics/primitives': 'processPrimitives',
    'process/primitives': 'processPrimitives',
    'local rules': 'processPrimitives', // Example for a more specific key
    'output': 'output', // Catches "Output:", "Output / Behaviors:"
    'output type': 'output',
    'role/connections': 'roleConnections',
    'connections': 'linksConnectionsContent', // General links
    'links': 'linksConnectionsContent',
    'theoretical concepts': 'theoreticalConceptsText',
    'related concepts': 'relatedToTextItems', // For lists under this key
    'related to': 'relatedToTextItems',
    'methods used': 'methodsUsedText',
    'associated methods': 'methodsUsedText',
    'example citations': 'exampleCitations',
    'references': 'exampleCitations',
  };

  const finalizePreviousBlock = () => {
    if (accumulatingContent.length > 0) {
      let contentBlock = accumulatingContent.join('\n').trim();
      if (activeKeyTarget === 'description') {
        contentBlock = contentBlock.replace(/^\s*(\*\*)?Description\s*:\s*(\*\*)?/i, '').trimStart();
      }
      // Keyed sections (input, output, etc.) get their content preprocessed for links.
      const preprocessedBlock = preprocessMarkdownForDisplayUtil(contentBlock, node.sourceFileKey, allNodes);

      if (activeKeyTarget) {
        if (activeKeyTarget === 'exampleCitations') {
            extractReferences(contentBlock).forEach(key => { // Extract from original block
                if (!details.exampleCitations.some(ec => ec.key === key)) {
                    details.exampleCitations.push({ key, originalMatch: `[${key}]` });
                }
            });
        } else if (activeKeyTarget === 'relatedToTextItems') {
            contentBlock.split(/\n\s*[\*-]\s*|,\s*(?![^\[]*\])/).map(item => item.trim()).filter(Boolean)
                .forEach(item => details.relatedToTextItems.push(preprocessMarkdownForDisplayUtil(item, node.sourceFileKey, allNodes)));
        } else if (activeKeyTarget !== 'humanReadableTitle' && activeKeyTarget !== 'generic_attribute') {
            (details as any)[activeKeyTarget] = ((details as any)[activeKeyTarget] ? (details as any)[activeKeyTarget] + '\n\n' : '') + preprocessedBlock;
        }
      } else if (activeRawKeyName) {
        details.attributes.push({ key: activeRawKeyName, value: preprocessedBlock });
      }
      accumulatingContent = [];
    }
    activeKeyTarget = null;
    activeRawKeyName = null;
  };

  for (const line of lines) {
    const keyValueMatch = line.match(/^\s*\*\s*\*\*(.*?):\*\*\s*(.*)/);
    if (keyValueMatch) {
      finalizePreviousBlock();
      firstKeyEncountered = true;
      activeRawKeyName = keyValueMatch[1].trim();
      let valueRaw = keyValueMatch[2].trim();
      const keyLower = activeRawKeyName.toLowerCase();

      if (keyLower.endsWith(" id") && !['gap_id', 'artifact_id', 'publication_id', 'parameter_id', 'metric_id', 'energy_type_id'].includes(keyLower) ) {
        activeKeyTarget = null; activeRawKeyName = null; continue;
      }

      activeKeyTarget = KNOWN_KEYS_MAP[keyLower] || null;
      if (activeKeyTarget === 'humanReadableTitle') {
          details.humanReadableTitle = valueRaw; activeKeyTarget = null; activeRawKeyName = null;
      } else if (activeKeyTarget) {
        if (valueRaw) accumulatingContent.push(valueRaw);
      } else {
        activeKeyTarget = 'generic_attribute';
        if (valueRaw) accumulatingContent.push(valueRaw);
      }
    } else {
        if (activeKeyTarget || activeRawKeyName) {
            accumulatingContent.push(line);
        } else if (!firstKeyEncountered && line.trim()) {
            generalProseAccumulator.push(line);
        } else if (firstKeyEncountered && line.trim()){
            if (!details.description && !currentKeyFieldTarget && !activeRawKeyName) { // If no current key, it's part of general description
                 generalProseAccumulator.push(line);
            } else { // Otherwise, it's continuation of the last active key
                 accumulatingContent.push(line);
            }
        }
    }
  }
  finalizePreviousBlock();

  if (generalProseAccumulator.length > 0) {
    const generalProse = preprocessMarkdownForDisplayUtil(generalProseAccumulator.join('\n').trim(), node.sourceFileKey, allNodes);
    if (!details.description.trim()) {
        details.description = generalProse;
    } else {
        details.description = generalProse + '\n\n' + details.description;
    }
  }
  
  // Ensure we always have a description
  if (!details.mainDescription || !details.mainDescription.trim()) {
    // Try to use the full node description if available
    if (node.description && node.description.trim()) {
      details.mainDescription = preprocessMarkdownForDisplayUtil(node.description, node.sourceFileKey, allNodes);
    } else {
      details.mainDescription = preprocessMarkdownForDisplayUtil(`*No primary description content found for ${node.label || node.id}.*`, node.sourceFileKey, allNodes);
    }
  }
  // Ensure mainDescription is set
  details.mainDescription = details.description;

  return details;
};