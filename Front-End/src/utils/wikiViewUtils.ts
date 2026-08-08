// src/utils/wikiViewUtils.ts
// (If KnowledgeBrowserSidebar.tsx imports from './WikiView/wikiViewUtils.ts', then this file should be at src/components/WikiView/wikiViewUtils.ts)
// For this example, assuming KnowledgeBrowserSidebar uses `../utils/wikiViewUtils` so this file is here.

import { ParsedSection } from '../types';
import { ParserOutput } from './markdownParser'; // Assuming ParserOutput is exported from markdownParser

export const findSectionById_local = (sections: ParsedSection[] | null, idToFind: string): ParsedSection | undefined => {
  if (!sections) return undefined;
  for (const section of sections) {
    if (section.id === idToFind) return section;
    if (section.subsections && section.subsections.length > 0) {
      const found = findSectionById_local(section.subsections, idToFind);
      if (found) return found;
    }
  }
  return undefined;
};

export const flattenSections = (sections: ParsedSection[] | null): ParsedSection[] => {
  if (!sections) return [];
  let flattened: ParsedSection[] = [];
  sections.forEach(section => {
    flattened.push(section);
    if (section.subsections && section.subsections.length > 0) {
      flattened = flattened.concat(flattenSections(section.subsections));
    }
  });
  return flattened;
};

export const findSectionByIdAcrossWikis = (
    wikiData: { [key: string]: ParserOutput | null },
    id: string
): { tabKey: string, section: ParsedSection } | null => {
  for (const [tabKey, data] of Object.entries(wikiData)) {
    if (data && data.sections) {
        const section = findSectionById_local(data.sections, id);
        if (section) { return { tabKey, section }; }
    }
  }
  return null;
};

export const humanizeSlugForDisplay = (slugOrTitle: string): string => {
    if (!slugOrTitle || typeof slugOrTitle !== 'string') return String(slugOrTitle);
    if (slugOrTitle.includes('-') && slugOrTitle === slugOrTitle.toLowerCase() && !slugOrTitle.includes('  ') && !slugOrTitle.startsWith('#')) {
        return slugOrTitle.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return slugOrTitle;
};