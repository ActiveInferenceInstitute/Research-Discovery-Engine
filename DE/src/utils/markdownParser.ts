/**
 * @fileoverview Markdown Parsing Utilities
 * 
 * This module provides utilities for parsing markdown content into structured data
 * for the knowledge graph system. It handles hierarchical parsing, reference extraction,
 * and section organization for wiki-style content.
 */

import { ParsedSection } from '../types';

/**
 * Parses markdown content into a hierarchical section structure
 * 
 * @param markdownContent - Raw markdown content to parse
 * @param sourceFileKey - Optional identifier for the source file
 * @returns Array of top-level parsed sections with nested subsections
 * 
 * @description This function parses markdown content by:
 * 1. Splitting content by heading markers (# ## ### etc.)
 * 2. Building hierarchical relationships between sections
 * 3. Extracting references and cross-links
 * 4. Generating unique section IDs for navigation
 * 
 * @example
 * ```typescript
 * const markdown = `
 * # Main Topic
 * Introduction content here.
 * 
 * ## Subtopic A
 * Details about subtopic A.
 * 
 * ### Details
 * More specific information.
 * 
 * ## Subtopic B
 * Details about subtopic B.
 * `;
 * 
 * const sections = parseMarkdownToSections(markdown, 'research-notes');
 * console.log(sections.length); // 1 (main section)
 * console.log(sections[0].subsections.length); // 2 (subtopics A & B)
 * ```
 */
export function parseMarkdownToSections(
  markdownContent: string,
  sourceFileKey?: string
): ParsedSection[] {
  if (!markdownContent || typeof markdownContent !== 'string') {
    console.warn('parseMarkdownToSections: Invalid markdown content provided');
    return [];
  }

  const lines = markdownContent.split('\n');
  const sections: ParsedSection[] = [];
  
  /**
   * Stack to track current section hierarchy
   * Used to properly nest subsections under their parent sections
   */
  const sectionStack: Array<{ section: ParsedSection; level: number }> = [];
  
  let currentContent: string[] = [];
  let currentTitle = '';
  let currentLevel = 0;
  let sectionIdCounter = 0;

  /**
   * Creates a new section object with proper metadata
   * 
   * @param title - Section title
   * @param content - Section content
   * @param level - Heading level (1-6)
   * @param parentPath - Hierarchical path to parent section
   * @returns Properly formatted ParsedSection object
   */
  const createSection = (
    title: string,
    content: string,
    level: number,
    parentPath?: string
  ): ParsedSection => {
    const sectionId = `section_${++sectionIdCounter}_${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}`;

    const references = extractReferences(content);
    
    return {
      id: sectionId,
      title: title.trim(),
      content: content.trim(),
      level,
      sourceFileKey,
      subsections: [],
      references,
      parentPath: parentPath ? `${parentPath} > ${title}` : title
    };
  };

  /**
   * Finalizes the current section being processed
   * Adds it to the appropriate parent or root level
   */
  const finalizeCurrentSection = () => {
    if (currentTitle && currentContent.length > 0) {
      const content = currentContent.join('\n').trim();
      const parentPath = sectionStack.length > 0 
        ? sectionStack[sectionStack.length - 1].section.parentPath 
        : undefined;
      
      const section = createSection(currentTitle, content, currentLevel, parentPath);
      
      // Find the appropriate parent for this section
      while (sectionStack.length > 0 && sectionStack[sectionStack.length - 1].level >= currentLevel) {
        sectionStack.pop();
      }
      
      if (sectionStack.length > 0) {
        // Add as subsection to the current parent
        sectionStack[sectionStack.length - 1].section.subsections.push(section);
      } else {
        // Add as top-level section
        sections.push(section);
      }
      
      // Add this section to the stack for potential subsections
      sectionStack.push({ section, level: currentLevel });
    }
    
    // Reset for next section
    currentContent = [];
  };

  // Process each line of the markdown
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      // Found a new heading - finalize previous section
      finalizeCurrentSection();
      
      // Start new section
      currentLevel = headingMatch[1].length;
      currentTitle = headingMatch[2];
    } else {
      // Add content line to current section
      currentContent.push(line);
    }
  }
  
  // Finalize the last section
  finalizeCurrentSection();
  
  return sections;
}

/**
 * Extracts references and citations from markdown content
 * 
 * @param content - Markdown content to analyze
 * @returns Array of reference strings found in the content
 * 
 * @description Identifies various types of references including:
 * - Wiki-style links: [[Node Name]]
 * - Citation patterns: @reference-key
 * - Explicit node references: {node:node-id}
 * - URL references for external sources
 * 
 * @example
 * ```typescript
 * const content = `
 * This section discusses [[Graphene]] and [[Carbon Nanotubes]].
 * See also @smith2023 for more details.
 * The mechanism {node:neural-networks} is relevant here.
 * `;
 * 
 * const refs = extractReferences(content);
 * // Returns: ['Graphene', 'Carbon Nanotubes', 'smith2023', 'neural-networks']
 * ```
 */
