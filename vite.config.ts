import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [svgr(), react(), tsconfigPaths()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
});
