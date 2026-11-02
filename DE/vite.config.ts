import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  resolve: {
    // Fix for "Multiple instances of Three.js being imported" warning
    dedupe: ['three']
  },
  build: {
    rollupOptions: {
      output: {
        // Vite 8 (rolldown) rejects the object form of manualChunks.
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;
          if (/node_modules\/(react|react-dom)\//.test(id)) return 'vendor';
          if (/node_modules\/(three|3d-force-graph|three-spritetext)\//.test(id)) return 'visualization';
          if (/node_modules\/lucide-react\//.test(id)) return 'ui';
          if (/node_modules\/(lodash|d3|date-fns)\//.test(id)) return 'utils';
          if (/node_modules\/(react-markdown|remark-gfm|rehype-raw)\//.test(id)) return 'markdown';
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
