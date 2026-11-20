import React, { useState, useRef } from 'react';
import { X, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { GraphData, TriggerAgent } from '../../types';
import { createLLMService } from '../../llm/utils/factory';
import { analyzeUploadedDocument, getUploadKind } from '../../utils/analyzeUploadedDocument';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PDFUploaderProps {
  darkMode: boolean;
  onClose: () => void;
  onFileProcessed: (parsedData: GraphData) => void;
  onTriggerAgent: TriggerAgent;
}

async function extractPDFText(file: File): Promise<string> {
  const task = pdfjs.getDocument({ data: await file.arrayBuffer() });
  try {
    const pdf = await task.promise;
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const { items } = await page.getTextContent();
      pages.push(items.flatMap(item => 'str' in item ? [item.str] : []).join(' '));
    }
    return pages.join('\n\n');
  } finally {
    await task.destroy();
  }
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ darkMode, onClose, onFileProcessed, onTriggerAgent }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectFile = (selectedFile: File | undefined) => {
    if (!selectedFile || status === 'processing') return;
    if (getUploadKind(selectedFile)) {
      setFile(selectedFile);
      setStatus('idle');
      setStatusMessage('');
    } else {
      setFile(null);
      setStatus('error');
      setStatusMessage('Please upload a PDF, text (.txt), or Markdown (.md) file.');
    }
  };

  const handleSelectFile = () => fileInputRef.current?.click();

  const handleSubmit = async () => {
    if (!file || status === 'processing') return;

    setStatus('processing');
    setStatusMessage('Reading document and analyzing content…');
    onTriggerAgent('add-message', {
      id: `process_start_${Date.now()}`,
      sourceAgent: 'Nexus Weaver',
      type: 'info',
      content: `Processing "${file.name}". This may take some time.`,
      timestamp: Date.now(),
    });

    try {
      const llmService = createLLMService();
      const { analysis, graph } = await analyzeUploadedDocument(file, extractPDFText, request => llmService.generateText(request));
      onFileProcessed(graph);

      setStatus('success');
      setStatusMessage('File processed successfully.');
      onTriggerAgent('add-message', {
        id: `process_success_${Date.now()}`,
        sourceAgent: 'Nexus Weaver',
        type: 'success',
        content: `Processed "${file.name}" and generated ${graph.nodes.length} nodes and ${graph.links.length} links.`,
        timestamp: Date.now(),
        action: {
          type: 'view-llm-result',
          payload: { title: `Analysis: ${file.name}`, content: analysis },
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to process this document.';
      setStatus('error');
      setStatusMessage(message);
      onTriggerAgent('add-message', {
        id: `process_error_${Date.now()}`,
        sourceAgent: 'Nexus Weaver',
        type: 'error',
        content: `Processing "${file.name}" failed. ${message}`,
        timestamp: Date.now(),
      });
    }
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
              status === 'processing' ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-100/50') : ''
          }`}
          onDrop={event => {
            event.preventDefault();
            selectFile(event.dataTransfer.files[0]);
          }}
          onDragOver={event => event.preventDefault()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={event => {
              selectFile(event.currentTarget.files?.[0]);
              event.currentTarget.value = '';
            }}
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

              {status === 'processing' && (
                <div role="status" className="flex items-center justify-center">
                  <Loader size={18} className="mr-2 animate-spin" />
                  <span>{statusMessage}</span>
                </div>
              )}
              {status === 'success' && (
                <div role="status" className="flex items-center justify-center text-green-500">
                  <CheckCircle size={18} className="mr-2" />
                  <span>{statusMessage}</span>
                </div>
              )}
              {(status === 'idle' || status === 'error') && (
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={handleSelectFile}
                    className={`px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                  >
                    Change
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`px-3 py-1 rounded-md ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
                  >
                    {status === 'error' ? 'Retry' : 'Process'}
                  </button>
                </div>
              )}
            </div>
          )}
          {status === 'error' && (
            <div role="alert" className="mt-2 flex items-center justify-center text-red-500">
              <AlertCircle size={18} className="mr-2" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFUploader;
