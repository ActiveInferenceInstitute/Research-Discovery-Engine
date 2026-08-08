import React from 'react';
import { Sun, Moon, GitBranch, Info } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <nav className={`px-4 py-3 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} z-30 relative`}> {/* Add z-30 */}
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <GitBranch className="h-6 w-6" />
          <span className="font-bold text-xl">Discovery Engine</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Placeholder for About/Info */}
          <button
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            title="About"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;