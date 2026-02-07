
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 確保部署到 GitHub Pages 時，資源路徑能正確對應子目錄
});
