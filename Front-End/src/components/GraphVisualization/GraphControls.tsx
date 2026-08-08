// Controls for the Graph Visualization view properties.

import React, { useState } from 'react';
import { ChevronsRight, ChevronsLeft, ZoomIn, ZoomOut, RefreshCw, Layers, Settings, Palette, Group } from 'lucide-react';
// Removed NodeObject import as it no longer displays node details

interface GraphControlsProps {
  darkMode: boolean;
  // Removed selectedNode prop
  showLabels: boolean;
  showLinks: boolean;
  enablePhysics: boolean;
  showParticles: boolean;
  onToggleLabels: () => void;
  onToggleLinks: () => void;
  onTogglePhysics: () => void;
  onToggleParticles: () => void;
  colorBy: 'type' | 'group' | 'status' | 'origin' | 'custom';
  onChangeColorBy: (value: string) => void;
  groupBy: 'none' | 'type' | 'status' | 'origin' | 'connections' | 'cluster';
  onChangeGroupBy: (value: string) => void;
  // Add more controls as needed (e.g., filter, layout)
}

const GraphControls: React.FC<GraphControlsProps> = ({
  darkMode,
  showLabels,
  showLinks,
  enablePhysics,
  showParticles,
  onToggleLabels,
  onToggleLinks,
  onTogglePhysics,
  onToggleParticles,
  colorBy,
  onChangeColorBy,
  groupBy,
  onChangeGroupBy
}) => {
  const [collapsed, setCollapsed] = useState(true);

  // Placeholder functions for graph manipulation (will need actual implementation in GraphVisualization)
  const handleZoomIn = () => console.log('Zoom In');
  const handleZoomOut = () => console.log('Zoom Out');
  const handleResetView = () => console.log('Reset View');
   const handleToggleLayers = () => console.log('Toggle Layers');


  return (
    <div
      className={`absolute top-4 right-4 transition-all duration-300 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      } rounded-lg shadow-lg z-10 ${
        collapsed ? 'w-12' : 'w-80'
      } flex flex-col`} // Use flex-col for layout
    >
      {/* Header */}
      <div className="p-2 flex items-center justify-between"> {/* Use p-2 for smaller padding */}
        <h3 className={`font-medium flex items-center ${collapsed ? 'hidden' : 'block'}`}>
             <Settings size={18} className="mr-2"/> Graph Settings
        </h3>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          title={collapsed ? "Show Graph Settings" : "Hide Graph Settings"}
        >
          {collapsed ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-2 space-y-4 overflow-y-auto flex-grow"> {/* Add overflow/flex-grow */}
            {/* Display Options */}
            <div>
              <h4 className="text-sm font-medium mb-2">Display</h4>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className={`mr-2 form-checkbox h-4 w-4 ${darkMode ? 'text-blue-500' : 'text-blue-600'}`}
                    checked={showLabels}
                    onChange={onToggleLabels}
                  />
                  <span>Show Labels</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                     className={`mr-2 form-checkbox h-4 w-4 ${darkMode ? 'text-blue-500' : 'text-blue-600'}`}
                    checked={showLinks}
                    onChange={onToggleLinks}
                  />
                  <span>Show Links</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                     className={`mr-2 form-checkbox h-4 w-4 ${darkMode ? 'text-blue-500' : 'text-blue-600'}`}
                    checked={enablePhysics}
                    onChange={onTogglePhysics}
                  />
                  <span>Enable Physics</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                     className={`mr-2 form-checkbox h-4 w-4 ${darkMode ? 'text-blue-500' : 'text-blue-600'}`}
                    checked={showParticles}
                    onChange={onToggleParticles}
                  />
                  <span>Show Particles</span>
                </label>
              </div>
            </div>

            {/* Node Coloring Options */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Palette size={14} className="mr-1.5" /> Color Nodes By
              </h4>
              <select
                value={colorBy}
                onChange={(e) => onChangeColorBy(e.target.value)}
                className={`w-full p-2 rounded-md text-sm ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                <option value="type">Node Type</option>
                <option value="status">Status</option>
                <option value="origin">Origin</option>
                <option value="group">Group</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Node Grouping Options */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Group size={14} className="mr-1.5" /> Group Nodes By
              </h4>
              <select
                value={groupBy}
                onChange={(e) => onChangeGroupBy(e.target.value)}
                className={`w-full p-2 rounded-md text-sm ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                <option value="none">No Grouping</option>
                <option value="type">Type</option>
                <option value="status">Status</option>
                <option value="origin">Origin</option>
                <option value="connections">Connections</option>
                <option value="cluster">Force Cluster</option>
              </select>
            </div>
            {/* Filtering Options (Examples) */}
             <div>
              <h4 className="text-sm font-medium mb-2">Filter Nodes</h4>
              <div className="space-y-2">
                 <select
                    className={`w-full p-2 rounded-md text-sm ${
                     darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    }`}
                 >
                     <option value="">All Types</option>
                     <option value="Material">Materials</option>
                     <option value="Mechanism">Mechanisms</option>
                     <option value="System">Systems</option>
                     <option value="Paper">Papers</option>
                     <option value="Concept">Concepts</option>
                 </select>
                 {/* Add more specific CSS attribute filters here */}
                 {/* E.g., filter by material type, mechanism category, scale */}
              </div>
            </div>

            {/* Layout Options (Examples) */}
            <div>
              <h4 className="text-sm font-medium mb-2">Layout</h4>
              <select
                className={`w-full p-2 rounded-md text-sm ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                <option value="force">Force-Directed</option>
                <option value="hierarchical">Hierarchical</option>
              </select>
            </div>

             {/* Node/Link Coloring/Sizing (Examples) */}
             <div>
              <h4 className="text-sm font-medium mb-2">Node Color By</h4>
              <select
                 className={`w-full p-2 rounded-md text-sm ${
                   darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                 }`}
               >
                 <option value="type">Type</option>
                 <option value="group">Group (Legacy)</option>
                 <option value="css_category">CSS Category</option>
                 <option value="validation_score">Validation Score</option>
               </select>
             </div>
              <div>
               <h4 className="text-sm font-medium mb-2">Node Size By</h4>
               <select
                  className={`w-full p-2 rounded-md text-sm ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  }`}
               >
                 <option value="connections">Connections</option>
                 <option value="validation_score">Validation Score</option>
                 <option value="value">Value (Legacy)</option>
               </select>
             </div>


          </div>
      )}

        {/* Bottom Action Buttons (Persistent) */}
      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-2 flex-shrink-0`}> {/* Use flex-shrink-0 */}
        <div className="flex justify-around">
          <button
            className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title="Zoom In"
            onClick={handleZoomIn}
          >
            <ZoomIn size={18} />
          </button>
          <button
            className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title="Zoom Out"
            onClick={handleZoomOut}
          >
            <ZoomOut size={18} />
          </button>
          <button
            className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title="Reset View"
            onClick={handleResetView}
          >
            <RefreshCw size={18} />
          </button>
           {/* This button could trigger a modal or a dedicated layers panel */}
          <button
            className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title="Toggle Layer Visibility"
            onClick={handleToggleLayers}
          >
            <Layers size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphControls;