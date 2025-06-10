import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  esbuild: {
    target: 'esnext',
    // Ignore TypeScript errors for development
    include: /\.(tsx?|jsx?)$/
  },
  build: {
    // Skip type checking for build as well
    target: 'esnext'
  }
});