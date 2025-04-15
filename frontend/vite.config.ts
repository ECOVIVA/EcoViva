import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';  

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5174,
    proxy: {
      // Redireciona /api para o backend
      '/api': {
        target: 'http://localhost:8000',  // endereço do seu backend Django
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components')  
    }
  }
});
