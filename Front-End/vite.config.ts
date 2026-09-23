import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    // Fix for "Multiple instances of Three.js being imported" warning
    dedupe: ['three']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          visualization: ['three', '3d-force-graph', 'three-spritetext'],
          ui: ['lucide-react'],
          utils: ['lodash', 'd3', 'date-fns'],
          markdown: ['react-markdown', 'remark-gfm', 'rehype-raw']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});