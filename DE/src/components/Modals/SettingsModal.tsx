import React from 'react';
import APISettings from '../Settings/APISettings';

interface SettingsModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ darkMode, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <APISettings darkMode={darkMode} onClose={onClose} />
      </div>
    </div>
  );
};

export default SettingsModal; 