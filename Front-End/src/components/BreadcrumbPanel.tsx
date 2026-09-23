// src/components/BreadcrumbPanel.tsx
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem, NodeObject } from '../../types'; // NodeObject for onSelectNode type

interface BreadcrumbPanelProps {
  darkMode: boolean;
  path: BreadcrumbItem[];
  onNavigate: (nodeId: string) => void; // Callback to select a node from breadcrumb
  // graphData might be needed if onNavigate needs the full NodeObject, but App can handle that.
}

const BreadcrumbPanel: React.FC<BreadcrumbPanelProps> = ({ darkMode, path, onNavigate }) => {
  if (!path || path.length === 0) {
    return null; // Don't render if path is empty
  }

  return (
    <nav
      aria-label="breadcrumb"
      className={`flex-shrink-0 px-3 py-1.5 text-xs sm:text-sm rounded-md mb-2
                 ${darkMode ? 'bg-slate-700/50 text-slate-300' : 'bg-slate-100 text-slate-600'}
                 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-slate-400/50 dark:scrollbar-thumb-slate-600/50`}
    >
      <ol className="flex items-center space-x-1 sm:space-x-1.5">
        <li>
          <button
            onClick={() => onNavigate('')} // Special ID or handler for "home" / clearing selection
            className={`flex items-center ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
            title="Back to Overview / Clear Selection"
          >
            <Home size={12} className="mr-1 flex-shrink-0" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </li>
        {path.map((item, index) => (
          <React.Fragment key={item.id}>
            <li>
              <ChevronRight size={12} className={`flex-shrink-0 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            </li>
            <li>
              {index === path.length - 1 ? (
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'} hover:underline`}
                >
                  {item.label}
                </button>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbPanel;