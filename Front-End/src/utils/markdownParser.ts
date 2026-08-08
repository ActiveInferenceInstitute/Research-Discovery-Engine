// src/utils/markdownParser.ts
import { ParsedSection } from '../types';

export function slugify(text: string): string {
  if (!text) return `section-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  let slug = text.toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/&[\w#]+;/g, '')
    .replace(/[()[\]{}.,<>?@#$%^*!~`'+=|\\/:;"']/g, '')
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  slug = slug.replace(/^-+|-+$/g, '');
  if (slug === "md") return `section-md-${Date.now().toString(36).substring(2,5)}`;
  return slug || `section-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export function extractReferences(text: string): string[] {
    const references: string[] = [];
    // Improved regex to better match citation keys like [author_year_title]
    const regex = /(?<![`[![#<A-Za-z0-9\-_~])\[([a-zA-Z0-9_-]+(?:_\d{4}(?:[a-zA-Z0-9_-]*)?)?)\](?![(#\]])/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        if (match[1]) {
            references.push(match[1].trim());
        }
    }
    return Array.from(new Set(references));
}

function createDisplayTitleFromHeadingText(headingText: string): string {
    const cleaned = headingText.replace(/<[^>]*>/g, '').replace(/`/g, '').trim();
    if (cleaned.includes('-') && cleaned === cleaned.toLowerCase() && !cleaned.includes('  ') && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleaned)) {
        return cleaned.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return cleaned;
}

export interface ParserOutput {
  documentTitle?: string;
  preambleContent?: string;
  sections: ParsedSection[];
}

export function parseMarkdownToStructuredDocument(markdown: string, sourceFileKey?: string): ParserOutput {
  if (!markdown || typeof markdown !== 'string') {
     console.error(`[markdownParser] Error: Invalid markdown input for ${sourceFileKey || 'unknown file'}.`);
     return { documentTitle: sourceFileKey || "Error", preambleContent: "Error parsing content.", sections: [] };
   }

  const lines = markdown.split(/\r?\n/);
  let documentTitle: string | undefined = undefined;
  let preambleLines: string[] = [];
  const rootSections: ParsedSection[] = [];
  
  let currentSectionStack: Array<ParsedSection & { _internal_accumulatedPathForParent?: string }> = [];
  let currentSectionContentLines: string[] = [];
  
  let firstH1Found = false;
  let firstContentAfterH1Started = false;
  let firstRealHeadingFound = false; 
  let inCodeBlock = false;

  function finalizeCurrentSection() {
    if (currentSectionStack.length > 0) {
      const lastSection = currentSectionStack[currentSectionStack.length - 1];
      const content = currentSectionContentLines.join('\n').trim();
      lastSection.content = content;
      lastSection.references = extractReferences(content);
      currentSectionContentLines = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (firstRealHeadingFound && currentSectionStack.length > 0) currentSectionContentLines.push(line);
      else if (firstContentAfterH1Started && !firstRealHeadingFound) preambleLines.push(line);
      continue;
    }
    if (inCodeBlock) {
      if (firstRealHeadingFound && currentSectionStack.length > 0) currentSectionContentLines.push(line);
      else if (firstContentAfterH1Started && !firstRealHeadingFound) preambleLines.push(line);
      continue;
    }

    const h1Match = !firstH1Found && line.match(/^#\s+(.*)/);
    if (h1Match) {
      documentTitle = createDisplayTitleFromHeadingText(h1Match[1].trim());
      firstH1Found = true;
      firstContentAfterH1Started = true; 
      continue; 
    }

    const isIndexLine = line.toLowerCase().includes("index of");
    const headingMatch = line.match(/^(##+)\s+(.*)/); 

    if (firstContentAfterH1Started && !firstRealHeadingFound && !headingMatch && !isIndexLine) {
      preambleLines.push(line);
    }
    
    if (headingMatch || (firstContentAfterH1Started && !firstRealHeadingFound && isIndexLine && !headingMatch )) {
        if (!firstRealHeadingFound) {
             firstRealHeadingFound = true; 
        }
        finalizeCurrentSection();

        const level = headingMatch ? headingMatch[1].length : 2; 
        const rawHeadingText = headingMatch ? headingMatch[2].trim() : createDisplayTitleFromHeadingText(line.trim().replace(/^\*\s*/, ''));
        
        const sectionId = slugify(rawHeadingText);
        const displayTitle = createDisplayTitleFromHeadingText(rawHeadingText);

        if (!sectionId || !displayTitle) continue;

        while (currentSectionStack.length > 0 && currentSectionStack[currentSectionStack.length - 1].level >= level) {
            currentSectionStack.pop();
        }
        
        const parentAccumulatedPath = currentSectionStack.length > 0 ? currentSectionStack[currentSectionStack.length-1]._internal_accumulatedPathForParent : '';
        const newSection: ParsedSection & { _internal_accumulatedPathForParent?: string, parentPath?: string } = {
            title: displayTitle, content: '', level, id: sectionId, sourceFileKey,
            subsections: [], references: [], parentPath: parentAccumulatedPath,
            _internal_accumulatedPathForParent: parentAccumulatedPath ? `${parentAccumulatedPath}/${sectionId}` : sectionId,
        };
        
        if (currentSectionStack.length > 0) {
            currentSectionStack[currentSectionStack.length - 1].subsections.push(newSection);
        } else {
            rootSections.push(newSection);
        }
        currentSectionStack.push(newSection);

    } else if (firstRealHeadingFound && currentSectionStack.length > 0) {
        currentSectionContentLines.push(line);
    } else if (!firstH1Found && !firstRealHeadingFound) { 
      preambleLines.push(line);
    }
  }
  finalizeCurrentSection();
  
  if (!firstH1Found && preambleLines.length > 0) {
    documentTitle = sourceFileKey ? createDisplayTitleFromHeadingText(sourceFileKey) : "Document";
    if (rootSections.length === 0) {
        rootSections.push({
            title: documentTitle, content: preambleLines.join('\n').trim(),
            level: 1, id: slugify(documentTitle + "-content"),
            sourceFileKey, subsections: [],
            references: extractReferences(preambleLines.join('\n')), parentPath: ''
        });
        preambleLines = [];
    }
  }
  
  const cleanSections = (sections: any[]): ParsedSection[] => {
    return sections.map(s => {
        const { _internal_accumulatedPathForParent, ...rest } = s;
        if (rest.subsections) {
            rest.subsections = cleanSections(rest.subsections);
        }
        return rest;
    });
  };
  
  return {
    documentTitle: documentTitle || (sourceFileKey ? createDisplayTitleFromHeadingText(sourceFileKey) : "Untitled Document"),
    preambleContent: preambleLines.join('\n').trim(),
    sections: cleanSections(rootSections)
  };
}