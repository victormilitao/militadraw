import { defineConfig } from 'vite';
export default defineConfig({ define: { 'process.env.IS_PREACT': 'false' }, build: { chunkSizeWarningLimit: 3000 } });
