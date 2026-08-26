import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { APP_FOLDER_NAME } from './src/globals/globalVariables.js';

// https://vite.dev/config/
export default defineConfig({
  base: `/${APP_FOLDER_NAME}/`,
  build: {
    outDir: APP_FOLDER_NAME,
  },
  plugins: [react()],
});
