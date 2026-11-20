import type { LLMRequest, LLMResult } from '../llm/types';
import type { GraphData } from '../types';

type GenerateAnalysis = (request: LLMRequest) => Promise<Pick<LLMResult, 'success' | 'content' | 'error'>>;

export function getUploadKind(file: File): 'pdf' | 'text' | undefined {
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) return 'pdf';
  if (file.type === 'text/plain' || /\.(txt|md)$/i.test(file.name)) return 'text';
}

export async function analyzeUploadedDocument(
  file: File,
  extractPDFText: (file: File) => Promise<string>,
  generateAnalysis: GenerateAnalysis,
): Promise<{ analysis: string; graph: GraphData }> {
  const kind = getUploadKind(file);
  if (!kind) throw new Error('Please upload a PDF, text (.txt), or Markdown (.md) file.');

  const text = kind === 'pdf' ? await extractPDFText(file) : await file.text();
  if (!text.trim()) throw new Error('No readable text was found in this file.');

  const response = await generateAnalysis({
    userPrompt: generatePaperPrompt(text, file.name),
    config: { temperature: 0.3, maxTokens: 2000 },
  });
  if (!response.success) throw new Error(response.error || 'Document analysis failed.');
  if (!response.content.trim()) throw new Error('Document analysis returned no content.');

  return { analysis: response.content, graph: buildUploadGraph(file.name, response.content) };
}

function buildUploadGraph(fileName: string, analysis: string): GraphData {
  const fileKey = fileName.replace(/\.[^/.]+$/, '');
  const paperId = `Paper_${fileKey}`;
  const graph: GraphData = {
    nodes: [{
      id: paperId,
      type: 'Documentation',
      group: 4,
      value: 5,
      label: fileName,
      description: analysis,
      references: [],
    }],
    links: [],
  };

  const sections = new Map(
    Array.from(analysis.matchAll(/## ([^\n]+)\n([\s\S]*?)(?=## |$)/g), ([, title, text]) => [
      title.trim(), text.trim(),
    ]),
  );
  for (const [heading, type, label, group, linkValue] of [
    ['Key Mechanisms', 'Mechanism', 'Mechanisms', 2, 2],
    ['Materials Used', 'Material', 'Materials', 1, 2],
    ['Applications', 'Application', 'Applications', 7, 1],
  ] as const) {
    const description = sections.get(heading);
    if (!description) continue;
    const id = `${type}_${fileKey}`;
    graph.nodes.push({
      id, type, group, value: 3, label: `${label} from ${fileName}`, description, references: [paperId],
    });
    graph.links.push({ source: paperId, target: id, type: 'cites-source', value: linkValue });
  }

  return graph;
}

// Generate paper analysis prompt
function generatePaperPrompt(text: string, fileName: string): string {
  // Load knowledge base context
  const knowledgeContext = `The entire knowledge graph is provided for your reference, including mechanisms.md, materials.md, methods.md, phenomena.md, applications.md, theoretical.md, vectors.md, css.md, and merged_ISM.md.`;

  // Create publication data
  const publicationData = {
    key: fileName.replace(/\.[^/.]+$/, ""),
    title: fileName,
    content: text.substring(0, 10000), // Limit text length
    year: new Date().getFullYear().toString(),
    authors: "Unknown",
    paper_type: "Research Paper"
  };

  // Create prompt based on paper_analysis.md template
  return `
# Paper Analysis Request

${knowledgeContext}

## Publication Data
- Key: ${publicationData.key}
- Title: ${publicationData.title}
- Year: ${publicationData.year}
- Authors: ${publicationData.authors}
- Paper Type: ${publicationData.paper_type}

## Content to Analyze
${publicationData.content}

## Analysis Instructions
Please analyze this paper and extract key information according to the following structure:

1. **Summary**: Provide a concise summary of the paper's main contributions
2. **Key Mechanisms**: Identify and explain the primary mechanisms discussed
3. **Materials Used**: List and describe the materials utilized
4. **Methods Employed**: Detail the methodologies and techniques
5. **Theoretical Foundations**: Explain the theoretical concepts underpinning the work
6. **Applications**: Describe potential or demonstrated applications
7. **Connections to Knowledge Graph**: Identify connections to existing knowledge graph nodes

Format your response as a well-structured markdown document with clear headings and sections.
`;
}