export function extractReferences(content: string): string[] {
  if (!content || typeof content !== 'string') {
    return [];
  }

  const references: Set<string> = new Set();
  
  // Extract wiki-style links: [[Node Name]]
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
  let match;
  while ((match = wikiLinkRegex.exec(content)) !== null) {
    const linkText = match[1].trim();
    if (linkText) {
      // Convert display text to node ID format
      const nodeId = linkText.toLowerCase().replace(/\s+/g, '-');
      references.add(nodeId);
    }
  }
  
  // Extract citation patterns: @reference-key
  const citationRegex = /@([a-zA-Z0-9_-]+)/g;
  while ((match = citationRegex.exec(content)) !== null) {
    references.add(match[1]);
  }
  
  // Extract explicit node references: {node:node-id}
  const nodeRefRegex = /\{node:([^}]+)\}/g;
  while ((match = nodeRefRegex.exec(content)) !== null) {
    references.add(match[1]);
  }
  
  // Extract URL references (for external sources)
  const urlRegex = /https?:\/\/[^\s)]+/g;
  while ((match = urlRegex.exec(content)) !== null) {
    // Store URLs as-is for external reference tracking
    references.add(match[0]);
  }
  
  return Array.from(references);
}

/**
 * Converts a section title to a URL-safe slug
 * 
 * @param title - Section title to convert
 * @returns URL-safe slug string
 * 
 * @description Creates consistent, URL-safe identifiers from section titles
 * by normalizing case, removing special characters, and replacing spaces
 * with hyphens.
 * 
 * @example
 * ```typescript
 * slugify('Neural Networks & AI'); // 'neural-networks-ai'
 * slugify('Section 1.2: Overview'); // 'section-1-2-overview'
 * slugify('Materials (Carbon-based)'); // 'materials-carbon-based'
 * ```
 */
export function slugify(title: string): string {
  if (!title || typeof title !== 'string') {
    return 'untitled';
  }

  return title
    .toLowerCase()
    .trim()
    // Replace special characters and spaces with hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    || 'untitled'; // Fallback if result is empty
}

/**
 * Splits long markdown content into smaller, manageable sections
 * 
 * @param content - Long markdown content to split
 * @param maxLength - Maximum character length per section (default: 5000)
 * @returns Array of content chunks with preserved markdown structure
 * 
 * @description Intelligently splits markdown content while:
 * - Preserving heading hierarchies
 * - Avoiding splits in the middle of code blocks
 * - Maintaining paragraph integrity
 * - Keeping related content together
 * 
 * @example
 * ```typescript
 * const longContent = '# Title\n'.repeat(100) + 'Content...';
 * const chunks = splitMarkdownContent(longContent, 1000);
 * console.log(chunks.length); // Multiple manageable chunks
 * ```
 */
export function splitMarkdownContent(content: string, maxLength: number = 5000): string[] {
  if (!content || content.length <= maxLength) {
    return content ? [content] : [];
  }

  const chunks: string[] = [];
  const lines = content.split('\n');
  let currentChunk: string[] = [];
  let currentLength = 0;
  let inCodeBlock = false;

  for (const line of lines) {
    const lineLength = line.length + 1; // +1 for newline
    
    // Track code block boundaries to avoid splitting
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    }
    
    // Check if adding this line would exceed the limit
    if (currentLength + lineLength > maxLength && !inCodeBlock && currentChunk.length > 0) {
      // Try to find a good break point (empty line or heading)
      const isBreakPoint = line.trim() === '' || line.match(/^#{1,6}\s/);
      
      if (isBreakPoint) {
        // Good place to split
        chunks.push(currentChunk.join('\n'));
        currentChunk = [];
        currentLength = 0;
      }
    }
    
    currentChunk.push(line);
    currentLength += lineLength;
  }
  
  // Add the final chunk if it has content
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n'));
  }
  
  return chunks;
}

/**
 * Normalizes markdown formatting for consistent processing
 * 
 * @param content - Raw markdown content
 * @returns Normalized markdown content
 * 
 * @description Applies consistent formatting rules:
 * - Standardizes heading syntax
 * - Normalizes line endings
 * - Removes excessive whitespace
 * - Fixes common markdown syntax issues
 * 
 * @example
 * ```typescript
 * const messy = '##Heading\n\n\n   Content   \n\n#  Another Heading';
 * const clean = normalizeMarkdown(messy);
 * // Result: '## Heading\n\nContent\n\n# Another Heading'
 * ```
 */
export function normalizeMarkdown(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  return content
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Fix heading spacing
    .replace(/^(#{1,6})([^\s#])/gm, '$1 $2')
    // Remove excessive blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Trim trailing whitespace from lines
    .replace(/[ \t]+$/gm, '')
    // Ensure single trailing newline
    .replace(/\n*$/, '\n')
    // Trim leading whitespace
    .replace(/^\s+/, '');
}

// Export aliases for compatibility with existing imports
export const parseMarkdownToStructuredDocument = parseMarkdownToSections;

// Export type aliases
export interface ParserOutput {
  sections: ParsedSection[];
  metadata?: {
    sourceFile?: string;
    lastModified?: string;
    totalSections?: number;
  };
}

// Create a wrapper function that returns the expected ParserOutput format
export function parseMarkdownToStructuredDocumentWithOutput(
  markdownContent: string,
  sourceFileKey?: string
): ParserOutput {
  const sections = parseMarkdownToSections(markdownContent, sourceFileKey);
  return {
    sections,
    metadata: {
      sourceFile: sourceFileKey,
      lastModified: new Date().toISOString(),
      totalSections: sections.length
    }
  };
}