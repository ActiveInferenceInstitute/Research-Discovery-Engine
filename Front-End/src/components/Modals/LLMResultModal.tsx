import React, { useEffect, useState, useRef } from 'react';
import { X, Loader, Copy, Check, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { createMarkdownLinkRenderer } from '../../utils/markdownLinkRenderer';
import { NodeObject } from '../../types';

interface LLMResultModalProps {
  darkMode: boolean;
  title: string;
  content: string;
  isLoading: boolean;
  onClose: () => void;
  allNodes?: NodeObject[];
  onSelectNode?: (node: NodeObject, sectionSlug?: string) => void;
  onPaperClick?: (citationKey: string) => void;
}

const LLMResultModal: React.FC<LLMResultModalProps> = ({
  darkMode,
  title,
  content,
  isLoading,
  onClose,
  allNodes = [],
  onSelectNode,
  onPaperClick
}) => {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
  };

  // Create markdown link renderer for interactive links
  const markdownLinkRenderer = createMarkdownLinkRenderer({
    darkMode,
    allNodes,
    onSelectNode: onSelectNode || (() => {}),
    onPaperClick: onPaperClick || (() => {}),
    currentFileKey: 'llm-result'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`w-full max-w-4xl h-5/6 flex flex-col rounded-xl shadow-2xl ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`p-4 flex justify-between items-center border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className={`p-2 rounded-full ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Copy content"
              disabled={isLoading}
            >
              {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div 
          ref={contentRef}
          className={`flex-grow p-6 overflow-y-auto ${
            darkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader className="w-12 h-12 animate-spin text-blue-500 mb-4" />
              <p className="text-lg">Generating response...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
            </div>
          ) : (
            <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''} 
                            prose-headings:font-bold prose-headings:border-b prose-headings:pb-1 
                            prose-headings:border-gray-200 dark:prose-headings:border-gray-700
                            prose-a:text-blue-600 dark:prose-a:text-blue-400
                            prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                            prose-code:text-red-500 dark:prose-code:text-red-400
                            prose-code:p-1 prose-code:rounded`}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
                components={{
                  a: markdownLinkRenderer,
                  // Add custom renderers for other elements if needed
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" {...props} />
                    </div>
                  ),
                  th: ({node, ...props}) => (
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider bg-gray-100 dark:bg-gray-800" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="px-3 py-2 whitespace-nowrap text-sm" {...props} />
                  )
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LLMResultModal;

// Function to convert markdown to HTML
function renderMarkdown() {
  const contentElement = document.querySelector('.markdown-content');
  if (!contentElement) return;
  
  // Simple markdown parsing for headings, lists, code blocks, etc.
  let markdown = contentElement.innerHTML;
  
  // Convert headings
  markdown = markdown.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  markdown = markdown.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  markdown = markdown.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  markdown = markdown.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
  
  // Convert bold and italic
  markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert lists
  markdown = markdown.replace(/^\s*- (.*$)/gm, '<li>$1</li>');
  markdown = markdown.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>');
  
  // Wrap lists
  markdown = markdown.replace(/<li>.*?<\/li>(?:\s*<li>.*?<\/li>)+/gs, match => {
    if (match.includes('1. ') || match.includes('2. ')) {
      return '<ol>' + match + '</ol>';
    } else {
      return '<ul>' + match + '</ul>';
    }
  });
  
  // Convert code blocks - fixed regex
  markdown = markdown.replace(/```([^`]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Convert inline code - fixed regex
  markdown = markdown.replace(/`([^`]*?)`/g, '<code>$1</code>');
  
  // Convert paragraphs (must come after other conversions)
  markdown = markdown.replace(/^(?!<[a-z])(.*$)/gm, '<p>$1</p>');
  
  // Fix empty paragraphs
  markdown = markdown.replace(/<p><\/p>/g, '<br>');
  
  // Set the HTML content
  contentElement.innerHTML = markdown;
}