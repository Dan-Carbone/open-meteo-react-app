import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Nécessaire pour être accessible hors du conteneur
    port: 3000,
    watch: {
      usePolling: true // Utile sous Docker pour le rechargement à chaud
    }
  }
});