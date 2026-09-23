// Modal to upload a file and trigger backend processing.

import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader, BookOpen } from 'lucide-react';
import { GraphData } from '../../types';
import { createLLMService } from '../../llm/utils/factory';
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface PDFUploaderProps {
  darkMode: boolean;
  onClose: () => void;
  onFileProcessed: (parsedData: GraphData) => void; // Callback when backend returns data
  onTriggerAgent: (action: string, payload?: any) => void; // To communicate with AgentConsole
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ darkMode, onClose, onFileProcessed, onTriggerAgent }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [extractedText, setExtractedText] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const llmService = createLLMService();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Basic validation
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.md')) {
        setFile(selectedFile);
        setStatus('idle');
        setStatusMessage('');
      } else {
        setStatus('error');
        setStatusMessage('Please upload a PDF, text (.txt), or Markdown (.md) file.');
      }
    }
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
       if (droppedFile.type === 'application/pdf' || droppedFile.type === 'text/plain' || droppedFile.name.endsWith('.md')) {
        setFile(droppedFile);
        setStatus('idle');
        setStatusMessage('');
      } else {
        setStatus('error');
        setStatusMessage('Please upload a PDF, text (.txt), or Markdown (.md) file.');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Extract text from PDF
  const extractPDFText = async (pdfFile: File): Promise<string> => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      return `Failed to extract text from ${pdfFile.name}: ${error}`;
    }
  };

  // Generate paper analysis prompt
  const generatePaperPrompt = (text: string, fileName: string): string => {
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
  };

  // Process PDF with LLM
  const processPDFWithLLM = async (text: string, fileName: string): Promise<string> => {
    try {
      const prompt = generatePaperPrompt(text, fileName);
      
      // Send to LLM
      const response = await llmService.generateText({
        userPrompt: prompt,
        config: {
          temperature: 0.3,
          maxTokens: 2000
        }
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Unknown error in LLM processing');
      }
      
      return response.content;
    } catch (error) {
      console.error('Error in LLM processing:', error);
      return `Failed to analyze PDF: ${error}`;
    }
  };

  // Parse markdown output into sections
  const parseMarkdownOutput = (markdown: string): Record<string, string> => {
    const sections: Record<string, string> = {};
    const sectionRegex = /## ([^\n]+)\n([\s\S]*?)(?=## |$)/g;
    
    let match;
    while ((match = sectionRegex.exec(markdown)) !== null) {
      const sectionName = match[1].trim();
      const sectionContent = match[2].trim();
      sections[sectionName] = sectionContent;
    }
    
    return sections;
  };

  const handleSubmit = async () => {
    if (!file) return;

    setStatus('uploading');
    setStatusMessage(`Uploading "${file.name}"...`);

    // --- Simulate backend processing ---
    onTriggerAgent('add-message', {
      id: `upload_start_${Date.now()}`,
      sourceAgent: 'Nexus Weaver',
      type: 'info',
      content: `Received file "${file.name}". Initiating processing pipeline...`,
      timestamp: Date.now(),
    });

    // Simulate file upload delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setStatus('processing');
    setStatusMessage('Processing file and extracting concepts...');

    onTriggerAgent('add-message', {
      id: `process_start_${Date.now()}`,
      sourceAgent: 'Nexus Weaver',
      type: 'info',
      content: `Processing "${file.name}". This may take some time...`,
      timestamp: Date.now(),
    });

    // Extract text from PDF if it's a PDF file
    let fileContent = '';
    if (file.type === 'application/pdf') {
      setStatusMessage('Extracting text from PDF...');
      fileContent = await extractPDFText(file);
      setExtractedText(fileContent);
      
      setStatusMessage('Analyzing content with LLM...');
      const analysisResult = await processPDFWithLLM(fileContent, file.name);
      
      // Parse the analysis into sections
      const parsedSections = parseMarkdownOutput(analysisResult);
      
      // Create nodes from the analysis
      const mockParsedData: GraphData = {
        nodes: [
          { 
            id: `Paper_${file.name.replace(/\.[^/.]+$/, "")}`, 
            type: 'Documentation', 
            group: 4, 
            value: 5, 
            label: file.name,
            description: analysisResult, 
            references: [] 
          }
        ],
        links: []
      };
      
      // Add nodes for each section if they contain meaningful content
      if (parsedSections['Key Mechanisms']) {
        mockParsedData.nodes.push({
          id: `Mechanism_${file.name.replace(/\.[^/.]+$/, "")}`,
          type: 'Mechanism',
          group: 2,
          value: 3,
          label: `Mechanisms from ${file.name}`,
          description: parsedSections['Key Mechanisms'],
          references: [`Paper_${file.name.replace(/\.[^/.]+$/, "")}`]
        });
        
        mockParsedData.links.push({
          source: `Paper_${file.name.replace(/\.[^/.]+$/, "")}`,
          target: `Mechanism_${file.name.replace(/\.[^/.]+$/, "")}`,
          type: 'cites-source',
          value: 2
        });
      }
      
      if (parsedSections['Materials Used']) {
        mockParsedData.nodes.push({
          id: `Material_${file.name.replace(/\.[^/.]+$/, "")}`,
          type: 'Material',
          group: 1,
          value: 3,
          label: `Materials from ${file.name}`,
          description: parsedSections['Materials Used'],
          references: [`Paper_${file.name.replace(/\.[^/.]+$/, "")}`]
        });
        
        mockParsedData.links.push({
          source: `Paper_${file.name.replace(/\.[^/.]+$/, "")}`,
          target: `Material_${file.name.replace(/\.[^/.]+$/, "")}`,
          type: 'cites-source',
          value: 2
        });
      }
      
      if (parsedSections['Applications']) {
        mockParsedData.nodes.push({
          id: `Application_${file.name.replace(/\.[^/.]+$/, "")}`,
          type: 'Application',
          group: 7,
          value: 3,
          label: `Applications from ${file.name}`,
          description: parsedSections['Applications'],
          references: [`Paper_${file.name.replace(/\.[^/.]+$/, "")}`]
        });
        
        mockParsedData.links.push({
          source: `Paper_${file.name.replace(/\.[^/.]+$/, "")}`,
          target: `Application_${file.name.replace(/\.[^/.]+$/, "")}`,
          type: 'cites-source',
          value: 1
        });
      }
      
      setStatus('success');
      setStatusMessage('File processed successfully! Extracted data is ready for integration.');
      
      onTriggerAgent('add-message', {
        id: `process_success_${Date.now()}`,
        sourceAgent: 'Nexus Weaver',
        type: 'info',
        content: `Successfully processed "${file.name}". Found ${mockParsedData.nodes.length} nodes and ${mockParsedData.links.length} links. Ready to add to graph.`,
        timestamp: Date.now(),
        action: { 
          type: 'view-llm-result', 
          payload: {
            title: `Analysis: ${file.name}`,
            content: analysisResult
          }
        }
      });
      
      onFileProcessed(mockParsedData);
      return;
    }
    
    // Handle text or markdown files
    if (file.type === 'text/plain' || file.name.endsWith('.md')) {
      setStatusMessage('Reading text content...');
      fileContent = await file.text();
      setExtractedText(fileContent);
      
      setStatusMessage('Analyzing content with LLM...');
      const analysisResult = await processPDFWithLLM(fileContent, file.name);
      
      // Create nodes from the analysis (similar to PDF processing)
      // ... (similar code as above)
    }

    // Fallback to simulated processing for other file types
    onTriggerAgent('add-message', {
        id: `upload_start_${Date.now()}`,
        sourceAgent: 'Nexus Weaver',
        type: 'info',
        content: `Received file "${file.name}". Initiating processing pipeline...`,
        timestamp: Date.now(),
    });

    // Simulate file upload delay
    await new Promise(resolve => setTimeout(resolve, 500));
     setStatus('processing');
    setStatusMessage('Processing file and extracting concepts...');

     onTriggerAgent('add-message', {
        id: `process_start_${Date.now()}`,
        sourceAgent: 'Nexus Weaver',
        type: 'info',
        content: `Processing "${file.name}". This may take some time...`,
        timestamp: Date.now(),
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000)); // Longer delay for processing

    // Simulate parsing result (mock data for now)
    // In a real app, this data comes from the backend
    const mockParsedData: GraphData = {
      nodes: [
        { id: 'Extracted Concept A', type: 'Concept', group: 6, value: 5, description: 'Simulated concept from upload', references: ['simulated_ref_2024'] },
        { id: 'Extracted Material B', type: 'Material', group: 1, value: 3, description: 'Simulated material from upload', references: ['simulated_ref_2024'] },
        { id: 'Extracted Mechanism C', type: 'Mechanism', group: 2, value: 4, description: 'Simulated mechanism from upload', references: ['simulated_ref_2024'] },
         { id: 'simulated_ref_2024', type: 'Paper', group: 4, description: 'Simulated reference paper', references: []} // Add reference node
      ],
      links: [
        { source: 'Extracted Concept A', target: 'Extracted Material B', type: 'uses-material', value: 2 },
        { source: 'Extracted Concept A', target: 'Extracted Mechanism C', type: 'uses-mechanism', value: 1 },
         { source: 'Extracted Concept A', target: 'simulated_ref_2024', type: 'cites-paper', value: 1 }, // Link concept to paper
         { source: 'Extracted Material B', target: 'simulated_ref_2024', type: 'cites-paper', value: 1 }, // Link material to paper
         { source: 'Extracted Mechanism C', target: 'simulated_ref_2024', type: 'cites-paper', value: 1 }, // Link mechanism to paper
      ]
    };

     setStatus('success');
    setStatusMessage('File processed successfully! Extracted data is ready for integration.');

     onTriggerAgent('add-message', {
        id: `process_success_${Date.now()}`,
        sourceAgent: 'Nexus Weaver',
        type: 'info',
        content: `Successfully processed "${file.name}". Found ${mockParsedData.nodes.length} nodes and ${mockParsedData.links.length} links. Ready to add to graph.`,
        timestamp: Date.now(),
        action: { 
          type: 'integrate-data', 
          payload: mockParsedData 
        }
    });

    onFileProcessed(mockParsedData); // Pass data back to App

  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}>
      <div className={`w-full max-w-md p-6 rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload File for Analysis</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={20} />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${darkMode ? 'border-gray-600' : 'border-gray-300'} ${file ? 'bg-opacity-50' : ''} ${
              status === 'processing' || status === 'uploading' ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-100/50') : ''
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.txt,.md" // Accept common text/markdown/pdf
            className="hidden"
          />

          {!file ? (
            <div>
              <FileText className="mx-auto h-12 w-12 mb-4 text-gray-400" />
              <p className="mb-2">Drag and drop your PDF, TXT, or MD file here, or</p>
              <button
                onClick={handleSelectFile}
                className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
              >
                Select File
              </button>
            </div>
          ) : (
            <div>
              <FileText className="mx-auto h-8 w-8 mb-2 text-blue-500" />
              <p className="mb-1 font-medium">{file.name}</p>
              <p className="text-sm text-gray-500 mb-2">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              
              {file.type === 'application/pdf' && (
                <p className="text-xs text-blue-500 mb-2">
                  <BookOpen className="inline-block mr-1" size={14} />
                  PDF will be processed with LLM analysis
                </p>
              )}

              {status === 'uploading' || status === 'processing' ? (
                 <div className={`flex items-center justify-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Loader size={18} className="animate-spin mr-2" />
                    <span>{statusMessage}</span>
                 </div>
              ) : status === 'success' ? (
                <div className="flex items-center justify-center text-green-500">
                  <CheckCircle size={18} className="mr-2" />
                  <span>{statusMessage}</span>
                </div>
              ) : status === 'error' ? (
                <div className="flex items-center justify-center text-red-500">
                  <AlertCircle size={18} className="mr-2" />
                  <span>{statusMessage}</span>
                </div>
              ) : (
                <div className="flex space-x-2 justify-center">
                  <button
                    onClick={handleSelectFile}
                    className={`px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                  >
                    Change
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`px-3 py-1 rounded-md ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
                    disabled={status === 'uploading' || status === 'processing'}
                  >
                    Process
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="font-medium mb-2">Process Steps (Simulated Backend)</h3>
          <ul className="text-sm space-y-1">
            <li className={`flex items-start ${status === 'uploading' ? 'text-blue-500 font-medium' : ''}`}>
              <span className="mr-2">{status === 'uploading' ? '→' : '•'}</span>
              <span>1. Upload & Pre-process Document</span>
            </li>
            <li className={`flex items-start ${status === 'processing' && !extractedText ? 'text-blue-500 font-medium' : ''}`}>
              <span className="mr-2">{status === 'processing' && !extractedText ? '→' : '•'}</span>
              <span>2. Extract Text from Document</span>
            </li>
            <li className={`flex items-start ${status === 'processing' && extractedText ? 'text-blue-500 font-medium' : ''}`}>
              <span className="mr-2">{status === 'processing' && extractedText ? '→' : '•'}</span>
              <span>3. Analyze Content with LLM</span>
            </li>
            <li className={`flex items-start ${status === 'success' ? 'text-blue-500 font-medium' : ''}`}>
              <span className="mr-2">{status === 'success' ? '→' : '•'}</span>
              <span>4. Integrate with Knowledge Graph</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFUploader;