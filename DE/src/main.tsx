// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AgentProvider } from './contexts/AgentContext';
import './algorithms'; // Import algorithms to ensure registration
import './index.css';
import { testBetweenness } from './test-betweenness';

// Run the test
testBetweenness();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AgentProvider>
      <App />
    </AgentProvider>
  </StrictMode>
);
