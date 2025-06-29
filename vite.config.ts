import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    removeConsole({
      includes: ['debug'],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
