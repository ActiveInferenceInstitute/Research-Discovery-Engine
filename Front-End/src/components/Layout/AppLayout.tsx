/**
 * App Layout Component - Main application layout structure
 * 
 * This component handles the overall layout and positioning of major UI sections,
 * extracting layout concerns from the main App component for better modularity.
 */

import React, { ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import Navbar from '../Navbar';
import ErrorBoundary from '../ErrorBoundary';

/**
 * Props for the AppLayout component
 */
interface AppLayoutProps {
  /** Dark mode state */
  darkMode: boolean;
  /** Function to toggle dark mode */
  onToggleDarkMode: () => void;
  /** Whether the browser sidebar is open */
  isBrowserSidebarOpen: boolean;
  /** Function to toggle browser sidebar */
  onToggleBrowserSidebar: () => void;
  /** Current active mode */
  activeMode: 'explore' | 'create';
  /** Function to set explore mode */
  onSetExploreMode: () => void;
  /** Function to set create mode */
  onSetCreateMode: () => void;
  /** Function to show PDF uploader */
  onShowPDFUploader: () => void;
  /** Search query value */
  searchQuery: string;
  /** Function to handle search input change */
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Function to handle search submit */
  onSearchSubmit: (e: React.FormEvent) => void;
  /** Sidebar content */
  sidebarContent: ReactNode;
  /** Main content area */
  mainContent: ReactNode;
  /** Context panel content */
  contextPanelContent: ReactNode;
  /** Agent console content */
  agentConsoleContent: ReactNode;
  /** Breadcrumb panel content */
  breadcrumbContent?: ReactNode;
}

/**
 * AppLayout component that provides the main application structure
 */
const AppLayout: React.FC<AppLayoutProps> = ({
  darkMode,
  onToggleDarkMode,
  isBrowserSidebarOpen,
  onToggleBrowserSidebar,
  activeMode,
  onSetExploreMode,
  onSetCreateMode,
  onShowPDFUploader,
  searchQuery,
  onSearchInputChange,
  onSearchSubmit,
  sidebarContent,
  mainContent,
  contextPanelContent,
  agentConsoleContent,
  breadcrumbContent
}) => {
  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <div className="flex flex-col h-screen">
        {/* Navigation Bar */}
        <ErrorBoundary componentName="Navbar">
          <Navbar
            darkMode={darkMode}
            toggleDarkMode={onToggleDarkMode}
          />
        </ErrorBoundary>

        {/* Breadcrumb Panel */}
        {breadcrumbContent && (
          <ErrorBoundary componentName="BreadcrumbPanel">
            <div className="border-b border-gray-200 dark:border-gray-700">
              {breadcrumbContent}
            </div>
          </ErrorBoundary>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Browser Sidebar */}
          <div className={`${
            isBrowserSidebarOpen ? 'w-80' : 'w-0'
          } transition-all duration-300 overflow-hidden border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 relative`}>
            
            {/* Sidebar Toggle Button */}
            <button
              onClick={onToggleBrowserSidebar}
              className={`absolute top-3 ${
                isBrowserSidebarOpen ? 'right-3' : '-right-8'
              } z-10 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300`}
              title={isBrowserSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              aria-label={isBrowserSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isBrowserSidebarOpen ? (
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* Sidebar Content */}
            <ErrorBoundary componentName="Browser Sidebar">
              <div className="h-full overflow-hidden">
                {sidebarContent}
              </div>
            </ErrorBoundary>
          </div>

          {/* Main Graph/Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ErrorBoundary componentName="Main Content">
              {mainContent}
            </ErrorBoundary>
          </div>

          {/* Context Panel */}
          <div className="w-96 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
            <ErrorBoundary componentName="Context Panel">
              {contextPanelContent}
            </ErrorBoundary>
          </div>
        </div>

        {/* Agent Console */}
        <div className="h-48 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <ErrorBoundary componentName="Agent Console">
            {agentConsoleContent}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default AppLayout; 